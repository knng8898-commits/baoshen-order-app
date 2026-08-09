/* 寶神叫貨助手 v5－最近 30 天叫貨統計 */
(function () {
  "use strict";

  const WINDOW_DAYS = 30;

  function historyRecords() {
    try { return JSON.parse(localStorage.getItem("baoshen_history") || "[]"); }
    catch { return []; }
  }

  function recordDate(record) {
    const date = new Date(record.createdAt || record.time || 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function recentRecords(vendorName, now = new Date()) {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - WINDOW_DAYS);
    return historyRecords().filter(record => {
      const date = recordDate(record);
      return record.vendor === vendorName && date && date >= cutoff && date <= now;
    });
  }

  function escapePattern(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseQuantity(token) {
    if (!token) return 0;
    if (token.includes("+")) return token.split("+").reduce((sum, part) => sum + (Number(part) || 0), 0);
    if (token.startsWith("半斤")) return 0.5;
    const jinHalf = token.match(/^(\d+(?:\.\d+)?)斤半/);
    if (jinHalf) return Number(jinHalf[1]) + 0.5;
    return Number(token.match(/\d+(?:\.\d+)?/)?.[0] || 0);
  }

  function legacyItemRows(record) {
    const vendor = APP_DATA.vendors[record.vendor];
    if (!vendor || !record.text) return [];
    return vendor.groups.flatMap(group => group.items).map(item => {
      let name = item.name;
      if (item.name === "麻吉燒芝麻") name = "芝麻";
      if (item.name === "麻吉燒花生") name = "花生";
      const match = String(record.text).match(new RegExp(`${escapePattern(name)}(?:（[^）]+）)?(?:\\s|\\*)+([^\\s、]+)`));
      const quantity = parseQuantity(match?.[1]);
      return { name: item.name, quantity, unit: item.unit };
    }).filter(item => item.quantity > 0);
  }

  function itemRows(record) {
    return Array.isArray(record.items)
      ? record.items.filter(item => Number(item.quantity) > 0)
      : legacyItemRows(record);
  }

  function analyze(vendorName, now = new Date()) {
    const records = recentRecords(vendorName, now);
    const stats = new Map();

    records.forEach(record => {
      itemRows(record).forEach(item => {
        const current = stats.get(item.name) || {
          name: item.name,
          unit: item.unit || "",
          quantities: [],
          count: 0,
          latest: null,
          latestAt: null
        };
        const quantity = Number(item.quantity);
        const date = recordDate(record);
        current.quantities.push(quantity);
        current.count += 1;
        if (!current.latestAt || date > current.latestAt) {
          current.latest = quantity;
          current.latestAt = date;
        }
        stats.set(item.name, current);
      });
    });

    const items = [...stats.values()].map(item => ({
      name: item.name,
      unit: item.unit,
      count: item.count,
      average: item.quantities.reduce((sum, value) => sum + value, 0) / item.quantities.length,
      maximum: Math.max(...item.quantities),
      minimum: Math.min(...item.quantities),
      latest: item.latest
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hant"));

    return { vendorName, records: records.length, items, top: items.slice(0, 10) };
  }

  function numberText(value) {
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
  }

  function amount(value, unit) {
    return `${numberText(value)}${unit || ""}`;
  }

  function render(container, vendorName, now = new Date()) {
    if (!container) return;
    const result = analyze(vendorName, now);
    if (!result.items.length) {
      container.innerHTML = `<div class="empty">${escapeHtml(vendorName)}最近 30 天尚無可分析的商品紀錄</div>`;
      return;
    }

    const itemSummary = result.items.map(item => `
      <div class="history-item">
        <div class="history-title">${escapeHtml(item.name)}</div>
        <div class="history-text">平均：${escapeHtml(amount(item.average, item.unit))}　最大：${escapeHtml(amount(item.maximum, item.unit))}　最小：${escapeHtml(amount(item.minimum, item.unit))}　最近一次：${escapeHtml(amount(item.latest, item.unit))}</div>
      </div>
    `).join("");

    const ranking = result.top.map((item, index) =>
      `<div class="history-text">TOP ${index + 1}　${escapeHtml(item.name)}　${item.count} 次</div>`
    ).join("");

    container.innerHTML = `
      <div class="section-title">最近 30 天統計・${escapeHtml(vendorName)}</div>
      <div class="helper">共 ${result.records} 筆叫貨紀錄</div>
      ${itemSummary}
      <div class="history-item"><div class="history-title">常叫商品排行</div>${ranking}</div>
    `;
  }

  window.BaoshenHistoryAnalytics = { historyRecords, recentRecords, analyze, render };
})();
