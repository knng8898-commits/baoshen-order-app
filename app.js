
const state = {
  store: localStorage.getItem("baoshen_store") || "songlong",
  vendor: localStorage.getItem("baoshen_vendor") || "西北",
  mode: localStorage.getItem("baoshen_mode") || "inventory",
  profile: localStorage.getItem("baoshen_profile") || "auto",
  deferredPrompt: null
};

const $ = id => document.getElementById(id);
const allItems = () => APP_DATA.vendors[state.vendor].groups.flatMap(g => g.items);

function localDateString(date = new Date()){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}
function addDays(date, days){
  const copy = new Date(date);
  copy.setDate(copy.getDate()+days);
  return copy;
}
function showToast(message){
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1700);
}
function escapeHtml(text){
  return String(text).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[c]);
}
function storageKey(itemName){
  return `baoshen_${state.mode}_${state.store}_${state.vendor}_${itemName}`;
}
function getSelectedDate(){
  return new Date(`${$("workDate").value}T12:00:00`);
}
function effectiveProfile(){
  if(state.profile !== "auto") return state.profile;
  const day = getSelectedDate().getDay();
  return (day === 5 || day === 6 || day === 0) ? "holiday" : "weekday";
}
function suggested(item){
  const customKey = `baoshen_suggested_${state.store}_${state.vendor}_${item.name}_${effectiveProfile()}`;
  const custom = localStorage.getItem(customKey);
  if(custom !== null) return Number(custom) || 0;
  return Number(item[effectiveProfile()] || 0);
}
function temporaryClosures(){
  return (localStorage.getItem("baoshen_temporary_closures") || "")
    .split(/\s+/).map(s=>s.trim()).filter(Boolean);
}

function renderStores(){
  const box = $("storeButtons");
  box.innerHTML = "";
  Object.entries(APP_DATA.stores).forEach(([key,label])=>{
    const button = document.createElement("button");
    button.className = "store-button" + (state.store === key ? " active" : "");
    button.textContent = label;
    button.onclick = ()=>{
      saveCurrentInputs();
      state.store = key;
      localStorage.setItem("baoshen_store",key);
      $("messageOutput").value = "";
      renderAll();
    };
    box.appendChild(button);
  });
}
function renderVendors(){
  const box = $("vendorButtons");
  box.innerHTML = "";
  Object.keys(APP_DATA.vendors).forEach(name=>{
    const button = document.createElement("button");
    button.className = "vendor-button" + (state.vendor === name ? " active" : "");
    button.textContent = name;
    button.onclick = ()=>{
      saveCurrentInputs();
      state.vendor = name;
      localStorage.setItem("baoshen_vendor",name);
      $("messageOutput").value = "";
      $("imageSection").classList.add("hidden");
      renderAll();
    };
    box.appendChild(button);
  });
}

