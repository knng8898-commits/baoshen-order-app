
const APP_DATA = {
  stores: {
    songlong: "寶神信義松隆店",
    songde: "寶神信義松德店"
  },

  // 正式使用前，可把環南市場休市日與統賀國定假日填入這兩個陣列。
  huannanClosures: [],
  tongheClosures: [],

  vendors: {
    "西北": {
      rule: "sunday",
      cutoff: "11:00",
      header: "vendor",
      footer: "謝謝",
      groups: [
        {
          title: "一般品項",
          items: [
            {name:"麻吉燒芝麻",unit:"包"},
            {name:"麻吉燒花生",unit:"包"},
            {name:"原味水晶餃",unit:"包"},
            {name:"芋頭角",unit:"包"},
            {name:"甜不辣",unit:"包"}
          ]
        },
        {
          title: "強強滾",
          outputTitle: "強強滾：",
          items: [
            {name:"蝦餃",unit:"包"},{name:"燕餃",unit:"包"},{name:"魚餃",unit:"包"},
            {name:"翡翠蝦球",unit:"包"},{name:"鼠來寶",unit:"包"},{name:"A級球",unit:"包"},
            {name:"北海刺",unit:"包"},{name:"黃金魚蛋",unit:"包"},{name:"跳跳蝦",unit:"包"},
            {name:"魚板",unit:"包"},{name:"魚卵卷",unit:"包"},{name:"鑫鑫腸",unit:"包"}
          ]
        }
      ]
    },

    "統賀": {
      rule: "holiday",
      header: "tomorrow",
      footer: "感謝",
      groups: [{
        title: "肉品",
        items: [
          {name:"梅花豬",unit:"條",note:"對切",weekday:6,holiday:6},
          {name:"精選雞",unit:"條",note:"對切",weekday:2,holiday:2},
          {name:"精選羊",unit:"條",note:"對切",weekday:3,holiday:3},
          {name:"松阪豬",unit:"條",note:"對切",weekday:1,holiday:1},
          {name:"雪花羊",unit:"條",note:"對切",weekday:1,holiday:1},
          {name:"菲力豬",unit:"條",weekday:2,holiday:2}
        ]
      }]
    },

    "樹森": {
      rule: "sunday",
      header: "helloTomorrow",
      footer: "感謝",
      groups: [{
        title: "肉品",
        items: [
          {name:"霜降牛",unit:"條",note:"十字切",weekday:1,holiday:1},
          {name:"小肥牛",unit:"條",note:"十字切",weekday:5,holiday:5},
          {name:"培根豬",unit:"條",note:"十字切",weekday:1,holiday:1},
          {name:"莎朗牛",unit:"條",note:"對切",weekday:4,holiday:4},
          {name:"板腱牛",unit:"條",note:"對切",weekday:2,holiday:2},
          {name:"雪花牛",unit:"條",note:"對切（挑小）",weekday:2,holiday:2},
          {name:"小羔羊",unit:"條",note:"對切",weekday:1,holiday:1},
          {name:"牛小排",unit:"條",weekday:1,holiday:1},
          {name:"A5和牛",unit:"條",weekday:2,holiday:2},
          {name:"去骨雞腿",unit:"件",weekday:1,holiday:1}
        ]
      }]
    },

    "何仙姑": {
      rule: "huannan",
      cutoff: "10:30",
      header: "store",
      footer: "謝謝",
      groups: [{
        title: "菇類",
        items: [
          {name:"香菇",unit:"斤",weekday:1,holiday:1},
          {name:"金針菇",unit:"包",weekday:3,holiday:3},
          {name:"杏鮑菇",unit:"包",weekday:3,holiday:3},
          {name:"木耳",unit:"斤",weekday:10,holiday:10}
        ]
      }]
    },

    "宏鑫": {
      rule: "huannan",
      cutoff: "10:30",
      header: "store",
      footer: "謝謝",
      image: true,
      groups: [
        {
          title: "蔬菜及火鍋料",
          items: [
            {name:"高麗菜",unit:"斤",weekday:50,holiday:70},
            {name:"大黃瓜",unit:"斤",weekday:6,holiday:9},
            {name:"青菜",unit:"斤",weekday:10,holiday:14},
            {name:"南瓜",unit:"斤",weekday:6,holiday:10},
            {name:"鴨血",unit:"塊",weekday:5,holiday:6},
            {name:"豆腐",unit:"板",weekday:1,holiday:2},
            {name:"仙草",unit:"桶",weekday:1,holiday:1},
            {name:"薑絲",unit:"包",weekday:2,holiday:3},
            {name:"青蔥",unit:"包",weekday:3,holiday:4},
            {name:"白蘿蔔",unit:"斤",weekday:6,holiday:8},
            {name:"蒜泥",unit:"包",weekday:4,holiday:5},
            {name:"蘿蔔泥",unit:"包",weekday:3,holiday:4},
            {name:"去頭朝天辣椒",unit:"斤",weekday:2,holiday:2},
            {name:"玉米筍",unit:"盒",weekday:25,holiday:35},
            {name:"小豆苗",unit:"斤",weekday:2,holiday:3},
            {name:"豆干",unit:"斤",weekday:3,holiday:3},
            {name:"海帶結",unit:"斤",weekday:3,holiday:4},
            {name:"台一三角豆腐",unit:"盒",weekday:1,holiday:2},
            {name:"麵條(5斤)",unit:"包",weekday:2,holiday:3},
            {name:"排骨酥",unit:"斤",weekday:3,holiday:3},
            {name:"蟹肉棒",unit:"包",weekday:1,holiday:1},
            {name:"蛋餃",unit:"包",weekday:1,holiday:1},
            {name:"福茂大貢丸",unit:"包",weekday:1,holiday:1},
            {name:"金利華魚包蛋",unit:"包",weekday:1,holiday:1}
          ]
        },
        {
          title: "海鮮、菇類及素料",
          items: [
            {name:"鮮蚵(乾)",unit:"包",weekday:3,holiday:4},
            {name:"蛤蜊(大)",unit:"斤",weekday:6,holiday:12,note:"照片另有中間建議值 8"},
            {name:"鳥蛋",unit:"斤",weekday:4,holiday:4},
            {name:"豬血糕(一包五小片)",unit:"包",weekday:1,holiday:1},
            {name:"豆皮捲(一包五小袋)",unit:"袋",weekday:1,holiday:1},
            {name:"泡菜",unit:"斤",weekday:1,holiday:1},
            {name:"絞肉(綜合)",unit:"斤",weekday:6,holiday:6},
            {name:"肥絞肉",unit:"斤",weekday:0,holiday:0,note:"照片未填建議量"},
            {name:"山粉圓",unit:"包",weekday:1,holiday:1},
            {name:"素高湯(大)",unit:"罐",weekday:1,holiday:1},
            {name:"素火腿",unit:"條",weekday:1,holiday:1},
            {name:"蒟蒻絲",unit:"件",weekday:1,holiday:1},
            {name:"素乾金針",unit:"斤",weekday:4,holiday:4},
            {name:"素高麗菜乾",unit:"斤",weekday:4,holiday:4},
            {name:"素香菇絲",unit:"斤",weekday:4,holiday:4},
            {name:"素火鍋料",unit:"包",weekday:10,holiday:10},
            {name:"白毛肚",unit:"斤",weekday:2,holiday:2},
            {name:"黑毛肚",unit:"斤",weekday:1,holiday:1},
            {name:"魚下巴",unit:"個",weekday:6,holiday:6},
            {name:"小乾香菇",unit:"斤",weekday:4,holiday:4},
            {name:"木耳",unit:"斤",weekday:10,holiday:10},
            {name:"香菇",unit:"斤",weekday:1,holiday:1},
            {name:"杏鮑菇",unit:"包",weekday:3,holiday:3},
            {name:"金針菇",unit:"包",weekday:3,holiday:3}
          ]
        }
      ]
    },

    "客惟您": {
      rule: "wednesday",
      header: "store",
      footer: "謝謝",
      groups: [{
        title: "冰淇淋",
        items: [
          "香草","草莓","巧克力","香芋","花生","鳳梨","瑞士巧克力","薄荷巧克力",
          "香檳葡萄","紅豆牛奶","芒果","青蘋果","山藥","咖啡","芝麻","牛奶雪沙",
          "芭樂","紫莓優格","哈密瓜","榴槤","布丁彩虹","情人果"
        ].map(name=>({name,unit:"桶"}))
      }]
    },

    "總部": {
      rule: "headquarters",
      header: "tomorrow",
      footer: "謝謝",
      groups: [{
        title: "總部品項",
        items: [
          {name:"大骨",unit:"桶"},{name:"醬油",unit:"桶"},{name:"高湯粉 全",unit:"箱"},
          {name:"高湯粉1/4",unit:"箱"},{name:"高湯粉1/2",unit:"箱"},
          {name:"養生包",unit:"包"},{name:"麻辣香粉",unit:"包"}
        ]
      }]
    }
  }
};
