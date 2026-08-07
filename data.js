const APP_DATA = {
  stores: {
    songlong: {name:"寶神信義松隆店", short:"松隆店", address:"松隆路"},
    songde: {name:"寶神信義松德店", short:"松德店", address:"松德路71號"}
  },
  huannanClosures: [],
  tongheClosures: [],
  vendors: {
    "西北": {rule:"sunday",cutoff:"11:00",header:"vendor",footer:"謝謝",groups:[
      {title:"一般品項",items:[{name:"麻吉燒芝麻",unit:"包"},{name:"麻吉燒花生",unit:"包"},{name:"原味水晶餃",unit:"包"},{name:"芋頭角",unit:"包"},{name:"甜不辣",unit:"包"}]},
      {title:"強強滾",outputTitle:"強強滾：",items:["蝦餃","燕餃","魚餃","翡翠蝦球","鼠來寶","A級球","北海刺","黃金魚蛋","跳跳蝦","魚板","魚卵卷","鑫鑫腸"].map(name=>({name,unit:"包"}))}
    ]},
    "統賀": {rule:"holiday",header:"tomorrow",footer:"感謝",groups:[{title:"肉品",items:[
      {name:"梅花豬",unit:"條",note:"對切",weekday:6,holiday:6},{name:"精選雞",unit:"條",note:"對切",weekday:2,holiday:2},{name:"精選羊",unit:"條",note:"對切",weekday:3,holiday:3},{name:"松阪豬",unit:"條",note:"對切",weekday:1,holiday:1},{name:"雪花羊",unit:"條",note:"對切",weekday:1,holiday:1},{name:"菲力豬",unit:"條",weekday:2,holiday:2}
    ]}]},
    "樹森": {rule:"sunday",header:"helloTomorrow",footer:"感謝",groups:[{title:"肉品",items:[
      {name:"霜降牛",unit:"條",note:"十字切",weekday:1,holiday:1},{name:"小肥牛",unit:"條",note:"十字切",weekday:5,holiday:5},{name:"培根豬",unit:"條",note:"十字切",weekday:1,holiday:1},{name:"沙朗牛",unit:"條",note:"對切",weekday:4,holiday:4},{name:"板腱牛",unit:"條",note:"對切",weekday:2,holiday:2},{name:"雪花牛",unit:"條",note:"對切（挑小）",weekday:2,holiday:2},{name:"小羔羊",unit:"條",note:"對切",weekday:1,holiday:1},{name:"牛小排",unit:"條",weekday:1,holiday:1},{name:"A5和牛",unit:"條",weekday:2,holiday:2},{name:"去骨雞腿",unit:"件",weekday:1,holiday:1}
    ]}]},
    "何仙姑": {rule:"huannan",cutoff:"10:30",header:"store",footer:"謝謝",groups:[{title:"菇類",items:[
      {name:"香菇",unit:"斤",weekday:1,holiday:1},{name:"金針菇",unit:"包",weekday:3,holiday:3},{name:"杏鮑菇",unit:"包",weekday:3,holiday:3},{name:"木耳",unit:"斤",weekday:10,holiday:10}
    ]}]},
    "宏鑫": {rule:"huannan",cutoff:"10:30",header:"store",footer:"謝謝",image:true,
      itemRules:{
        "高麗菜":{step:10},
        "絞肉(綜合)":{step:6,quantityFormat:"repeatStep"},
        "青菜":{vendorName:"青菜（5斤一包）"},
        "素乾金針":{step:0.5,quantityFormat:"halfJin",quantityIncludesUnit:true},
        "素高麗菜乾":{step:0.5,quantityFormat:"halfJin",quantityIncludesUnit:true},
        "素香菇絲":{step:0.5,quantityFormat:"halfJin",quantityIncludesUnit:true},
        "小乾香菇":{step:0.5,quantityFormat:"halfJin",quantityIncludesUnit:true},
        "鳥蛋":{step:0.5,quantityFormat:"halfJin",quantityIncludesUnit:true}
      },
      routeOrder:["高麗菜","泡菜","素高湯(大)","素乾金針","素高麗菜乾","素香菇絲","小乾香菇","鳥蛋","青菜","玉米筍","鴨血","大黃瓜","南瓜","白蘿蔔","山粉圓","蒟蒻絲","豆皮卷(1袋5小包)","海帶結","豆干","素火腿","素火鍋料","台一三角豆腐","白毛肚","黑毛肚","魚下巴","排骨酥","蟹肉棒","蛋餃","金利華魚包蛋","福茂大貢丸","豬血糕(1包5小片)","鮮蚵(乾)","蛤蜊(大)","豆腐","薑絲","小豆苗","麵條(5斤)","青蔥","蒜泥","蘿蔔泥","去頭朝天辣椒","仙草","絞肉(綜合)","杏鮑菇","金針菇","木耳","香菇","整支青蔥","肥絞肉"],
      imageLeft:["高麗菜","大黃瓜","青菜","南瓜","鴨血","豆腐","仙草","薑絲","青蔥","白蘿蔔","紅蘿蔔","蒜泥","蘿蔔泥","去頭朝天辣椒","玉米筍","小豆苗","豆干","海帶結","台一三角豆腐","絲瓜","黑柿番茄","玉米條","麵條(5斤)","排骨酥","蟹肉棒","蛋餃","金利華魚包蛋","福茂大貢丸"],
      imageRight:["鮮蚵(乾)","蛤蜊(大)","鳥蛋","榨菜","豬血糕(1包5小片)","豆皮卷(1袋5小包)","木耳","香菇","杏鮑菇","金針菇","泡菜","絞肉(綜合)","肥絞肉","山粉圓","素高湯(大)","素火腿","蒟蒻絲","素乾金針","素高麗菜乾","素香菇絲","素火鍋料","整支青蔥","白毛肚","黑毛肚","魚下巴","小乾香菇"],
      groups:[{title:"依點貨動線",items:[
        {name:"高麗菜",unit:"斤",weekday:50,holiday:70},{name:"泡菜",unit:"斤",weekday:1,holiday:1},{name:"素高湯(大)",unit:"罐",weekday:1,holiday:1},{name:"素乾金針",unit:"斤",weekday:4,holiday:4},{name:"素高麗菜乾",unit:"斤",weekday:4,holiday:4},{name:"素香菇絲",unit:"斤",weekday:4,holiday:4},{name:"小乾香菇",unit:"斤",weekday:4,holiday:4},{name:"鳥蛋",unit:"斤",weekday:4,holiday:4},{name:"青菜",unit:"斤",weekday:10,holiday:14},{name:"玉米筍",unit:"盒",weekday:25,holiday:35},{name:"鴨血",unit:"塊",weekday:5,holiday:6},{name:"大黃瓜",unit:"斤",weekday:6,holiday:9},{name:"南瓜",unit:"斤",weekday:6,holiday:10},{name:"白蘿蔔",unit:"斤",weekday:6,holiday:8},{name:"山粉圓",unit:"包",weekday:1,holiday:1},{name:"蒟蒻絲",unit:"件",weekday:1,holiday:1},{name:"豆皮卷(1袋5小包)",unit:"袋",weekday:1,holiday:1},{name:"海帶結",unit:"斤",weekday:3,holiday:4},{name:"豆干",unit:"斤",weekday:3,holiday:3},{name:"素火腿",unit:"條",weekday:1,holiday:1},{name:"素火鍋料",unit:"包",weekday:10,holiday:10},{name:"台一三角豆腐",unit:"盒",weekday:1,holiday:2},{name:"白毛肚",unit:"斤",weekday:2,holiday:2},{name:"黑毛肚",unit:"斤",weekday:1,holiday:1},{name:"魚下巴",unit:"個",weekday:6,holiday:6},{name:"排骨酥",unit:"斤",weekday:3,holiday:3},{name:"蟹肉棒",unit:"包",weekday:1,holiday:1},{name:"蛋餃",unit:"包",weekday:1,holiday:1},{name:"金利華魚包蛋",unit:"包",weekday:1,holiday:1},{name:"福茂大貢丸",unit:"包",weekday:1,holiday:1},{name:"豬血糕(1包5小片)",unit:"包",weekday:1,holiday:1},{name:"鮮蚵(乾)",unit:"包",weekday:3,holiday:4},{name:"蛤蜊(大)",unit:"斤",weekday:6,holiday:12},{name:"豆腐",unit:"板",weekday:1,holiday:2},{name:"薑絲",unit:"包",weekday:2,holiday:3},{name:"小豆苗",unit:"斤",weekday:2,holiday:3},{name:"麵條(5斤)",unit:"包",weekday:2,holiday:3},{name:"青蔥",unit:"包",weekday:3,holiday:4},{name:"蒜泥",unit:"包",weekday:4,holiday:5},{name:"蘿蔔泥",unit:"包",weekday:3,holiday:4},{name:"去頭朝天辣椒",unit:"斤",weekday:2,holiday:2},{name:"仙草",unit:"桶",weekday:1,holiday:1},{name:"絞肉(綜合)",unit:"斤",weekday:6,holiday:6},{name:"杏鮑菇",unit:"包",weekday:3,holiday:3},{name:"金針菇",unit:"包",weekday:3,holiday:3},{name:"木耳",unit:"斤",weekday:10,holiday:10},{name:"香菇",unit:"斤",weekday:1,holiday:1},{name:"整支青蔥",unit:"斤",weekday:0,holiday:0},{name:"肥絞肉",unit:"斤",weekday:0,holiday:0}
      ]}]},
    "客惟您": {rule:"customerice",header:"store",footer:"謝謝",groups:[{title:"冰淇淋",items:["香草","草莓","巧克力","香芋","花生","鳳梨","瑞士巧克力","薄荷巧克力","香檳葡萄","紅豆牛奶","芒果","青蘋果","山藥","咖啡","芝麻","牛奶雪沙","芭樂","紫莓優格","哈密瓜","榴槤","布丁彩虹","情人果"].map(name=>({name,unit:"桶"}))}]},
    "總部": {rule:"headquarters",header:"tomorrow",footer:"謝謝",groups:[{title:"總部品項",items:[{name:"大骨",unit:"桶"},{name:"醬油",unit:"桶"},{name:"高湯粉 全",unit:"箱"},{name:"高湯粉1/4",unit:"箱"},{name:"高湯粉1/2",unit:"箱"},{name:"養生包",unit:"包"},{name:"麻辣香粉",unit:"包"}]}]}
  }
};
