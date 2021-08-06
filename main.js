/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Weather            | Weather that effects plants
Tasks              | Small chores given by main charecters
Incidents          | Luck run when harvesting or using the Market, weeds
Unlock Plots       | Functions that unlock plots
Tour               | Welcome new players, should redo for market
Market             | Sell items for seeds
Main Loop          | Loop for updating display, what function run on loading
Helpful Functions  | Some helpful functions
Commands           | Commands to open panels, right click menu
Active Cursors     | Cursors you can enable to do things
Settings           | Update Sidebar
Save               | Save the game data, restart
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
   center: "empty",
   pumpkins: "empty",
   cabbage: "empty",
   dandelion: "empty",
   rhubarb: "empty",
   // Grow Times
   peasGrowing: Infinity,
   peasFlowering: Infinity,
   peasReady: Infinity,
   cornGrowing: Infinity,
   cornFlowering: Infinity,
   cornReady: Infinity,
   strawberriesGrowing: Infinity,
   strawberriesFlowering: Infinity,
   strawberriesReady: Infinity,
   eggplantsGrowing: Infinity,
   eggplantsFlowering: Infinity,
   eggplantsReady: Infinity,
   centerGrowing: Infinity,
   centerFlowering: Infinity,
   centerReady: Infinity,
   pumpkinsGrowing: Infinity,
   pumpkinsFlowering: Infinity,
   pumpkinsReady: Infinity,
   cabbageGrowing: Infinity,
   cabbageFlowering: Infinity,
   cabbageReady: Infinity,
   dandelionGrowing: Infinity,
   dandelionFlowering: Infinity,
   dandelionReady: Infinity,
   rhubarbGrowing: Infinity,
   rhubarbFlowering: Infinity,
   rhubarbReady: Infinity,
   // Center Plot
   centerStatus: "plant-ready",
   centerReadyTime: 0,
   centerHarvest: 0,
   urlOne: "url(Images/Plots/plot.png)",
   urlTwo: "url(Images/Plots/plot.png)",
   urlThree: "url(Images/Plots/plot.png)",
}
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
   cabbage: 0,
   dandelion: 0,
   rhubarb: 0,
}
let initalPlots = {
   price2: 150,
   price3: 750,
   price4: 3750,
   price5: "Recive an extra plant!",
   price6: 50000,
   price7: 250000,
   price8: 1000000,
   price9: 8000000,
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
   pumpkinplot: "locked",
   cabbageplot: "locked",
   dandelionplot: "locked",
   rhubarbplot: "locked",
   centerplot: "locked",
}
let initalMarketData = {
   seeds: 0,
   marketResets: 0,
   fertilizers: 0,
   doughnuts: 0,
   weedPieces: 0,
   // Time (Where elese do I put it?)
   weedSeason: Date.now() + 1800000,
   disasterTime: 0,
   newWeatherTime: 0,
   // Vegetable prices
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 250,
   sellStrawberries: 250,
   buyEggplants: 750,
   sellEggplants: 750,
   buyPumpkins: 5000,
   sellPumpkins: 5000,
   buyCabbage: 25000,
   sellCabbage: 25000,
   buyDandelion: 100000,
   sellDandelion: 100000,
   buyRhubarb: 7500000,
   sellRhubarb: 7500000,
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
      peas: .2,
      corn: .5,
      strawberries: 6,
      eggplants: 45,
      pumpkins: 90,
      cabbage: 180,
      dandelion: 440,
      rhubarb: 1240,
   },
   weather: {
      sunny: false,
      rainy: false,
      partlySunny: false,
      partlyCloudy: false,
      snowy: false,
      cloudy: false,
      frost: false,
      flood: false,
      marketResetBonus: 0,
      hasBeenPunished: true,
      // heatwave: ["depends", "?"],
      // locusts: ["- all plants",],
      // birds: ["-10% - 15% of seeds",], // Scarecrow investment will reduce by 5%
      // flood: ["-20% stored veg"], // Irrigation investment will retract bad effects, make +1 produce
   }
}
let initalSettings = {
   theme: "dark",
   intro: "unfinished",
   loadtimes: [1000],
}
let initalTaskList = {
   isInSave: true,
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
   unlockThe_cornPlot:  "unreached",
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

var settings = initalSettings;
var plotStatus = initalPlotStatus;
var produce = initalProduce;
var plots = initalPlots;
var marketData = initalMarketData;
var taskList = initalTaskList;
settings.loadtime = findAvg(settings.loadtimes);

function addWeed() {
   let weedBoxHeight = document.querySelector(".land").clientHeight;
   let weedBoxWidth = document.querySelector(".land").clientWidth;
   $(".weed").each(function () {
      var randomtop = (Math.floor(Math.random() * weedBoxHeight) - 25);
      var randomleft = (Math.floor(Math.random() * weedBoxWidth) - 25);
      $(this).css({
         "transform": "scale(1)",
         "margin-top": randomtop,
         "margin-left": randomleft,
      });
   });
}
function collectWeed() {
   $(".weed").remove();
   marketData.weedPieces++;
   callAlert(`You collected a weed fragment! You now have ${marketData.weedPieces}/5`);
   if (marketData.weedPieces >= 5) {
      marketData.weedPieces -= 5;
      marketData.fertilizers += 1;
      callAlert(`You made 1 fertilizer out of the composted weed fragments!`);
   }
}
function toWeedOrNotToWeed() {
   if (Date.now() >= marketData.weedSeason) {
      let myRand = Math.random();
      if (myRand <= .80) { addWeed(); }
      marketData.weedSeason = Date.now() + 1800000;
   }
   currentTime = Date.now();
}

function findAvg(array) {
   let total = 0;
   for(let i = 0; i < array.length; i++) { total += array[i]; }
   let avg = total / array.length;
   return avg;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function infoModal(veg) {
   if (document.querySelector(`#info${veg}`).style.opacity === "1") { hideObj(`#info${veg}`); }
   else { showObj(`#info${veg}`); }
}
function tend(veg, timeOne, timeTwo, timeThree) {
   if (plotStatus[veg + "Ready"] === 0) {
      plotStatus[veg + "Ready"] = Infinity;
      plotStatus[veg] = "empty";
      produce[veg]++;
      document.querySelector(`.${capitalize(veg)}`).textContent = `Grow ${capitalize(veg)}!`;
      marketData.seeds++;
      harvestLuck(capitalize(veg));
      showObj(`.${capitalize(veg)}`);
      if (marketData.weather.rainy === true) { produce[veg]++; }
   }
   else {
      currentTime = Date.now();
      plotStatus[veg + "Growing"] = currentTime + timeOne;
      plotStatus[veg + "Flowering"] = currentTime + timeTwo;
      if (marketData.weather.cloudy) { plotStatus[veg + "Ready"] = currentTime + timeThree + 5000; }
      else { plotStatus[veg + "Ready"] = currentTime + timeThree; }
      plotStatus[veg] = "working";
      timeLeft(timeThree, veg.toLowerCase());
      hideObj(`.${capitalize(veg)}`);
   }
}
function fertilize(veg) {
   if (marketData.fertilizers >= 1) {
      marketData.fertilizers -= 1;
      plotStatus[veg + "Ready"] = 0;
      produce[veg]++;
      checkTasks("tryFertilizer");
   }
}
function plantLoop(veg, pltNumber, urlOne, urlTwo, urlThree, readyTime) {
   let plotImg = document.querySelector(`#plot${pltNumber}`).style;
   let detailedPlantStatus = setInterval(() => {
      timeLeft(readyTime, veg);
      if (plotStatus[veg] === "working") { hideObj(`.${capitalize(veg)}`); }
      if (plotStatus[veg] === "withered") { plotImg.backgroundImage = `url(Images/Plots/withered.png)` }
      else if (Date.now() >= plotStatus[veg + "Ready"]) {
         plotImg.backgroundImage = `url(Images/Plots/${urlThree})`;
         document.querySelector(`.${capitalize(veg)}`).textContent = `Harvest ${capitalize(veg)}!`;
         showObj(`.${capitalize(veg)}`);
         plotStatus[veg + "Growing"] = plotStatus[veg + "Flowering"] = Infinity;
         plotStatus[veg + "Ready"] = 0;
      }
      else if (Date.now() >= plotStatus[veg + "Flowering"]) { plotImg.backgroundImage = `url(Images/Plots/${urlTwo})`; }
      else if (Date.now() >= plotStatus[veg + "Growing"]) { plotImg.backgroundImage = `url(Images/Plots/${urlOne})`; }
      else { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
   }, 1000);
}
function tendCenter(veg, timeOne, timeTwo, timeThree, urlOne, urlTwo, urlThree) {
   if (plotStatus.centerStatus === "harvest-ready") {
      plotStatus.centerReady = Infinity;
      plotStatus.center = "empty";
      produce[plotStatus.centerHarvest]++;
      marketData.seeds++;
      harvestLuck(capitalize(plotStatus.centerHarvest));
      plotStatus.centerReadyTime = 0;
      if (marketData.weather.rainy === true) { produce[plotStatus.centerHarvest]++; }
      plotStatus.centerStatus = "plant-ready";
   }
   else if (plotStatus.centerStatus === "plant-ready") {
      plotStatus.centerHarvest = veg;
      currentTime = Date.now();
      plotStatus.centerGrowing = currentTime + timeOne;
      plotStatus.centerFlowering = currentTime + timeTwo;
      if (marketData.weather.cloudy) { plotStatus.centerReady = currentTime + timeThree + 5000; }
      else { plotStatus.centerReady = currentTime + timeThree; }
      plotStatus.center = "working";
      timeLeft(timeThree, veg);
      plotStatus.centerReadyTime = timeThree;
      plotStatus.urlOne = urlOne;
      plotStatus.urlTwo = urlTwo;
      plotStatus.urlThree = urlThree;
      plotStatus.centerStatus = "growing";
   }
}
setInterval(() => {
   let plotImg = document.querySelector("#plot5");
   timeLeft(plotStatus.centerReadyTime, "center");
   if (Date.now() >= plotStatus.centerReady) {
      plotImg.style.backgroundImage = `url(Images/Plots/${plotStatus.urlThree})`;
      plotStatus.centerGrowing = Infinity;
      plotStatus.centerFlowering = Infinity;
      plotStatus.centerReady = 0;
      plotStatus.centerStatus = "harvest-ready";
   }
   else if (Date.now() >= plotStatus.centerFlowering) { plotImg.style.backgroundImage = `url(Images/Plots/${plotStatus.urlTwo})`; plotStatus.centerGrowing = Infinity; }
   else if (Date.now() >= plotStatus.centerGrowing) { plotImg.style.backgroundImage = `url(Images/Plots/${plotStatus.urlOne})`; }
   else { plotImg.style.backgroundImage = "url(Images/Plots/plot.png)"; }
}, 1000);

plantLoop("peas", 1, "Peas/growing.png", "Peas/flowering.png", "Peas/fruiting.png", 10000);
plantLoop("corn", 2, "growing.png", "Corn/growing.png", "Corn/fruiting.png", 25000);
plantLoop("strawberries", 3, "Strawberry/growing.png", "Strawberry/flowering.png", "Strawberry/fruiting.png", 150000);
plantLoop("eggplants", 4, "Eggplant/growing.png", "Eggplant/flowering.png", "Eggplant/fruiting.png", 900000);
plantLoop("pumpkins", 6, "growing.png", "Pumpkin/growing.png", "Pumpkin/fruiting.png", 1800000);
plantLoop("cabbage", 7, "growing.png", "Cabbage/growing.png", "Cabbage/fruiting.png", 3600000);
plantLoop("dandelion", 8, "Dandelion/flowering.png", "Dandelion/flowering.png", "Dandelion/fruiting.png", 10800000);
plantLoop("rhubarb", 9, "growing.png", "Rhubarb/growing.png", "Rhubarb/fruiting.png", 28800000);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Weather
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let randomWeatherNum = (Math.random()).toFixed(2);
function weatherChance(min, max) {
   let value = {};
   for (i = min; i < max; i += .01) {
      if (randomWeatherNum === i.toFixed(2)) { value[i] = true; }
      else { value[i.toFixed(2)] = false; }
   }
   return !Object.keys(value).every((k) => !value[k]);
}
function chooseWeather() {
   randomWeatherNum = (Math.random()).toFixed(2);
   if (weatherChance(0, .15) === true) { marketData.weather.sunny = true; } else { marketData.weather.sunny = false; }
   if (weatherChance(.15, .30) === true) { marketData.weather.rainy = true; } else { marketData.weather.rainy = false; }
   if (weatherChance(.30, .55) === true) { marketData.weather.partlySunny = true; } else { marketData.weather.partlySunny = false; }
   if (weatherChance(.55, .80) === true) { marketData.weather.partlyCloudy = true; } else { marketData.weather.partlyCloudy = false; }
   if (weatherChance(.80, .85) === true) { marketData.weather.snowy = true; marketData.weather.hasBeenPunished = false; } else { marketData.weather.snowy = false; }
   if (weatherChance(.85, .93) === true) { marketData.weather.cloudy = true; } else { marketData.weather.cloudy = false; }
   if (weatherChance(.93, .95) === true) { marketData.weather.frost = true; marketData.weather.hasBeenPunished = false; } else { marketData.weather.frost = false; }
   if (weatherChance(.95, 1.01) === true) { marketData.weather.flood = true; marketData.weather.hasBeenPunished = false; } else { marketData.weather.flood = false; }
}
let updateWeather = window.setInterval(function() {
   // Implement Weather Effects
   if (marketData.weather.sunny) { marketData.weather.marketResetBonus = 0.03; }
   else { marketData.weather.marketResetBonus = 0; }
   if (marketData.weather.snowy && marketData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(produce[unluckyVeg] / 3);
      produce[unluckyVeg] -= amountLost;
      callAlert(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
      marketData.weather.hasBeenPunished = true;
   }
   if (marketData.weather.flood && marketData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(produce[unluckyVeg] / 5);
      produce[unluckyVeg] -= amountLost;
      callAlert(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      marketData.weather.hasBeenPunished = true;
   }
   if (marketData.weather.frost && marketData.weather.hasBeenPunished === false) {
      if (plots.peaplot === "unlocked" && plotStatus.peasReady != Infinity) { maybeLose("peas"); }
      if (plots.cornplot === "unlocked" && plotStatus.cornReady != Infinity) { maybeLose("corn"); }
      if (plots.strawberryplot === "unlocked" && plotStatus.strawberriesReady != Infinity) { maybeLose("strawberries"); }
      if (plots.eggplantplot === "unlocked" && plotStatus.eggplantsReady != Infinity) { maybeLose("eggplants"); }
      if (plots.pumpkinplot === "unlocked" && plotStatus.pumpkinsReady != Infinity) { maybeLose("pumpkins"); }
      if (plots.cabbageplot === "unlocked" && plotStatus.cabbageReady != Infinity) { maybeLose("cabbage"); }
      if (plots.dandelionplot === "unlocked" && plotStatus.dandelionReady != Infinity) { maybeLose("dandelion"); }
      if (plots.rhubarbplot === "unlocked" && plotStatus.rhubarbReady != Infinity) { maybeLose("rhubarb"); }
      function maybeLose(veg) {
         if (Math.random() > .5) {
            plotStatus[veg + "Growing"] = plotStatus[veg + "Flowering"] = plotStatus[veg + "Ready"] = Infinity;
            plotStatus[veg] = "withered";
            showObj(`.${capitalize(veg)}`);
         }
      }
      marketData.weather.hasBeenPunished = true;
   }
   // Choose next weathertime
   if (Date.now() >= marketData.newWeatherTime) {
      chooseWeather();
      // 6 Minutes (360000)
      marketData.newWeatherTime = Date.now() + 360000;
   }
   // Update Display
   if (marketData.weather.sunny) { changeWeatherDisplay("Sunny", "Benefits: +3% market reset harvest chance", "sunny.svg"); }
   if (marketData.weather.rainy) { changeWeatherDisplay("Rainy", "Benefits: +1 produce", "rain.svg"); }
   if (marketData.weather.partlyCloudy) { changeWeatherDisplay("Partly Cloudy", "Effects: None", "overcast.svg"); }
   if (marketData.weather.partlySunny) { changeWeatherDisplay("Partly Sunny", "Effects: None", "partly-cloudy.svg"); }
   if (marketData.weather.snowy) { changeWeatherDisplay("Snowy", "Detriments: -33% of a stored vegetable", "snow.svg"); }
   if (marketData.weather.cloudy) { changeWeatherDisplay("Cloudy", "Detriments: +5s growing time", "cloudy.svg"); }
   if (marketData.weather.frost) { changeWeatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (marketData.weather.flood) { changeWeatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }
   function changeWeatherDisplay(weather, text, url) {
      document.querySelector(".weather-name"). textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`;
   }
}, 100)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

for (i = 1; i <= 4; i++) { hideObj(`.task-info-button-${i}`); }
let listOfTasks = ["jebsPeaSalad", "useMarketResets", "tryFertilizer", "jebsGrilledCorn", "josephinesDandelionSalad", "unlockThe_cornPlot", "seeBlackMarket", "tryPoliceDoughnuts", "bakeSale_cornBread", "bakeSale_peaSnacks", "bakeSale_strawberryJam", "bakeSale_pumpkinPie"];

// Task Insensitive
function setTask(task) {
   if (taskList.taskBox1 === "unoccupied") { taskList[`${task}Num`] = 1; }
   else if (taskList.taskBox2 === "unoccupied") { taskList[`${task}Num`] = 2; }
   else if (taskList.taskBox3 === "unoccupied") { taskList[`${task}Num`] = 3; }
   else if (taskList.taskBox4 === "unoccupied") { taskList[`${task}Num`] = 4; }
   else { taskList[`${task}Num`] = "Full"; }
   if (taskList[`${task}Num`] === "Full") { task = "waiting"; return; }
   taskList[`taskBox${taskList[`${task}Num`]}`] = `occupied ${task}`;
}
function startTask(num, buttonTxt, buttonOnClick, infoTxt, taskGiver, taskGiverImg, task) {
   taskList[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   showObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
   document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", `javascript: ${buttonOnClick}` );
   document.querySelector(`.task-info-${num}`).textContent = infoTxt;
   document.querySelector(`.task-info-giver-${num}`).textContent = taskGiver;
   $(`.task-info-img-${num}`).attr("src", taskGiverImg);
   taskList["taskBox" + num] = "occupied " + task;
}
function clearTask(num) {
   hideObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).textContent = "";
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: " );
   document.querySelector(`.task-info-${num}`).textContent = "";
   document.querySelector(`.task-info-giver-${num}`).textContent = "";
   $(`.task-info-img-${num}`).attr("src", "");
   taskList["taskBox" + num] = "unoccupied";
}
function oldTaskCheck(task) {
   if (taskList.taskBox1 === `occupied ${task}`) { return 1; }
   else if (taskList.taskBox2 === `occupied ${task}`) { return 2; }
   else if (taskList.taskBox3 === `occupied ${task}`) { return 3; }
   else if (taskList.taskBox4 === `occupied ${task}`) { return 4; }
   else { return false; }
}
function taskAlreadyUp(task) {
   let value = {};
   for (i = 1; i < 5; i++) {
      if (taskList["taskBox" + i] === task) { value[i] = true; }
      else { value[i] = false; }
   }
   if (value[1] === false && value[2] === false && value[3] === false && value[4] === false) { return false }
   else { return true }
}
function checkTasks(task) { if (taskList[task] === "active") { taskList[task] = "ready"; } }

// Task Sensitive
function giveTasks() {
   if (ifTrue("jebsPeaSalad")) { taskList.jebsPeaSalad = "active" }
   if (ifTrueComplete("useMarketResets", "jebsPeaSalad") && marketData.marketResets >= 1) { taskList.useMarketResets = "active" }
   if (ifTrueComplete("tryFertilizer", "jebsPeaSalad")) { taskList.tryFertilizer = "active" }
   if (ifTrue("jebsGrilledCorn") && plots.cornplot === "unlocked") { taskList.jebsGrilledCorn = "active" }
   if (ifTrue("josephinesDandelionSalad") && plots.dandelionplot === "unlocked") { taskList.josephinesDandelionSalad = "active" }
   if (ifTrue("unlockThe_cornPlot") && plots.cornplot === "locked") { taskList.unlockThe_cornPlot = "active" }
   if (ifTrueComplete("seeBlackMarket", "useMarketResets") && plots.strawberryplot === "unlocked") { taskList.seeBlackMarket = "active"; }
   if (ifTrueComplete("tryPoliceDoughnuts", "seeBlackMarket")) { taskList.tryPoliceDoughnuts = "active"; }
   // Bake Sale
   if (plots.pumpkinplot === "unlocked") { taskList.bakeSale = "progressing"; }
   if (ifTrue("bakeSale_cornBread") && taskList.bakeSale === "progressing") { taskList.bakeSale_cornBread = "active" }
   if (passListItem("bakeSale_peaSnacks", "bakeSale_cornBread", "bakeSale")) { taskList.bakeSale_peaSnacks = "active" }
   if (passListItem("bakeSale_strawberryJam", "bakeSale_peaSnacks", "bakeSale")) { taskList.bakeSale_strawberryJam = "active" }
   if (passListItem("bakeSale_pumpkinPie", "bakeSale_strawberryJam", "bakeSale")) { taskList.bakeSale_pumpkinPie = "active" }
   function ifTrue(term) {
      if (taskList[term] != "complete" && taskList[term] != "ready") { return true; }
      else { return false; }
   }
   function ifTrueComplete(term, complete) {
      if (taskList[term] != "complete" && taskList[term] != "ready" && taskList[complete] === "complete") { return true; }
      else { return false; }
   }
   function passListItem(term, complete, list) {
      if (taskList[term] != "complete" && taskList[term] != "ready" && taskList[complete] === "complete" && taskList[list] === "progressing") { return true; }
      else { return false; }
   }
}
function showTasks() {
   if (ifCheck("jebsPeaSalad")) { setTask("jebsPeaSalad"); }
   if (ifCheck("useMarketResets")) { setTask("useMarketResets"); }
   if (ifCheck("tryFertilizer")) { setTask("tryFertilizer"); }
   if (ifCheck("jebsGrilledCorn")) { setTask("jebsGrilledCorn"); }
   if (ifCheck("josephinesDandelionSalad")) { setTask("josephinesDandelionSalad"); }
   if (ifCheck("unlockThe_cornPlot")) { setTask("unlockThe_cornPlot"); }
   if (ifCheck("seeBlackMarket")) { setTask("seeBlackMarket"); }
   if (ifCheck("tryPoliceDoughnuts")) { setTask("tryPoliceDoughnuts"); }
   // Bake Sale
   if (ifCheck("bakeSale_cornBread")) { setTask("bakeSale_cornBread"); }
   if (ifCheck("bakeSale_peaSnacks")) { setTask("bakeSale_peaSnacks"); }
   if (ifCheck("bakeSale_strawberryJam")) { setTask("bakeSale_strawberryJam"); }
   if (ifCheck("bakeSale_pumpkinPie")) { setTask("bakeSale_pumpkinPie"); }
   function ifCheck(task) {
      if (!taskAlreadyUp(`occupied ${task}`) && (taskList[task] === "active" || taskList[task] === "waiting")) { return true; }
      else { return false; }
   }
   // Old open tasks
   if (oldTaskCheck("jebsPeaSalad") != false) {
      if (taskList.jebsPeaSalad === "ready") { startTask(`${oldTaskCheck("jebsPeaSalad")}`, "Collect 2 Fertilizer", "collectTaskReward('jebsPeaSalad')", "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
      else { startTask(`${oldTaskCheck("jebsPeaSalad")}`, "Submit 25 Peas", "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('jebsPeaSalad'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
   }
   if (oldTaskCheck("useMarketResets") != false) {
      if (taskList.useMarketResets === "ready") { startTask(`${oldTaskCheck("useMarketResets")}`, "Collect 250 Seeds", "collectTaskReward('useMarketResets')", "Thank you for completing that small task for me! Here, take 250 seeds!", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
      else { startTask(`${oldTaskCheck("useMarketResets")}`, "Use 1 Market Reset", " ", "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
   }
   if (oldTaskCheck("tryFertilizer") != false) {
      if (taskList.tryFertilizer === "ready") { startTask(`${oldTaskCheck("tryFertilizer")}`, "Collect 2 Market Resets", "collectTaskReward('tryFertilizer')", "Wow, just look at those plants grow! Here, take these, I've had them lying about for years.", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
      else { startTask(`${oldTaskCheck("tryFertilizer")}`, "Use 1 Fertilizer", " ", "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
   }
   if (oldTaskCheck("jebsGrilledCorn") != false) {
      if (taskList.jebsGrilledCorn === "ready") { startTask(`${oldTaskCheck("jebsGrilledCorn")}`, "Collect 8 Market Resets", "collectTaskReward('jebsGrilledCorn')", "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsGrilledCorn"); }
      else { startTask(`${oldTaskCheck("jebsGrilledCorn")}`, "Submit 50 Corn", "if (produce.corn >= 50) { produce.corn -= 50; checkTasks('jebsGrilledCorn'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I'm inviting some family over, and I want to serve corn on the cob. I'm going to need to get come corn. Could you get them for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsGrilledCorn"); }
   }
   if (oldTaskCheck("josephinesDandelionSalad") != false) {
      if (taskList.josephinesDandelionSalad === "ready") { startTask(`${oldTaskCheck("josephinesDandelionSalad")}`, "Collect 15,000 Seeds", "collectTaskReward('josephinesDandelionSalad')", "Take that, Happy Place Farm! Our profits have increased by 20%, and their quarterly earnings fell by 35%! Hurrah for dandelion salad!", "Grandma Josephine", "Images/Tasks/granny.png", "josephinesDandelionSalad"); }
      else { startTask(`${oldTaskCheck("josephinesDandelionSalad")}`, "Submit 6 Dandelions", "if (produce.dandelion >= 6) { produce.dandelion -= 6; checkTasks('josephinesDandelionSalad'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Meet dandelion salad!", "Grandma Josephine", "Images/Tasks/granny.png", "josephinesDandelionSalad"); }
   }
   if (oldTaskCheck("unlockThe_cornPlot") != false) {
      if (taskList.unlockThe_cornPlot === "ready") { startTask(`${oldTaskCheck("unlockThe_cornPlot")}`, "Collect 1 Fertilizer", "collectTaskReward('unlockThe_cornPlot')", "Ooooh, look! It's corn! Whoopie!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "unlockThe_cornPlot"); }
      else { startTask(`${oldTaskCheck("unlockThe_cornPlot")}`, "Unlock the second plot", " ", "You need to diversify your farm. Unlock the second plot for a new plant!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "unlockThe_cornPlot"); }
   }
   if (oldTaskCheck("seeBlackMarket") != false) {
      if (taskList.seeBlackMarket === "ready") { startTask(`${oldTaskCheck("seeBlackMarket")}`, "Collect 5 Doughnuts", "collectTaskReward('seeBlackMarket')", "Well done. Keep up the bad work.", "Shade E. Charekter", "Images/Tasks/shade-e.png", "seeBlackMarket"); }
      else { startTask(`${oldTaskCheck("seeBlackMarket")}`, "Accept a Black Market offer", " ", "My friend has an offer to make you, meet him in the dark alleyway behind the marketplace.", "Shade E. Charekter", "Images/Tasks/shade-e.png", "seeBlackMarket"); }
   }
   if (oldTaskCheck("tryPoliceDoughnuts") != false) {
      if (taskList.tryPoliceDoughnuts === "ready") { startTask(`${oldTaskCheck("tryPoliceDoughnuts")}`, "Collect 7,500 Seeds", "collectTaskReward('tryPoliceDoughnuts')", "Very good. Here, take some cash.", "Shade E. Charekter", "Images/Tasks/shade-e.png", "tryPoliceDoughnuts"); }
      else { startTask(`${oldTaskCheck("tryPoliceDoughnuts")}`, "Use 1 Doughnut", " ", "After accepting or declining a few offers, the police will get suspicious. Feed them doughnuts to satiate their wrath.", "Shade E. Charekter", "Images/Tasks/shade-e.png", "tryPoliceDoughnuts"); }
   }
   // Bake Sale
   if (oldTaskCheck("bakeSale_cornBread") != false) {
      if (taskList.bakeSale_cornBread === "ready") { startTask(oldTaskCheck("bakeSale_cornBread"), "Collect 5 Seeds", "collectTaskReward('bakeSale_cornBread')", "Just you wait! This bake sale is just beginning!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.cornBread"); }
      else { startTask(oldTaskCheck("bakeSale_cornBread"), "Submit 20 Corn", "if (produce.corn >= 20) { produce.corn -= 20; checkTasks('bakeSale_cornBread'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I have a wonderful lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal faviorite!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_cornBread"); }
   }
   if (oldTaskCheck("bakeSale_peaSnacks") != false) {
      if (taskList.bakeSale_peaSnacks === "ready") { startTask(oldTaskCheck("bakeSale_peaSnacks"), "Collect 10 Seeds", "collectTaskReward('bakeSale_peaSnacks')", "We may not have sold much yet, but we've barely started!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.peaSnacks"); }
      else { startTask(oldTaskCheck("bakeSale_peaSnacks"), "Submit 60 Peas", "if (produce.peas >= 60) { produce.peas -= 60; checkTasks('bakeSale_peaSnacks'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Next, let's make some crunchy pea snacks!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_peaSnacks"); }
   }
   if (oldTaskCheck("bakeSale_strawberryJam") != false) {
      if (taskList.bakeSale_strawberryJam === "ready") { startTask(oldTaskCheck("bakeSale_strawberryJam"), "Collect 15 Seeds", "collectTaskReward('bakeSale_strawberryJam')", "Be patient, for great rewards come to those who wait!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.strawberryJam"); }
      else { startTask(oldTaskCheck("bakeSale_strawberryJam"), "Submit 15 Strawberries", "if (produce.strawberries >= 15) { produce.strawberries -= 15; checkTasks('bakeSale_strawberryJam'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_strawberryJam"); }
   }
   if (oldTaskCheck("bakeSale_pumpkinPie") != false) {
      if (taskList.bakeSale_pumpkinPie === "ready") { startTask(oldTaskCheck("bakeSale_pumpkinPie"), "Collect 75,000 Seeds", "collectTaskReward('bakeSale_pumpkinPie')", "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.pumpkinPie"); }
      else { startTask(oldTaskCheck("bakeSale_pumpkinPie"), "Submit 10 Pumpkins", "if (produce.pumpkins >= 10) { produce.pumpkins -= 10; checkTasks('bakeSale_pumpkinPie'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Not all pumpkin pies are great, but my recipe is! Let's make a few!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_pumpkinPie"); }
   }
}
function collectTaskReward(task) {
   if (task === "jebsPeaSalad") { marketData.fertilizers += 2; }
   if (task === "useMarketResets") { marketData.seeds += 250; }
   if (task === "tryFertilizer") { marketData.marketResets += 2; }
   if (task === "jebsGrilledCorn") { marketData.marketResets += 8; }
   if (task === "josephinesDandelionSalad") { marketData.seeds += 15000; }
   if (task === "unlockThe_cornPlot") { marketData.fertilizers += 1; }
   if (task === "seeBlackMarket") { marketData.doughnuts += 5; }
   if (task === "tryPoliceDoughnuts") { marketData.seeds += 7500; }
   // Bake Sale
   if (task === "bakeSale_cornBread") { marketData.seeds += 5; }
   if (task === "bakeSale_peaSnacks") { marketData.seeds += 10; }
   if (task === "bakeSale_strawberryJam") { marketData.seeds += 15; }
   if (task === "bakeSale_pumpkinPie") { marketData.seeds += 75000; }
   taskList[task] = "complete";
   clearTask(taskList[task + "Num"]);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let rand = Math.random();
let vegetablesOwned = [];
vegetablesOwned.push("peas")
function vegetablesOwnedLoop() {
   if (plots.peaplot === "unlocked" && !vegetablesOwned.includes("peas")) { vegetablesOwned.push("peas") }
   if (plots.cornplot === "unlocked" && !vegetablesOwned.includes("corn")) { vegetablesOwned.push("corn") }
   if (plots.strawberryplot === "unlocked" && !vegetablesOwned.includes("strawberries")) { vegetablesOwned.push("strawberries") }
   if (plots.eggplantplot === "unlocked" && !vegetablesOwned.includes("eggplants")) { vegetablesOwned.push("eggplants") }
   if (plots.pumpkinplot === "unlocked" && !vegetablesOwned.includes("pumpkins")) { vegetablesOwned.push("pumpkins") }
   if (plots.cabbageplot === "unlocked" && !vegetablesOwned.includes("cabbage")) { vegetablesOwned.push("cabbage") }
   if (plots.dandelionplot === "unlocked" && !vegetablesOwned.includes("dandelion")) { vegetablesOwned.push("dandelion") }
   if (plots.rhubarbplot === "unlocked" && !vegetablesOwned.includes("rhubarb")) { vegetablesOwned.push("rhubarb") }
}
function harvestLuck(veg) {
   rand = Math.random();
   if (rand < 0.20) {
      fadeTextAppear(event, `You collected 5 \n extra seeds!`, "vegLuck");
      marketData.seeds += 5;
   }
   if (rand < 0.10) {
      fadeTextAppear(event, `It rained! You collected \n 2 extra ${veg}!`, "vegLuck");
      produce[veg.toLowerCase()] += 2;
   }
   if (rand < (0.05 + marketData.weather.marketResetBonus)) {
      fadeTextAppear(event, `You collected a market \n reset! You now have ${marketData.marketResets}`, "vegLuck");
      marketData.marketResets++;
   }
}
function marketLuck() {
   rand = Math.random();
   if (rand < 0.01) {
      marketData.marketResets++;
      callAlert(`You collected a market reset! You now have ${marketData.marketResets}`);
   }
}
function blackMarketLuck() {
   if (Math.random() < marketData.black.catchChance) {
      callAlert("The police caught you! You were fined 6000 Seeds");
      marketData.seeds -= 6000;
   }
}
function luckyRoll() {
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(produce[vegLost] / 3);
   if (Math.random() < .08) {
      produce[vegLost] -= amountLost;
      callAlert(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
    }
}
let whenToLuck = window.setInterval(function() {
   if (Date.now() >= marketData.disasterTime) { luckyRoll(); marketData.disasterTime = Date.now() + 480000; }
}, 1000)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function checkLocks() {
   if (plots.cornplot === "unlocked") { openLock("corn", 2); document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price3, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`; }
   if (plots.strawberryplot === "unlocked") { openLock("strawberry", 3); document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price4, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`; }
   if (plots.eggplantplot === "unlocked") { openLock("eggplant", 4); document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price6, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`; }
   if (plots.pumpkinplot === "unlocked") { openLock("pumpkin", 6); document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price7, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(7)">Purchase Plot</button>`; }
   if (plots.cabbageplot === "unlocked") { openLock("cabbage", 7); document.getElementById("lock8Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price8, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(8)">Purchase Plot</button>`; }
   if (plots.dandelionplot === "unlocked") { openLock("dandelion", 8); document.getElementById("lock9Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price9, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(9)">Purchase Plot</button>`; }
   if (plots.rhubarbplot === "unlocked") { openLock("rhubarb", 9); document.getElementById("lock5Text").innerHTML = "Coming <br> Soon!"; }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (marketData.seeds >= plots["price" + plotNum]) {
      marketData.seeds -= plots["price" + plotNum];
      marketData.marketResets++;
      if (number == "2") { setTimeout(() => { openLock("corn", 2); infoModal('UnlockedCorn'); }, 2500); document.getElementById("lock2").classList.add("removing-lock"); }
      if (number == "3") { setTimeout(() => { openLock("strawberry", 3); infoModal('UnlockedStrawberry'); }, 2500); document.getElementById("lock3").classList.add("removing-lock"); }
      if (number == "4") { setTimeout(() => { openLock("eggplant", 4); infoModal('UnlockedEggplant'); }, 2500); document.getElementById("lock4").classList.add("removing-lock"); }
      if (number == "6") { setTimeout(() => { openLock("pumpkin", 6); infoModal('UnlockedPumpkin'); }, 2500); document.getElementById("lock6").classList.add("removing-lock"); }
      if (number == "7") { setTimeout(() => { openLock("cabbage", 7); infoModal('UnlockedCabbage'); }, 2500); document.getElementById("lock7").classList.add("removing-lock"); }
      if (number == "8") { setTimeout(() => { openLock("dandelion", 8); infoModal('UnlockedDandelion'); }, 2500); document.getElementById("lock8").classList.add("removing-lock"); }
      if (number == "9") { setTimeout(() => { openLock("rhubarb", 9); infoModal('UnlockedRhubarb'); }, 2500); document.getElementById("lock9").classList.add("removing-lock"); }
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function openLock(vegetable, num) {
   document.getElementById(`lockedDiv${num}`).remove();
   document.getElementById(`openPlot${num}`).style.display = "block";
   plots[vegetable + "plot"] = "unlocked";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let introData = { hello: false, meetGramps: false, planting: false, produceBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
function runIntro() {
   plotStatus = initalPlotStatus;
   produce = initalProduce;
   plots = initalPlots;
   marketData = initalMarketData;
   settings = initalSettings;
   taskList = initalTaskList;
   save();
   settings.intro = "finished";
   showObj(".welcome");
   marketData.disasterTime = Date.now() + 480000;
   blackMarketValues();
   newBlackOffer();
}
function goIntro() { hideObj(".welcome"); showObj(".introDarkShadow"); intro(); }
function intro() {
   let introShadow = document.querySelector(".introDarkShadow");
   let qstRibbon = document.getElementById("questRibbon");
   let introBlock = document.querySelector(".intro-container");
   let introImg = document.querySelector(".intro-img");
   let introText = document.querySelector(".intro-text");
   if (introData.hello === false) { introData.hello = true; }
   else { meetGrapms(); }
   function meetGrapms() {
      if (introData.meetGramps === false) {
         $(".intro-img").attr("src", "Images/Tasks/jenkins.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin', the good ol' way!";
         introData.meetGramps = true;
      }
      else { planting(); }
   }
   function planting() {
      if (introData.planting === false) {
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press Grow Peas, and when it's done, press Harvest Peas!";
         document.querySelector(".plant-quest-arrow").style.display = "block";
         document.getElementById("plot1").style.zIndex = "100";
         introData.planting = true;
      }
      else {
         document.querySelector(".plant-quest-arrow").style.display = "none";
         document.getElementById("plot1").style.zIndex = "0";
         sidebar();
      }
   }
   function sidebar() {
      if (introData.produceBar === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "This toolbar shows the amount of produce you have, holds the fertilizer for growing plants quickly, and the sickle for harvesting.";
         document.querySelector(".toolbar").style.zIndex = "100";
         introData.produceBar = true;
      }
      else { weather(); }
   }
   function weather() {
      if (introData.weather === false) {
         $(".intro-img").attr("src", "Images/Tasks/jenkins.png");
         introText.textContent = "Keep an eye on the weather, because it will affect you plants! Sometimes it will help, while other times it could ruin your crop!";
       document.querySelector(".toolbar").style.zIndex = "0";
         document.querySelector(".weather-short").style.zIndex = "9999";
         introData.weather = true;
      }
      else { meetGran(); }
   }
   function meetGran() {
      if (introData.meetGran === false) {
         $(".intro-img").attr("src", "Images/Tasks/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
       document.querySelector(".weather-short").style.zIndex = "0";
         introData.meetGran = true;
      }
      else { market(); }
   }
   function market() {
      if (introData.market === false) {
         introText.textContent = "This is the market, were you can gain seeds by selling produce, which are useful for many things, like opening more plots.";
         introBlock.style.bottom = "20vh";
         document.querySelector(".command-panel").style.zIndex = "9999";
         commandBar();
         introData.market = true;
      }
      else { tasks(); }
   }
   function tasks() {
      if (introData.tasks === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "This little ribbon opens to show Tasks, where you can get rewards for doing chores around the farm.";
         introBlock.style.bottom = "2vh";
         document.querySelector(".command-panel").style.zIndex = "0";
         document.querySelector(".tasks").style.zIndex = "9999";
         introData.tasks = true;
      }
      else { help(); }
   }
   function help() {
      if (introData.help === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "That's it! If you need more help, just check out the small help icon in the top left corner. Be sure to check out the shortcuts section for helpful tips!";
         document.querySelector(".tasks").style.zIndex = "0";
         document.querySelector(".help-center-img").style.zIndex = "9999";
         introData.help = true;
      }
      else { location.reload(); }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function checkMarket() {
   let marketItem = document.getElementsByClassName("market-item");
   marketItem[0].style.display = "block";
   marketItem[11].style.display = "block";
   if (plots.peaplot != "locked") { marketItem[1].style.display = "block"; }
   if (plots.cornplot != "locked") { marketItem[2].style.display = "block"; marketItem[9].style.display = "block"; }
   if (plots.strawberryplot != "locked") { marketItem[3].style.display = "block"; marketItem[10].style.display = "block"; }
   if (plots.eggplantplot != "locked") { marketItem[4].style.display = "block"; }
   if (plots.pumpkinplot != "locked") { marketItem[5].style.display = "block"; }
   if (plots.cabbageplot != "locked") { marketItem[6].style.display = "block"; }
   if (plots.dandelionplot != "locked") { marketItem[7].style.display = "block"; }
   if (plots.rhubarbplot != "locked") { marketItem[8].style.display = "block"; }
}
function updateMarket() {
   display("Peas");
   display("Corn");
   display("Strawberries");
   display("Eggplants");
   display("Pumpkins");
   display("Cabbage");
   display("Dandelion");
   display("Rhubarb");
   function display(veg) {
      document.querySelector(`.${veg.toLowerCase()}-market-item`).textContent = `${veg}: ${toWord(produce[veg.toLowerCase()])}
      Buy for ${toWord(marketData["buy" + veg], "short")}
      Sell for ${toWord(marketData["sell" + veg], "short")} \r\n \r\n`;
   }
   document.querySelector(".special-market-item").textContent = `Seeds: ${toWord(marketData.seeds, "long")}`;
   document.querySelector(".reset-market-item").textContent = `You have ${marketData.marketResets} Market Resets`;
}
function resetMarketValues() {
   if (marketData.marketResets > 0) {
      marketData.marketResets--;
      marketData.buyPeas = 25;
      marketData.sellPeas = 25;
      marketData.buyCorn = 75;
      marketData.sellCorn = 75;
      marketData.buyStrawberries = 250;
      marketData.sellStrawberries = 250;
      marketData.buyEggplants = 750;
      marketData.sellEggplants = 750;
      marketData.buyPumpkins = 5000;
      marketData.sellPumpkins = 5000;
      marketData.buyCabbage = 25000;
      marketData.sellCabbage = 25000;
      marketData.buyDandelion = 100000;
      marketData.sellDandelion = 100000;
      marketData.buyRhubarb = 7500000;
      marketData.sellRhubarb = 7500000;
      checkTasks("useMarketResets");
   }
}

// Buy & Sell Vegetables
function buyProduce(produceRequested, produceCase) {
   if (event.ctrlKey && marketData.seeds >= calcInflation(10)) {
      for (i = 0; i < 10; i++) { buy(); } marketLuck();
   }
   else if (event.shiftKey && marketData.seeds >= calcInflation(5)) {
      for (i = 0; i < 5; i++) { buy(); } marketLuck();
   }
   else if (marketData.seeds >= marketData["buy" + produceCase]) { buy(); marketLuck(); }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
   function buy() {
      produce[produceRequested] += 5;
      marketData.seeds -= marketData["buy" + produceCase];
      marketData["buy" + produceCase] *= 1.08;
      marketData["sell" + produceCase] *= 1.02;
   }
   function calcInflation(times) {
      let fakeBuy = marketData["buy" + produceCase];
      let totalPrice = 0;
      for (i = 1; i < times; i++) { totalPrice += fakeBuy; fakeBuy *= 1.08; }
      return totalPrice;
   }
}
function sellProduce(produceRequested, produceCase) {
   if (event.ctrlKey && produce[produceRequested] >= 50) {
      for (i = 0; i < 10; i++) { sell(); } marketLuck();
   }
   else if (event.shiftKey && produce[produceRequested] >= 25) {
      for (i = 0; i < 5; i++) { sell(); } marketLuck();
   }
   else if (produce[produceRequested] >= 5) { sell(); marketLuck(); }
   else { fadeTextAppear(event, `Not enough produce`, false); }
   function sell() {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
   }
}

// Exchange Market!
let offerVeg = costVeg = {};
function generateExchange() {
   let merchantNames = ["Ramesh Devi", "Zhang Wei", "Emmanuel Abara", "Kim Nguyen", "John Smith", "Muhammad Khan", "David Smith", "Achariya Sok", "Aleksandr Ivanov", "Mary Smith", "José Silva", "Oliver Gruber", "James Wang", "Kenji Satō"];
   let merchantName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
   let vegetablesOwnedExchange = vegetablesOwned;
   let x = vegetablesOwnedExchange[Math.floor(Math.random() * vegetablesOwnedExchange.length)];
   vegetablesOwnedExchange = vegetablesOwnedExchange.filter(e => e !== `${x}`);
   let n = vegetablesOwnedExchange[Math.floor(Math.random() * vegetablesOwnedExchange.length)];
   offerVeg.vegetable = x;
   costVeg.vegetable = n;
   offerVeg.worth = marketData["exchangeMarket"][x];
   costVeg.worth = marketData["exchangeMarket"][n];
   offerVeg.amount = random(2, 25);
   offerVeg.totalVal = offerVeg.amount * offerVeg.worth;
   costVeg.amount = offerVeg.totalVal / costVeg.worth;
   document.querySelector(".market-exchange").style.backgroundColor = genColor();
   document.querySelector(".exchange-merchant").textContent = `${merchantName}`;
   document.querySelector(".exchange-offer").textContent = `${Math.round(offerVeg.amount)} ${x}`;
   document.querySelector(".exchange-demand").textContent = `${Math.round(costVeg.amount)} ${n}`;
   if (Math.round(offerVeg.amount) === 0) { generateExchange(); }
   if (Math.round(costVeg.amount) === 0) { generateExchange(); }
}
function acceptExchange() {
   if (produce[costVeg.vegetable] >= costVeg.amount) {
      produce[offerVeg.vegetable] += offerVeg.amount;
      produce[costVeg.vegetable] -= costVeg.amount;
      generateExchange();
   }
   else { fadeTextAppear(event, `Not enough produce`, false); }
}

// Black Market
function blackMarketValues() {
   marketData.black.name = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel", "Stolin Goods"][Math.floor(Math.random() * 7)];
   marketData.black.item = ["Market Resets", "Fertilizer", "Doughnuts"][Math.floor(Math.random() * 3)];
   marketData.black.quantity = random(1, 5);
   if (marketData.black.item === "Market Resets") { marketData.black.worth = marketData.black.resets; }
   if (marketData.black.item === "Fertilizer") { marketData.black.worth = marketData.black.fertilizer; }
   if (marketData.black.item === "Doughnuts") { marketData.black.worth = marketData.black.doughnuts; }
   marketData.black.cost = marketData.black.worth * marketData.black.quantity;
}
function newBlackOffer() {
   document.querySelector(".bmo-seller").textContent = marketData.black.name;
   document.querySelector(".bmo-offer").textContent = marketData.black.quantity + " " + marketData.black.item;
   document.querySelector(".bmo-price").textContent = toWord(marketData.black.cost);
   document.querySelector(".blackMarket").style.backgroundColor = genColor();
}
function accept() {
   if (marketData.seeds >= marketData.black.cost) {
      marketData.seeds -= marketData.black.cost;
      blackMarketValues();
      blackMarketLuck();
      newBlackOffer();
      marketData.black.catchChance += .01;
      if (marketData.black.item === "Market Resets") { marketData.marketResets += marketData.black.quantity; }
      if (marketData.black.item === "Fertilizer") { marketData.fertilizers += marketData.black.quantity; }
      if (marketData.black.item === "Doughnuts") { marketData.doughnuts += marketData.black.quantity; }
      checkTasks("seeBlackMarket");
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function deny() {
   blackMarketValues();
   blackMarketLuck();
   newBlackOffer();
   marketData.black.catchChance += .01;
}
function feedPolice() {
   if (marketData.doughnuts >= 1) {
      marketData.doughnuts -= 1;
      marketData.black.catchChance = .02;
      fadeTextAppear(event, `-1 Doughnut`, false);
      checkTasks("tryPoliceDoughnuts");
   }
   else { fadeTextAppear(event, `Not enough doughnuts`, false); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let mainLoop = window.setInterval(function() {
   updateMarket();
   vegetablesOwnedLoop();
   giveTasks();
   showTasks();
   checkMarket();
   updateModalMarketPrices("Corn");
   updateModalMarketPrices("Peas");
   updateModalMarketPrices("Strawberries");
   updateModalMarketPrices("Eggplants");
   updateModalMarketPrices("Pumpkins");
   updateModalMarketPrices("Cabbage");
   updateModalMarketPrices("Dandelion");
   updateModalMarketPrices("Rhubarb");
   function updateModalMarketPrices(veg) {
      document.querySelector(`.modal${veg}PriceBuy`).textContent = `Buy For ${toWord(marketData[`buy${veg}`], "short")}`;
      document.querySelector(`.modal${veg}PriceSell`).textContent = `Sell For ${toWord(marketData[`sell${veg}`], "short")}`;
   }
   // Update produce display
   document.querySelector(".police-chance").textContent = (marketData.black.catchChance).toFixed(2);
   document.querySelector(".seeds").textContent = `${toWord(marketData.seeds, "short")} Seeds`;
   document.querySelector(".seedsQuick").textContent = `${toWord(marketData.seeds)} Seeds`;
   document.querySelector("#doughnuts").textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`;
   document.querySelector("#fertilizer").textContent = `${Math.round(marketData.fertilizers)} Fertilizers Click + Place to apply`;
   if (plots.peaplot === "unlocked") { revealProduceQwk("#peaBushelsQuick", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduceQwk("#cornBushelsQuick", "corn"); }
   if (plots.strawberryplot === "unlocked") { revealProduceQwk("#strawberryBushelsQuick", "strawberries");
      document.querySelector(`.doughnutsAmountQuick`).style.display = "block"; document.querySelector(`#doughnutsQuick`).textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`; }
   if (plots.eggplantplot === "unlocked") { revealProduceQwk("#eggplantBushelsQuick", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduceQwk("#pumpkinBushelsQuick", "pumpkins"); }
   if (plots.cabbageplot === "unlocked") { revealProduceQwk("#cabbageBushelsQuick", "cabbage"); }
   if (plots.dandelionplot === "unlocked") { revealProduceQwk("#dandelionBushelsQuick", "dandelion"); }
   if (plots.rhubarbplot === "unlocked") { revealProduceQwk("#rhubarbBushelsQuick", "rhubarb"); }
   if (plots.peaplot === "unlocked") { revealProduce("#peaBushels", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduce("#cornBushels", "corn"); checkTasks("unlockThe_cornPlot"); }
   if (plots.strawberryplot === "unlocked") { revealProduce("#strawberryBushels", "strawberries");
      document.querySelector(`.doughnutsAmount`).style.display = "block"; document.querySelector(`#doughnuts`).textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`; }
   if (plots.eggplantplot === "unlocked") { revealProduce("#eggplantBushels", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduce("#pumpkinBushels", "pumpkins"); }
   if (plots.cabbageplot === "unlocked") { revealProduce("#cabbageBushels", "cabbage"); }
   if (plots.dandelionplot === "unlocked") { revealProduce("#dandelionBushels", "dandelion"); }
   if (plots.rhubarbplot === "unlocked") { revealProduce("#rhubarbBushels", "rhubarb"); }
   function revealProduce(id, veg) {
      document.querySelector(`.${veg}Amount`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(produce[veg], "short")} Bushels of ${capitalize(veg)}`; }
   function revealProduceQwk(id, veg) {
      document.querySelector(`.${veg}AmountQuick`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(produce[veg], "short")} Bushels of ${capitalize(veg)}`; }
   if (plots.cornplot === 'unlocked') { document.querySelector(".tm-tb-co").style.opacity = "1"; }
   if (plots.strawberryplot === 'unlocked') { document.querySelector(".tm-tb-st").style.opacity = "1"; }
   if (plots.eggplantplot === 'unlocked') { document.querySelector(".tm-tb-eg").style.opacity = "1"; }
   if (plots.pumpkinplot === 'unlocked') { document.querySelector(".tm-tb-pu").style.opacity = "1"; }
   if (plots.cabbageplot === 'unlocked') { document.querySelector(".tm-tb-ca").style.opacity = "1"; }
   if (plots.dandelionplot === 'unlocked') { document.querySelector(".tm-tb-da").style.opacity = "1"; }
   if (plots.rhubarbplot === 'unlocked') { document.querySelector(".tm-tb-rh").style.opacity = "1"; }
}, 200)

setInterval(() => {
   if (chechIf()) { document.querySelector(".aTaskIsReady").style.opacity = "1"; }
   else { document.querySelector(".aTaskIsReady").style.opacity = "0"; }
   function chechIf() {
      let array = [];
      for (i = 0; i < listOfTasks.length; i++) {
         if (taskList[listOfTasks[i]] === "ready") { array[i] = true; }
         else { array[i] = false; }
      }
      if (isTrue(array)) { return true; }
      else { return false; }
   }
   function isTrue(array) { let result = false; for (let i = 0; i < array.length; i++) { if (array[i] === true) { return true; } } }
}, 2000);

window.onload = function() {
   whatTheme();
   checkLocks();
   checkMarket();
   newBlackOffer();
   setTimeout(() => { generateExchange(); }, 750);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function commas(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function reverseString(str) {
   let splitString = str.split("");
   return splitString.reverse().join("");
}
function diff(n, x) { return n / x; }
function random(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function scrollToSection(id) { document.getElementById(id).scrollIntoView(); }
function hideObj(objId) {
   document.querySelector(objId).style.opacity = "0";
   document.querySelector(objId).style.pointerEvents = "none";
   document.querySelector(objId).style.zIndex = "0";
}
function showObj(objId) {
   document.querySelector(objId).style.opacity = "1";
   document.querySelector(objId).style.pointerEvents = "auto";
   document.querySelector(objId).style.zIndex = "1";
}
function genColor() {
   function rand(min, max) { let randomNum = Math.random() * (max - min) + min; return Math.round(randomNum); }
   let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   let color = '#';
   for (let i = 0; i < 6; i++) { let index = rand(0, 15); color += hex[index]; }
   return color;
}
function callAlert(text) {
   // Isn't it just great copying the code from other projects?
   let alert = document.querySelector(".alert");
   alert.style.opacity = "1";
   alert.style.pointerEvents = "auto";
   alert.textContent = text;
   setTimeout(alertAnimation => { document.querySelector('.alert').classList.add('alertAnimation'); }, 6000);
   setTimeout(removeAnimation => { document.querySelector('.alert').classList.remove('alertAnimation'); }, 9000);
   setTimeout(hideAlerts => { alert.style.opacity = "0"; alert.style.pointerEvents = "none"; }, 9000);
}
function timeLeft(time, veg) {
   if (!Number.isFinite(plotStatus[veg + "Ready"])) { return; }
   var countDown = document.querySelector(`.${veg}-time-left`);
   var endTime = plotStatus[veg + "Ready"];
   var countDownInterval;
   var secondsLeftms;
   var setCountDown = (endTime) => {
      secondsLeftms = endTime - Date.now();
      var secondsLeft = Math.round(secondsLeftms / 1000);
      var hours = Math.floor(secondsLeft / 3600);
      var minutes = Math.floor(secondsLeft / 60) - (hours * 60);
      var seconds = secondsLeft % 60;
      if (secondsLeft < 0) { resetCountDown(); return; }
      if (hours < 10) { hours = `0${hours}`; }
      if (minutes < 10) { minutes = `0${minutes}`; }
      if (seconds < 10) { seconds = `0${seconds}`; }
      countDown.textContent = `${hours}:${minutes}:${seconds}`;
   };
   if (time > 0) {
      var now = Date.now();
      setCountDown(endTime);
      countDownInterval = setInterval(() => { setCountDown(endTime); }, 1000);
   }
   function resetCountDown() {
      clearInterval(countDownInterval);
      countDown.textContent = '00:00:00';
   }
}
$(document).ready(function(){ $('.help-subjects-item').click(function () { $('.help-subjects-item-active').removeClass("help-subjects-item-active"); $(this).addClass("help-subjects-item-active"); }) });

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function aEL(key, func) { document.addEventListener("keyup", function(event) { event.preventDefault(); if (event.shiftKey && event.keyCode === key) { func(); } }); }

var pageX = pageY = 0;
var pressCount = 0;
function tellPos(p){ pageX = p.pageX; pageY = p.pageY; }
let quickInformation = "closed";
let quickInfoMenu = document.querySelector(".qIM");
addEventListener("mousemove", tellPos, false);
document.addEventListener("keyup", function(event) {
   if (event.key === "Shift") {
      pressCount++;
      setTimeout(() => {
         if (pressCount >= 2) {
            if (quickInformation === "closed") {
               quickInfoMenu.style.display = "block";
               quickInformation = "opened";
               var updateMovingInfo = setInterval(() => {
                  quickInfoMenu.style.top = `${pageY}px`;
                  quickInfoMenu.style.left = `${pageX}px`;
               }, 50);
            } else {
               quickInfoMenu.style.display = "none";
               quickInformation = "closed";
               clearInterval(updateMovingInfo);
            }
         }
         pressCount = 0;
      }, 250);
   }
});

aEL(84, taskBar); // Shift + T
aEL(83, settingModal); // Shift + S
aEL(80, plantDrag); // Shift + P
aEL(72, harvestDrag); // Shift + H
aEL(70, fertilizeHover); // Shift + F
aEL(77, toggleMarket); // Shift + M
aEL(65, tendAll); // Shift + A

function tendAll() {
   if ("working" !== plotStatus["peas"]) { tend('peas', 3000, 6000, 10000); }
   if (Date.now() >= plotStatus["peasReady"]) { tend('peas', 3000, 6000, 10000); }
   if (plots.cornplot === "unlocked" && "working" !== plotStatus["corn"]) { tend('corn', 6000, 12000, 25000); }
   if (plots.cornplot === "unlocked" && Date.now() >= plotStatus["cornReady"]) { tend('corn', 6000, 12000, 25000); }
   if (plots.strawberryplot === "unlocked" && "working" !== plotStatus["strawberries"]) { tend('strawberries', 50000, 100000, 150000); }
   if (plots.strawberryplot === "unlocked" && Date.now() >= plotStatus["strawberriesReady"]) { tend('strawberries', 50000, 100000, 150000); }
   if (plots.eggplantplot === "unlocked" && "working" !== plotStatus["eggplants"]) { tend('eggplants', 300000, 600000, 900000); }
   if (plots.eggplantplot === "unlocked" && Date.now() >= plotStatus["eggplantsReady"]) { tend('eggplants', 300000, 600000, 900000); }
   if (plots.pumpkinplot === "unlocked" && "working" !== plotStatus["pumpkins"]) { tend('pumpkins', 600000, 1200000, 1800000); }
   if (plots.pumpkinplot === "unlocked" && Date.now() >= plotStatus["pumpkinsReady"]) { tend('pumpkins', 600000, 1200000, 1800000); }
   if (plots.cabbageplot === "unlocked" && "working" !== plotStatus["cabbage"]) { tend('cabbage', 1200000, 2400000, 3600000); }
   if (plots.cabbageplot === "unlocked" && Date.now() >= plotStatus["cabbageReady"]) { tend('cabbage', 1200000, 2400000, 3600000); }
   if (plots.dandelionplot === "unlocked" && "working" !== plotStatus["dandelion"]) { tend('dandelion', 3600000, 7200000, 10800000); }
   if (plots.dandelionplot === "unlocked" && Date.now() >= plotStatus["dandelionReady"]) { tend('dandelion', 3600000, 7200000, 10800000); }
   if (plots.rhubarbplot === "unlocked" && "working" !== plotStatus["rhubarb"]) { tend('rhubarb', 9600000, 18200000, 28800000); }
   if (plots.rhubarbplot === "unlocked" && Date.now() >= plotStatus["rhubarbReady"]) { tend('rhubarb', 9600000, 18200000, 28800000); }
}

taskBarOpen = false;
function taskBar() {
   if (taskBarOpen === true) {
      document.querySelector(".tasks").style.left = "0";
      document.querySelector(".taskShadow").style.display = "block";
      taskBarOpen = false;
   }
   else {
      document.querySelector(".tasks").style.left = "-80vh";
      document.querySelector(".taskShadow").style.display = "none";
      taskBarOpen = true;
   }
}
function commandBar() {
   if (document.querySelectorAll(".commandBarImg")[0].style.display === "inline-block") {
      document.querySelectorAll(".commandBarImg")[0].style.display = "none";
      document.querySelectorAll(".commandBarImg")[1].style.display = "none";
      document.querySelector(".slider").style.backgroundColor = "#cb9e00";
      document.querySelector(".slider").style.transform = "rotate(0)";
   }
   else {
      document.querySelectorAll(".commandBarImg")[0].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[1].style.display = "inline-block";
      document.querySelector(".slider").style.backgroundColor = "#ffca18";
      document.querySelector(".slider").style.transform = "rotate(180deg)";
   }
}
function settingModal() {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
}
function toggleMarket() {
   if (document.querySelector(".marketShadow").style.opacity === "0") { showObj(".marketShadow"); }
   else { hideObj(".marketShadow"); }
}

// Right Click Menu
let rightClickMenu = document.querySelector("#menu").style;
if (document.addEventListener) {
   document.addEventListener('contextmenu', function(e) {
      let posX = e.clientX;
      let posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   }, false);
   document.addEventListener('click', function(e) {
      rightClickMenu.display = "none";
   }, false);
}
else {
   document.attachEvent('oncontextmenu', function(e) {
      var posX = e.clientX;
      var posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   });
   document.attachEvent('onclick', function(e) {
      setTimeout(function() {
         rightClickMenu.display = "none";
      }, 501);
   });
}
function menu(x, y) {
   rightClickMenu.top = y + "px";
   rightClickMenu.left = x + "px";
   rightClickMenu.display = "block";
}

function fadeTextAppear(e, txt, extraClass) {
   let fadeText = document.querySelector(".fade-text").cloneNode();
   fadeText.id = "fadeTextNew";
   fadeText.textContent = txt;
   document.querySelector("body").appendChild(fadeText);
   if (extraClass != false) { fadeText.classList.add(extraClass); }
   fadeText.style.left = `${(window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)}px`;
   fadeText.style.top = `${(window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)}px`;
}

let openTaskHov = [];
let openTaskUnHov = [];
function taskHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).style.position = 'absolute';
      document.querySelector(`.task-block-${num}`).style.transform = 'scale(2)';
      document.querySelector(`.task-block-${num}`).style.top = '18vh';
      document.querySelector(`.task-block-${num}`).style.left = '18vh';
      document.querySelector(`.task-block-${num}`).style.right = '18vh';
      document.querySelector(`.task-block-${num}`).style.width = '40vh';
      document.querySelector(`.task-block-${num}`).style.height = '40vh';
      document.querySelector(`.task-block-${num}`).style.zIndex = '1';
   }, 750);
}
function taskUnHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskUnHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).style.position = 'relative';
      document.querySelector(`.task-block-${num}`).style.transform = 'scale(1)';
      document.querySelector(`.task-block-${num}`).style.top = '0';
      document.querySelector(`.task-block-${num}`).style.left = 'auto';
      document.querySelector(`.task-block-${num}`).style.right = 'auto';
      document.querySelector(`.task-block-${num}`).style.width = '92%';
      document.querySelector(`.task-block-${num}`).style.height = '37vh';
      document.querySelector(`.task-block-${num}`).style.zIndex = '0';
   }, 250);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Active Cursors
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var mouseDown = 0;
document.body.onmousedown = function() { mouseDown = 1; }
document.body.onmouseup = function() { mouseDown = 0; }

var mouseWasDown = false;
var plntMouseWasDown = false;
let harvestCursor = "not active";
let plantCursor = "not active";
let fertilizerCursor = "not active";

function harvestDrag() {
   if (harvestCursor === "active") {
      harvestCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      harvestCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Global Assets/sickle-cursor.png'), auto";
   }
}
function plantDrag() {
   if (plantCursor === "active") {
      plantCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      plantCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Global Assets/plant-cursor.png'), auto";
   }
}
function fertilizeHover() {
   if (fertilizerCursor === "active") {
      fertilizerCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      fertilizerCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Global Assets/fertilizer-shovel.png'), auto";
   }
}

setInterval(() => {
   if (harvestCursor === "active" && mouseDown === 1) { mouseWasDown = true; }
   if (harvestCursor !== "active") { mouseWasDown = false; }
   if (mouseDown === 0 && mouseWasDown === true) { harvestDrag(); }
   if (plantCursor === "active" && mouseDown === 1) { plntMouseWasDown = true; }
   if (plantCursor !== "active") { plntMouseWasDown = false; }
   if (mouseDown === 0 && plntMouseWasDown === true) { plantDrag(); }
}, 100)

$("#plot1").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && "working" !== plotStatus["peas"]) { tend('peas', 3000, 6000, 10000); }
   if (mouseDown === 1 && harvestCursor === "active" && Date.now() >= plotStatus["peasReady"]) { tend('peas', 3000, 6000, 10000); }
});
$("#plot2").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.cornplot === "unlocked" && "working" !== plotStatus["corn"]) { tend('corn', 6000, 12000, 25000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.cornplot === "unlocked" && Date.now() >= plotStatus["cornReady"]) { tend('corn', 6000, 12000, 25000); }
});
$("#plot3").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.strawberryplot === "unlocked" && "working" !== plotStatus["strawberries"]) { tend('strawberries', 50000, 100000, 150000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.strawberryplot === "unlocked" && Date.now() >= plotStatus["strawberriesReady"]) { tend('strawberries', 50000, 100000, 150000); }
});
$("#plot4").mouseenter(() => {
   if (mouseDown === 1 && plantCursor || harvestCursor === "active"  && (plots.eggplantplot === "unlocked" && "working" !== plotStatus["eggplants"]) || (plots.eggplantplot === "unlocked" && Date.now() >= plotStatus["eggplantsReady"])) { tend('eggplants', 300000, 600000, 900000); }
});
$("#plot6").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.pumpkinplot === "unlocked" && "working" !== plotStatus["pumpkins"]) { tend('pumpkins', 600000, 1200000, 1800000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.pumpkinplot === "unlocked" && Date.now() >= plotStatus["pumpkinsReady"]) { tend('pumpkins', 600000, 1200000, 1800000); }
});
$("#plot7").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.cabbageplot === "unlocked" && "working" !== plotStatus["cabbage"]) { tend('cabbage', 1200000, 2400000, 3600000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.cabbageplot === "unlocked" && Date.now() >= plotStatus["cabbageReady"]) { tend('cabbage', 1200000, 2400000, 3600000); }
});
$("#plot8").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.dandelionplot === "unlocked" && "working" !== plotStatus["dandelion"]) { tend('dandelion', 3600000, 7200000, 10800000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.dandelionplot === "unlocked" && Date.now() >= plotStatus["dandelionReady"]) { tend('dandelion', 3600000, 7200000, 10800000); }
});
$("#plot9").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.rhubarbplot === "unlocked" && "working" !== plotStatus["rhubarb"]) { tend('rhubarb', 9600000, 18200000, 28800000); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.rhubarbplot === "unlocked" && Date.now() >= plotStatus["rhubarbReady"]) { tend('rhubarb', 9600000, 18200000, 28800000); }
});

document.querySelector("#plot1").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.peasReady !== 0) { fertilize("peas"); fertilizeHover(); } });
document.querySelector("#plot2").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.cornReady !== 0) { fertilize("corn"); fertilizeHover(); } });
document.querySelector("#plot3").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.strawberriesReady !== 0) { fertilize("strawberries"); fertilizeHover(); } });
document.querySelector("#plot4").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.eggplantsReady !== 0) { fertilize("eggplants"); fertilizeHover(); } });
document.querySelector("#plot6").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.pumpkinsReady !== 0) { fertilize("pumpkins"); fertilizeHover(); } });
document.querySelector("#plot7").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.cabbageReady !== 0) { fertilize("cabbage"); fertilizeHover(); } });
document.querySelector("#plot8").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.dandelionReady !== 0) { fertilize("dandelion"); fertilizeHover(); } });
document.querySelector("#plot9").addEventListener("click", event => { if (fertilizerCursor === "active" && plotStatus.rhubarbReady !== 0) { fertilize("rhubarb"); fertilizeHover(); } });

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (settings.theme === "dark") { darkTheme(); }
   else if (settings.theme === "light") { lightTheme(); }
   else if (settings.theme === "random") { randTheme(); }
   else { darkTheme(); }
}
function darkTheme() { document.querySelector(".toolbar").style.backgroundColor = "#111"; settings.theme = "dark"; }
function randTheme() { document.querySelector(".toolbar").style.backgroundColor = genColor(); settings.theme = "random"; }
function lightTheme() { document.querySelector(".toolbar").style.backgroundColor = "#f5f5f5"; settings.theme = "light"; }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// For keeping Infinity the same after saving
const replacer = (key, value) => {
   if (value instanceof Function) { return value.toString(); }
   else if (value === NaN) { return 'NaN'; }
   else if (value === Infinity) { return 'Infinity'; }
   else if (typeof value === 'undefined') { return 'undefined'; }
   else { return value; }
}

let saveLoop = window.setInterval(function() { save(); }, 1000)

function save() {
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus, replacer));
   localStorage.setItem("produce", JSON.stringify(produce, replacer));
   localStorage.setItem("plots", JSON.stringify(plots, replacer));
   localStorage.setItem("marketData", JSON.stringify(marketData, replacer));
   localStorage.setItem("settingData", JSON.stringify(settings, replacer));
   localStorage.setItem("taskList", JSON.stringify(taskList, replacer));
}

if (settings.intro != "finished") {
   plotStatus = JSON.parse(localStorage.getItem("plotStatus"));
   produce = JSON.parse(localStorage.getItem("produce"));
   plots = JSON.parse(localStorage.getItem("plots"));
   marketData = JSON.parse(localStorage.getItem("marketData"));
   settings = JSON.parse(localStorage.getItem("settingData"));
   taskList = JSON.parse(localStorage.getItem("taskList"));
}

if (!settings || (settings.intro != "finished")) { runIntro(); }

function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
   if (areYouSure === true && areYouReallySure === true) {
      localStorage.setItem("plotStatus", JSON.stringify(initalPlotStatus, replacer));
      localStorage.setItem("produce", JSON.stringify(initalProduce, replacer));
      localStorage.setItem("plots", JSON.stringify(initalPlots, replacer));
      localStorage.setItem("marketData", JSON.stringify(initalMarketData, replacer));
      localStorage.setItem("settingData", JSON.stringify(initalSettings, replacer));
      localStorage.setItem("taskList", JSON.stringify(initalTaskList, replacer));
      plotStatus = JSON.parse(localStorage.getItem("plotStatus"));
      produce = JSON.parse(localStorage.getItem("produce"));
      plots = JSON.parse(localStorage.getItem("plots"));
      marketData = JSON.parse(localStorage.getItem("marketData"));
      settings = JSON.parse(localStorage.getItem("settingData"));
      taskList = JSON.parse(localStorage.getItem("taskList"));
      // Reload
      location.reload();
   }
}

const initalPlotStatusKeys = Object.keys(initalPlotStatus);
const initalProduceKeys = Object.keys(initalProduce);
const initalPlotsKeys = Object.keys(initalPlots);
const initalMarketDataKeys = Object.keys(initalMarketData);
const initalSettingsKeys = Object.keys(initalSettings);
const initalTaskListKeys = Object.keys(initalTaskList);
for (key of initalPlotStatusKeys) { if (plotStatus[key] === undefined) { plotStatus[key] = initalPlotStatus[key]; } }
for (key of initalProduceKeys) { if (produce[key] === undefined) { produce[key] = initalProduce[key]; } }
for (key of initalPlotsKeys) { if (plots[key] === undefined) { plots[key] = initalPlots[key]; } }
for (key of initalMarketDataKeys) { if (marketData[key] === undefined) { marketData[key] = initalMarketData[key]; } }
for (key of initalSettingsKeys) { if (settings[key] === undefined) { settings[key] = initalSettings[key]; } }
for (key of initalTaskListKeys) { if (taskList[key] === undefined) { taskList[key] = initalTaskList[key]; } }

if (isMobile()) { document.location = "mobile.html"; }
function isMobile() { return ('ontouchstart' in document.documentElement); }

if (Math.random() > .80) { document.querySelector(".meter").classList.add("red-load"); }
else if (Math.random() > .60) { document.querySelector(".meter").classList.add("orange-load"); }
else if (Math.random() > .40) { document.querySelector(".meter").classList.add("yellow-load"); }
else if (Math.random() > .20) { document.querySelector(".meter").classList.add("green-load"); }
else if (Math.random() > .10) { document.querySelector(".meter").classList.add("blue-load"); }
else { document.querySelector(".meter").classList.add("purple-load"); }

window.addEventListener('load', (event) => {
   settings.loadtimes.push(Date.now() - timerStart);
   console.log("Loaded");
   clearInterval(loadbar);
   document.querySelector(".loading-progress").style.width = "100%";
   document.querySelector(".load-display").textContent = "100%";
   setTimeout(() => { $(".cover").hide(); }, 750);
});

let everytime = settings.loadtime / 100;
let loadProgress = 0;
let loadbar = setInterval(() => {
   loadProgress += 3;
   document.querySelector(".loading-progress").style.width = loadProgress + "%";
   document.querySelector(".load-display").textContent = loadProgress + "%";
   if (loadProgress >= 197) { clearInterval(loadbar); }
}, everytime);

$(".meter > span").each(function () {
   $(this)
   .data("origWidth", $(this).width())
   .width(0)
   .animate( { width: $(this).data("origWidth") }, 1  );
});

// Import/Export Save
setInterval(() => {
   document.querySelector(".stringSave").textContent = reverseString(`${JSON.stringify(settings)}~${JSON.stringify(plotStatus)}~${JSON.stringify(produce)}~${JSON.stringify(plots)}~${JSON.stringify(marketData)}~${JSON.stringify(taskList)}`);
}, 500);

function exportSave() {
   let text = document.querySelector(".stringSave").textContent;
   let textArea = document.createElement("textarea");
   textArea.value = text;
   document.body.appendChild(textArea);
   textArea.select();
   document.execCommand("copy");
   document.body.removeChild(textArea);
}
function importSave() {
   let saveInput = prompt("where is your save?");
   if (saveInput !== null) {
      let imported = reverseString(saveInput).split('~');
      settings = JSON.parse(imported[0]);
      plotStatus = JSON.parse(imported[1]);
      produce = JSON.parse(imported[2]);
      plots = JSON.parse(imported[3]);
      marketData = JSON.parse(imported[4]);
      taskList = JSON.parse(imported[5]);
   }
   save();
   location.reload();
}

// Sent to new site
if (location.hostname === "squirrel-314.github.io") { window.location.href = `https://vegetable-dash.herokuapp.com#${reverseString(`${JSON.stringify(settings, replacer)}~${JSON.stringify(plotStatus, replacer)}~${JSON.stringify(produce, replacer)}~${JSON.stringify(plots, replacer)}~${JSON.stringify(marketData, replacer)}~${JSON.stringify(taskList, replacer)}`)}`; }

let siteLocation = window.location.href;
if (siteLocation.includes("#")) {
   let importQuestion = prompt("You were redirected from the old site. Would you like to bring your save over with you, or start from scratch? (y/n)");
   if (importQuestion == "y") {
      let saveFromOldOne = siteLocation.replace("https://vegetable-dash.herokuapp.com/#","");
      let saveFromOld = decodeURIComponent(saveFromOldOne);
      console.log(saveFromOld);
      if (saveFromOld !== null) {
         let imported = reverseString(saveFromOld).split('~');
         settings = JSON.parse(imported[0]);
         plotStatus = JSON.parse(imported[1]);
         produce = JSON.parse(imported[2]);
         plots = JSON.parse(imported[3]);
         marketData = JSON.parse(imported[4]);
         taskList = JSON.parse(imported[5]);
      }
      save();
      window.location.href = `https://vegetable-dash.herokuapp.com/`;
   }
   else { window.location.href = `https://vegetable-dash.herokuapp.com/`; }
}
