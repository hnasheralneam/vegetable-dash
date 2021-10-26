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

console.log(`hi ${userData.name}`);

window.addEventListener("beforeunload", function(e){
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus, replacer));
   localStorage.setItem("produce", JSON.stringify(produce, replacer));
   localStorage.setItem("plots", JSON.stringify(plots, replacer));
   localStorage.setItem("marketData", JSON.stringify(marketData, replacer));
   localStorage.setItem("settingData", JSON.stringify(settings, replacer));
   localStorage.setItem("taskList", JSON.stringify(taskList, replacer));
}, false);

var plotStatus = initPlotStatus;
var produce = initProduce;
plots = initPlots;
marketData = initMarketData;
var settings = initSettings;
taskList = initTaskList;

settings.loadtime = findAvg(settings.loadtimes);

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
function tend(veg) {
   if (plotStatus[veg + "Ready"] === 0) {
      plotStatus[veg + "Ready"] = Infinity;
      plotStatus[veg] = "empty";
      produce[veg]++;
      document.querySelector(`.${capitalize(veg)}`).textContent = `Grow ${capitalize(veg)}!`;
      marketData.seeds++;
      harvestLuck(capitalize(veg));
      showObj(`.${capitalize(veg)}`);
      if (marketData.weather.weather === "rainy") { produce[veg]++; }
   }
   else {
      currentTime = Date.now();
      plotStatus[veg + "Growing"] = currentTime + plotStatus[veg + "Time"][0];
      plotStatus[veg + "Flowering"] = currentTime + plotStatus[veg + "Time"][1];
      if (marketData.weather.weather === "cloudy") { plotStatus[veg + "Ready"] = currentTime + plotStatus[veg + "Time"][2] + (plotStatus[veg + "Time"][2] / 4); }
      else { plotStatus[veg + "Ready"] = currentTime + plotStatus[veg + "Time"][2]; }
      plotStatus[veg] = "working";
      timeLeft(plotStatus[veg + "Time"][2], veg.toLowerCase());
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
function plantLoop(veg, pltNumber, urlOne, urlTwo, urlThree) {
   let plotImg = document.querySelector(`#plot${pltNumber}`).style;
   let detailedPlantStatus = setInterval(() => {
      timeLeft(plotStatus[veg + "Time"][2], veg);
      if (plotStatus[veg] === "working") { hideObj(`.${capitalize(veg)}`); }
      if (plotStatus[veg] === "withered") { plotImg.backgroundImage = `url(Images/Plots/withered.png)` }
      else if (Date.now() >= plotStatus[veg + "Ready"]) {
         plotImg.backgroundImage = `url(Images/Plots/${urlThree})`;
         document.querySelector(`.${capitalize(veg)}`).textContent = `Harvest ${capitalize(veg)}!`;
         showObj(`.${capitalize(veg)}`);
         plotStatus[veg + "Growing"] = plotStatus[veg + "Flowering"] = Infinity;
         plotStatus[veg + "Ready"] = 0;
         plotStatus[veg] = "ready";
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
      if (marketData.weather.weather === "rainy") { produce[plotStatus.centerHarvest]++; }
      plotStatus.centerStatus = "plant-ready";
   }
   else if (plotStatus.centerStatus === "plant-ready") {
      plotStatus.centerHarvest = veg;
      currentTime = Date.now();
      plotStatus.centerGrowing = currentTime + timeOne;
      plotStatus.centerFlowering = currentTime + timeTwo;
      if (marketData.weather.weather === "cloudy") { plotStatus.centerReady = currentTime + (timeThree / 4); }
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

plantLoop("peas", 1, "Peas/growing.png", "Peas/flowering.png", "Peas/fruiting.png");
plantLoop("corn", 2, "growing.png", "Corn/growing.png", "Corn/fruiting.png");
plantLoop("strawberries", 3, "Strawberry/growing.png", "Strawberry/flowering.png", "Strawberry/fruiting.png");
plantLoop("eggplants", 4, "Eggplant/growing.png", "Eggplant/flowering.png", "Eggplant/fruiting.png");
plantLoop("pumpkins", 6, "growing.png", "Pumpkin/growing.png", "Pumpkin/fruiting.png");
plantLoop("cabbage", 7, "growing.png", "Cabbage/growing.png", "Cabbage/fruiting.png");
plantLoop("dandelion", 8, "Dandelion/flowering.png", "Dandelion/flowering.png", "Dandelion/fruiting.png");
plantLoop("rhubarb", 9, "growing.png", "Rhubarb/growing.png", "Rhubarb/fruiting.png");

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
   if (weatherChance(0, .15) === true) { marketData.weather.nextWeather = "sunny"; }
   if (weatherChance(.15, .30) === true) { marketData.weather.nextWeather = "rainy"; }
   if (weatherChance(.30, .55) === true) { marketData.weather.nextWeather = "partlySunny"; }
   if (weatherChance(.55, .80) === true) { marketData.weather.nextWeather = "partlyCloudy"; }
   if (weatherChance(.80, .85) === true) { marketData.weather.nextWeather = "snowy"; }
   if (weatherChance(.85, .93) === true) { marketData.weather.nextWeather = "cloudy"; }
   if (weatherChance(.93, .95) === true) { marketData.weather.nextWeather = "frost"; }
   if (weatherChance(.95, 1.01) === true) { marketData.weather.nextWeather = "flood"; }
   if (marketData.weather.weather === "snowy" || "frost" || "flood") { marketData.weather.hasBeenPunished = false; }
}
let updateWeather = window.setInterval(function() {
   // Implement Weather Effects
   if (marketData.weather.weather === "sunny") { marketData.weather.marketResetBonus = 0.03; }
   else { marketData.weather.marketResetBonus = 0; }
   if (marketData.weather.weather === "snowy" && marketData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(produce[unluckyVeg] /= 3);
      produce[unluckyVeg] -= amountLost;
      callAlert(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
      marketData.weather.hasBeenPunished = true;
   }
   if (marketData.weather.weather === "flood" && marketData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(produce[unluckyVeg] /= 5);
      produce[unluckyVeg] -= amountLost;
      callAlert(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      marketData.weather.hasBeenPunished = true;
   }
   if (marketData.weather.weather === "frost" && marketData.weather.hasBeenPunished === false) {
      if (plotStatus.peasReady != Infinity) { maybeLose("peas"); }
      if (plotStatus.cornReady != Infinity) { maybeLose("corn"); }
      if (plotStatus.strawberriesReady != Infinity) { maybeLose("strawberries"); }
      if (plotStatus.eggplantsReady != Infinity) { maybeLose("eggplants"); }
      if (plotStatus.pumpkinsReady != Infinity) { maybeLose("pumpkins"); }
      if (plotStatus.cabbageReady != Infinity) { maybeLose("cabbage"); }
      if (plotStatus.dandelionReady != Infinity) { maybeLose("dandelion"); }
      if (plotStatus.rhubarbReady != Infinity) { maybeLose("rhubarb"); }
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
      marketData.weather.lastWeather = marketData.weather.weather;
      marketData.weather.weather = marketData.weather.nextWeather;
      chooseWeather();
      marketData.newWeatherTime = Date.now() + 360000; // 6 Minutes (360000)
   }
   // Update Display
   if (marketData.weather.weather === "sunny") { changeWeatherDisplay("Sunny", "Benefits: +3% market reset harvest chance", "sunny.svg"); }
   if (marketData.weather.weather === "rainy") { changeWeatherDisplay("Rainy", "Benefits: +1 produce", "rain.svg"); }
   if (marketData.weather.weather === "partlyCloudy") { changeWeatherDisplay("Partly Cloudy", "Effects: None", "overcast.svg"); }
   if (marketData.weather.weather === "partlySunny") { changeWeatherDisplay("Partly Sunny", "Effects: None", "partly-cloudy.svg"); }
   if (marketData.weather.weather === "snowy") { changeWeatherDisplay("Snowy", "Detriments: -33% of a stored vegetable", "snow.svg"); }
   if (marketData.weather.weather === "cloudy") { changeWeatherDisplay("Cloudy", "Detriments: +25% growing time", "cloudy.svg"); }
   if (marketData.weather.weather === "frost") { changeWeatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (marketData.weather.weather === "flood") { changeWeatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }
   if (marketData.weather.lastWeather === "sunny") { lastWeather("sunny.svg"); }
   if (marketData.weather.lastWeather === "rainy") { lastWeather("rain.svg"); }
   if (marketData.weather.lastWeather === "partlyCloudy") { lastWeather("overcast.svg"); }
   if (marketData.weather.lastWeather === "partlySunny") { lastWeather("partly-cloudy.svg"); }
   if (marketData.weather.lastWeather === "snowy") { lastWeather("snow.svg"); }
   if (marketData.weather.lastWeather === "cloudy") { lastWeather("cloudy.svg"); }
   if (marketData.weather.lastWeather === "frost") { lastWeather("frost.svg"); }
   if (marketData.weather.lastWeather === "flood") { lastWeather("flood.svg"); }
   if (marketData.weather.nextWeather === "sunny") { nextWeather("sunny.svg"); }
   if (marketData.weather.nextWeather === "rainy") { nextWeather("rain.svg"); }
   if (marketData.weather.nextWeather === "partlyCloudy") { nextWeather("overcast.svg"); }
   if (marketData.weather.nextWeather === "partlySunny") { nextWeather("partly-cloudy.svg"); }
   if (marketData.weather.nextWeather === "snowy") { nextWeather("snow.svg"); }
   if (marketData.weather.nextWeather === "cloudy") { nextWeather("cloudy.svg"); }
   if (marketData.weather.nextWeather === "frost") { nextWeather("frost.svg"); }
   if (marketData.weather.nextWeather === "flood") { nextWeather("flood.svg"); }
   function lastWeather(url) { document.querySelector(".weather-last").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function nextWeather(url) { document.querySelector(".weather-next").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function changeWeatherDisplay(weather, text, url) {
      document.querySelector(".weather-name").textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`;
   }
}, 100)
let updateWeatherTimeDisplay = setInterval(() => {
   let secondsLeft = Math.round((marketData.newWeatherTime - Date.now()) / 1000);
   let minutes = Math.floor(secondsLeft / 60) - (Math.floor(secondsLeft / 3600) * 60);
   let seconds = secondsLeft % 60;
   if (seconds < 10) { seconds = `0${seconds}`; }
   document.querySelector(".weather-time").textContent = `Next Weather: ${minutes}:${seconds}`;
}, 1000);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

tD = rawTaskData;
for (i = 1; i <= 4; i++) { hideObj(`.task-info-button-${i}`); }

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
function collectTaskReward(task) {
   for (let i = 1; i <= tD.numOTasks; i++) { if (task === tD[`t${i}`]["n"]) { marketData[tD[`t${i}`]["rIT"]] += tD[`t${i}`]["rA"]; } }
   taskList[task] = "complete";
   clearTask(taskList[task + "Num"]);
}
function showTasks() {
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (ifCheck(tD[`t${i}`]["n"])) { setTask(tD[`t${i}`]["n"]); }
      if (oldTaskCheck(tD[`t${i}`]["n"]) != false) {
         if (taskList[tD[`t${i}`]["n"]] === "ready") { startTask(`${oldTaskCheck(tD[`t${i}`]["n"])}`, tD[`t${i}`]["cRT"], tD[`t${i}`]["cRC"], tD[`t${i}`]["rT"], tD[`t${i}`]["tG"], tD[`t${i}`]["tGI"], tD[`t${i}`]["n"]); }
         else { startTask(`${oldTaskCheck(tD[`t${i}`]["n"])}`, tD[`t${i}`]["tD"], tD[`t${i}`]["tDC"], tD[`t${i}`]["nRT"], tD[`t${i}`]["tG"], tD[`t${i}`]["tGI"], tD[`t${i}`]["n"]); }
      }
   }
   function ifCheck(task) {
      if (!taskAlreadyUp(`occupied ${task}`) && (taskList[task] === "active" || taskList[task] === "waiting")) { return true; }
      else { return false; }
   }
}
function giveTasks() {
   // This line should be repeated only for taskLists
   if (plots.pumpkinplot === "unlocked") { taskList.bakeSale = "progressing"; }
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (checkIf(tD[`t${i}`]["n"], tD[`t${i}`]["c"])) { taskList[tD[`t${i}`]["n"]] = "active"; }
   }
   function checkIf(name, conditions) {
      let trueList = { is1: false, is2: false, is3: false }
      if (taskList[name] != "complete" && taskList[name] != "ready") { trueList.is1 = true; }
      if (conditions[0][0]) {
         conditions[0][1][0] = tD;
         if (taskList[conditions[0][1][0][conditions[0][1][1]][conditions[0][1][2]]] === "complete") { trueList.is2 = true; }
      } else { trueList.is2 = true; }
      if (conditions[1][0]) {
         if (conditions[1][1][0] == "plots") { conditions[1][1][0] = plots; }
         if (conditions[1][1][0] == "marketData") { conditions[1][1][0] = marketData; }
         if (conditions[1][1][0] == "taskList") { conditions[1][1][0] = taskList; }
         if (typeof conditions[1][2] === "number") { if (conditions[1][1][0][conditions[1][1][1]] >= conditions[1][2]) { trueList.is3 = true; } }
         else { if (conditions[1][1][0][conditions[1][1][1]] === conditions[1][2]) { trueList.is3 = true; } }
      } else { trueList.is3 = true; }
      if (trueList.is1 && trueList.is2 && trueList.is3) { return true; }
      else { return false; }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let rand = Math.random();
let vegetablesOwned = [];
vegetablesOwned.push("peas")
function harvestLuck(veg) {
   rand = Math.random();
   if (rand < 0.20) {
      fadeTextAppear(event, `You collected 5 \n extra seeds!`, "vegLuck", "#00de88");
      marketData.seeds += 5;
   }
   if (rand < 0.10) {
      fadeTextAppear(event, `This was a good crop! You collected \n 2 extra ${veg}!`, "vegLuck", "#00de88");
      produce[veg.toLowerCase()] += 2;
   }
   if (rand < (0.05 + marketData.weather.marketResetBonus)) {
      fadeTextAppear(event, `You collected a market \n reset! You now have ${marketData.marketResets}`, "vegLuck", "#00de88");
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
   let amountLost = Math.floor(produce[vegLost] /= 3);
   if (Math.random() < .08) {
      produce[vegLost] -= amountLost;
      callAlert(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
    }
}
let whenToLuck = window.setInterval(function() {
   if (Date.now() >= marketData.disasterTime) { luckyRoll(); marketData.disasterTime = Date.now() + 480000; }
}, 1000)

// Weeds
function addWeed() {
   let weedBoxHeight = document.querySelector(".land").clientHeight;
   let weedBoxWidth = document.querySelector(".land").clientWidth;
   let weed = document.querySelector(".weed").cloneNode();
   document.querySelector(".land").appendChild(weed);
   var randomtop = (Math.floor(Math.random() * weedBoxHeight) - 25);
   var randomleft = (Math.floor(Math.random() * weedBoxWidth) - 25);
   weed.style.transform = "scale(1)";
   weed.style.top = `${randomtop}px`;
   weed.style.left = `${randomleft}px`;
}
function collectWeed(THIS) {
   THIS.remove();
   marketData.weedPieces++;
   callAlert(`You collected a weed fragment! You now have ${marketData.weedPieces}/5`);
   if (marketData.weedPieces >= 5) {
      marketData.weedPieces -= 5;
      marketData.fertilizers += 1;
      callAlert(`You made 1 fertilizer out of the composted weed fragments!`);
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function showBuyPlot() {
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
   else { fadeTextAppear(event, `Not enough seeds`, false, '#de0000'); }
}
function openLock(vegetable, num) {
   document.querySelector(`#lockedDiv${num}`).style.display = "none";
   document.getElementById(`openPlot${num}`).style.display = "block";
   plots[vegetable + "plot"] = "unlocked";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let introData = { hello: false, meetGramps: false, planting: false, produceBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
function runIntro() {
   plotStatus = initPlotStatus;
   produce = initProduce;
   plots = initPlots;
   marketData = initMarketData;
   settings = initSettings;
   taskList = initTaskList;
   chooseWeather();
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
         $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
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
         $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
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
         $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
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
   else { fadeTextAppear(event, `Not enough seeds`, false, "#de0000"); }
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
   else { fadeTextAppear(event, `Not enough produce`, false, "#de0000"); }
   function sell() {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
   }
}

// Exchange Market!
let offerVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let costVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
function generateExchange() {
   let merchantNames = ["Ramesh Devi", "Zhang Wei", "Emmanuel Abara", "Kim Nguyen", "John Smith", "Muhammad Khan", "David Smith", "Achariya Sok", "Aleksandr Ivanov", "Mary Smith", "José Silva", "Oliver Gruber", "James Wang", "Kenji Satō"];
   let merchantName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
   let vegOwnedExchange = vegetablesOwned;
   let x = vegOwnedExchange[Math.floor(Math.random() * vegOwnedExchange.length)];
   vegOwnedExchange = vegOwnedExchange.filter(e => e !== `${x}`);
   let n = vegOwnedExchange[Math.floor(Math.random() * vegOwnedExchange.length)];
   offerVeg.vegetable = x;
   costVeg.vegetable = n;
   offerVeg.worth = marketData["exchangeMarket"][offerVeg.vegetable];
   costVeg.worth = marketData["exchangeMarket"][costVeg.vegetable];
   offerVeg.amount = random(2, 25);
   offerVeg.totalVal = offerVeg.amount * offerVeg.worth;
   costVeg.amount = Math.round(offerVeg.totalVal / costVeg.worth);
   document.querySelector(".market-exchange").style.backgroundColor = genColor();
   document.querySelector(".exchange-merchant").textContent = `${merchantName}`;
   document.querySelector(".exchange-offer").textContent = `${Math.round(offerVeg.amount)} ${offerVeg.vegetable}`;
   document.querySelector(".exchange-demand").textContent = `${Math.round(costVeg.amount)} ${costVeg.vegetable}`;
   if (Math.round(offerVeg.amount) === 0) { generateExchange(); }
   if (Math.round(costVeg.amount) === 0) { generateExchange(); }
}
function acceptExchange() {
   if (produce[costVeg.vegetable] >= costVeg.amount) {
      produce[offerVeg.vegetable] += Math.round(offerVeg.amount);
      produce[costVeg.vegetable] -= Math.round(costVeg.amount);
      generateExchange();
   }
   else { fadeTextAppear(event, `Not enough produce`, false, "#de0000"); }
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
   else { fadeTextAppear(event, `Not enough seeds`, false, "#de0000"); }
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
      fadeTextAppear(event, `-1 Doughnut`, false, "#de0000");
      checkTasks("tryPoliceDoughnuts");
   }
   else { fadeTextAppear(event, `Not enough doughnuts`, false, "#de0000"); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let bgImgArr = [["lake-night", "lake-day"], ["mountian-night", "mountian-day"]];
let bgImg = bgImgArr[Math.floor(Math.random() * bgImgArr.length)];
let mainLoop = window.setInterval(() => {
   const hours = new Date().getHours();
   if (hours > 6 && hours < 20) { document.body.style.backgroundImage = `url('Images/Background/${bgImg[1]}.svg')`; }
   else { document.body.style.backgroundImage = `url('Images/Background/${bgImg[0]}.svg')`; }
   updateMdlPrices("Corn");
   updateMdlPrices("Peas");
   updateMdlPrices("Strawberries");
   updateMdlPrices("Eggplants");
   updateMdlPrices("Pumpkins");
   updateMdlPrices("Cabbage");
   updateMdlPrices("Dandelion");
   updateMdlPrices("Rhubarb");
   function updateMdlPrices(veg) {
      document.querySelector(`.modal${veg}PriceBuy`).textContent = `Buy For ${toWord(marketData[`buy${veg}`], "short")}`;
      document.querySelector(`.modal${veg}PriceSell`).textContent = `Sell For ${toWord(marketData[`sell${veg}`], "short")}`;
   }
   document.querySelector(".police-chance").textContent = (marketData.black.catchChance).toFixed(2);
   document.querySelector(".seeds").textContent = `${toWord(marketData.seeds, "short")} Seeds`;
   document.querySelector(".seedsQuick").textContent = `${toWord(marketData.seeds)} Seeds`;
   document.querySelector("#doughnuts").textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`;
   document.querySelector("#fertilizer").textContent = `${Math.round(marketData.fertilizers)} Fertilizers Click + Place to apply`;
   if (plots.peaplot === "unlocked") {
      revealProduceQwk("#peaBushelsQuick", "peas");
      revealProduce("#peaBushels", "peas");
      !vegetablesOwned.includes("peas") ? vegetablesOwned.push("peas") : null;
   } if (plots.cornplot === "unlocked") {
      revealProduceQwk("#cornBushelsQuick", "corn");
      revealProduce("#cornBushels", "corn");
      checkTasks("unlockThe_cornPlot");
      document.querySelector(".tm-tb-co").style.opacity = "1";
      !vegetablesOwned.includes("corn") ? vegetablesOwned.push("corn") : null;
   } if (plots.strawberryplot === "unlocked") {
      revealProduceQwk("#strawberryBushelsQuick", "strawberries");
      revealProduce("#strawberryBushels", "strawberries");
      document.querySelector(`.doughnutsAmount`).style.display = "block";
      document.querySelector(`#doughnuts`).textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`;
      document.querySelector(`.doughnutsAmountQuick`).style.display = "block";
      document.querySelector(`#doughnutsQuick`).textContent = `${toWord(marketData.doughnuts, "short")} Doughnuts`;
      document.querySelector(".tm-tb-st").style.opacity = "1";
      !vegetablesOwned.includes("strawberries") ? vegetablesOwned.push("strawberries") : null;
   } if (plots.eggplantplot === "unlocked") {
      revealProduceQwk("#eggplantBushelsQuick", "eggplants");
      revealProduce("#eggplantBushels", "eggplants");
      document.querySelector(".tm-tb-eg").style.opacity = "1";
      !vegetablesOwned.includes("eggplants") ? vegetablesOwned.push("eggplants") : null;
   } if (plots.pumpkinplot === "unlocked") {
      revealProduceQwk("#pumpkinBushelsQuick", "pumpkins");
      revealProduce("#pumpkinBushels", "pumpkins");
      document.querySelector(".tm-tb-pu").style.opacity = "1";
      !vegetablesOwned.includes("pumpkins") ? vegetablesOwned.push("pumpkins") : null;
   } if (plots.cabbageplot === "unlocked") {
      revealProduceQwk("#cabbageBushelsQuick", "cabbage");
      revealProduce("#cabbageBushels", "cabbage");
      document.querySelector(".tm-tb-ca").style.opacity = "1";
      !vegetablesOwned.includes("cabbage") ? vegetablesOwned.push("cabbage") : null;
   } if (plots.dandelionplot === "unlocked") {
      revealProduceQwk("#dandelionBushelsQuick", "dandelion");
      revealProduce("#dandelionBushels", "dandelion");
      document.querySelector(".tm-tb-da").style.opacity = "1";
      !vegetablesOwned.includes("dandelion") ? vegetablesOwned.push("dandelion") : null;
   } if (plots.rhubarbplot === "unlocked") {
      revealProduceQwk("#rhubarbBushelsQuick", "rhubarb");
      revealProduce("#rhubarbBushels", "rhubarb");
      document.querySelector(".tm-tb-rh").style.opacity = "1";
      !vegetablesOwned.includes("rhubarb") ? vegetablesOwned.push("rhubarb") : null;
   }
   function revealProduce(id, veg) {
      document.querySelector(`.${veg}Amount`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(produce[veg], "short")} Bushels of ${capitalize(veg)}`; }
   function revealProduceQwk(id, veg) {
      document.querySelector(`.${veg}AmountQuick`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(produce[veg], "short")} Bushels of ${capitalize(veg)}`; }
   // To weed or not to weed
   if (Date.now() >= marketData.weedSeason) {
      let myRand = Math.random();
      if (myRand <= .80) { addWeed(); }
      marketData.weedSeason = Date.now() + 1800000;
   }
}, 200);
let taskLoop = setInterval(() => { giveTasks(); showTasks(); }, 750);
let marketLoop = setInterval(() => { updateMarket(); checkMarket(); }, 500);
let tasksReadyLoop = setInterval(() => {
   if (chechIf()) { document.querySelector(".aTaskIsReady").style.opacity = "1"; }
   else { document.querySelector(".aTaskIsReady").style.opacity = "0"; }
   function chechIf() {
      let array = [];
      for (i = 0; i < tD.listOfTasks.length; i++) {
         if (taskList[tD.listOfTasks[i]] === "ready") { array[i] = true; }
         else { array[i] = false; }
      }
      if (isTrue(array)) { return true; }
      else { return false; }
   }
   function isTrue(array) { let result = false; for (let i = 0; i < array.length; i++) { if (array[i] === true) { return true; } } }
}, 2000);

window.onload = function() {
   whatTheme();
   checkMarket();
   newBlackOffer();
   setTimeout(() => { generateExchange(); }, 750);
   if (settings.helpOpen) { showObj('.help-shadow'); }
   if (settings.settingsOpen) { showObj('.settingShadow'); }
   if (settings.marketOpen) { showObj('.marketShadow'); }
   if (settings.blackMarketOpen) { showObj('.marketShadow'); showObj('.blackMarketShadow'); settings.marketOpen = true; }
   if (settings.tasksOpen) { taskBar("close"); }
}
setTimeout(() => { showBuyPlot(); }, 500);

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
   let countDown = document.querySelector(`.${veg}-time-left`);
   let endTime = plotStatus[veg + "Ready"];
   let countDownInterval;
   let secondsLeftms;
   let setCountDown = (endTime) => {
      secondsLeftms = endTime - Date.now();
      let secondsLeft = Math.round(secondsLeftms / 1000);
      let hours = Math.floor(secondsLeft / 3600);
      let minutes = Math.floor(secondsLeft / 60) - (hours * 60);
      let seconds = secondsLeft % 60;
      if (secondsLeft < 0) { resetCountDown(); return; }
      if (hours < 10) { hours = `0${hours}`; }
      if (minutes < 10) { minutes = `0${minutes}`; }
      if (seconds < 10) { seconds = `0${seconds}`; }
      countDown.textContent = `${hours}:${minutes}:${seconds}`;
   };
   if (time > 0) {
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
   if ("working" !== plotStatus["peas"]) { tend('peas'); }
   if (plots.cornplot === "unlocked" && "working" !== plotStatus["corn"]) { tend('corn'); }
   if (plots.strawberryplot === "unlocked" && "working" !== plotStatus["strawberries"]) { tend('strawberries'); }
   if (plots.eggplantplot === "unlocked" && "working" !== plotStatus["eggplants"]) { tend('eggplants'); }
   if (plots.pumpkinplot === "unlocked" && "working" !== plotStatus["pumpkins"]) { tend('pumpkins'); }
   if (plots.cabbageplot === "unlocked" && "working" !== plotStatus["cabbage"]) { tend('cabbage'); }
   if (plots.dandelionplot === "unlocked" && "working" !== plotStatus["dandelion"]) { tend('dandelion'); }
   if (plots.rhubarbplot === "unlocked" && "working" !== plotStatus["rhubarb"]) { tend('rhubarb'); }
}

function taskBar(whatToDo) {
   if (whatToDo === "close") {
      document.querySelector(".tasks").style.left = "0";
      document.querySelector(".taskShadow").style.display = "block";
      settings.tasksOpen = true;
   }
   else if (whatToDo === "open") {
      document.querySelector(".tasks").style.left = "-80vh";
      document.querySelector(".taskShadow").style.display = "none";
      settings.tasksOpen = false;
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

function fadeTextAppear(e, txt, extraClass, txtColor) {
   let fadeText = document.querySelector(".fade-text").cloneNode();
   fadeText.id = "fadeTextNew";
   fadeText.textContent = txt;
   document.querySelector("body").appendChild(fadeText);
   if (extraClass != false) { fadeText.classList.add(extraClass); }
   if (txtColor) {
      fadeText.style.color = txtColor;
      fadeText.style.textShadow = `0 0 .5vh ${txtColor}`;
   }
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
      document.querySelector(".land").style.cursor = "url('Images/Cursors/sickle.png'), auto";
   }
}
function plantDrag() {
   if (plantCursor === "active") {
      plantCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      plantCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Cursors/plant.png'), auto";
   }
}
function fertilizeHover() {
   if (fertilizerCursor === "active") {
      fertilizerCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      fertilizerCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Cursors/fertilizer.png'), auto";
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
   if (mouseDown === 1 && plantCursor === "active" && "working" !== plotStatus["peas"]) { tend('peas'); }
   if (mouseDown === 1 && harvestCursor === "active" && Date.now() >= plotStatus["peasReady"]) { tend('peas'); }
});
$("#plot2").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.cornplot === "unlocked" && "working" !== plotStatus["corn"]) { tend('corn'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.cornplot === "unlocked" && Date.now() >= plotStatus["cornReady"]) { tend('corn'); }
});
$("#plot3").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.strawberryplot === "unlocked" && "working" !== plotStatus["strawberries"]) { tend('strawberries'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.strawberryplot === "unlocked" && Date.now() >= plotStatus["strawberriesReady"]) { tend('strawberries'); }
});
$("#plot4").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.eggplantplot === "unlocked" && "working" !== plotStatus["eggplants"]) { tend('eggplants'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.eggplantplot === "unlocked" && Date.now() >= plotStatus["eggplantsReady"]) { tend('eggplants'); }
});
$("#plot6").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.pumpkinplot === "unlocked" && "working" !== plotStatus["pumpkins"]) { tend('pumpkins'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.pumpkinplot === "unlocked" && Date.now() >= plotStatus["pumpkinsReady"]) { tend('pumpkins'); }
});
$("#plot7").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.cabbageplot === "unlocked" && "working" !== plotStatus["cabbage"]) { tend('cabbage'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.cabbageplot === "unlocked" && Date.now() >= plotStatus["cabbageReady"]) { tend('cabbage'); }
});
$("#plot8").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.dandelionplot === "unlocked" && "working" !== plotStatus["dandelion"]) { tend('dandelion'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.dandelionplot === "unlocked" && Date.now() >= plotStatus["dandelionReady"]) { tend('dandelion'); }
});
$("#plot9").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plots.rhubarbplot === "unlocked" && "working" !== plotStatus["rhubarb"]) { tend('rhubarb'); }
   if (mouseDown === 1 && harvestCursor === "active" && plots.rhubarbplot === "unlocked" && Date.now() >= plotStatus["rhubarbReady"]) { tend('rhubarb'); }
});

