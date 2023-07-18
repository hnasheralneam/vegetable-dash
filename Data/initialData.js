/*
A few states for vegetables
1. "Ready" - your plant is ready
2. (timestamp) - the moment your plant will be ready
3. "Empty" - your plot is empty
4. "Locked" - your plot is locked
5. "withered" - your plants have been killed by frost
*/

let initGameData = {
   // Main
   coins: 0,
   genes: 0,

   // Plots
   plantSeeds: ["peas"],
   plots: [],

   // Plot and seed prices
   plotPrices: [500, 1000, 5000, 10000, 25000, 50000, 100000, 150000],
   plotPlants: ["corn", "strawberries", "eggplants", "pumpkins", "cabbage", "dandelion", "rhubarb"],

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
   vegCost: {
      peas: {
         buy: 30,
         sell: 30
      },
      corn: {
         buy: 80,
         sell: 80
      },
      strawberries: {
         buy: 250,
         sell: 250
      },
      eggplants: {
         buy: 750,
         sell: 750
      },
      pumpkins: {
         buy: 2250,
         sell: 2250
      },
      cabbage: {
         buy: 6750,
         sell: 6750
      },
      dandelion: {
         buy: 18000,
         sell: 18000
      },
      rhubarb: {
         buy: 50000,
         sell: 50000
      }
   },

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
   plantLoadingBars: false,
   panels: {
      settings: false,
      market: false,
      blackMarket: false,
      tasks: false,
      shop: false,
      genelab: false
   },

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
