/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Tasks              | Small chores given by main charecters
Incidents          | Luck run when harvesting or using the Market
Unlock Plots       | Functions that unlock plots
Tour               | Welcome new players, should redo for market
Market             | Sell items for seeds
Main Loop & Setup  | Main loop and setup
Helpful Functions  | Some helpful functions
Commands           | Commands to open panels, right click menu
Settings           | Update Sidebar
Save               | Save the game data, restart

// To do
v0.1.0 (May 25 2021)
~ rhubarb
~ rhubarb market

~ more tasks

~ weather
~ weather in tour

~ pictures for help
~ Update copyright

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data | 57 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
   pumpkins: "empty",
   cabbage: "empty",
   dandelion: "empty",
   // Grow Times
   peasGrowing: Infinity,
   peasReady: Infinity,
   cornGrowing: Infinity,
   cornReady: Infinity,
   strawberriesGrowing: Infinity,
   strawberriesFlowering: Infinity,
   strawberriesReady: Infinity,
   eggplantsGrowing: Infinity,
   eggplantsReady: Infinity,
   pumpkinsGrowing: Infinity,
   pumpkinsReady: Infinity,
   cabbageGrowing: Infinity,
   cabbageReady: Infinity,
   dandelionGrowing: Infinity,
   dandelionFlowering: Infinity,
   dandelionReady: Infinity,
}
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
   cabbage: 0,
   dandelion: 0,
}
let initalPlots = {
   price2: 150,
   price3: 750,
   price4: 3750,
   price5: "your soul (or $$$ - we don't accept credit)",
   price6: 50000,
   price7: 250000,
   price8: 1000000,
   price9: NaN,
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
   pumpkinplot: "locked",
   cabbageplot: "locked",
   dandelionplot: "locked",
}
let initalMarketData = {
   seeds: 0,
   marketResets: 0,
   fertilizers: 0,
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
   sellerName: ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)],
   sellItem: ["Market Resets"][Math.floor(Math.random() * 1)],
   sellItemQuantity: Math.floor(Math.random() * (5 - 1)) + 1,
   seedCost: Math.floor(Math.random() * (10000 - 2000)) + 2000,
}
let initalSettings = {
   theme: "light",
   intro: "unfinished",
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables | 61 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function infoModal(veg) {
   let modalID = "#info" + veg;
   if (document.querySelector(modalID).style.opacity === "1") { hideObj(modalID); }
   else { showObj(modalID); }
}
function harvest(veg) {
   plotStatus[veg.toLowerCase() + "Ready"] = Infinity;
   let plntID = "grow" + veg;
   let hrvstID = "harvest" + veg;
   plotStatus[veg.toLowerCase()] = "empty";
   produce[veg.toLowerCase()]++;
   document.querySelector(`#${hrvstID}`).disabled = true;
   document.querySelector(`#${plntID}`).disabled = false;
   marketData.seeds++;
   harvestLuck(veg);
   if (weather.rainy === true) { produce[veg.toLowerCase()]++; }
}
function plant(veg, timeOne, timeTwo) {
   currentTime = Date.now();
   plotStatus[veg + "Growing"] = currentTime + timeOne;
   if (weather.cloudy) { plotStatus[veg + "Ready"] = currentTime + timeTwo + 5000; }
   else { plotStatus[veg + "Ready"] = currentTime + timeTwo; }
   plotStatus[veg] = "working";
   timeLeft(timeTwo, veg.toLowerCase());
   document.querySelector("#grow" + capitalize(veg)).disabled = true;
}
function fertilize(veg) {
   if (marketData.fertilizers >= 1) {
      marketData.fertilizers -= 1;
      plotStatus[veg + "Ready"] = 0;
      if (veg === "strawberries") { plotStatus[veg + "Ready"] = 0; }
      produce[veg]++;
      checkTasks("fertilize", "tryFertilizer");
   }
}
function plantLoop(veg, pltNumber, url, readyTime) {
   let vegPlot = document.querySelector("#plot" + pltNumber);
   let imgUrl = "url(Images/" + url + ")";
   setInterval(vegStatus, 1000);
   function vegStatus() {
      timeLeft(readyTime, veg);
      if (plotStatus[veg] === "working") { document.querySelector("#harvest" + capitalize(veg)).disabled = true; document.querySelector("#grow" + capitalize(veg)).disabled = true; }
      if (plotStatus[veg] === "empty") { document.querySelector("#harvest" + capitalize(veg)).disabled = true; document.querySelector("#grow" + capitalize(veg)).disabled = false; }
      if (Date.now() >= plotStatus[veg + "Ready"]) {
         vegPlot.style.backgroundImage = String(imgUrl);
         document.querySelector("#harvest" + capitalize(veg)).disabled = false;
         plotStatus[veg + "Growing"] = Infinity;
      }
      else if (Date.now() >= plotStatus[veg + "Growing"]) { vegPlot.style.backgroundImage = "url(Images/Plots/growing.png)"; }
      else { vegPlot.style.backgroundImage = "url(Images/Plots/plot.png)"; }
   }
}

plantLoop("peas", 1, 'Plots/grown-pea.png', 5000);
plantLoop("corn", 2, 'Plots/grown-corn.png', 12000);
plantLoop("eggplants", 4, 'Plots/grown-eggplant.png', 480000);
plantLoop("pumpkins", 6, 'Plots/grown-pumpkin.png', 600000);
plantLoop("cabbage", 7, 'Plots/grown-cabbage.png', 3600000);

function detailedPlant(veg, timeOne, timeTwo, timeThree) {
   currentTime = Date.now();
   plotStatus[veg + "Growing"] = currentTime + timeOne;
   plotStatus[veg + "Flowering"] = currentTime + timeTwo;
   if (weather.cloudy) { plotStatus[veg + "Ready"] = currentTime + timeThree + 5000; }
   else { plotStatus[veg + "Ready"] = currentTime + timeThree; }
   plotStatus[veg] = "working";
   timeLeft(timeThree, veg.toLowerCase());
   document.querySelector("#grow" + capitalize(veg)).disabled = true;
}
function detailedPlantLoop(veg, pltNumber, urlOne, urlTwo, urlThree, readyTime) {
   let vegetable = veg;
   let plotImg = document.querySelector("#plot" + pltNumber);
   setInterval(detailedPlantStatus, 1000);
   function detailedPlantStatus() {
      timeLeft(readyTime, veg);
      if (plotStatus[veg]  === "working") {
         document.querySelector("#harvest" + capitalize(veg)).disabled = true;
         document.querySelector("#grow" + capitalize(veg)).disabled = true;
      }
      if (Date.now() >= plotStatus[veg + "Ready"]) {
         plotImg.style.backgroundImage = `url(Images/${urlThree})`;
         document.querySelector("#harvest" + capitalize(veg)).disabled = false;
         plotStatus[veg + "Flowering"] = Infinity;
      }
      else if (Date.now() >= plotStatus[veg + "Flowering"]) { plotImg.style.backgroundImage = `url(Images/${urlTwo})`; plotStatus[veg + "Growing"] = Infinity; }
      else if (Date.now() >= plotStatus[veg + "Growing"]) { plotImg.style.backgroundImage = `url(Images/${urlOne})`; }
      else { plotImg.style.backgroundImage = "url(Images/Plots/plot.png)"; }
   }
}

detailedPlantLoop("strawberries", 3, "Plots/Strawberry/growing-strawberries.png", "Plots/Strawberry/flowering-strawberries.png", "Plots/Strawberry/grown-strawberries.png", 120000)
detailedPlantLoop("dandelion", 8, "Plots/Dandelion/flowering.png", "Plots/Dandelion/flowering.png", "Plots/Dandelion/fruiting.png", 10800000)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Weather | 21 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let weather = {
   sunny: false,
   rainy: false,
   partlySunny: false,
   partlyCloudy: false,
   snowy: false,
   cloudy: false,
   frost: false,
   flood: false,
   marketResetBonus: 0,

   // heatwave: ["depends", "?"],
   // locusts: ["- all plants",],
   // birds: ["-10% - 15% of seeds",], // Scarecrow investment will reduce by 5%
   // flood: ["-20% stored veg"], // Irrigation investment will retract bad effects, make +1 produce
}
let random = (Math.random()).toFixed(2);

function weatherChance(min, max) {
   let value = {};
   for (i = min; i < max; i += .01) {
      if (random === i.toFixed(2)) { value[i] = true; }
      else { value[i.toFixed(2)] = false; }
   }
   return !Object.keys(value).every((k) => !value[k]);
}
function chooseWeather() {
   random = (Math.random()).toFixed(2);
   if (weatherChance(0, .15) === true) { weather.sunny = true; } else { weather.sunny = false; }
   if (weatherChance(.15, .30) === true) { weather.rainy = true; } else { weather.rainy = false; }
   if (weatherChance(.30, .55) === true) { weather.partlySunny = true; } else { weather.partlySunny = false; }
   if (weatherChance(.55, .80) === true) { weather.partlyCloudy = true; } else { weather.partlyCloudy = false; }
   if (weatherChance(.80, .85) === true) { weather.snowy = true; } else { weather.snowy = false; }
   if (weatherChance(.85, .93) === true) { weather.cloudy = true; } else { weather.cloudy = false; }
   if (weatherChance(.93, .95) === true) { weather.frost = true; } else { weather.frost = false; }
   if (weatherChance(.95, 1.01) === true) { weather.flood = true; } else { weather.flood = false; }
   if (weather.sunny) { weather.marketResetBonus = 0.03; }
   else { weather.marketResetBonus = 0; }
   // if (weather.frost) {
   //    plots.peaplot === "unlocked" ? maybeLose("peas") : console.log();
   //    plots.cornplot === "unlocked" ? maybeLose("corn") : console.log();
   //    plots.strawberryplot === "unlocked" ? maybeLose("strawberries") : console.log();
   //    plots.eggplantplot === "unlocked" ? maybeLose("eggplants") : console.log();
   //    plots.pumpkinplot === "unlocked" ? maybeLose("pumpkins") : console.log();
   //    plots.cabbageplot === "unlocked" ? maybeLose("cabbage") : console.log();
   //    plots.dandelionplot === "unlocked" ? maybeLose("dandelion") : console.log();
   //    function maybeLose(veg) {
   //       if (plotStatus[veg + "Ready"] != Infinity) {
   //          let random = Math.random();
   //          if (random > .5) {
   //             plotStatus[veg] = "empty";
   //             plotStatus[veg + "Growing"] = Infinity;
   //             plotStatus[veg + "Ready"] = Infinity;
   //             // Stop growing
   //          }
   //       }
   //    }
   //    chooseWeather();
   // }
   // if (weather.flood) {
   //    let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   //    let amountLost = Math.floor(produce[vegLost] / 1);
   //    produce[vegLost] -= amountLost;
   //    // 20% stored
   //    chooseWeather();
   // }
   // if (weather.snowy) {
   //    let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   //    let amountLost = Math.floor(produce[unluckyVeg] / 3);
   //    produce[unluckyVeg] -= amountLost;
   //    // 33% stored
   //    chooseWeather();
   // }
   // let currentTime = Date.now();
   // plotStatus[veg + "Growing"] = currentTime + timeOne;
   setTimeout(chooseWeather, 1000);
}
chooseWeather();

let updateWeatherImg = window.setInterval(function() {
   if (weather.sunny === true) { changeWeatherDisplay("Sunny", "Effects: Positive <br> Benifits: +3% market reset harvest chance", "https://api.iconify.design/wi:day-sunny.svg") }
   if (weather.rainy === true) { changeWeatherDisplay("Rainy", "Effects: Positive <br> Benifits: +1 produce", "https://api.iconify.design/wi:showers.svg") }
   if (weather.partlyCloudy === true) { changeWeatherDisplay("Partly Cloudy", "Effects: None <br> Benifits: None", "https://api.iconify.design/wi:day-cloudy.svg") }
   if (weather.partlySunny) {changeWeatherDisplay("Partly Sunny", "Effects: None <br> Benifits: None", "https://api.iconify.design/wi:day-sunny-overcast.svg") }
   if (weather.snowy === true) {changeWeatherDisplay("Snowy", "Effects: Adverse <br> Disadvantages: -33% of a stored vegetable lost", "https://api.iconify.design/wi:snow.svg") }
   if (weather.cloudy === true) {changeWeatherDisplay("Cloudy", "Effects: Adverse <br> Disadvantages: +5s growing time", "https://api.iconify.design/wi:cloudy.svg") }
   if (weather.frost === true) {changeWeatherDisplay("Frost", "Effects: Adverse <br> Disadvantages: 50% plants wither", "https://api.iconify.design/wi:snowflake-cold.svg") }
   if (weather.flood === true) {changeWeatherDisplay("Flooding", "Effects: Adverse <br> Disadvantages: -20% of a stored veg", "https://api.iconify.design/wi:flood.svg") }
   function changeWeatherDisplay(weather, text, url) {
      document.querySelector(".weather-name"). textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("${url}") no-repeat center center / contain`;
   }
}, 200)
function maybeLose(veg) {
   if (plotStatus[veg + "Ready"] != Infinity) {
      let random = Math.random();
      if (random > .5) {
         plotStatus[veg] = "empty";
         plotStatus[veg + "Growing"] = Infinity;
         plotStatus[veg + "Ready"] = Infinity;
         // Stop growing
      }
   }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks | 100 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

hideObj(`.task-info-button-${1}`);
hideObj(`.task-info-button-${2}`);
hideObj(`.task-info-button-${3}`);
hideObj(`.task-info-button-${4}`);

// Task Insensitive
function setTask(num, task) {
   taskList[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   taskList["taskBox" + num] = "occupied " + task;
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
function emptyTaskCheck(task) {
   if (taskList.taskBox1 === "unoccupied") { taskList[task] = 1; }
   else if (taskList.taskBox2 === "unoccupied") { taskList[task] = 2; }
   else if (taskList.taskBox3 === "unoccupied") { taskList[task] = 3; }
   else if (taskList.taskBox4 === "unoccupied") { taskList[task] = 4; }
   else { taskList[task] = "Full"; }
   return taskList[task];
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

// Task Sensitive
function giveTasks() {
   if (ifTrue("jebsPeaSalad")) { taskList.jebsPeaSalad = "active" }
   if (ifTrueComplete("useMarketResets", "jebsPeaSalad") && marketData.marketResets >= 1) { taskList.useMarketResets = "active" }
   if (ifTrueComplete("tryFertilizer", "jebsPeaSalad")) { taskList.tryFertilizer = "active" }
   if (ifTrue("jebsGrilledCorn") && plots.cornplot === "unlocked") { taskList.jebsGrilledCorn = "active" }
   if (ifTrue("josephinesDandelionSalad") && plots.dandelionplot === "unlocked") { taskList.josephinesDandelionSalad = "active" }
   if (ifTrue("unlockThe_cornPlot") && plots.cornplot === "locked") { taskList.unlockThe_cornPlot = "active" }
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
   if (ifCheck("jebsPeaSalad")) { setTask(emptyTaskCheck("jebsPeaSaladNum"), "jebsPeaSalad"); }
   if (ifCheck("useMarketResets")) { setTask(emptyTaskCheck("useMarketResetsNum"), "useMarketResets"); }
   if (ifCheck("tryFertilizer")) { setTask(emptyTaskCheck("tryFertilizerNum"), "tryFertilizer"); }
   if (ifCheck("jebsGrilledCorn")) { setTask(emptyTaskCheck("jebsGrilledCorn"), "jebsGrilledCorn"); }
   if (ifCheck("josephinesDandelionSalad")) { setTask(emptyTaskCheck("josephinesDandelionSalad"), "josephinesDandelionSalad"); }
   if (ifCheck("unlockThe_cornPlot")) { setTask(emptyTaskCheck("unlockThe_cornPlot"), "unlockThe_cornPlot"); }
   // Bake Sale
   if (ifCheck("bakeSale_cornBread")) { setTask(emptyTaskCheck("bakeSale_cornBreadNum"), "bakeSale_cornBread"); }
   if (ifCheck("bakeSale_peaSnacks")) { setTask(emptyTaskCheck("bakeSale_peaSnacksNum"), "bakeSale_peaSnacks"); }
   if (ifCheck("bakeSale_strawberryJam")) { setTask(emptyTaskCheck("bakeSale_strawberryJamNum"), "bakeSale_strawberryJam"); }
   if (ifCheck("bakeSale_pumpkinPie")) { setTask(emptyTaskCheck("bakeSale_pumpkinPieNum"), "bakeSale_pumpkinPie"); }
   function ifCheck(task) {
      if (!taskAlreadyUp(`occupied ${task}`) && (taskList[task] === "active" || taskList[task] === "waiting")) { return true; }
      else { return false; }
   }
   // Old open tasks
   if (oldTaskCheck("jebsPeaSalad") != false) {
      if (taskList.jebsPeaSalad === "ready") { startTask(`${oldTaskCheck("jebsPeaSalad")}`, "Collect 2 Fertilizer", "collectTaskReward('jebsPeaSalad', taskList.jebsPeaSaladNum)", "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
      else { startTask(`${oldTaskCheck("jebsPeaSalad")}`, "Submit 25 Peas", "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('producePaid', 'jebsPeaSalad'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
   }
   if (oldTaskCheck("useMarketResets") != false) {
      if (taskList.useMarketResets === "ready") { startTask(`${oldTaskCheck("useMarketResets")}`, "Collect 250 Seeds", "collectTaskReward('useMarketResets', taskList.useMarketResetsNum)", "Thank you for completing that small task for me! Here, take 250 seeds!", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
      else { startTask(`${oldTaskCheck("useMarketResets")}`, "Use 1 Market Reset", " ", "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
   }
   if (oldTaskCheck("tryFertilizer") != false) {
      if (taskList.tryFertilizer === "ready") { startTask(`${oldTaskCheck("tryFertilizer")}`, "Collect 2 Market Resets", "collectTaskReward('tryFertilizer', taskList.tryFertilizerNum)", "Wow, just look at those plants grow! Here, take these, I've had them lying about for years.", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
      else { startTask(`${oldTaskCheck("tryFertilizer")}`, "Use 1 Fertilizer", " ", "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
   }
   if (oldTaskCheck("jebsGrilledCorn") != false) {
      if (taskList.jebsGrilledCorn === "ready") { startTask(`${oldTaskCheck("jebsGrilledCorn")}`, "Collect 8 Market Resets", "collectTaskReward('jebsGrilledCorn', taskList.jebsGrilledCornNum)", "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsGrilledCorn"); }
      else { startTask(`${oldTaskCheck("jebsGrilledCorn")}`, "Submit 50 Corn", "if (produce.corn >= 50) { produce.corn -= 50; checkTasks('jebsGrilledCornPaid', 'jebsGrilledCorn'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I'm inviting some family over, and I want to serve corn on the cob. I'm going to need to get come corn. Could you get them for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsGrilledCorn"); }
   }
   if (oldTaskCheck("josephinesDandelionSalad") != false) {
      if (taskList.josephinesDandelionSalad === "ready") { startTask(`${oldTaskCheck("josephinesDandelionSalad")}`, "Collect 15,000 Seeds", "collectTaskReward('josephinesDandelionSalad', taskList.josephinesDandelionSaladNum)", "Take that, Happy Place Farm! Our profits have increased by 20%, and their quarterly earnings fell by 35%! Hurrah for dandelion salad!", "Grandma Josephine", "Images/Tasks/granny.png", "josephinesDandelionSalad"); }
      else { startTask(`${oldTaskCheck("josephinesDandelionSalad")}`, "Submit 6 Dandelions", "if (produce.dandelion >= 6) { produce.dandelion -= 6; checkTasks('josephinesDandelionSaladPaid', 'josephinesDandelionSalad'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Meet dandelion salad!", "Grandma Josephine", "Images/Tasks/granny.png", "josephinesDandelionSalad"); }
   }
   if (oldTaskCheck("unlockThe_cornPlot") != false) {
      if (taskList.unlockThe_cornPlot === "ready") { startTask(`${oldTaskCheck("unlockThe_cornPlot")}`, "Collect 1 Fertilizer", "collectTaskReward('unlockThe_cornPlot', taskList.unlockThe_cornPlotNum)", "Ooooh, look! It's corn! Whoopie!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "unlockThe_cornPlot"); }
      else { startTask(`${oldTaskCheck("unlockThe_cornPlot")}`, "Unlock the second plot", " ", "You need to diversify your farm. Unlock the second plot for a new plant!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "unlockThe_cornPlot"); }
   }
   // Bake Sale
   if (oldTaskCheck("bakeSale_cornBread") != false) {
      if (taskList.bakeSale_cornBread === "ready") { startTask(oldTaskCheck("bakeSale_cornBread"), "Collect 5 Seeds", "collectTaskReward('bakeSale_cornBread', taskList.bakeSale_cornBreadNum)", "Just you wait! This bake sale is just beginning!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.cornBread"); }
      else { startTask(oldTaskCheck("bakeSale_cornBread"), "Submit 20 Corn", "if (produce.corn >= 20) { produce.corn -= 20; checkTasks('cornBreadPaid', 'bakeSale_cornBread'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "I have a wonderful lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal faviorite!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_cornBread"); }
   }
   if (oldTaskCheck("bakeSale_peaSnacks") != false) {
      if (taskList.bakeSale_peaSnacks === "ready") { startTask(oldTaskCheck("bakeSale_peaSnacks"), "Collect 10 Seeds", "collectTaskReward('bakeSale_peaSnacks', taskList.bakeSale_peaSnacksNum)", "We may not have sold much yet, but we've barely started!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.peaSnacks"); }
      else { startTask(oldTaskCheck("bakeSale_peaSnacks"), "Submit 60 Peas", "if (produce.peas >= 60) { produce.peas -= 60; checkTasks('peaSnacksPaid', 'bakeSale_peaSnacks'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Next, let's make some crunchy pea snacks!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_peaSnacks"); }
   }
   if (oldTaskCheck("bakeSale_strawberryJam") != false) {
      if (taskList.bakeSale_strawberryJam === "ready") { startTask(oldTaskCheck("bakeSale_strawberryJam"), "Collect 15 Seeds", "collectTaskReward('bakeSale_strawberryJam', taskList.bakeSale_strawberryJamNum)", "Be patient, for great rewards come to those who wait!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.strawberryJam"); }
      else { startTask(oldTaskCheck("bakeSale_strawberryJam"), "Submit 15 Strawberries", "if (produce.strawberries >= 15) { produce.strawberries -= 15; checkTasks('strawberryJamPaid', 'bakeSale_strawberryJam'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_strawberryJam"); }
   }
   if (oldTaskCheck("bakeSale_pumpkinPie") != false) {
      if (taskList.bakeSale_pumpkinPie === "ready") { startTask(oldTaskCheck("bakeSale_pumpkinPie"), "Collect 75,000 Seeds", "collectTaskReward('bakeSale_pumpkinPie', taskList.bakeSale_pumpkinPieNum)", "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale.pumpkinPie"); }
      else { startTask(oldTaskCheck("bakeSale_pumpkinPie"), "Submit 10 Pumpkins", "if (produce.pumpkins >= 10) { produce.pumpkins -= 10; checkTasks('pumpkinPiePaid', 'bakeSale_pumpkinPie'); } else { fadeTextAppear(event, 'Not enough produce', false); }", "Not all pumpkin pies are great, but my recipe is! Let's make a few!", "Grandma Josephine", "Images/Tasks/granny.png", "bakeSale_pumpkinPie"); }
   }
}
function checkTasks(origin, task) {
   if (taskList[task] === "active" && origin === "producePaid") { taskList.jebsPeaSalad = "ready"; }
   if (taskList[task] === "active" && origin === "resetMarketValues") { taskList.useMarketResets = "ready"; }
   if (taskList[task] === "active" && origin === "fertilize") { taskList.tryFertilizer = "ready"; }
   if (taskList[task] === "active" && origin === "jebsGrilledCornPaid") { taskList.jebsGrilledCorn = "ready"; }
   if (taskList[task] === "active" && origin === "josephinesDandelionSaladPaid") { taskList.josephinesDandelionSalad = "ready"; }
   if (taskList[task] === "active" && origin === "cornPlotUnlocked") { taskList.unlockThe_cornPlot = "ready"; }
   // Bake Sale
   if (taskList[task] === "active" && origin === "cornBreadPaid") { taskList.bakeSale_cornBread = "ready"; }
   if (taskList[task] === "active" && origin === "peaSnacksPaid") { taskList.bakeSale_peaSnacks = "ready"; }
   if (taskList[task] === "active" && origin === "strawberryJamPaid") { taskList.bakeSale_strawberryJam = "ready"; }
   if (taskList[task] === "active" && origin === "pumpkinPiePaid") { taskList.bakeSale_pumpkinPie = "ready"; }
}
function collectTaskReward(task, num) {
   if (task === "jebsPeaSalad") { marketData.fertilizers += 2; }
   if (task === "useMarketResets") { marketData.seeds += 250; }
   if (task === "tryFertilizer") { marketData.marketResets += 2; }
   if (task === "jebsGrilledCorn") { marketData.marketResets += 8; }
   if (task === "josephinesDandelionSalad") { marketData.seeds += 15000; }
   if (task === "unlockThe_cornPlot") { marketData.fertilizers += 1; }
   // Bake Sale
   if (task === "bakeSale_cornBread") { marketData.seeds += 5; }
   if (task === "bakeSale_peaSnacks") { marketData.seeds += 10; }
   if (task === "bakeSale_strawberryJam") { marketData.seeds += 15; }
   if (task === "bakeSale_pumpkinPie") { marketData.seeds += 75000; }
   taskList[task] = "complete";
   clearTask(num);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents | 0 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let rand = Math.random();
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
   if (rand < (0.05 + weather.marketResetBonus)) {
      fadeTextAppear(event, `You collected a market \n reset! You now have ${marketData.marketResets}`, "vegLuck");
      marketData.marketResets++;
   }
}
function marketLuck() {
   rand = Math.random();
   if (rand < 0.01) { marketData.marketResets++; }
}
function blackMarketLuck() {
   rand = Math.random();
   if (rand < 0.02) { marketData.seeds -= 6000; }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let vegetablesOwned = [];
vegetablesOwned.push("peas")
function vegetablesOwnedLoop() {
   if (produce.peas >= "3" && !vegetablesOwned.includes("peas")) { vegetablesOwned.push("peas") }
   if (produce.corn >= "3" && !vegetablesOwned.includes("corn")) { vegetablesOwned.push("corn") }
   if (produce.strawberries >= "3" && !vegetablesOwned.includes("strawberries")) { vegetablesOwned.push("strawberries") }
   if (produce.eggplants >= "3" && !vegetablesOwned.includes("eggplants")) { vegetablesOwned.push("eggplants") }
   if (produce.pumpkins >= "3" && !vegetablesOwned.includes("pumpkins")) { vegetablesOwned.push("pumpkins") }
   if (produce.cabbage >= "3" && !vegetablesOwned.includes("cabbage")) { vegetablesOwned.push("cabbage") }
   if (produce.dandelion >= "3" && !vegetablesOwned.includes("dandelion")) { vegetablesOwned.push("dandelion") }
}

let luckyRoll = window.setInterval(function() {
   rand = Math.random();
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(produce[vegLost] / 3);
   if (rand < .08) { produce[vegLost] -= amountLost; }
}, 300000)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots | 52 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function checkLocks() {
   if (plots.cornplot === "unlocked") { openLock("corn", 2) }
   if (plots.strawberryplot === "unlocked") { openLock("strawberry", 3) }
   if (plots.eggplantplot === "unlocked") { openLock("eggplant", 4) }
   if (plots.pumpkinplot === "unlocked") { openLock("pumpkin", 6) }
   if (plots.cabbageplot === "unlocked") { openLock("cabbage", 7) }
   if (plots.dandelionplot === "unlocked") { openLock("dandelion", 8) }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (marketData.seeds >= plots["price" + plotNum]) {
      marketData.seeds -= plots["price" + plotNum];
      marketData.marketResets++;
      if (number == "2") { setTimeout(() => { openLock("corn", 2); }, 2500); document.getElementById("lock2").classList.add("removing-lock"); }
      if (number == "3") { setTimeout(() => { openLock("strawberry", 3); }, 2500); document.getElementById("lock3").classList.add("removing-lock"); }
      if (number == "4") { setTimeout(() => { openLock("eggplant", 4); }, 2500); document.getElementById("lock4").classList.add("removing-lock"); }
      if (number == "6") { setTimeout(() => { openLock("pumpkin", 6); }, 2500); document.getElementById("lock6").classList.add("removing-lock"); }
      if (number == "7") { setTimeout(() => { openLock("cabbage", 7); }, 2500); document.getElementById("lock7").classList.add("removing-lock"); }
      if (number == "8") { setTimeout(() => { openLock("dandelion", 8); }, 2500); document.getElementById("lock8").classList.add("removing-lock"); }
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function openLock(vegetable, num) {
   document.getElementById(`lockedDiv${num}`).remove();
   document.getElementById(`openPlot${num}`).style.display = "block";
   plots[vegetable + "plot"] = "unlocked";
   if (vegetable === "corn") { document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price3, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`; }
   if (vegetable === "strawberry") { document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price4, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`; }
   if (vegetable === "eggplant") { document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price6, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`; }
   if (vegetable === "pumpkin") { document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price7, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(7)">Purchase Plot</button>`; }
   if (vegetable === "cabbage") { document.getElementById("lock8Text").innerHTML = `This plot is locked <br> Pay ${toWord(plots.price8, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(8)">Purchase Plot</button>`; }
   if (vegetable === "dandelion") { document.getElementById("lock9Text").innerHTML = `This plot is locked <br> Pay your soul to unlock <br> <button class="purchase-plot">Requires SoulPay+</button>`; }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour | 98 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let introData = { hello: false, meetGramps: false, planting: false, produceBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
function runIntro() {
   plotStatus = initalPlotStatus;
   produce = initalProduce;
   plots = initalPlots;
   marketData = initalMarketData;
   settings = initalSettings;
   // Save
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
   localStorage.setItem("marketData", JSON.stringify(marketData));
   localStorage.setItem("settingData", JSON.stringify(settings));

   settings.intro = "finished";
   showObj(".welcome");
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
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press the plant button, and when it's done, the harvest button Peas!";
         introData.planting = true;
      }
      else { sidebar(); }
   }
   function sidebar() {
      if (introData.produceBar === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "This bar is where you control the farm.";
         document.querySelector(".command-panel").style.zIndex = "1";
         introData.produceBar = true;
      }
      else { meetGran(); }
   }
   function meetGran() {
      if (introData.meetGran === false) {
         $(".intro-img").attr("src", "Images/Tasks/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
         introData.meetGran = true;
      }
      else { market(); }
   }
   function market() {
      if (introData.market === false) {
         introText.textContent = "This is the market, were you can gain seeds by selling produce, which are useful for many things, like opening more plots.";
         introData.market = true;
      }
      else { tasks(); }
   }
   function tasks() {
      if (introData.tasks === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "This little ribbon opens to show Tasks, where you can get rewards for doing chores around the farm.";
         document.querySelector(".command-panel").style.zIndex = "0";
         document.querySelector(".quests").style.zIndex = "9999";
         introData.tasks = true;
      }
      else { weather(); }
   }
   function weather() {
      if (introData.tasks === false) {
         $(".intro-img").attr("src", "Images/Tasks/jenkins.png");
         introText.textContent = "Keep an eye on the weather, because it will affect you plants!";
         document.querySelector(".command-panel").style.zIndex = "0";
         document.querySelector(".weather").style.zIndex = "9999";
         introData.weather = true;
      }
      else { help(); }
   }
   function help() {
      if (introData.help === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.png");
         introText.textContent = "That's it! If you need more help, just check the small help icon in the top left corner.";
         document.querySelector(".quests").style.zIndex = "0";
         document.querySelector(".help-center-img").style.zIndex = "9999";
         introData.help = true;
      }
      else { location.reload(); }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 77) {
   if (document.querySelector(".marketShadow").style.opacity === "0") { showObj(".marketShadow"); }
   else { hideObj(".marketShadow"); }
}})
function checkMarket() {
   let marketItem = document.getElementsByClassName("market-item");
   marketItem[0].style.display = "block";
   marketItem[8].style.display = "block";
   marketItem[9].style.display = "block";
   if (plots.peaplot != "locked") { marketItem[1].style.display = "block"; }
   if (plots.cornplot != "locked") { marketItem[2].style.display = "block"; }
   if (plots.strawberryplot != "locked") { marketItem[3].style.display = "block"; }
   if (plots.eggplantplot != "locked") { marketItem[4].style.display = "block"; }
   if (plots.pumpkinplot != "locked") { marketItem[5].style.display = "block"; }
   if (plots.cabbageplot != "locked") { marketItem[6].style.display = "block"; }
   if (plots.dandelionplot != "locked") { marketItem[7].style.display = "block"; }
}
function buyProduce(produceRequested, produceCase) {
   if (marketData.seeds >= marketData["buy" + produceCase]) {
      produce[produceRequested] += 5;
      marketData.seeds -= marketData["buy" + produceCase];
      marketData["buy" + produceCase] *= 1.08;
      marketData["sell" + produceCase] *= 1.02;
      updateMarket();
      checkMarket();
      marketLuck();
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function sellProduce(produceRequested, produceCase) {
   if (produce[produceRequested] >= 5) {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
      updateMarket();
      checkMarket();
      marketLuck();
   }
   else { fadeTextAppear(event, `Not enough produce`, false); }
}

function updateMarket() {
   display("Peas");
   display("Corn");
   display("Strawberries");
   display("Eggplants");
   display("Pumpkins");
   display("Cabbage");
   display("Dandelion");
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
      marketData.marketResets--
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
      checkTasks("resetMarketValues", "useMarketResets");
   }
}

/* newBlackOffer();
function blackMarketValues() {
   marketData.sellerName = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel"][Math.floor(Math.random() * 6)];
   marketData.sellItem = ["Market Resets"][Math.floor(Math.random() * 1)];
   // sellItem = ["Watering Cans", "Compost", "Fertilizer"] compost = extra, watering can = instant
   marketData.sellItemQuantity = Math.floor(Math.random() * (5 - 1)) + 1;
   marketData.seedCost = Math.floor(Math.random() * (10000 - 2000)) + 2000;
}
function newBlackOffer() { document.querySelector(".blackMarketOffer").textContent = `Offer by ${marketData.sellerName} \n Selling ${marketData.sellItemQuantity} ${marketData.sellItem} \n for ${marketData.seedCost} Seeds`; }
function accept() {
   if (marketData.seeds >= marketData.seedCost) {
      marketData.seeds -= marketData.seedCost;
      blackMarketLuck();
      blackMarketValues();
      newBlackOffer();
      if (marketData.sellItem === "Market Resets") { marketData.marketResets += marketData.sellItemQuantity; }
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function deny() {
   blackMarketLuck();
   blackMarketValues();
   newBlackOffer();
   document.querySelector(".blackMarketOffer").style.backgroundColor = genColor();
} */

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop & Setup | 27 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let mainLoop = window.setInterval(function() {
   updateMarket();
   vegetablesOwnedLoop();
   giveTasks();
   showTasks();
   checkMarket();
   // Update produce display
   document.querySelector("#seeds").style.display = "inline-block";
   document.querySelector("#fertilizer").style.display = "inline-block";
   document.querySelector("#seeds").textContent = `${toWord(marketData.seeds, "short")} Seeds`;
   document.querySelector("#fertilizer").textContent = `${Math.round(marketData.fertilizers)} Fertilizers`;
   if (plots.peaplot === "unlocked") { revealProduce("#peaBushels", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduce("#cornBushels", "corn"); }
   if (plots.strawberryplot === "unlocked") { revealProduce("#strawberryBushels", "strawberries"); }
   if (plots.eggplantplot === "unlocked") { revealProduce("#eggplantBushels", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduce("#pumpkinBushels", "pumpkins"); }
   if (plots.cabbageplot === "unlocked") { revealProduce("#cabbageBushels", "cabbage"); }
   if (plots.dandelionplot === "unlocked") { revealProduce("#dandelionBushels", "dandelion"); }
   function revealProduce(id, veg) {
      document.querySelector(id).style.display = "inline-block";
      document.querySelector(id).textContent = `${toWord(produce[veg], "short")} Bushels of ${capitalize(veg)}`;
   }
   if (plots.cornplot === "unlocked") { checkTasks("cornPlotUnlocked", "unlockThe_cornPlot"); }
}, 200)
function setup() {
   if (!taskList) { taskList = initalTaskList; }
   whatTheme();
   checkLocks();
   checkMarket();
}
window.addEventListener('load', (event) => { setup(); });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions | 22 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function commas(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands | 73 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Command Panel
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 69) { openCommands(); } });
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 81) { questbar(); } });
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 87) {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
} });

