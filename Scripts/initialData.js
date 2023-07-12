/*
A few states for vegetables
1. "Ready" - your plant is ready
2. (timestamp) - the moment your plant will be ready
3. "Empty" - your plot is empty
4. "Locked" - your plot is locked
5. "withered" - your plants have been killed by frost
*/

// Just values, not saved ot account
let gameInfo = {
   // Growing times
   peasTime: [3500, 7000, 10000],
   cornTime: [10000, 20000, 30000],
   strawberriesTime: [30000, 60000, 90000],
   eggplantsTime: [100000, 200000, 300000],
   pumpkinsTime: [300000, 600000, 900000],
   cabbageTime: [900000, 1800000, 2700000],
   dandelionTime: [2400000, 4800000, 7200000],
   rhubarbTime: [7200000, 14400000, 21600000],
   // Seed prices
   cornSeeds: 150,
   strawberriesSeeds: 500,
   eggplantsSeeds: 2000,
   pumpkinsSeeds: 7500,
   cabbageSeeds: 20000,
   dandelionSeeds: 75000,
   rhubarbSeeds: 150000,
   // URLs
   peasURLs: ["Peas/growing.png", "Peas/flowering.png", "Peas/fruiting.png"],
   cornURLs: ["growing.png", "Corn/growing.png", "Corn/fruiting.png"],
   strawberriesURLs: ["Strawberry/growing.png", "Strawberry/flowering.png", "Strawberry/fruiting.png"],
   eggplantsURLs: ["Eggplant/growing.png", "Eggplant/flowering.png", "Eggplant/fruiting.png"],
   pumpkinsURLs: ["growing.png", "Pumpkin/growing.png", "Pumpkin/fruiting.png"],
   cabbageURLs: ["growing.png", "Cabbage/growing.png", "Cabbage/fruiting.png"],
   dandelionURLs: ["Dandelion/flowering.png", "Dandelion/flowering.png", "Dandelion/fruiting.png"],
   rhubarbURLs: ["growing.png", "Rhubarb/growing.png", "Rhubarb/fruiting.png"]
}

// This is saved
let initGameData = {
   // Main
   coins: 0,
   genes: 0,

   // Plots
   plantSeeds: ["peas"],
   plots: [],

   // Plot prices
   plotPrices: [500, 1000, 5000, 10000, 25000, 50000, 100000, 150000],
   plotPlants: ["corn", "strawberries", "eggplants", "pumpkins", "cabbage", "dandelion", "rhubarb"],

   // Harvest yield
   peasRewards: 1,
   cornRewards: 1,
   strawberriesReward: 1,
   eggplantReward: 1,
   pumpkinsRewards: 1,
   cabbageReward: 1,
   dandelionReward: 1,
   rhubarbReward: 1,

   // Produce
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
   cabbage: 0,
   dandelion: 0,
   rhubarb: 0,

   // Market Data
   marketResets: 0,
   fertilizers: 0,
   doughnuts: 0,
   weedPieces: 0,
   weedsLeft: 0,

   // Time
   weedSeason: Date.now() + 1800000,
   disasterTime: 0,
   newWeatherTime: 0,

   // Vegetable prices
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 225,
   sellStrawberries: 225,
   buyEggplants: 750,
   sellEggplants: 750,
   buyPumpkins: 2250,
   sellPumpkins: 2250,
   buyCabbage: 6750,
   sellCabbage: 6750,
   buyDandelion: 18000,
   sellDandelion: 18000,
   buyRhubarb: 54000,
   sellRhubarb: 54000,

   // Markets
   black: {
      name: 0,
      item: 0,
      quantity: 0,
      cost: 0,
      resets: 1500,
      fertilizer: 7500,
      doughnuts: 750,
      catchChance: .02,
   },
   exchangeMarket: {
      peas: 1,
      corn: 3,
      strawberries: 9,
      eggplants: 30,
      pumpkins: 90,
      cabbage: 270,
      dandelion: 720,
      rhubarb: 2160,
   },

   // Weather
   weather: "partlySunny",
   lastWeather: "",
   nextWeather: "",
   marketResetBonus: 0,
   hasBeenPunished: true,

   // Settings
   theme: "dark",
   settingsOpen: false,
   marketOpen: false,
   blackMarketOpen: false,
   tasksOpen: false,
   shopOpen: false,
   genelabOpen: false,

   // Tasks
   taskBox1: "unoccupied",
   taskBox2: "unoccupied",
   taskBox3: "unoccupied",
   taskBox4: "unoccupied",
   jebsPeaSalad: "active",
   jebsPeaSaladNum: 0,
   useMarketResets: "unreached",
   useMarketResetsNum: 0,
   tryFertilizer: "unreached",
   tryFertilizerNum: 0,
   jebsGrilledCorn: "unreached",
   jebsGrilledCornNum: 0,
   josephinesDandelionSalad: "unreached",
   josephinesDandelionSaladNum: 0,
   // Black Market
   seeBlackMarket: "unreached",
   seeBlackMarketNum: 0,
   tryPoliceDoughnuts: "unreached",
   tryPoliceDoughnutsNum: 0,
   // Unlock Plots: Grandpa Jenkins
   unlockThe_cornPlot:  "active",
   unlockThe_cornPlotNum: 0,
   // Bake Sale: Grandma Josephine
   bakeSale: "awaiting",
   bakeSale_peaSnacks: "unreached",
   bakeSale_peaSnacksNum: 0,
   bakeSale_cornBread: "unreached",
   bakeSale_cornBreadNum: 0,
   bakeSale_strawberryJam: "unreached",
   bakeSale_strawberryJamNum: 0,
   bakeSale_pumpkinPie: "unreached",
   bakeSale_pumpkinPieNum: 0,
}