document.querySelector("#plot1").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.peaplot != "locked" && plotStatus.peasReady !== 0) { fertilize("peas"); fertilizeHover(); } });
document.querySelector("#plot2").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.cornplot != "locked" && plotStatus.cornReady !== 0) { fertilize("corn"); fertilizeHover(); } });
document.querySelector("#plot3").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.strawberryplot != "locked" && plotStatus.strawberriesReady !== 0) { fertilize("strawberries"); fertilizeHover(); } });
document.querySelector("#plot4").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.eggplantplot != "locked" && plotStatus.eggplantsReady !== 0) { fertilize("eggplants"); fertilizeHover(); } });
document.querySelector("#plot6").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.pumpkinplot != "locked" && plotStatus.pumpkinsReady !== 0) { fertilize("pumpkins"); fertilizeHover(); } });
document.querySelector("#plot7").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.cabbageplot != "locked" && plotStatus.cabbageReady !== 0) { fertilize("cabbage"); fertilizeHover(); } });
document.querySelector("#plot8").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.dandelionplot != "locked" && plotStatus.dandelionReady !== 0) { fertilize("dandelion"); fertilizeHover(); } });
document.querySelector("#plot9").addEventListener("click", event => { if (fertilizerCursor === "active" && plots.rhubarbplot != "locked" && plotStatus.rhubarbReady !== 0) { fertilize("rhubarb"); fertilizeHover(); } });

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