function vendorStatus(){
  const vendor = APP_DATA.vendors[state.vendor];
  const date = getSelectedDate();
  const ds = $("workDate").value;
  const day = date.getDay();
  const cutoff = vendor.cutoff ? `，截止 ${vendor.cutoff}` : "";
  const temp = temporaryClosures();

  if(temp.includes(ds)) return {type:"danger", text:"🚫 今日設定為臨時休假"};
  if(temp.includes(localDateString(addDays(date,1)))) return {type:"danger", text:"🚫 明日臨時休假，今天不收單"};

  if(vendor.rule === "sunday"){
    if(day === 0) return {type:"danger",text:"🚫 今日休息"};
    if(day === 5) return {type:"warn",text:`⚠️ 今天是最後叫貨日，請備足週末貨量${cutoff}`};
    if(day === 6) return {type:"danger",text:"🚫 今日不可叫貨，昨日為最後叫貨日"};
    return {type:"ok",text:`✅ 今日可正常叫貨${cutoff}`};
  }

  if(vendor.rule === "wednesday"){
    if(day === 3) return {type:"danger",text:"🚫 今日休息"};
    if(day === 1) return {type:"warn",text:"⚠️ 今天是最後叫貨日，請備足週三休息貨量"};
    if(day === 2) return {type:"danger",text:"🚫 今日不可叫貨，昨日為最後叫貨日"};
    return {type:"ok",text:"✅ 今日可正常叫貨"};
  }

  if(vendor.rule === "headquarters"){
    return (day === 0 || day === 4)
      ? {type:"ok",text:"✅ 今日可向總部叫貨"}
      : {type:"danger",text:"🚫 總部僅週日、週四可叫貨"};
  }

  if(vendor.rule === "holiday"){
    if(APP_DATA.tongheClosures.includes(ds)) return {type:"danger",text:"🚫 今日國定假日休息"};
    const inTwoDays = localDateString(addDays(date,2));
    if(APP_DATA.tongheClosures.includes(inTwoDays)) return {type:"warn",text:"⚠️ 國定假日前兩天，請備足休假貨量"};
    return {type:"ok",text:"✅ 今日可正常叫貨"};
  }

  if(vendor.rule === "huannan"){
    const closed = APP_DATA.huannanClosures;
    if(closed.includes(ds)){
      const tomorrow = localDateString(addDays(date,1));
      if(!closed.includes(tomorrow)) return {type:"info",text:`ℹ️ 今日為休市最後一天，可下單安排後續配送${cutoff}`};
      return {type:"danger",text:"🚫 今日環南市場休市"};
    }
    const tomorrow = localDateString(addDays(date,1));
    if(closed.includes(tomorrow)) return {type:"danger",text:"🚫 明日環南市場休市，今天不收單"};
    return {type:"ok",text:`✅ 今日可正常叫貨${cutoff}`};
  }

  return {type:"ok",text:"✅ 今日可正常叫貨"};
}

function renderDateAndNotice(){
  const date = getSelectedDate();
  const weekday = ["日","一","二","三","四","五","六"][date.getDay()];
  $("dateSummary").textContent =
    `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日（星期${weekday}）｜${effectiveProfile()==="holiday"?"假日建議":"平日建議"}`;
  const status = vendorStatus();
  $("vendorNotice").innerHTML = `<div class="notice ${status.type}">${status.text}</div>`;
}

function renderItems(){
  $("inventoryMode").classList.toggle("active",state.mode==="inventory");
  $("orderMode").classList.toggle("active",state.mode==="order");
  $("generateImage").style.display = APP_DATA.vendors[state.vendor].image ? "inline-block" : "none";

  const box = $("items");
  box.innerHTML = "";
  APP_DATA.vendors[state.vendor].groups.forEach(group=>{
    const title = document.createElement("div");
    title.className = "group-title";
    title.textContent = group.title;
    box.appendChild(title);

    group.items.forEach(item=>{
      const saved = Number(localStorage.getItem(storageKey(item.name)) || 0);
      const target = suggested(item);

      const row = document.createElement("div");
      row.className = "item";

      const info = document.createElement("div");
      info.innerHTML = `
        <div class="item-name">${escapeHtml(item.name)}</div>
        <div class="item-meta">${escapeHtml(item.unit)}${item.note ? "・"+escapeHtml(item.note) : ""}</div>
        ${(item.weekday !== undefined || item.holiday !== undefined) ? `<div class="item-suggested">建議庫存：${target}${escapeHtml(item.unit)}</div>` : ""}
        ${state.mode==="inventory" && saved===0 ? '<div class="item-warning">請確認：目前庫存為 0</div>' : ""}
      `;

      const stepper = document.createElement("div");
      stepper.className = "stepper";
      const minus = document.createElement("button");
      minus.textContent = "−";
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.className = "quantity";
      input.dataset.itemName = item.name;
      input.value = saved;
      const plus = document.createElement("button");
      plus.textContent = "+";

      const update = delta=>{
        input.value = Math.max(0,(Number(input.value)||0)+delta);
        saveCurrentInputs();
        renderItems();
      };
      minus.onclick = ()=>update(-1);
      plus.onclick = ()=>update(1);
      input.oninput = saveCurrentInputs;
      input.onchange = ()=>{
        input.value = Math.max(0,Number(input.value)||0);
        saveCurrentInputs();
        renderItems();
      };

      stepper.append(minus,input,plus);
      if(state.mode === "inventory"){
        const result = document.createElement("div");
        result.className = "order-result";
        result.textContent = `叫 ${Math.max(0,target-saved)}${item.unit}`;
        stepper.appendChild(result);
      }

      row.append(info,stepper);
      box.appendChild(row);
    });
  });
}
function saveCurrentInputs(){
  document.querySelectorAll(".quantity").forEach(input=>{
    localStorage.setItem(storageKey(input.dataset.itemName),String(Math.max(0,Number(input.value)||0)));
  });
}
function orderQuantity(item){
  const input = [...document.querySelectorAll(".quantity")].find(el=>el.dataset.itemName===item.name);
  const value = input ? Number(input.value||0) : 0;
  return state.mode === "inventory" ? Math.max(0,suggested(item)-value) : value;
}
function messageHeader(){
  const store = APP_DATA.stores[state.store];
  const vendor = APP_DATA.vendors[state.vendor];
  if(vendor.header === "vendor") return state.vendor;
  if(vendor.header === "helloTomorrow") return `您好 ${store} 明天要`;
  if(vendor.header === "tomorrow") return `${store} 明天要`;
  return store;
}

