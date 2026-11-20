/* 寶神叫貨助手 v5－介面語言 */
(function () {
  "use strict";

  const messages = {
    "zh-Hant": {
      appTitle: "📦 寶神叫貨助手", appSubtitle: "v5｜點貨、叫貨、圖片與管理設定",
      languageButton: "Tiếng Việt", installApp: "安裝 App", dashboard: "今日叫貨總覽",
      storeAndDate: "門市與日期", workDate: "點貨日期", stockProfile: "庫存建議",
      auto: "自動判斷", weekday: "平日", holiday: "假日", vendorSwitch: "廠商快速切換",
      orderMode: "直接輸入叫貨量", inventoryMode: "輸入目前庫存", generateLine: "產生 LINE 訊息",
      generateImage: "產生宏鑫訂貨圖片", clearVendor: "清空本廠商", linePreview: "LINE 訊息預覽",
      linePlaceholder: "按「產生 LINE 訊息」後顯示內容", copy: "📋 複製內容", saveHistory: "💾 儲存紀錄",
      imageSheet: "宏鑫訂貨明細表", downloadImage: "儲存圖片", shareImage: "分享圖片",
      imageHelp: "iPhone／Android 可先按「分享圖片」；若不支援，系統會自動下載圖片。",
      recentHistory: "最近叫貨紀錄", clearHistory: "清除紀錄", admin: "🔐 管理設定",
      adminHelp: "預設密碼 8888。建議庫存與臨時休假只儲存在目前裝置，請定期匯出備份。",
      passwordPlaceholder: "輸入管理密碼", unlock: "解鎖", logout: "登出", changePassword: "修改密碼",
      exportSettings: "匯出設定", importSettings: "匯入設定", suggestedManagement: "建議庫存管理",
      store: "門市", vendor: "廠商", saveSuggested: "儲存建議庫存", resetDefault: "恢復預設",
      vendorHolidays: "各廠商臨時休假", holidayDate: "休假日期", addHoliday: "新增休假日期",
      quickLine: "產生 LINE 文字", quickImage: "產生訂貨圖片", unit: "單位", suggested: "建議庫存",
      weekdaySuggested: "平日建議庫存", holidaySuggested: "假日建議庫存", order: "叫",
      zeroItem: "請確認：目前庫存為 0", zeroAlert: "⚠️ 今日有 {count} 項商品庫存為 0，請確認是否缺貨。",
      weekdayProfile: "平日建議", holidayProfile: "假日建議", weekDays: "日,一,二,三,四,五,六",
      noOrder: "目前沒有需要叫貨的品項", unavailableToday: "今日不可叫貨", copied: "已複製，可以貼到 LINE",
      generatedLine: "已產生 LINE 訊息", generatedImage: "已產生宏鑫訂貨明細表",
      imageDownloaded: "無法直接分享，圖片已下載，請從 LINE 選擇相簿或檔案傳送",
      shareFailed: "圖片分享失敗，已改為下載", onlyHongxin: "只有宏鑫使用訂貨明細表圖片",
      emptyHistory: "目前沒有叫貨紀錄", delete: "刪除", emptyHoliday: "目前沒有臨時休假",
      languageChanged: "介面語言已切換為中文",
      ruleMissing: "🚫 找不到廠商資料", ruleTemporaryLast: "ℹ️ 臨時休假最後一天，可下單安排後續配送{cutoff}",
      ruleTemporaryClosed: "🚫 今日臨時休假", ruleHuannanLast: "ℹ️ 今日為休市最後一天，可下單安排後續配送{cutoff}",
      ruleHuannanClosed: "🚫 今日環南市場休市", ruleCustomerIce: "🚫 客惟您星期二不可叫貨",
      ruleHeadquartersClosed: "🚫 總部僅星期日、星期四可叫貨", ruleTongheHoliday: "🚫 今日國定假日休息",
      ruleTongheClosed: "🚫 統賀星期五、星期六不能叫貨", ruleClosed: "🚫 今日不可叫貨",
      ruleHuannanTomorrow: "🚫 明日環南市場休市，今天不收單", ruleHeadquartersOpen: "✅ 今日可向總部叫貨",
      ruleOpen: "✅ 今日可正常叫貨{cutoff}", ruleStockDays: "⚠️ 明日不可叫貨，請備足{days}天貨量",
      recentStats: "最近 30 天統計", noStats: "最近 30 天尚無可分析的商品紀錄", recordsCount: "共 {count} 筆叫貨紀錄",
      average: "平均", maximum: "最大", minimum: "最小", latest: "最近一次", ranking: "常叫商品排行", times: "{count} 次"
    },
    vi: {
      appTitle: "📦 Trợ lý đặt hàng Bảo Thần", appSubtitle: "v5｜Kiểm kho, đặt hàng, hình ảnh và cài đặt",
      languageButton: "中文", installApp: "Cài ứng dụng", dashboard: "Tổng quan đặt hàng hôm nay",
      storeAndDate: "Cửa hàng và ngày", workDate: "Ngày kiểm kho", stockProfile: "Mức tồn kho đề xuất",
      auto: "Tự động", weekday: "Ngày thường", holiday: "Ngày lễ", vendorSwitch: "Chuyển nhà cung cấp",
      orderMode: "Nhập số lượng đặt", inventoryMode: "Nhập tồn kho hiện tại", generateLine: "Tạo tin nhắn LINE",
      generateImage: "Tạo ảnh đặt hàng Hồng Hâm", clearVendor: "Xóa số lượng nhà cung cấp", linePreview: "Xem trước LINE",
      linePlaceholder: "Nhấn “Tạo tin nhắn LINE” để hiển thị nội dung", copy: "📋 Sao chép", saveHistory: "💾 Lưu lịch sử",
      imageSheet: "Phiếu đặt hàng Hồng Hâm", downloadImage: "Lưu ảnh", shareImage: "Chia sẻ ảnh",
      imageHelp: "Trên iPhone/Android, hãy thử “Chia sẻ ảnh”; nếu không hỗ trợ, ảnh sẽ tự động tải xuống.",
      recentHistory: "Lịch sử đặt hàng gần đây", clearHistory: "Xóa lịch sử", admin: "🔐 Cài đặt quản trị",
      adminHelp: "Mật khẩu mặc định 8888. Dữ liệu chỉ lưu trên thiết bị này, hãy sao lưu định kỳ.",
      passwordPlaceholder: "Nhập mật khẩu quản trị", unlock: "Mở khóa", logout: "Đăng xuất", changePassword: "Đổi mật khẩu",
      exportSettings: "Xuất cài đặt", importSettings: "Nhập cài đặt", suggestedManagement: "Quản lý tồn kho đề xuất",
      store: "Cửa hàng", vendor: "Nhà cung cấp", saveSuggested: "Lưu mức đề xuất", resetDefault: "Khôi phục mặc định",
      vendorHolidays: "Ngày nghỉ tạm thời", holidayDate: "Ngày nghỉ", addHoliday: "Thêm ngày nghỉ",
      quickLine: "Tạo nội dung LINE", quickImage: "Tạo ảnh đặt hàng", unit: "Đơn vị", suggested: "Tồn kho đề xuất",
      weekdaySuggested: "Đề xuất ngày thường", holidaySuggested: "Đề xuất ngày lễ", order: "Đặt",
      zeroItem: "Xác nhận: tồn kho hiện tại bằng 0", zeroAlert: "⚠️ Hôm nay có {count} mặt hàng tồn kho bằng 0, vui lòng kiểm tra thiếu hàng.",
      weekdayProfile: "Đề xuất ngày thường", holidayProfile: "Đề xuất ngày lễ", weekDays: "CN,T2,T3,T4,T5,T6,T7",
      noOrder: "Hiện không có mặt hàng cần đặt", unavailableToday: "Hôm nay không thể đặt hàng", copied: "Đã sao chép, có thể dán vào LINE",
      generatedLine: "Đã tạo tin nhắn LINE", generatedImage: "Đã tạo phiếu đặt hàng Hồng Hâm",
      imageDownloaded: "Không thể chia sẻ trực tiếp. Ảnh đã được tải xuống; hãy gửi từ Album hoặc Tệp trong LINE.",
      shareFailed: "Chia sẻ thất bại, ảnh đã được tải xuống", onlyHongxin: "Chỉ Hồng Hâm sử dụng phiếu đặt hàng bằng ảnh",
      emptyHistory: "Chưa có lịch sử đặt hàng", delete: "Xóa", emptyHoliday: "Chưa có ngày nghỉ tạm thời",
      languageChanged: "Đã chuyển giao diện sang tiếng Việt",
      ruleMissing: "🚫 Không tìm thấy dữ liệu nhà cung cấp", ruleTemporaryLast: "ℹ️ Ngày nghỉ tạm thời cuối cùng, có thể đặt cho đợt giao tiếp theo{cutoff}",
      ruleTemporaryClosed: "🚫 Hôm nay nghỉ tạm thời", ruleHuannanLast: "ℹ️ Hôm nay là ngày nghỉ chợ cuối cùng, có thể đặt cho đợt giao tiếp theo{cutoff}",
      ruleHuannanClosed: "🚫 Hôm nay chợ Hoàn Nam nghỉ", ruleCustomerIce: "🚫 Khách Duy Nhĩ không nhận đơn vào thứ Ba",
      ruleHeadquartersClosed: "🚫 Trụ sở chỉ nhận đơn Chủ nhật và thứ Năm", ruleTongheHoliday: "🚫 Hôm nay nghỉ lễ",
      ruleTongheClosed: "🚫 Thống Hạ không nhận đơn thứ Sáu và thứ Bảy", ruleClosed: "🚫 Hôm nay không thể đặt hàng",
      ruleHuannanTomorrow: "🚫 Ngày mai chợ Hoàn Nam nghỉ, hôm nay không nhận đơn", ruleHeadquartersOpen: "✅ Hôm nay có thể đặt hàng từ trụ sở",
      ruleOpen: "✅ Hôm nay có thể đặt hàng bình thường{cutoff}", ruleStockDays: "⚠️ Ngày mai không thể đặt hàng, hãy chuẩn bị đủ hàng cho {days} ngày",
      recentStats: "Thống kê 30 ngày gần nhất", noStats: "Chưa có dữ liệu sản phẩm để phân tích trong 30 ngày gần nhất", recordsCount: "Tổng cộng {count} đơn hàng",
      average: "Trung bình", maximum: "Cao nhất", minimum: "Thấp nhất", latest: "Lần gần nhất", ranking: "Xếp hạng mặt hàng thường đặt", times: "{count} lần"
    }
  };

  let language = localStorage.getItem("baoshen_language") === "vi" ? "vi" : "zh-Hant";

  function translate(key, vars = {}) {
    let text = messages[language]?.[key] || messages["zh-Hant"][key] || key;
    Object.entries(vars).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, value); });
    return text;
  }

  function applyLanguage() {
    document.documentElement.lang = language === "vi" ? "vi" : "zh-Hant";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      element.placeholder = translate(element.dataset.i18nPlaceholder);
    });
    document.title = language === "vi" ? "Trợ lý đặt hàng Bảo Thần" : "寶神叫貨助手 v5";
  }

  function toggleLanguage() {
    language = language === "vi" ? "zh-Hant" : "vi";
    localStorage.setItem("baoshen_language", language);
    applyLanguage();
    if (typeof renderAll === "function") renderAll();
    if (typeof showToast === "function") showToast(translate("languageChanged"));
  }

  window.t = translate;
  window.currentLanguage = () => language;
  window.applyLanguage = applyLanguage;
  window.toggleLanguage = toggleLanguage;
  document.addEventListener("DOMContentLoaded", applyLanguage);
})();
