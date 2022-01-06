/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Weather            | Weather that effects plants
Tasks              | Small chores given by main charecters
Incidents          | Luck run when harvesting or using the Market, weeds
Unlock gameData       | Functions that unlock gameData
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

function save() {
   let saveObject = gameData;
   let saveJSON = JSON.stringify(saveObject);
   $.ajax({
      type: "POST",
      contentType: "application/json",
      data: saveJSON,
      url: "/save-vegetable-dash",
   }).done(function(response){
      // Misson Success!
   }).fail(function(xhr, textStatus, errorThrown) {
      console.log("ERROR: ", errorThrown);
      return xhr.responseText;
   });
}

var gameData = userData.gameSave;

gameData.loadtime = findAvg(gameData.loadtimes);

function findAvg(array) {
   let total = 0;
   for(let i = 0; i < array.length; i++) { total += array[i]; }
   return total / array.length;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function infoModal(veg) {
   if (document.querySelector(`#info${veg}`).style.opacity === "1") { hideObj(`#info${veg}`); }
   else { showObj(`#info${veg}`); }
}
function plotUnlockedModal(veg) {
   if (document.querySelector(`#info${veg}`).style.opacity === "1") { hideObj(`#info${veg}`); }
   else { showObj(`#info${veg}`); }
}

function tend(veg) {
   // Harvest
   if (gameData[`${veg}Status`] === "Ready") {
      gameData[`${veg}Status`] = "Empty";
      document.querySelector(`.${capitalize(veg)}`).textContent = `Grow ${capitalize(veg)}!`;
      gameData.seeds++;
      harvestLuck(capitalize(veg));
      showObj(`.${capitalize(veg)}`);
      if (gameData[veg]) { gameData[veg] += gameData[veg + "Reward"]; }
      else { gameData[veg] = gameData[veg + "Reward"]; }
      gameData[veg + "Reward"] = 1;
   }
   // Plant
   else {
      let currentTime = Date.now();
      let harvestTime = gameData[`${veg}Time`][2] / 4;
      if (gameData.weather.weather === "cloudy") { harvestTime = gameData[`${veg}Time`][2] + harvestTime; }
      else { harvestTime = gameData[`${veg}Time`][2]; }
      gameData[`${veg}Status`] = currentTime + harvestTime;
      timeLeft(veg.toLowerCase());
      hideObj(`.${capitalize(veg)}`);
      if (gameData.weather.weather === "rainy") { gameData[veg + "Reward"]++; }
   }
}
function fertilize(veg) {
   if (gameData.fertilizers >= 1) {
      gameData.fertilizers -= 1;
      gameData[veg + "Status"] = "Ready";
      gameData[veg + "Reward"]++;
      checkTasks("tryFertilizer");
   }
}
function plantLoop(veg, pltNumber, urlOne, urlTwo, urlThree) {
   let plotImg = document.querySelector(`#plot${pltNumber}`).style;
   let btnText = document.querySelector(`.${capitalize(veg)}`);
   setInterval(() => {
      if (gameData[`${veg}Status`] == "Ready") {
         btnText.textContent = `Harvest ${capitalize(veg)}!`;
         plotImg.backgroundImage = `url(Images/Plots/${urlThree})`;
         document.querySelector(`.${capitalize(veg)}`).textContent = `Harvest ${capitalize(veg)}!`;
         showObj(`.${capitalize(veg)}`);
      }
      if (gameData[`${veg}Status`] == "Empty") { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      if (gameData[`${veg}Status`] == "Locked") { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      if (gameData[`${veg}Status`] == "withered") { plotImg.backgroundImage = `url(Images/Plots/withered.png)`; }
      if (plantGrowing(veg)) {
         hideObj(`.${capitalize(veg)}`);
         timeLeft(veg);
         let progressTime = gameData[`${veg}Status`] - Date.now();
         let readyTime = Math.round(progressTime / 1000) * 1000;
         let checkTimeOne = gameData[`${veg}Status`] - gameData[`${veg}Time`][0];
         let checkTimeTwo = gameData[`${veg}Status`] - gameData[`${veg}Time`][1];
         if (Date.now() >= gameData[`${veg}Status`]) { gameData[`${veg}Status`] = "Ready"; }
         else if (Date.now() >= checkTimeOne) { plotImg.backgroundImage = `url(Images/Plots/${urlTwo})`; }
         else if (Date.now() >= checkTimeTwo) { plotImg.backgroundImage = `url(Images/Plots/${urlOne})`; }
         else { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      }
   }, 1000);
}

function plantGrowing(veg) {
   if (["Ready", "Empty", "Locked", "withered"].indexOf(gameData[`${veg}Status`]) + 1) { return false; }
   else { return true; }
}

function plantStatus(checkfor, veg) {
   switch (checkfor) {
      case "g-or-e": // For fertilizer
         if (["Ready", "Locked", "withered"].indexOf(gameData[`${veg}Status`]) + 1) { return false; }
         else { return true; }
      case "r-or-e": // For tend
         if (["Ready", "Empty"].indexOf(gameData[`${veg}Status`]) + 1) { return true; }
         else { return false; }
      case "g": // ?
         if (["Ready", "Empty", "Locked", "withered"].indexOf(gameData[`${veg}Status`]) + 1) { return false; }
         else { return true; }
   }
}

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
   if (weatherChance(0, .15) === true) { gameData.weather.nextWeather = "sunny"; }
   if (weatherChance(.15, .30) === true) { gameData.weather.nextWeather = "rainy"; }
   if (weatherChance(.30, .55) === true) { gameData.weather.nextWeather = "partlySunny"; }
   if (weatherChance(.55, .80) === true) { gameData.weather.nextWeather = "partlyCloudy"; }
   if (weatherChance(.80, .85) === true) { gameData.weather.nextWeather = "snowy"; }
   if (weatherChance(.85, .93) === true) { gameData.weather.nextWeather = "cloudy"; }
   if (weatherChance(.93, .95) === true) { gameData.weather.nextWeather = "frost"; }
   if (weatherChance(.95, 1.01) === true) { gameData.weather.nextWeather = "flood"; }
   if (gameData.weather.weather === "snowy" || "frost" || "flood") { gameData.weather.hasBeenPunished = false; }
}
let updateWeather = window.setInterval(function() {
   // Implement Weather Effects
   if (gameData.weather.weather === "sunny") { gameData.weather.marketResetBonus = 0.03; }
   else { gameData.weather.marketResetBonus = 0; }
   if (gameData.weather.weather === "snowy" && gameData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] /= 3);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      callAlert(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.weather.hasBeenPunished = true;
   }
   if (gameData.weather.weather === "flood" && gameData.weather.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] /= 5);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      callAlert(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.weather.hasBeenPunished = true;
   }
   if (gameData.weather.weather === "frost" && gameData.weather.hasBeenPunished === false) {
      if (plantStatus("r-or-e", "peas") || plantStatus("g", "peas")) { maybeLose("peas"); }
      if (plantStatus("r-or-e", "corn") || plantStatus("g", "corn")) { maybeLose("corn"); }
      if (plantStatus("r-or-e", "strawberries") || plantStatus("g", "strawberries")) { maybeLose("strawberries"); }
      if (plantStatus("r-or-e", "eggplants") || plantStatus("g", "eggplants")) { maybeLose("eggplants"); }
      if (plantStatus("r-or-e", "pumpkins") || plantStatus("g", "pumpkins")) { maybeLose("pumpkins"); }
      if (plantStatus("r-or-e", "cabbage") || plantStatus("g", "cabbage")) { maybeLose("cabbage"); }
      if (plantStatus("r-or-e", "dandelion") || plantStatus("g", "dandelion")) { maybeLose("dandelion"); }
      if (plantStatus("r-or-e", "rhubarb") || plantStatus("g", "rhubarb")) { maybeLose("rhubarb"); }
      function maybeLose(veg) {
         if (Math.random() > .5) {
            gameData[veg + "Status"] = "withered";
            showObj(`.${capitalize(veg)}`);
         }
      }
      gameData.weather.hasBeenPunished = true;
   }
   // Choose next weathertime
   if (Date.now() >= gameData.newWeatherTime) {
      gameData.weather.lastWeather = gameData.weather.weather;
      gameData.weather.weather = gameData.weather.nextWeather;
      chooseWeather();
      gameData.newWeatherTime = Date.now() + 360000; // 6 Minutes (360000)
   }
   // Update Display
   if (gameData.weather.weather === "sunny") { changeWeatherDisplay("Sunny", "Benefits: +3% market reset harvest chance", "sunny.svg"); }
   if (gameData.weather.weather === "rainy") { changeWeatherDisplay("Rainy", "Benefits: +1 gameData", "rain.svg"); }
   if (gameData.weather.weather === "partlyCloudy") { changeWeatherDisplay("Partly Cloudy", "Effects: None", "overcast.svg"); }
   if (gameData.weather.weather === "partlySunny") { changeWeatherDisplay("Partly Sunny", "Effects: None", "partly-cloudy.svg"); }
   if (gameData.weather.weather === "snowy") { changeWeatherDisplay("Snowy", "Detriments: -33% of a stored vegetable", "snow.svg"); }
   if (gameData.weather.weather === "cloudy") { changeWeatherDisplay("Cloudy", "Detriments: +25% growing time", "cloudy.svg"); }
   if (gameData.weather.weather === "frost") { changeWeatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (gameData.weather.weather === "flood") { changeWeatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }
   if (gameData.weather.lastWeather === "sunny") { lastWeather("sunny.svg"); }
   if (gameData.weather.lastWeather === "rainy") { lastWeather("rain.svg"); }
   if (gameData.weather.lastWeather === "partlyCloudy") { lastWeather("overcast.svg"); }
   if (gameData.weather.lastWeather === "partlySunny") { lastWeather("partly-cloudy.svg"); }
   if (gameData.weather.lastWeather === "snowy") { lastWeather("snow.svg"); }
   if (gameData.weather.lastWeather === "cloudy") { lastWeather("cloudy.svg"); }
   if (gameData.weather.lastWeather === "frost") { lastWeather("frost.svg"); }
   if (gameData.weather.lastWeather === "flood") { lastWeather("flood.svg"); }
   if (gameData.weather.nextWeather === "sunny") { nextWeather("sunny.svg"); }
   if (gameData.weather.nextWeather === "rainy") { nextWeather("rain.svg"); }
   if (gameData.weather.nextWeather === "partlyCloudy") { nextWeather("overcast.svg"); }
   if (gameData.weather.nextWeather === "partlySunny") { nextWeather("partly-cloudy.svg"); }
   if (gameData.weather.nextWeather === "snowy") { nextWeather("snow.svg"); }
   if (gameData.weather.nextWeather === "cloudy") { nextWeather("cloudy.svg"); }
   if (gameData.weather.nextWeather === "frost") { nextWeather("frost.svg"); }
   if (gameData.weather.nextWeather === "flood") { nextWeather("flood.svg"); }
   function lastWeather(url) { document.querySelector(".weather-last").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function nextWeather(url) { document.querySelector(".weather-next").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function changeWeatherDisplay(weather, text, url) {
      document.querySelector(".weather-name").textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`;
   }
}, 100)
let updateWeatherTimeDisplay = setInterval(() => {
   let secondsLeft = Math.round((gameData.newWeatherTime - Date.now()) / 1000);
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
   if (gameData.taskBox1 === "unoccupied") { gameData[`${task}Num`] = 1; }
   else if (gameData.taskBox2 === "unoccupied") { gameData[`${task}Num`] = 2; }
   else if (gameData.taskBox3 === "unoccupied") { gameData[`${task}Num`] = 3; }
   else if (gameData.taskBox4 === "unoccupied") { gameData[`${task}Num`] = 4; }
   else { gameData[`${task}Num`] = "Full"; }
   if (gameData[`${task}Num`] === "Full") { task = "waiting"; return; }
   gameData[`taskBox${gameData[`${task}Num`]}`] = `occupied ${task}`;
}
function startTask(num, buttonTxt, buttonOnClick, infoTxt, taskGiver, taskGiverImg, task) {
   gameData[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   showObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
   document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", `javascript: ${buttonOnClick}` );
   document.querySelector(`.task-info-${num}`).textContent = infoTxt;
   document.querySelector(`.task-info-giver-${num}`).textContent = taskGiver;
   $(`.task-info-img-${num}`).attr("src", `Images/${taskGiverImg}`);
   gameData["taskBox" + num] = "occupied " + task;
}
function clearTask(num) {
   hideObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).textContent = "";
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: " );
   document.querySelector(`.task-info-${num}`).textContent = "";
   document.querySelector(`.task-info-giver-${num}`).textContent = "";
   $(`.task-info-img-${num}`).attr("src", "");
   gameData["taskBox" + num] = "unoccupied";
}
function oldTaskCheck(task) {
   if (gameData.taskBox1 === `occupied ${task}`) { return 1; }
   else if (gameData.taskBox2 === `occupied ${task}`) { return 2; }
   else if (gameData.taskBox3 === `occupied ${task}`) { return 3; }
   else if (gameData.taskBox4 === `occupied ${task}`) { return 4; }
   else { return false; }
}
function taskAlreadyUp(task) {
   let value = {};
   for (i = 1; i < 5; i++) {
      if (gameData["taskBox" + i] === task) { value[i] = true; }
      else { value[i] = false; }
   }
   if (value[1] === false && value[2] === false && value[3] === false && value[4] === false) { return false }
   else { return true }
}
function checkTasks(task) { if (gameData[task] === "active") { gameData[task] = "ready"; } }
function collectTaskReward(task) {
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (task === tD[`t${i}`]["name"]) {
         gameData[tD[`t${i}`]["reward"]["item"]] += tD[`t${i}`]["reward"]["amount"];
      }
   }
   gameData[task] = "complete";
   clearTask(gameData[task + "Num"]);
}
function showTasks() {
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (ifCheck(tD[`t${i}`]["name"])) { setTask(tD[`t${i}`]["name"]); }
      if (oldTaskCheck(tD[`t${i}`]["name"]) != false) {
         if (gameData[tD[`t${i}`]["name"]] === "ready") {
            startTask(`${oldTaskCheck(tD[`t${i}`]["name"])}`,
            tD[`t${i}`]["reward"]["text"],
            tD[`t${i}`]["reward"]["code"],
            tD[`t${i}`]["text"]["ready"],
            tD[`t${i}`]["taskGiver"]["name"],
            tD[`t${i}`]["taskGiver"]["image"],
            tD[`t${i}`]["name"]);
         }
         else {
            startTask(`${oldTaskCheck(tD[`t${i}`]["name"])}`,
            tD[`t${i}`]["demand"]["text"],
            tD[`t${i}`]["demand"]["code"],
            tD[`t${i}`]["text"]["notReady"],
            tD[`t${i}`]["taskGiver"]["name"],
            tD[`t${i}`]["taskGiver"]["image"],
            tD[`t${i}`]["name"]);
         }
      }
   }
   function ifCheck(task) {
      if (!taskAlreadyUp(`occupied ${task}`) && (gameData[task] === "active" || gameData[task] === "waiting")) { return true; }
      else { return false; }
   }
}
function giveTasks() {
   if (gameData.pumpkinsStatus != "Locked") { gameData.bakeSale = "progressing"; }
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (checkIf(tD[`t${i}`]["name"], tD[`t${i}`]["conditions"])) { gameData[tD[`t${i}`]["name"]] = "active"; }
   }
   function checkIf(name, conditions) {
      let trueList = { is1: false, is2: false, is3: false, is4: false }
      if (gameData[name] != "complete" && gameData[name] != "ready") { trueList.is1 = true; }
      if (conditions["c1"][0] !== false) {
         let taskCheckingNumber = conditions["c1"][0];
         let stateOfThatTask = gameData[tD[taskCheckingNumber]["name"]];
         if (stateOfThatTask === "complete") { trueList.is2 = true; }
      } else { trueList.is2 = false; }
      if (conditions["c2"][0] !== "false") {
         if (typeof conditions["c2"][1] === "number") {
            if (gameData[conditions["c2"][0]] >= conditions["c2"][1]) { trueList.is3 = true; }
         }
         else if (gameData[conditions["c2"][0]] === conditions["c2"][1]) { trueList.is3 = true; }
      } else { trueList.is3 = false; }
      if (conditions["c3"][0] !== "false") {
         if (gameData[conditions["c3"][0]] !== "Locked") { trueList.is4 = true; }
      } else { trueList.is4 = false; }
      if (trueList.is1 && trueList.is2 && trueList.is3 && trueList.is4) { return true; }
      else { return false; }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let vegetablesOwned = [];
vegetablesOwned.push("peas")
function harvestLuck(veg) {
   if (Math.random() < 0.20) {
      gameData.seeds += 5;
      fadeTextAppear(event, `You collected 5 \n extra seeds!`, "vegLuck", "#00de88");
   }
   if (Math.random() < 0.10) {
      gameData[veg.toLowerCase()] += 2;
      fadeTextAppear(event, `This was a good crop! You collected \n 2 extra ${veg}!`, "vegLuck", "#00de88");
   }
   if (Math.random() < (0.05 + gameData.weather.marketResetBonus)) {
      gameData.marketResets++;
      fadeTextAppear(event, `You collected a market \n reset! You now have ${gameData.marketResets}`, "vegLuck", "#00de88");
   }
}
function marketLuck() {
   if (Math.random() < 0.01) {
      gameData.marketResets++;
      callAlert(`You collected a market reset! You now have ${gameData.marketResets}`);
   }
}
function blackMarketLuck() {
   if (Math.random() < gameData.black.catchChance) {
      callAlert("The police caught you! You were fined 6000 Seeds");
      gameData.seeds -= 6000;
   }
}
function luckyRoll() {
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(gameData[vegLost] /= 3);
   if (Math.random() < .08) {
      gameData[vegLost] -= amountLost;
      callAlert(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
    }
    if (Math.random() < .02) {
      gameData[vegLost] -= amountLost;
      callAlert(`A hacker has hacked your account (not really)! You lost ${amountLost} of your ${vegLost}!`);
    }
}
let whenToLuck = window.setInterval(function() {
   if (Date.now() >= gameData.disasterTime) { luckyRoll(); gameData.disasterTime = Date.now() + 480000; }
}, 1000)

// Weeds
function addWeed(check) {
   let weedBoxHeight = document.querySelector(".land").clientHeight;
   let weedBoxWidth = document.querySelector(".land").clientWidth;
   let weed = document.querySelector(".weed").cloneNode();
   document.querySelector(".land").appendChild(weed);
   var randomtop = (Math.floor(Math.random() * weedBoxHeight) - 25);
   var randomleft = (Math.floor(Math.random() * weedBoxWidth) - 25);
   weed.style.transform = "scale(1)";
   weed.style.top = `${randomtop}px`;
   weed.style.left = `${randomleft}px`;
   if (!check) { gameData.weedsLeft++; }
}
function collectWeed(THIS) {
   THIS.remove();
   gameData.weedPieces++;
   gameData.weedsLeft--;
   if (gameData.weedPieces >= 5) {
      gameData.weedPieces -= 5;
      gameData.fertilizers += 1;
      callAlert(`You made 1 fertilizer out of the composted weed fragments!`);
   }
   else { callAlert(`You collected a weed fragment! You now have ${gameData.weedPieces}/5`); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function showBuyPlot() {
   if (gameData.cornStatus != "Locked") { openLock("corn", 2); document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price3, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`; }
   if (gameData.strawberriesStatus != "Locked") { openLock("strawberry", 3); document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price4, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`; }
   if (gameData.eggplantsStatus != "Locked") { openLock("eggplant", 4); document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price6, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`; }
   if (gameData.pumpkinsStatus != "Locked") { openLock("pumpkin", 6); document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price7, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(7)">Purchase Plot</button>`; }
   if (gameData.cabbageStatus != "Locked") { openLock("cabbage", 7); document.getElementById("lock8Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price8, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(8)">Purchase Plot</button>`; }
   if (gameData.dandelionStatus != "Locked") { openLock("dandelion", 8); document.getElementById("lock9Text").innerHTML = `This plot is locked <br> Pay ${toWord(gameData.price9, "short")} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(9)">Purchase Plot</button>`; }
   if (gameData.rhubarbStatus != "Locked") { openLock("rhubarb", 9); document.getElementById("lock5Text").innerHTML = "Coming <br> Soon!"; }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (gameData.seeds >= gameData["price" + plotNum]) {
      gameData.seeds -= gameData["price" + plotNum];
      gameData.marketResets++;
      if (number == "2") { setTimeout(() => { openLock("corn", 2); infoModal('UnlockedCorn'); }, 2500); document.getElementById("lock2").classList.add("removing-lock"); }
      if (number == "3") { setTimeout(() => { openLock("strawberries", 3); infoModal('UnlockedStrawberry'); }, 2500); document.getElementById("lock3").classList.add("removing-lock"); }
      if (number == "4") { setTimeout(() => { openLock("eggplants", 4); infoModal('UnlockedEggplant'); }, 2500); document.getElementById("lock4").classList.add("removing-lock"); }
      if (number == "6") { setTimeout(() => { openLock("pumpkins", 6); infoModal('UnlockedPumpkin'); }, 2500); document.getElementById("lock6").classList.add("removing-lock"); }
      if (number == "7") { setTimeout(() => { openLock("cabbage", 7); infoModal('UnlockedCabbage'); }, 2500); document.getElementById("lock7").classList.add("removing-lock"); }
      if (number == "8") { setTimeout(() => { openLock("dandelion", 8); infoModal('UnlockedDandelion'); }, 2500); document.getElementById("lock8").classList.add("removing-lock"); }
      if (number == "9") { setTimeout(() => { openLock("rhubarb", 9); infoModal('UnlockedRhubarb'); }, 2500); document.getElementById("lock9").classList.add("removing-lock"); }
   }
   else { fadeTextAppear(event, `Not enough seeds`, false, '#de0000'); }
}
function openLock(vegetable, num) {
   document.querySelector(`#lockedDiv${num}`).style.display = "none";
   document.getElementById(`openPlot${num}`).style.display = "block";
   if (gameData[`${vegetable}Status`] === "Locked") { gameData[`${vegetable}Status`] = "Empty"; }  
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let introData = { hello: false, meetGramps: false, planting: false, gameDataBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
function runIntro() {
   gameData = initGameData;
   chooseWeather();
   save();
   gameData.intro = "finished";
   showObj(".welcome");
   gameData.disasterTime = Date.now() + 480000;
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
      if (introData.gameDataBar === false) {
         $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
         introText.textContent = "This toolbar shows the amount of gameData you have, holds the fertilizer for growing plants quickly, and the sickle for harvesting.";
         document.querySelector(".toolbar").style.zIndex = "100";
         introData.gameDataBar = true;
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
         introText.textContent = "This is the market, were you can gain seeds by selling gameData, which are useful for many things, like opening more gameData.";
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
   if (gameData.peasStatus != "Locked") { marketItem[1].style.display = "block"; }
   if (gameData.cornStatus != "Locked") { marketItem[2].style.display = "block"; marketItem[9].style.display = "block"; }
   if (gameData.strawberriesStatus != "Locked") { marketItem[3].style.display = "block"; marketItem[10].style.display = "block"; }
   if (gameData.eggplantsStatus != "Locked") { marketItem[4].style.display = "block"; }
   if (gameData.pumpkinsStatus != "Locked") { marketItem[5].style.display = "block"; }
   if (gameData.cabbageStatus != "Locked") { marketItem[6].style.display = "block"; }
   if (gameData.dandelionStatus != "Locked") { marketItem[7].style.display = "block"; }
   if (gameData.rhubarbStatus != "Locked") { marketItem[8].style.display = "block"; }
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
      document.querySelector(`.${veg.toLowerCase()}-market-item`).textContent = `${veg}: ${toWord(gameData[veg.toLowerCase()])}
      Buy for ${toWord(gameData["buy" + veg], "short")}
      Sell for ${toWord(gameData["sell" + veg], "short")} \r\n \r\n`;
   }
   document.querySelector(".special-market-item").textContent = `Seeds: ${toWord(gameData.seeds, "long")}`;
   document.querySelector(".reset-market-item").textContent = `You have ${gameData.marketResets} Market Resets`;
}
function resetMarketValues() {
   if (gameData.marketResets > 0) {
      gameData.marketResets--;
      gameData.buyPeas = 25;
      gameData.sellPeas = 25;
      gameData.buyCorn = 75;
      gameData.sellCorn = 75;
      gameData.buyStrawberries = 250;
      gameData.sellStrawberries = 250;
      gameData.buyEggplants = 750;
      gameData.sellEggplants = 750;
      gameData.buyPumpkins = 5000;
      gameData.sellPumpkins = 5000;
      gameData.buyCabbage = 25000;
      gameData.sellCabbage = 25000;
      gameData.buyDandelion = 100000;
      gameData.sellDandelion = 100000;
      gameData.buyRhubarb = 7500000;
      gameData.sellRhubarb = 7500000;
      checkTasks("useMarketResets");
   }
}

// Buy & Sell Vegetables
function buyProduce(produceRequested, produceCase) {
   if (event.ctrlKey && gameData.seeds >= calcInflation(10)) {
      for (i = 0; i < 10; i++) { buy(); } marketLuck();
   }
   else if (event.shiftKey && gameData.seeds >= calcInflation(5)) {
      for (i = 0; i < 5; i++) { buy(); } marketLuck();
   }
   else if (gameData.seeds >= gameData["buy" + produceCase]) { buy(); marketLuck(); }
   else { fadeTextAppear(event, `Not enough seeds`, false, "#de0000"); }
   function buy() {
      gameData[produceRequested] += 5;
      gameData.seeds -= gameData["buy" + produceCase];
      gameData["buy" + produceCase] *= 1.08;
      gameData["sell" + produceCase] *= 1.02;
   }
   function calcInflation(times) {
      let fakeBuy = gameData["buy" + produceCase];
      let totalPrice = 0;
      for (i = 1; i < times; i++) { totalPrice += fakeBuy; fakeBuy *= 1.08; }
      return totalPrice;
   }
}
function sellProduce(produceRequested, produceCase) {
   if (event.ctrlKey && gameData[produceRequested] >= 50) {
      for (i = 0; i < 10; i++) { sell(); } marketLuck();
   }
   else if (event.shiftKey && gameData[produceRequested] >= 25) {
      for (i = 0; i < 5; i++) { sell(); } marketLuck();
   }
   else if (gameData[produceRequested] >= 5) { sell(); marketLuck(); }
   else { fadeTextAppear(event, `Not enough produce`, false, "#de0000"); }
   function sell() {
      gameData[produceRequested] -= 5;
      gameData.seeds += gameData["sell" + produceCase];
      gameData["buy" + produceCase] *= 0.98;
      gameData["sell" + produceCase] *= 0.92;
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
   offerVeg.worth = gameData["exchangeMarket"][offerVeg.vegetable];
   costVeg.worth = gameData["exchangeMarket"][costVeg.vegetable];
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
   if (gameData[costVeg.vegetable] >= costVeg.amount) {
      gameData[offerVeg.vegetable] += Math.round(offerVeg.amount);
      gameData[costVeg.vegetable] -= Math.round(costVeg.amount);
      generateExchange();
   }
   else { fadeTextAppear(event, `Not enough produce`, false, "#de0000"); }
}

// Black Market
function blackMarketValues() {
   gameData.black.name = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel", "Stolin Goods"][Math.floor(Math.random() * 7)];
   gameData.black.item = ["Market Resets", "Fertilizer", "Doughnuts"][Math.floor(Math.random() * 3)];
   gameData.black.quantity = random(1, 5);
   if (gameData.black.item === "Market Resets") { gameData.black.worth = gameData.black.resets; }
   if (gameData.black.item === "Fertilizer") { gameData.black.worth = gameData.black.fertilizer; }
   if (gameData.black.item === "Doughnuts") { gameData.black.worth = gameData.black.doughnuts; }
   gameData.black.cost = gameData.black.worth * gameData.black.quantity;
}
function newBlackOffer() {
   document.querySelector(".bmo-seller").textContent = gameData.black.name;
   document.querySelector(".bmo-offer").textContent = gameData.black.quantity + " " + gameData.black.item;
   document.querySelector(".bmo-price").textContent = toWord(gameData.black.cost);
   document.querySelector(".blackMarket").style.backgroundColor = genColor();
}
function accept() {
   if (gameData.seeds >= gameData.black.cost) {
      gameData.seeds -= gameData.black.cost;
      blackMarketValues();
      blackMarketLuck();
      newBlackOffer();
      gameData.black.catchChance += .01;
      if (gameData.black.item === "Market Resets") { gameData.marketResets += gameData.black.quantity; }
      if (gameData.black.item === "Fertilizer") { gameData.fertilizers += gameData.black.quantity; }
      if (gameData.black.item === "Doughnuts") { gameData.doughnuts += gameData.black.quantity; }
      checkTasks("seeBlackMarket");
   }
   else { fadeTextAppear(event, `Not enough seeds`, false, "#de0000"); }
}
function deny() {
   blackMarketValues();
   blackMarketLuck();
   newBlackOffer();
   gameData.black.catchChance += .01;
}
function feedPolice() {
   if (gameData.doughnuts >= 1) {
      gameData.doughnuts -= 1;
      gameData.black.catchChance = .02;
      fadeTextAppear(event, `-1 Doughnut`, false, "#de0000");
      checkTasks("tryPoliceDoughnuts");
   }
   else { fadeTextAppear(event, `Not enough doughnuts`, false, "#de0000"); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.body.addEventListener("mousemove", e => {getCoords(e); });

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
      document.querySelector(`.modal${veg}PriceBuy`).textContent = `Buy For ${toWord(gameData[`buy${veg}`], "short")}`;
      document.querySelector(`.modal${veg}PriceSell`).textContent = `Sell For ${toWord(gameData[`sell${veg}`], "short")}`;
   }
   document.querySelector(".police-chance").textContent = (gameData.black.catchChance).toFixed(2);
   document.querySelector(".seeds").textContent = `${toWord(gameData.seeds, "short")} Seeds`;
   document.querySelector(".seedsQuick").textContent = `${toWord(gameData.seeds)} Seeds`;
   document.querySelector("#doughnuts").textContent = `${toWord(gameData.doughnuts, "short")} Doughnuts`;
   document.querySelector("#fertilizer").textContent = `${Math.round(gameData.fertilizers)} Fertilizers Click + Place to apply`;
   if (gameData.peasStatus != "Locked") {
      revealgameDataQwk("#peaBushelsQuick", "peas");
      revealgameData("#peaBushels", "peas");
      !vegetablesOwned.includes("peas") ? vegetablesOwned.push("peas") : null;
   } if (gameData.cornStatus != "Locked") {
      revealgameDataQwk("#cornBushelsQuick", "corn");
      revealgameData("#cornBushels", "corn");
      checkTasks("unlockThe_cornPlot");
      document.querySelector(".tm-tb-co").style.opacity = "1";
      !vegetablesOwned.includes("corn") ? vegetablesOwned.push("corn") : null;
   } if (gameData.strawberriesStatus != "Locked") {
      revealgameDataQwk("#strawberryBushelsQuick", "strawberries");
      revealgameData("#strawberryBushels", "strawberries");
      document.querySelector(`.doughnutsAmount`).style.display = "block";
      document.querySelector(`#doughnuts`).textContent = `${toWord(gameData.doughnuts, "short")} Doughnuts`;
      document.querySelector(`.doughnutsAmountQuick`).style.display = "block";
      document.querySelector(`#doughnutsQuick`).textContent = `${toWord(gameData.doughnuts, "short")} Doughnuts`;
      document.querySelector(".tm-tb-st").style.opacity = "1";
      !vegetablesOwned.includes("strawberries") ? vegetablesOwned.push("strawberries") : null;
   } if (gameData.eggplantsStatus != "Locked") {
      revealgameDataQwk("#eggplantBushelsQuick", "eggplants");
      revealgameData("#eggplantBushels", "eggplants");
      document.querySelector(".tm-tb-eg").style.opacity = "1";
      !vegetablesOwned.includes("eggplants") ? vegetablesOwned.push("eggplants") : null;
   } if (gameData.pumpkinsStatus != "Locked") {
      revealgameDataQwk("#pumpkinBushelsQuick", "pumpkins");
      revealgameData("#pumpkinBushels", "pumpkins");
      document.querySelector(".tm-tb-pu").style.opacity = "1";
      !vegetablesOwned.includes("pumpkins") ? vegetablesOwned.push("pumpkins") : null;
   } if (gameData.cabbageStatus != "Locked") {
      revealgameDataQwk("#cabbageBushelsQuick", "cabbage");
      revealgameData("#cabbageBushels", "cabbage");
      document.querySelector(".tm-tb-ca").style.opacity = "1";
      !vegetablesOwned.includes("cabbage") ? vegetablesOwned.push("cabbage") : null;
   } if (gameData.dandelionStatus != "Locked") {
      revealgameDataQwk("#dandelionBushelsQuick", "dandelion");
      revealgameData("#dandelionBushels", "dandelion");
      document.querySelector(".tm-tb-da").style.opacity = "1";
      !vegetablesOwned.includes("dandelion") ? vegetablesOwned.push("dandelion") : null;
   } if (gameData.rhubarbStatus != "Locked") {
      revealgameDataQwk("#rhubarbBushelsQuick", "rhubarb");
      revealgameData("#rhubarbBushels", "rhubarb");
      document.querySelector(".tm-tb-rh").style.opacity = "1";
      !vegetablesOwned.includes("rhubarb") ? vegetablesOwned.push("rhubarb") : null;
   }
   function revealgameData(id, veg) {
      document.querySelector(`.${veg}Amount`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(gameData[veg], "short")} Bushels of ${capitalize(veg)}`; }
   function revealgameDataQwk(id, veg) {
      document.querySelector(`.${veg}AmountQuick`).style.display = "block";
      document.querySelector(id).textContent = `${toWord(gameData[veg], "short")} Bushels of ${capitalize(veg)}`; }
   // To weed or not to weed
   if (Date.now() >= gameData.weedSeason) {
      let myRand = Math.random();
      if (myRand <= .80) { addWeed(); }
      gameData.weedSeason = Date.now() + 1800000;
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
         if (gameData[tD.listOfTasks[i]] === "ready") { array[i] = true; }
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
   if (gameData.helpOpen) { showObj('.help-shadow'); }
   if (gameData.settingsOpen) { showObj('.settingShadow'); }
   if (gameData.marketOpen) { showObj('.marketShadow'); }
   if (gameData.blackMarketOpen) { showObj('.marketShadow'); showObj('.blackMarketShadow'); gameData.marketOpen = true; }
   if (gameData.tasksOpen) { taskBar("close"); }
}
setTimeout(() => { showBuyPlot(); }, 500);

// Create old weeds
setTimeout(() => { for (let i = 0; i < gameData.weedsLeft; i++) { addWeed(true); } }, 500);

// Onload
if (gameData.peasStatus != "Locked") {
   plantLoop("peas", 1, "Peas/growing.png", "Peas/flowering.png", "Peas/fruiting.png");
} if (gameData.cornStatus != "Locked") {
   plantLoop("corn", 2, "growing.png", "Corn/growing.png", "Corn/fruiting.png");
} if (gameData.strawberriesStatus != "Locked") {
   plantLoop("strawberries", 3, "Strawberry/growing.png", "Strawberry/flowering.png", "Strawberry/fruiting.png");
} if (gameData.eggplantsStatus != "Locked") {
   plantLoop("eggplants", 4, "Eggplant/growing.png", "Eggplant/flowering.png", "Eggplant/fruiting.png");
} if (gameData.pumpkinsStatus != "Locked") {
   plantLoop("pumpkins", 6, "growing.png", "Pumpkin/growing.png", "Pumpkin/fruiting.png");
} if (gameData.cabbageStatus != "Locked") {
   plantLoop("cabbage", 7, "growing.png", "Cabbage/growing.png", "Cabbage/fruiting.png");
} if (gameData.dandelionStatus != "Locked") {
   plantLoop("dandelion", 8, "Dandelion/flowering.png", "Dandelion/flowering.png", "Dandelion/fruiting.png");
} if (gameData.rhubarbStatus != "Locked") {
   plantLoop("rhubarb", 9, "growing.png", "Rhubarb/growing.png", "Rhubarb/fruiting.png");
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
function hlpScrl(id) {
   document.querySelector(`#help-${id}`).scrollIntoView();
   $('.help-subjects-item-active').removeClass('help-subjects-item-active');
   $(`.help-subjects-item-${id}`).addClass('help-subjects-item-active');
}
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
// callAlert("A swarm of locusts have eaten all of your cheese! Que the profound weeping!"); // Test alert ;)
function callAlert(text) {
   // Isn't it just great copying the code from other projects?
   let alert = document.querySelector(".alert").cloneNode(true);
   document.querySelector(".alert-box").insertBefore(alert, document.querySelector(".alert-box").firstChild);
   alert.style.display = "block";
   alert.textContent = text;
   setTimeout(alertAnimation => { alert.classList.add('alertAnimation'); }, 6000);
   setTimeout(removeAnimation => { alert.classList.remove('alertAnimation');  alert.remove(); }, 7000);
}
function timeLeft(veg) {
   if (!plantGrowing(veg)) { return; }
   let countDown = document.querySelector(`.${veg}-time-left`);
   let endTime = gameData[`${veg}Status`];
   let secondsLeftms;
   secondsLeftms = endTime - Date.now();
   let secondsLeft = Math.round(secondsLeftms / 1000);
   let hours = Math.floor(secondsLeft / 3600);
   let minutes = Math.floor(secondsLeft / 60) - (hours * 60);
   let seconds = secondsLeft % 60;
   if (secondsLeft < 0) { countDown.textContent = `00:00:00`; return; }
   if (hours < 10) { hours = `0${hours}`; }
   if (minutes < 10) { minutes = `0${minutes}`; }
   if (seconds < 10) { seconds = `0${seconds}`; }
   countDown.textContent = `${hours}:${minutes}:${seconds}`;
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
   if (plantStatus("r-or-e", "peas")) { tend('peas'); }
   if (plantStatus("r-or-e", "corn")) { tend('corn'); }
   if (plantStatus("r-or-e", "strawberries")) { tend('strawberries'); }
   if (plantStatus("r-or-e", "eggplants")) { tend('eggplants'); }
   if (plantStatus("r-or-e", "pumpkins")) { tend('pumpkins'); }
   if (plantStatus("r-or-e", "cabbage")) { tend('cabbage'); }
   if (plantStatus("r-or-e", "dandelion")) { tend('dandelion'); }
   if (plantStatus("r-or-e", "rhubarb")) { tend('rhubarb'); }
}

function taskBar(whatToDo) {
   if (whatToDo === "close") {
      document.querySelector(".tasks").style.left = "0";
      document.querySelector(".taskShadow").style.display = "block";
      gameData.tasksOpen = true;
   }
   else if (whatToDo === "open") {
      document.querySelector(".tasks").style.left = "-80vh";
      document.querySelector(".taskShadow").style.display = "none";
      gameData.tasksOpen = false;
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

let cursorInterval = setInterval(() => {
   if (harvestCursor === "active" && mouseDown === 1) { mouseWasDown = true; }
   if (harvestCursor !== "active") { mouseWasDown = false; }
   if (mouseDown === 0 && mouseWasDown === true) { harvestDrag(); }
   if (plantCursor === "active" && mouseDown === 1) { plntMouseWasDown = true; }
   if (plantCursor !== "active") { plntMouseWasDown = false; }
   if (mouseDown === 0 && plntMouseWasDown === true) { plantDrag(); }
}, 100);

// Harvest and plant drag
$("#plot1").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "peas")) { tend('peas'); }
});
$("#plot2").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "corn")) { tend('corn'); }
});
$("#plot3").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "strawberries")) { tend('strawberries'); }
});
$("#plot4").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "eggplants")) { tend('eggplants'); }
});
$("#plot6").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "pumpkins")) { tend('pumpkins'); }
});
$("#plot7").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "cabbage")) { tend('cabbage'); }
});
$("#plot8").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "dandelion")) { tend('dandelion'); }
});
$("#plot9").mouseenter(() => {
   if (mouseDown === 1 && plantCursor === "active" && plantStatus("r-or-e", "rhubarb")) { tend('rhubarb'); }
});

