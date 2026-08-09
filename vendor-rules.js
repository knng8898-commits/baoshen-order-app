/* 寶神叫貨助手 v5－所有廠商叫貨與配送規則 */
(function () {
  "use strict";

  const MAX_LOOKAHEAD_DAYS = 60;

  const dateKey = date => localDateString(date);
  const nextDate = (date, days = 1) => addDays(date, days);
  const cutoffText = vendor => vendor?.cutoff ? `，截止 ${vendor.cutoff}` : "";
  const status = (type, text, allowed) => ({ type, text, allowed });
  const holidayKey = vendorName => `baoshen_holidays_${vendorName}`;
  function holidays(vendorName) {
    try { return JSON.parse(localStorage.getItem(holidayKey(vendorName)) || "[]"); }
    catch { return []; }
  }
  const temporaryClosures = vendorName => holidays(vendorName);

  function recurringClosed(vendor, date) {
    const day = date.getDay();
    if (vendor.rule === "sunday") return day === 6;
    if (vendor.rule === "customerice") return day === 2;
    if (vendor.rule === "headquarters") return day !== 0 && day !== 4;
    if (vendor.rule === "holiday") return day === 5 || day === 6;
    return false;
  }

  function calendarClosures(vendor, date) {
    const key = dateKey(date);
    if (vendor.rule === "holiday") return APP_DATA.tongheClosures || [];
    if (vendor.rule === "huannan") return APP_DATA.huannanClosures || [];
    return [];
  }

  function closureReason(vendorName, date) {
    const vendor = APP_DATA.vendors[vendorName];
    if (!vendor) return "missing";
    const key = dateKey(date);
    if (temporaryClosures(vendorName).includes(key)) return "temporary";
    if (calendarClosures(vendor, date).includes(key)) {
      return vendor.rule === "huannan" ? "huannan" : "holiday";
    }
    if (recurringClosed(vendor, date)) return "recurring";
    return null;
  }

  function isServiceClosed(vendorName, date) {
    return Boolean(closureReason(vendorName, date));
  }

  function isLastClosedDay(vendorName, date) {
    return isServiceClosed(vendorName, date) && !isServiceClosed(vendorName, nextDate(date));
  }

  function isReopeningEve(vendorName, date) {
    return isLastClosedDay(vendorName, date);
  }

  function isLastOrderDay(vendorName, date) {
    return getBaseStatus(vendorName, date).allowed && !getBaseStatus(vendorName, nextDate(date)).allowed;
  }

  function getNextServiceDate(vendorName, date) {
    for (let offset = 1; offset <= MAX_LOOKAHEAD_DAYS; offset += 1) {
      const candidate = nextDate(date, offset);
      if (!isServiceClosed(vendorName, candidate)) return { date: candidate, days: offset };
    }
    return null;
  }

  function getStockDays(vendorName, date) {
    if (getBaseStatus(vendorName, nextDate(date)).allowed) return 0;
    for (let offset = 2; offset <= MAX_LOOKAHEAD_DAYS; offset += 1) {
      if (getBaseStatus(vendorName, nextDate(date, offset)).allowed) return offset;
    }
    return 0;
  }

  function closedStatus(vendorName, date) {
    const vendor = APP_DATA.vendors[vendorName];
    const reason = closureReason(vendorName, date);
    const cutoff = cutoffText(vendor);

    if (reason === "temporary") {
      if (isReopeningEve(vendorName, date)) {
        return status("info", `ℹ️ 臨時休假最後一天，可下單安排後續配送${cutoff}`, true);
      }
      return status("danger", "🚫 今日臨時休假", false);
    }

    if (reason === "huannan") {
      if (isReopeningEve(vendorName, date)) {
        return status("info", `ℹ️ 今日為休市最後一天，可下單安排後續配送${cutoff}`, true);
      }
      return status("danger", "🚫 今日環南市場休市", false);
    }

    if (vendor.rule === "customerice") {
      return status("danger", "🚫 客惟您星期二不可叫貨", false);
    }
    if (vendor.rule === "headquarters") {
      return status("danger", "🚫 總部僅星期日、星期四可叫貨", false);
    }
    if (vendor.rule === "holiday") {
      return reason === "holiday"
        ? status("danger", "🚫 今日國定假日休息", false)
        : status("danger", "🚫 統賀星期五、星期六不能叫貨", false);
    }
    return status("danger", "🚫 今日不可叫貨", false);
  }

  function getBaseStatus(vendorName, date) {
    const vendor = APP_DATA.vendors[vendorName];
    if (!vendor) return status("danger", "🚫 找不到廠商資料", false);
    if (isServiceClosed(vendorName, date)) return closedStatus(vendorName, date);
    if (vendor.rule === "huannan" && isServiceClosed(vendorName, nextDate(date))) {
      return status("danger", "🚫 明日環南市場休市，今天不收單", false);
    }
    if (vendor.rule === "headquarters") return status("ok", "✅ 今日可向總部叫貨", true);
    return status("ok", `✅ 今日可正常叫貨${cutoffText(vendor)}`, true);
  }

  function getUpcomingWarning(vendorName, date) {
    const days = getStockDays(vendorName, date);
    return days > 0
      ? status("warn", `⚠️ 明日不可叫貨，請備足${days}天貨量`, true)
      : null;
  }

  function getVendorStatus(vendorName = state.vendor, date = getSelectedDate()) {
    const base = getBaseStatus(vendorName, date);
    if (!base.allowed) return base;
    return getUpcomingWarning(vendorName, date) || base;
  }

  window.vendorStatus = getVendorStatus;
  window.holidayKey = holidayKey;
  window.holidays = holidays;
  window.BaoshenVendorRules = {
    closureReason,
    isServiceClosed,
    isLastClosedDay,
    isReopeningEve,
    isLastOrderDay,
    getNextServiceDate,
    getStockDays,
    getBaseStatus,
    getUpcomingWarning,
    getVendorStatus
  };

  if (typeof renderAll === "function") renderAll();
})();