questbarIsOpen = false;
function questbar() {
   if (questbarIsOpen === true) {
      document.querySelector(".quests").style.left = "0";
      document.querySelector(".questShadow").style.display = "block";
      questbarIsOpen = false;
   }
   else {
      document.querySelector(".quests").style.left = "-80vh";
      document.querySelector(".questShadow").style.display = "none";
      questbarIsOpen = true;
   }
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings | 23 LINES=
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (settings.theme === "dark") { darkTheme(); }
   if (settings.theme === "light") { light(); }
   if (settings.theme === "random") { randTheme(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.querySelector('.command-panel').style.backgroundColor = '#111';
   settings.theme = "dark";
}
function randTheme() {
   document.querySelector('.command-panel').style.backgroundColor = genColor();
   settings.theme = "random";
}
function light() {
   document.querySelector('.command-panel').style.backgroundColor = '#f5f5f5';
   settings.theme = "light";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let saveLoop = window.setInterval(function() {
   localStorage.setItem("plotStatusMobile", JSON.stringify(plotStatus, replacer));
   localStorage.setItem("produceMobile", JSON.stringify(produce, replacer));
   localStorage.setItem("plotsMobile", JSON.stringify(plots, replacer));
   localStorage.setItem("marketDataMobile", JSON.stringify(marketData, replacer));
   localStorage.setItem("settingDataMobile", JSON.stringify(settings, replacer));
   localStorage.setItem("taskListMobile", JSON.stringify(taskList, replacer));
}, 1000)

plotStatus = JSON.parse(localStorage.getItem("plotStatusMobile"));
produce = JSON.parse(localStorage.getItem("produceMobile"));
plots = JSON.parse(localStorage.getItem("plotsMobile"));
marketData = JSON.parse(localStorage.getItem("marketDataMobile"));
settings = JSON.parse(localStorage.getItem("settingDataMobile"));
taskList = JSON.parse(localStorage.getItem("taskListMobile"));

if (!settings || (settings.intro != "finished")) { runIntro(); }

function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure === true) {
      let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure === true) {
         // Save
         localStorage.setItem("plotStatusMobile", JSON.stringify(initalPlotStatus, replacer));
         localStorage.setItem("produceMobile", JSON.stringify(initalProduce, replacer));
         localStorage.setItem("plotsMobile", JSON.stringify(initalPlots, replacer));
         localStorage.setItem("marketDataMobile", JSON.stringify(initalMarketData, replacer));
         localStorage.setItem("settingDataMobile", JSON.stringify(initalSettings, replacer));
         localStorage.setItem("taskListMobile", JSON.stringify(initalTaskList, replacer));
         plotStatus = JSON.parse(localStorage.getItem("plotStatusMobile"));
         produce = JSON.parse(localStorage.getItem("produceMobile"));
         plots = JSON.parse(localStorage.getItem("plotsMobile"));
         marketData = JSON.parse(localStorage.getItem("marketDataMobile"));
         settings = JSON.parse(localStorage.getItem("settingDataMobile"));
         taskList = JSON.parse(localStorage.getItem("taskListMobile"));
         // Reload
         location.reload();
      }
   }
}

// For keeping Infinity the same after saving
const replacer = (key, value) => {
   if (value instanceof Function) { return value.toString(); }
   else if (value === NaN) { return 'NaN'; }
   else if (value === Infinity) { return 'Infinity'; }
   else if (typeof value === 'undefined') { return 'undefined'; }
   else { return value; }
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

if (!isMobile()) { document.location = "index.html"; }
function isMobile() { return ('ontouchstart' in document.documentElement); }