// Fertilizer Cursor
fertilizerListener(1, "peas");
fertilizerListener(2, "corn");
fertilizerListener(3, "strawberries");
fertilizerListener(4, "eggplants");
fertilizerListener(6, "pumpkins");
fertilizerListener(7, "cabbage");
fertilizerListener(8, "dandelion");
fertilizerListener(9, "rhubarb");

function fertilizerListener(plotNum, veg) {
   document.querySelector(`#plot${plotNum}`).addEventListener("click", event => {
      if (fertilizerCursor === "active" && plantStatus("g-or-e", veg)) { fertilize(veg); fertilizeHover(); }
   });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (gameData.theme === "dark") { darkTheme(); }
   else if (gameData.theme === "light") { lightTheme(); }
   else if (gameData.theme === "random") { randTheme(); }
   else { darkTheme(); }
}
function darkTheme() { document.querySelector(".toolbar").style.backgroundColor = "#111"; gameData.theme = "dark"; }
function randTheme() { document.querySelector(".toolbar").style.backgroundColor = genColor(); gameData.theme = "random"; }
function lightTheme() { document.querySelector(".toolbar").style.backgroundColor = "#f5f5f5"; gameData.theme = "light"; }

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

let saveLoop = window.setInterval(function() { save(); }, 1000);

