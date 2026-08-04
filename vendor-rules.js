/*
 * 寶神叫貨助手 v5－廠商叫貨規則
 *
 * 每個廠商保留自己的固定規則，並共用：
 * 1. 管理者新增的臨時休假。
 * 2. 自動計算「明日不可叫貨，請備足幾天貨量」。
 *
 * 計算方式：從明天開始，一直算到下一個可叫貨日，並包含該日。
 */

(function () {
  "use strict";

  const MAX_LOOKAHEAD_DAYS = 45;

  function dateKey(date) {
    return localDateString(date);
  }

  function nextDate(date, days = 1) {
    return addDays(date, days);
  }

  function cutoffText(vendor) {
    return vendor?.cutoff ? `，截止 ${vendor.cutoff}` : "";
  }

  function status(type, text, allowed) {
    return { type, text, allowed };
  }

  function isLastClosedDay(date, closedDates) {
    return (
      closedDates.includes(dateKey(date)) &&
      !closedDates.includes(dateKey(nextDate(date)))
    );
  }

  function getTemporaryClosureStatus(vendorName, date, cutoff) {
    const closedDates = holidays(vendorName);
    const today = dateKey(date);
    const tomorrow = dateKey(nextDate(date));

    if (closedDates.includes(today)) {
      if (isLastClosedDay(date, closedDates)) {
        return status(
          "info",
          `ℹ️ 臨時休假最後一天，可下單安排後續配送${cutoff}`,
          true
        );
      }

      return status("danger", "🚫 今日臨時休假", false);
    }

    if (closedDates.includes(tomorrow)) {
      return status("danger", "🚫 明日臨時休假，今天不收單", false);
    }

    return null;
  }

  function getBaseStatus(vendorName, date) {
    const vendor = APP_DATA.vendors[vendorName];

    if (!vendor) {
      return status("danger", "🚫 找不到廠商資料", false);
    }

    const day = date.getDay();
    const today = dateKey(date);
    const tomorrow = dateKey(nextDate(date));
    const cutoff = cutoffText(vendor);

    const temporaryStatus = getTemporaryClosureStatus(
      vendorName,
      date,
      cutoff
    );

    if (temporaryStatus) return temporaryStatus;

    // 西北、樹森：星期六不能叫貨；星期日休息但可以接單。
    if (vendor.rule === "sunday") {
      if (day === 6) {
        return status("danger", "🚫 今日不可叫貨", false);
      }

      if (day === 0) {
        return status(
          "ok",
          `✅ 今日可正常叫貨${cutoff}`,
          true
        );
      }

      return status("ok", `✅ 今日可正常叫貨${cutoff}`, true);
    }

    // 客惟您：星期二不能叫貨；星期三可以叫貨及交貨。
    if (vendor.rule === "customerice") {
      if (day === 2) {
        return status("danger", "🚫 客惟您星期二不可叫貨", false);
      }

      return status("ok", "✅ 今日可正常叫貨", true);
    }

    // 總部：僅星期日、星期四可叫貨。
    if (vendor.rule === "headquarters") {
      if (day === 0 || day === 4) {
        return status("ok", "✅ 今日可向總部叫貨", true);
      }

      return status(
        "danger",
        "🚫 總部僅星期日、星期四可叫貨",
        false
      );
    }

    // 統賀：星期五、星期六不能叫貨，另套用國定假日。
    if (vendor.rule === "holiday") {
      if (day === 5 || day === 6) {
        return status(
          "danger",
          "🚫 統賀星期五、星期六不能叫貨",
          false
        );
      }

      if (APP_DATA.tongheClosures.includes(today)) {
        return status("danger", "🚫 今日國定假日休息", false);
      }

      return status("ok", "✅ 今日可正常叫貨", true);
    }

    // 宏鑫、何仙姑：完全共用環南市場休市表。
    if (vendor.rule === "huannan") {
      const closedDates = APP_DATA.huannanClosures;

      if (closedDates.includes(today)) {
        if (isLastClosedDay(date, closedDates)) {
          return status(
            "info",
            `ℹ️ 今日為休市最後一天，可下單安排後續配送${cutoff}`,
            true
          );
        }

        return status(
          "danger",
          "🚫 今日環南市場休市，尚未到休市最後一天",
          false
        );
      }

      if (closedDates.includes(tomorrow)) {
        return status(
          "danger",
          "🚫 明日環南市場休市，今天不收單",
          false
        );
      }

      return status("ok", `✅ 今日可正常叫貨${cutoff}`, true);
    }

    return status("ok", `✅ 今日可正常叫貨${cutoff}`, true);
  }

  function getUpcomingWarning(vendorName, date) {
    const tomorrowStatus = getBaseStatus(vendorName, nextDate(date));

    if (tomorrowStatus.allowed) return null;

    for (let offset = 2; offset <= MAX_LOOKAHEAD_DAYS; offset += 1) {
      const checkStatus = getBaseStatus(
        vendorName,
        nextDate(date, offset)
      );

      if (checkStatus.allowed) {
        return status(
          "warn",
          `⚠️ 明日不可叫貨，請備足${offset}天貨量${cutoffText(
            APP_DATA.vendors[vendorName]
          )}`,
          true
        );
      }
    }

    return status(
      "warn",
      "⚠️ 明日不可叫貨，請確認後續休假與配送安排",
      true
    );
  }

  function getVendorStatus(
    vendorName = state.vendor,
    date = getSelectedDate()
  ) {
    const baseStatus = getBaseStatus(vendorName, date);

    if (!baseStatus.allowed) return baseStatus;

    return getUpcomingWarning(vendorName, date) || baseStatus;
  }

  window.vendorStatus = getVendorStatus;
  window.BaoshenVendorRules = {
    getBaseStatus,
    getUpcomingWarning,
    getVendorStatus
  };

  if (typeof renderAll === "function") {
    renderAll();
  }
})();