function generateMessage(){
  saveCurrentInputs();
  const vendor = APP_DATA.vendors[state.vendor];
  const sections = [];

  if(state.vendor === "西北"){
    const general = [];
    const sesame = allItems().find(i=>i.name==="麻吉燒芝麻");
    const peanut = allItems().find(i=>i.name==="麻吉燒花生");
    const parts = [];
    const sq = orderQuantity(sesame), pq = orderQuantity(peanut);
    if(sq>0) parts.push(`芝麻${sq}包`);
    if(pq>0) parts.push(`花生${pq}包`);
    if(parts.length) general.push(`麻吉燒${parts.join(" ")}`);

    ["原味水晶餃","芋頭角","甜不辣"].forEach(name=>{
      const item = allItems().find(i=>i.name===name);
      const q = orderQuantity(item);
      if(q>0) general.push(`${name}${q}${item.unit}`);
    });
    if(general.length) sections.push(general.join("\n"));

    const strong = APP_DATA.vendors["西北"].groups[1].items
      .map(item=>{
        const q = orderQuantity(item);
        return q>0 ? `${item.name}${q}${item.unit}` : null;
      }).filter(Boolean);
    if(strong.length) sections.push(`強強滾：\n${strong.join("\n")}`);
  }else{
    vendor.groups.forEach(group=>{
      const lines = group.items.map(item=>{
        const q = orderQuantity(item);
        return q>0 ? `${item.name}${q}${item.unit}${item.note ? " "+item.note : ""}` : null;
      }).filter(Boolean);
      if(lines.length) sections.push((group.outputTitle ? group.outputTitle+"\n" : "") + lines.join("\n"));
    });
  }

  if(!sections.length){
    $("messageOutput").value = "";
    showToast("目前沒有需要叫貨的品項");
    return "";
  }
  const message = `${messageHeader()}\n\n${sections.join("\n\n")}\n\n${vendor.footer}`;
  $("messageOutput").value = message;
  showToast("已產生 LINE 訊息");
  return message;
}

function clearCurrent(){
  if(!confirm(`確定要清空「${APP_DATA.stores[state.store]}・${state.vendor}」的${state.mode==="inventory"?"庫存":"叫貨"}數量嗎？`)) return;
  allItems().forEach(item=>localStorage.setItem(storageKey(item.name),"0"));
  $("messageOutput").value = "";
  renderItems();
  showToast("已清空");
}

async function copyMessage(){
  if(!$("messageOutput").value.trim()) generateMessage();
  if(!$("messageOutput").value.trim()) return;
  try{
    await navigator.clipboard.writeText($("messageOutput").value);
  }catch{
    $("messageOutput").select();
    document.execCommand("copy");
  }
  showToast("已複製，可以貼到 LINE");
}