if (gameData.intro != "finished") { gameData = initGameData; runIntro(); }

function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
   if (areYouSure && areYouReallySure) {
      gameData = initGameData;
      save();
      setTimeout(() => { location.reload(); }, 5000)
   }
}

const initalGameDataKeys = Object.keys(initGameData);
for (key of initalGameDataKeys) { if (gameData[key] === undefined) { gameData[key] = initGameData[key]; } }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// NOT Save
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Load
if (Math.random() > .80) { document.querySelector(".meter").classList.add("red-load"); }
else if (Math.random() > .60) { document.querySelector(".meter").classList.add("orange-load"); }
else if (Math.random() > .40) { document.querySelector(".meter").classList.add("yellow-load"); }
else if (Math.random() > .20) { document.querySelector(".meter").classList.add("green-load"); }
else if (Math.random() > .10) { document.querySelector(".meter").classList.add("blue-load"); }
else { document.querySelector(".meter").classList.add("purple-load"); }

window.addEventListener('load', (event) => {
   gameData.loadtimes.push(Date.now() - timerStart);
   clearInterval(loadbar);
   document.querySelector(".loading-progress").style.width = "100%";
   document.querySelector(".load-display").textContent = "100%";
   setTimeout(() => { $(".cover").hide(); }, 750);
});

let everytime = gameData.loadtime / 100;
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

// Sent to new site
if (location.hostname === "squirrel-314.github.io") { window.location.href = `https://vegetable-dash.herokuapp.com`; }

// Dynamic hover
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
   if (gameData.theme === "light") { hover.classList.add("dynamicHover"); }
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