let saveLoop = window.setInterval(function() { save(); }, 15000);
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
      localStorage.setItem("plotStatus", JSON.stringify(initPlotStatus, replacer));
      localStorage.setItem("produce", JSON.stringify(initProduce, replacer));
      localStorage.setItem("plots", JSON.stringify(initPlots, replacer));
      localStorage.setItem("marketData", JSON.stringify(initMarketData, replacer));
      localStorage.setItem("settingData", JSON.stringify(initSettings, replacer));
      localStorage.setItem("taskList", JSON.stringify(initTaskList, replacer));
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

const initalPlotStatusKeys = Object.keys(initPlotStatus);
const initalProduceKeys = Object.keys(initProduce);
const initalPlotsKeys = Object.keys(initPlots);
const initalMarketDataKeys = Object.keys(initMarketData);
const initalSettingsKeys = Object.keys(initSettings);
const initalTaskListKeys = Object.keys(initTaskList);
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

var hover;
var mouseX;
var mouseY;
var doThigsOnMousemoveList = [];
function getCoords(e) {
   mouseX = event.clientX;
   mouseY = event.clientY;
   if (doThigsOnMousemoveList.length >= 1) {
      for (i = 0; i < doThigsOnMousemoveList.length; i++) {
         let thsFunction = window[doThigsOnMousemoveList[i]];
         thsFunction();
      }
   }
}

function info(THIS) {
   let parent = THIS.parentElement;
   hover = document.createElement("span");
   hover.textContent = THIS.dataset.info;
   hover.style.position = "fixed";
   if (settings.theme === "light") { hover.classList.add("dynamicHover"); }
   else { hover.classList.add("dynamicHoverDark"); }
   doThigsOnMousemoveList.push("moveInfoHover");
   parent.appendChild(hover);
   // setTimeout(() => { hover.style.opacity = "1" }, 100);
   THIS.addEventListener("mouseleave", doThis);
   function doThis() { hover.remove(); doThigsOnMousemoveList.splice(doThigsOnMousemoveList.indexOf("moveInfoHover"), 1); THIS.removeEventListener("mouseleave", doThis); }
   // hover.style.opacity = "0"; setTimeout(() => { hover.remove(); }, 100);
}
function moveInfoHover() {
   hover.style.top = `${mouseY}px`;
   hover.style.left = `${mouseX + 25}px`;
}