function saveHistory(){
  if(!$("messageOutput").value.trim()) generateMessage();
  if(!$("messageOutput").value.trim()) return;
  const history = JSON.parse(localStorage.getItem("baoshen_history") || "[]");
  history.unshift({
    store: state.store,
    vendor: state.vendor,
    time: new Date().toLocaleString("zh-TW"),
    text: $("messageOutput").value
  });
  localStorage.setItem("baoshen_history",JSON.stringify(history.slice(0,40)));
  renderHistory();
  showToast("已儲存叫貨紀錄");
}
function renderHistory(){
  const box = $("history");
  const history = JSON.parse(localStorage.getItem("baoshen_history") || "[]");
  if(!history.length){
    box.innerHTML = '<div class="empty">目前沒有叫貨紀錄</div>';
    return;
  }
  box.innerHTML = "";
  history.forEach(record=>{
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-top">
        <div class="history-title">${escapeHtml(APP_DATA.stores[record.store] || record.store)}・${escapeHtml(record.vendor)}</div>
        <div class="history-time">${escapeHtml(record.time)}</div>
      </div>
      <div class="history-text">${escapeHtml(record.text)}</div>
    `;
    item.onclick = ()=>{
      state.store = record.store;
      state.vendor = record.vendor;
      localStorage.setItem("baoshen_store",state.store);
      localStorage.setItem("baoshen_vendor",state.vendor);
      $("messageOutput").value = record.text;
      renderAll();
      window.scrollTo({top:0,behavior:"smooth"});
    };
    box.appendChild(item);
  });
}

function generateImage(){
  if(!APP_DATA.vendors[state.vendor].image){
    showToast("此廠商目前使用 LINE 文字叫貨");
    return;
  }
  const canvas = $("orderCanvas");
  const ctx = canvas.getContext("2d");
  const W=1400,H=1900,margin=55,gap=55,top=150,rowH=58;
  const colW=(W-margin*2-gap)/2;
  ctx.fillStyle="#fff";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#111";ctx.textAlign="center";ctx.font='bold 42px "PingFang TC",sans-serif';
  ctx.fillText(`店名：寶神（${state.store==="songlong"?"松隆":"松德"}店）`,W/2,72);
  ctx.font='26px "PingFang TC",sans-serif';
  ctx.fillText(`${effectiveProfile()==="holiday"?"假日":"平日"}建議｜${localDateString(getSelectedDate())}`,W/2,112);

  function drawColumn(items,x){
    const nameW=colW*.67, qtyW=colW*.21, unitW=colW-nameW-qtyW;
    let y=top;
    ctx.strokeStyle="#222";ctx.lineWidth=2;ctx.fillStyle="#111";ctx.textAlign="left";
    ctx.strokeRect(x,y,colW,rowH);
    ctx.beginPath();ctx.moveTo(x+nameW,y);ctx.lineTo(x+nameW,y+rowH);
    ctx.moveTo(x+nameW+qtyW,y);ctx.lineTo(x+nameW+qtyW,y+rowH);ctx.stroke();
    ctx.font='bold 25px "PingFang TC",sans-serif';
    ctx.fillText("品名",x+12,y+38);ctx.fillText("數量",x+nameW+12,y+38);
    y += rowH;

    items.forEach(item=>{
      const q=orderQuantity(item);
      ctx.strokeRect(x,y,colW,rowH);
      ctx.beginPath();ctx.moveTo(x+nameW,y);ctx.lineTo(x+nameW,y+rowH);
      ctx.moveTo(x+nameW+qtyW,y);ctx.lineTo(x+nameW+qtyW,y+rowH);ctx.stroke();

      ctx.fillStyle="#111";ctx.textAlign="left";
      ctx.font=(item.name.length>11?'20px':'23px')+' "PingFang TC",sans-serif';
      ctx.fillText(item.name,x+9,y+38);

      ctx.fillStyle=q>0?"#c62828":"#aaa";ctx.textAlign="center";
      ctx.font='bold 28px "PingFang TC",sans-serif';
      ctx.fillText(q>0?String(q):"",x+nameW+qtyW/2,y+39);

      ctx.fillStyle="#111";ctx.font='23px "PingFang TC",sans-serif';
      ctx.fillText(item.unit,x+nameW+qtyW+unitW/2,y+38);
      y += rowH;
    });
  }

  drawColumn(APP_DATA.vendors[state.vendor].groups[0].items,margin);
  drawColumn(APP_DATA.vendors[state.vendor].groups[1].items,margin+colW+gap);

  ctx.textAlign="left";ctx.fillStyle="#444";ctx.font='22px "PingFang TC",sans-serif';
  ctx.fillText(`產生時間：${new Date().toLocaleString("zh-TW")}`,margin,H-42);

  $("imageSection").classList.remove("hidden");
  $("imageSection").scrollIntoView({behavior:"smooth"});
  showToast("已產生叫貨圖片");
}
function canvasBlob(){
  return new Promise(resolve=>$("orderCanvas").toBlob(resolve,"image/png"));
}
async function downloadImage(){
  const blob = await canvasBlob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `宏鑫叫貨_${state.store==="songlong"?"松隆":"松德"}_${localDateString()}.png`;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),500);
}
async function shareImage(){
  const blob = await canvasBlob();
  const file = new File([blob],`宏鑫叫貨_${state.store==="songlong"?"松隆":"松德"}.png`,{type:"image/png"});
  if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
    await navigator.share({files:[file],title:"宏鑫叫貨"});
  }else{
    showToast("此瀏覽器不支援直接分享，請按儲存圖片");
  }
}

function renderAll(){
  renderStores();
  renderVendors();
  renderDateAndNotice();
  renderItems();
  renderHistory();
}

$("workDate").value = localDateString();
$("stockProfile").value = state.profile;

$("workDate").onchange = ()=>{renderDateAndNotice();renderItems()};
$("stockProfile").onchange = ()=>{
  state.profile = $("stockProfile").value;
  localStorage.setItem("baoshen_profile",state.profile);
  renderDateAndNotice();renderItems();
};
$("inventoryMode").onclick = ()=>{
  saveCurrentInputs();state.mode="inventory";localStorage.setItem("baoshen_mode",state.mode);renderItems();
};
$("orderMode").onclick = ()=>{
  saveCurrentInputs();state.mode="order";localStorage.setItem("baoshen_mode",state.mode);renderItems();
};
$("generateText").onclick = generateMessage;
$("generateImage").onclick = generateImage;
$("clearCurrent").onclick = clearCurrent;
$("copyMessage").onclick = copyMessage;
$("saveHistory").onclick = saveHistory;
$("downloadImage").onclick = downloadImage;
$("shareImage").onclick = shareImage;
$("clearHistory").onclick = ()=>{
  if(confirm("確定要清除所有叫貨紀錄嗎？")){
    localStorage.removeItem("baoshen_history");
    renderHistory();
    showToast("叫貨紀錄已清除");
  }
};

$("unlockAdmin").onclick = ()=>{
  if($("adminPassword").value === "8888"){
    $("adminPanel").classList.remove("hidden");
    $("temporaryClosures").value = localStorage.getItem("baoshen_temporary_closures") || "";
    showToast("管理設定已解鎖");
  }else{
    showToast("密碼錯誤");
  }
};
$("saveTemporaryClosures").onclick = ()=>{
  localStorage.setItem("baoshen_temporary_closures",$("temporaryClosures").value.trim());
  renderDateAndNotice();
  showToast("臨時休假已儲存");
};
$("exportData").onclick = ()=>{
  const data = {};
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key && key.startsWith("baoshen")) data[key]=localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`baoshen-backup-${localDateString()}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
};

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  state.deferredPrompt=event;
  $("installButton").classList.remove("hidden");
});
$("installButton").onclick=async()=>{
  if(!state.deferredPrompt) return;
  state.deferredPrompt.prompt();
  await state.deferredPrompt.userChoice;
  state.deferredPrompt=null;
  $("installButton").classList.add("hidden");
};

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js"));
}

renderAll();
