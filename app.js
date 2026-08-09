const state = { store: localStorage.getItem("baoshen_store") || "songlong", vendor: localStorage.getItem("baoshen_vendor") || "西北", mode: localStorage.getItem("baoshen_mode") || "order", profile: localStorage.getItem("baoshen_profile") || "auto", deferredPrompt: null };
const $ = id => document.getElementById(id);
const storeLabel = key => APP_DATA.stores[key]?.name || key;
const allItems = (vendor = state.vendor) => APP_DATA.vendors[vendor].groups.flatMap(g => g.items);
const localDateString = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d };
function showToast(message) { const t = $("toast"); t.textContent = message; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800) }
function escapeHtml(text) { return String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]) }
function getSelectedDate() { return new Date(`${$("workDate").value}T12:00:00`) }
function effectiveProfile() { if (state.profile !== "auto") return state.profile; return [5, 6, 0].includes(getSelectedDate().getDay()) ? "holiday" : "weekday" }
function quantityKey(itemName) { return `baoshen_${state.mode}_${state.store}_${state.vendor}_${itemName}` }
const itemRule = item => APP_DATA.vendors[state.vendor].itemRules?.[item.name] || {};
const itemStep = item => Number(itemRule(item).step) || 1;
function normalizeQuantity(item, quantity) { const q = Math.max(0, Number(quantity) || 0), step = itemStep(item); return itemRule(item).step ? Math.floor(q / step) * step : q }
function formatQuantity(item, quantity) { const q = normalizeQuantity(item, quantity), rule = itemRule(item); if (rule.quantityFormat === "repeatStep" && q > 0) return Array(q / itemStep(item)).fill(itemStep(item)).join("+"); if (rule.quantityFormat === "halfJin") { if (q === 0) return "0"; const whole = Math.floor(q), half = q % 1 === 0.5; return whole ? `${whole}斤${half ? "半" : ""}` : "半斤" } return String(q) }
function formatQuantityWithUnit(item, quantity) { const rule = itemRule(item), separator = rule.quantityFormat === "repeatStep" ? " " : ""; return `${formatQuantity(item, quantity)}${rule.quantityIncludesUnit ? "" : separator + item.unit}` }
function formatImageQuantity(item, quantity) { const q = normalizeQuantity(item, quantity); return itemRule(item).quantityFormat === "halfJin" ? (q === 0.5 ? "半" : String(q)) : formatQuantity(item, q) }
const vendorItemName = item => itemRule(item).vendorName || item.name;
function suggestedKey(store, vendor, item, profile) { return `baoshen_suggested_${store}_${vendor}_${item}_${profile}` }
function suggested(item, store = state.store, vendor = state.vendor, profile = effectiveProfile()) { const custom = localStorage.getItem(suggestedKey(store, vendor, item.name, profile)); return custom === null ? Number(item[profile] || 0) : Number(custom || 0) }
function renderDashboard() {
  const date = getSelectedDate();

  $("dashboard").innerHTML = Object.keys(APP_DATA.vendors)
    .map((vendorName) => {
      const status = vendorStatus(vendorName, date);

      return `
        <div class="dash-item ${status.type}">
          <b>${escapeHtml(vendorName)}</b><br>
          ${escapeHtml(status.text.replace(/^[^ ]+ /, ""))}
        </div>
      `;
    })
    .join("");
}
function renderStores() {
  const box = $("storeButtons");
  box.innerHTML = "";

  Object.entries(APP_DATA.stores).forEach(([key, store]) => {
    const button = document.createElement("button");

    button.className =
      "store-button" +
      (state.store === key ? " active" : "");

    button.textContent = store.name;

    button.onclick = () => {
      saveCurrentInputs();

      state.store = key;
      localStorage.setItem("baoshen_store", key);

      $("messageOutput").value = "";

      renderAll();
    };

    box.appendChild(button);
  });
}
  function renderVendors() { const box = $("vendorButtons"); box.innerHTML = ""; Object.keys(APP_DATA.vendors).forEach(name => { const b = document.createElement("button"); b.className = "vendor-button" + (state.vendor === name ? " active" : ""); b.textContent = name; b.onclick = () => { saveCurrentInputs(); state.vendor = name; localStorage.setItem("baoshen_vendor", name); $("messageOutput").value = ""; $("imageSection").classList.add("hidden"); renderAll() }; box.appendChild(b) }) }
  function renderDateAndNotice() { const d = getSelectedDate(), wd = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()]; $("dateSummary").textContent = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（星期${wd}）｜${effectiveProfile() === "holiday" ? "假日建議" : "平日建議"}`; const s = vendorStatus(); $("vendorNotice").innerHTML = `<div class="notice ${s.type}">${s.text}</div>`; renderDashboard() }
  function saveCurrentInputs() { document.querySelectorAll(".quantity").forEach(i => localStorage.setItem(quantityKey(i.dataset.itemName), String(Math.max(0, Number(i.dataset.quantity ?? i.value) || 0)))) }
  function renderStockAlert() {
    const box = $("stockAlert");
    if (!box) return;
    if (state.mode !== "inventory") {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    const zeroCount = allItems().filter(item =>
      normalizeQuantity(item, localStorage.getItem(quantityKey(item.name)) || 0) === 0
    ).length;
    box.classList.toggle("hidden", zeroCount === 0);
    box.innerHTML = zeroCount > 0
      ? `<div class="notice warn">⚠️ 今日有 ${zeroCount} 項商品庫存為 0，請確認是否缺貨。</div>`
      : "";
  }

  function renderItems() {
    $("inventoryMode").classList.toggle("active", state.mode === "inventory");
    $("orderMode").classList.toggle("active", state.mode === "order");
    const hasImage = Boolean(APP_DATA.vendors[state.vendor].image);
    $("generateImage").style.display = hasImage ? "inline-block" : "none";
    $("quickGenerateImage")?.classList.toggle("hidden", !hasImage);

    const box = $("items");
    box.innerHTML = "";

    APP_DATA.vendors[state.vendor].groups.forEach(group => {
      const title = document.createElement("div");
      title.className = "group-title";
      title.textContent = group.title;
      box.appendChild(title);

      group.items.forEach(item => {
        const saved = normalizeQuantity(item, localStorage.getItem(quantityKey(item.name)) || 0);
        const target = suggested(item);
        const weekdayTarget = suggested(item, state.store, state.vendor, "weekday");
        const holidayTarget = suggested(item, state.store, state.vendor, "holiday");
        const row = document.createElement("div");
        row.className = "item";
        const info = document.createElement("div");

        let suggestedDisplay = "";
        if (item.weekday !== undefined || item.holiday !== undefined) {
          suggestedDisplay = state.vendor === "宏鑫"
            ? `<div class="item-suggested"><div>平日建議庫存：${escapeHtml(formatQuantityWithUnit(item, weekdayTarget))}</div><div>假日建議庫存：${escapeHtml(formatQuantityWithUnit(item, holidayTarget))}</div></div>`
            : `<div class="item-suggested">建議庫存：${escapeHtml(formatQuantityWithUnit(item, target))}</div>`;
        }

        info.innerHTML = `
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-meta">單位：${escapeHtml(item.unit)}${item.note ? "・" + escapeHtml(item.note) : ""}</div>
          ${suggestedDisplay}
          ${state.mode === "inventory" && saved === 0 ? '<div class="item-warning">請確認：目前庫存為 0</div>' : ""}
        `;

        const stepper = document.createElement("div");
        stepper.className = "stepper";
        const minus = document.createElement("button");
        const input = document.createElement("input");
        const plus = document.createElement("button");
        const increment = itemStep(item);
        const hasCustomStep = Boolean(itemRule(item).step);

        minus.textContent = "−";
        plus.textContent = "+";
        input.type = hasCustomStep ? "text" : "number";
        input.min = "0";
        input.className = "quantity";
        input.dataset.itemName = item.name;
        input.dataset.quantity = saved;
        input.value = formatQuantity(item, saved);
        input.readOnly = hasCustomStep;

        const update = delta => {
          const value = Math.max(0, (Number(input.dataset.quantity) || 0) + delta);
          localStorage.setItem(quantityKey(item.name), value);
          renderItems();
        };

        minus.onclick = () => update(-increment);
        plus.onclick = () => update(increment);

        if (!hasCustomStep) {
          input.oninput = () => {
            input.dataset.quantity = String(Math.max(0, Number(input.value) || 0));
            localStorage.setItem(quantityKey(item.name), input.dataset.quantity);
            renderStockAlert();
          };
          input.onchange = () => {
            input.dataset.quantity = String(Math.max(0, Number(input.value) || 0));
            input.value = input.dataset.quantity;
            localStorage.setItem(quantityKey(item.name), input.dataset.quantity);
            renderItems();
          };
        }

        stepper.append(minus, input, plus);
        if (state.mode === "inventory") {
          const result = document.createElement("div");
          result.className = "order-result";
          result.textContent = `叫 ${formatQuantityWithUnit(item, Math.max(0, target - saved))}`;
          stepper.appendChild(result);
        }
        row.append(info, stepper);
        box.appendChild(row);
      });
    });

    renderStockAlert();
  }
  function orderQuantity(item) { const val = normalizeQuantity(item, localStorage.getItem(quantityKey(item.name)) || 0); return state.mode === "inventory" ? normalizeQuantity(item, Math.max(0, suggested(item) - val)) : val }
  function messageHeader() {
    const vendor = APP_DATA.vendors[state.vendor], store = storeLabel(state.store); if (state.vendor === "西北") {
      return state.store === "songlong"
        ? "CR18049寶神松隆"
        : "CR22779寶神松德";
    }

    if (vendor.header === "vendor")
      return state.vendor; if (vendor.header === "helloTomorrow") return `您好 ${store} 明天要`; if (vendor.header === "tomorrow") return `${store} 明天要`; return store
  }
  function generateMessage() {
    saveCurrentInputs();

    if (!vendorStatus().allowed) {
      showToast("今日不可叫貨");
      return "";
    }

    const vendor = APP_DATA.vendors[state.vendor];
    const sections = [];

    // 西北專用格式
    if (state.vendor === "西北") {
      const general = [];

      const sesame = allItems().find(
        (item) => item.name === "麻吉燒芝麻"
      );

      const peanut = allItems().find(
        (item) => item.name === "麻吉燒花生"
      );

      const parts = [];

      const sesameQuantity = orderQuantity(sesame);
      const peanutQuantity = orderQuantity(peanut);

      if (sesameQuantity > 0) {
        parts.push(`芝麻 ${sesameQuantity}包`);
      }

      if (peanutQuantity > 0) {
        parts.push(`花生 ${peanutQuantity}包`);
      }

      if (parts.length) {
        general.push(`麻吉燒 ${parts.join("、")}`);
      }

      ["原味水晶餃", "芋頭角", "甜不辣"].forEach((name) => {
        const item = allItems().find((entry) => entry.name === name);

        if (!item) return;

        const quantity = orderQuantity(item);

        if (quantity > 0) {
          general.push(`${name} ${quantity}${item.unit}`);
        }
      });

      if (general.length) {
        sections.push(general.join("\n"));
      }

      const strong = APP_DATA.vendors["西北"].groups[1].items
        .map((item) => {
          const quantity = orderQuantity(item);

          return quantity > 0
            ? `${item.name} ${quantity}${item.unit}`
            : null;
        })
        .filter(Boolean);

      if (strong.length) {
        sections.push(`強強滾：\n${strong.join("\n")}`);
      }

      // 何仙姑專用格式
    } else if (state.vendor === "何仙姑") {
      const lines = [];

      const displayRules = {
        金針菇: (quantity) => `金針菇（五斤裝）*${quantity}`,
        杏鮑菇: (quantity) => `杏鮑菇*${quantity}`,
        木耳: (quantity) => `木耳*${quantity}斤`,
        香菇: (quantity) => `香菇*${quantity}斤`,
      };

      allItems().forEach((item) => {
        const quantity = orderQuantity(item);
        const format = displayRules[item.name];

        if (quantity > 0 && format) {
          lines.push(format(quantity));
        }
      });

      if (lines.length) {
        sections.push(lines.join("\n"));
      }

      // 其他廠商一般格式
    } else {
      vendor.groups.forEach((group) => {
        const lines = group.items
          .map((item) => {
            const quantity = orderQuantity(item);

            if (quantity <= 0) return null;

            return `${vendorItemName(item)} ${formatQuantityWithUnit(item, quantity)}${item.note ? ` ${item.note}` : ""
              }`;
          })
          .filter(Boolean);

        if (lines.length) {
          const title = group.outputTitle
            ? `${group.outputTitle}\n`
            : "";

          sections.push(title + lines.join("\n"));
        }
      });
    }

    if (!sections.length) {
      $("messageOutput").value = "";
      showToast("目前沒有需要叫貨的品項");
      return "";
    }

    const message =
      `${messageHeader()}\n\n` +
      `${sections.join("\n\n")}\n\n` +
      `${vendor.footer}`;

    $("messageOutput").value = message;
    showToast("已產生 LINE 訊息");

    return message;
  }
  function clearCurrent() {
    const confirmed = confirm(
      `確定清空「${storeLabel(state.store)}・${state.vendor}」嗎？`
    );

    if (!confirmed) return;

    allItems().forEach((item) => {
      localStorage.setItem(
        quantityKey(item.name),
        "0"
      );
    });

    $("messageOutput").value = "";
    renderItems();
    showToast("已清空");
  } async function copyMessage() { if (!$("messageOutput").value.trim()) generateMessage(); if (!$("messageOutput").value.trim()) return; try { await navigator.clipboard.writeText($("messageOutput").value) } catch { $("messageOutput").select(); document.execCommand("copy") } showToast("已複製，可以貼到 LINE") }
  function saveHistory() { if (!$("messageOutput").value.trim()) generateMessage(); if (!$("messageOutput").value.trim()) return; const now = new Date(), h = JSON.parse(localStorage.getItem("baoshen_history") || "[]"), items = allItems().map(item => ({ name: item.name, quantity: orderQuantity(item), unit: item.unit })).filter(item => item.quantity > 0); h.unshift({ store: state.store, vendor: state.vendor, createdAt: now.toISOString(), time: now.toLocaleString("zh-TW"), text: $("messageOutput").value, items }); localStorage.setItem("baoshen_history", JSON.stringify(h.slice(0, 500))); renderHistory(); if (confirm("紀錄已儲存。是否完成此次叫貨並清空本廠商數量？")) { allItems().forEach(i => localStorage.setItem(quantityKey(i.name), "0")); renderItems() } showToast("已儲存叫貨紀錄") }
  function renderHistory() { const box = $("history"), h = JSON.parse(localStorage.getItem("baoshen_history") || "[]"); box.innerHTML = h.length ? h.map(r => `<div class="history-item"><div class="history-top"><div class="history-title">${escapeHtml(storeLabel(r.store))}・${escapeHtml(r.vendor)}</div><div class="history-time">${escapeHtml(r.time)}</div></div><div class="history-text">${escapeHtml(r.text)}</div></div>`).join("") : '<div class="empty">目前沒有叫貨紀錄</div>'; window.BaoshenHistoryAnalytics?.render($("historyAnalytics"), state.vendor) }
  function findItem(name) { return allItems("宏鑫").find(i => i.name === name) }
  function generateImage() {
    if (state.vendor !== "宏鑫") { showToast("只有宏鑫使用訂貨明細表圖片"); return } if (!vendorStatus().allowed) { showToast("今日不可叫貨"); return }
    const c = $("orderCanvas"), ctx = c.getContext("2d"), W = c.width, H = c.height; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.font = 'bold 48px "PingFang TC",sans-serif'; ctx.fillText("宏鑫 訂貨明細表", W / 2, 62); ctx.textAlign = "left"; ctx.font = '30px "PingFang TC",sans-serif'; const store = APP_DATA.stores[state.store]; ctx.fillText(`店名：${store.name}（${store.address}）`, 25, 112);
    const top = 160, margin = 16, gap = 0, colW = (W - margin * 2) / 2, rowH = 48;
    function drawColumn(names, x) {
      const nameW = colW * .58, qtyW = colW * .25, unitW = colW - nameW - qtyW; let y = top; ctx.fillStyle = "#ddd"; ctx.fillRect(x, y, colW, rowH); ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.strokeRect(x, y, colW, rowH); ctx.beginPath(); ctx.moveTo(x + nameW, y); ctx.lineTo(x + nameW, y + rowH); ctx.moveTo(x + nameW + qtyW, y); ctx.lineTo(x + nameW + qtyW, y + rowH); ctx.stroke(); ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.font = 'bold 28px "PingFang TC",sans-serif'; ctx.fillText("品名", x + nameW / 2, y + 34); ctx.fillText("數量", x + nameW + qtyW / 2, y + 34); ctx.fillText("單位", x + nameW + qtyW + unitW / 2, y + 34); y += rowH;
      names.forEach(name => { const item = findItem(name), q = item ? orderQuantity(item) : 0, displayName = item ? vendorItemName(item) : name, unit = item?.unit || ({ "紅蘿蔔": "斤", "榨菜": "包", "絲瓜": "條", "黑柿番茄": "顆", "玉米條": "斤" }[name] || ""); ctx.strokeRect(x, y, colW, rowH); ctx.beginPath(); ctx.moveTo(x + nameW, y); ctx.lineTo(x + nameW, y + rowH); ctx.moveTo(x + nameW + qtyW, y); ctx.lineTo(x + nameW + qtyW, y + rowH); ctx.stroke(); ctx.fillStyle = "#111"; ctx.textAlign = "left"; ctx.font = `${displayName.length > 10 ? 21 : 25}px "PingFang TC",sans-serif`; ctx.fillText(displayName, x + 8, y + 33); ctx.textAlign = "center"; ctx.fillStyle = "#b44"; ctx.font = 'bold 29px "PingFang TC",sans-serif'; if (q > 0) ctx.fillText(formatImageQuantity(item, q), x + nameW + qtyW / 2, y + 34); ctx.fillStyle = "#111"; ctx.font = '25px "PingFang TC",sans-serif'; ctx.fillText(unit, x + nameW + qtyW + unitW / 2, y + 33); y += rowH })
    }
    drawColumn(APP_DATA.vendors["宏鑫"].imageLeft, margin); drawColumn(APP_DATA.vendors["宏鑫"].imageRight, margin + colW + gap); ctx.textAlign = "left"; ctx.fillStyle = "#111"; ctx.font = '25px "PingFang TC",sans-serif'; ctx.fillText("傳真：82525624　電話：22539609　手機：0989263550　陳皓鑫", 25, H - 35); $("imageSection").classList.remove("hidden"); $("imageSection").scrollIntoView({ behavior: "smooth" }); showToast("已產生宏鑫訂貨明細表")
  }
  const canvasBlob = () => new Promise(resolve => $("orderCanvas").toBlob(resolve, "image/png"));
  async function downloadImage() { const b = await canvasBlob(), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `宏鑫叫貨_${APP_DATA.stores[state.store].short}_${localDateString()}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500) }
  async function shareImage() { const b = await canvasBlob(), f = new File([b], `宏鑫叫貨_${APP_DATA.stores[state.store].short}.png`, { type: "image/png" }); if (navigator.share && navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: "宏鑫叫貨" }); else showToast("此瀏覽器不支援直接分享，請按儲存圖片") }
  function fillAdminSelectors() { const stores = Object.entries(APP_DATA.stores).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join(""), vendors = Object.keys(APP_DATA.vendors).map(v => `<option>${v}</option>`).join(""); $("adminStore").innerHTML = stores; $("adminVendor").innerHTML = vendors; $("holidayVendor").innerHTML = vendors; $("adminStore").value = state.store; $("adminVendor").value = state.vendor; $("holidayVendor").value = state.vendor; renderSuggestedEditor(); renderHolidayList() }
  function renderSuggestedEditor() { const s = $("adminStore").value, v = $("adminVendor").value; $("suggestedEditor").innerHTML = allItems(v).map(i => `<div class="admin-item"><b>${escapeHtml(i.name)} <small>${escapeHtml(i.unit)}</small></b><input class="suggest-weekday" data-name="${escapeHtml(i.name)}" type="number" min="0" value="${suggested(i, s, v, "weekday")}" title="平日"><input class="suggest-holiday" data-name="${escapeHtml(i.name)}" type="number" min="0" value="${suggested(i, s, v, "holiday")}" title="假日"></div>`).join(""); $("suggestedEditor").insertAdjacentHTML("afterbegin", '<div class="admin-item"><b>品名</b><b>平日</b><b>假日</b></div>') }
  function renderHolidayList() { const v = $("holidayVendor").value, arr = holidays(v); $("holidayList").innerHTML = arr.length ? arr.map(d => `<div class="holiday-item"><b>${d}</b><button class="danger" data-remove-date="${d}">刪除</button></div>`).join("") : '<div class="empty">目前沒有臨時休假</div>'; document.querySelectorAll("[data-remove-date]").forEach(b => b.onclick = () => { localStorage.setItem(holidayKey(v), JSON.stringify(arr.filter(x => x !== b.dataset.removeDate))); renderHolidayList(); renderAll(); showToast("已刪除") }) }
  function exportData() { const data = { version: 4, exportedAt: new Date().toISOString(), localStorage: {} }; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith("baoshen")) data.localStorage[k] = localStorage.getItem(k) } const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `寶神叫貨助手備份_${localDateString()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500) }
  function renderAll() { renderStores(); renderVendors(); renderDateAndNotice(); renderItems(); renderHistory() }
  $("workDate").value = localDateString(); $("stockProfile").value = state.profile; $("workDate").onchange = () => { renderDateAndNotice(); renderItems() }; $("stockProfile").onchange = () => { state.profile = $("stockProfile").value; localStorage.setItem("baoshen_profile", state.profile); renderDateAndNotice(); renderItems() };
  $("orderMode").onclick = () => { saveCurrentInputs(); state.mode = "order"; localStorage.setItem("baoshen_mode", state.mode); renderItems() }; $("inventoryMode").onclick = () => { saveCurrentInputs(); state.mode = "inventory"; localStorage.setItem("baoshen_mode", state.mode); renderItems() };
  $("generateText").onclick = generateMessage; $("generateImage").onclick = generateImage; $("quickGenerateText").onclick = generateMessage; $("quickGenerateImage").onclick = generateImage; $("clearCurrent").onclick = clearCurrent; $("copyMessage").onclick = copyMessage; $("saveHistory").onclick = saveHistory; $("downloadImage").onclick = downloadImage; $("shareImage").onclick = shareImage; $("clearHistory").onclick = () => { if (confirm("確定清除所有叫貨紀錄嗎？")) { localStorage.removeItem("baoshen_history"); renderHistory(); showToast("已清除") } };
  $("unlockAdmin").onclick = () => { if ($("adminPassword").value === (localStorage.getItem("baoshen_admin_password") || "8888")) { sessionStorage.setItem("baoshen_admin", "1"); $("adminLogin").classList.add("hidden"); $("adminPanel").classList.remove("hidden"); fillAdminSelectors(); showToast("管理設定已解鎖") } else showToast("密碼錯誤") }; $("lockAdmin").onclick = () => { sessionStorage.removeItem("baoshen_admin"); $("adminPanel").classList.add("hidden"); $("adminLogin").classList.remove("hidden") }; $("changePassword").onclick = () => { const p = prompt("輸入新密碼（至少 4 碼）"); if (p && p.length >= 4) { localStorage.setItem("baoshen_admin_password", p); showToast("密碼已修改") } else if (p !== null) showToast("密碼至少 4 碼") };
  $("adminStore").onchange = renderSuggestedEditor; $("adminVendor").onchange = renderSuggestedEditor; $("saveSuggested").onclick = () => { const s = $("adminStore").value, v = $("adminVendor").value; document.querySelectorAll(".suggest-weekday").forEach(i => localStorage.setItem(suggestedKey(s, v, i.dataset.name, "weekday"), String(Math.max(0, Number(i.value) || 0)))); document.querySelectorAll(".suggest-holiday").forEach(i => localStorage.setItem(suggestedKey(s, v, i.dataset.name, "holiday"), String(Math.max(0, Number(i.value) || 0)))); renderItems(); showToast("建議庫存已儲存") }; $("resetSuggested").onclick = () => { if (!confirm("恢復此門市、此廠商的預設建議庫存？")) return; const s = $("adminStore").value, v = $("adminVendor").value; allItems(v).forEach(i => ["weekday", "holiday"].forEach(p => localStorage.removeItem(suggestedKey(s, v, i.name, p)))); renderSuggestedEditor(); renderItems(); showToast("已恢復預設") };
  $("holidayVendor").onchange = renderHolidayList; $("addHoliday").onclick = () => { const v = $("holidayVendor").value, d = $("holidayDate").value; if (!d) return showToast("請先選擇日期"); localStorage.setItem(holidayKey(v), JSON.stringify([...new Set([...holidays(v), d])].sort())); renderHolidayList(); renderAll(); showToast("已新增臨時休假") };
  $("exportData").onclick = exportData; $("importData").onclick = () => $("importFile").click(); $("importFile").onchange = async e => { try { const x = JSON.parse(await e.target.files[0].text()); Object.entries(x.localStorage || x).forEach(([k, v]) => { if (k.startsWith("baoshen")) localStorage.setItem(k, v) }); showToast("設定已匯入"); setTimeout(() => location.reload(), 500) } catch { showToast("匯入失敗，請確認檔案") } };
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); state.deferredPrompt = e; $("installButton").classList.remove("hidden") }); $("installButton").onclick = async () => { if (!state.deferredPrompt) return; state.deferredPrompt.prompt(); await state.deferredPrompt.userChoice; state.deferredPrompt = null; $("installButton").classList.add("hidden") };
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
  if (sessionStorage.getItem("baoshen_admin") === "1") { $("adminLogin").classList.add("hidden"); $("adminPanel").classList.remove("hidden"); fillAdminSelectors() }
