/* Copyright July 9th 2023 by Editor Rust */
/* Version 0.1.4 */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Run Immediately on Load
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var start = false;

function loadSave() {
   let saveCheck = JSON.parse(localStorage.getItem("vegetabledashsave"));
   if ((saveCheck == "restarted") || (Object.is(saveCheck, null))) {
      console.log("Starting new game...");
      gameData = initGameData;

      // !! Start setup !!
      const link = document.createElement("link");
      link.href = "Styles/intro.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      gameData = initGameData;
      gameData.disasterTime = Date.now() + 480000;
      gameData.plots.push(new Plot("Empty", "peas"));
   
      init();
      runIntro();
   }
   else {
      console.log("Loading save...");
      // Sets data object to save
      gameData = JSON.parse(localStorage.getItem("vegetabledashsave"));
      init();
   }
}

// Declare the varibles
let randomWeatherNum = (Math.random()).toFixed(2);
let vegetablesOwned = ["peas"];
let offerVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let costVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let rightClickMenu = document.querySelector("#menu").style;

// Active cursor varibles
let mouseDown = 0;
document.body.onmousedown = function() { mouseDown = 1; }
document.body.onmouseup = function() { mouseDown = 0; }
var mouseWasDown = false;
var plntMouseWasDown = false;
let tendCursor = "not active";
let fertilizerCursor = "not active";

// Tasks
tD = rawTaskData;
for (i = 1; i <= 4; i++) { hideObj(`.task-info-button-${i}`); }
// Background Image
let bgImgArr = [["lake-night", "lake-day"], ["mountian-night", "mountian-day"]];
let bgImg = bgImgArr[Math.floor(Math.random() * bgImgArr.length)];

document.onreadystatechange = function () {
   switch (document.readyState) {
      case "interactive":
         loadingbar();
         
         break;
      case "complete":

         

         goAhead();
         function goAhead() {
            clearInterval(pageloadbar);
            document.querySelector(".loading-progress").style.width = "100%";
            document.querySelector(".load-display").textContent = "100%";
            document.querySelector(".cover").remove();
         }
         loadSave();
         break;
   }
}

function init() {
   // Order is kinda important, ex. DynamHov depends on whatTheme
   initPlots();
   openPanels();
   whatTheme();
   saveSetup();
   setupDynamHov();
   cursorInit();
   vegetableCheck();
   checkMarket();
   newBlackOffer();
   generateExchange();
   runLoops();
   contextMenu();
   setupShop();
   // Get coords
   document.addEventListener("mousemove", e => { getCoords(e); });
   // Add old weeds
   for (let i = 0; i < gameData.weedsLeft; i++) { addWeed(true); }

   if (gameData.plots.length == 0) {
      gameData.plots.push(new Plot("Empty", "peas"));
   }
   // Make plots bigger if there are only a few
   if (gameData.plots.length <= 4) {
      document.querySelector(".land").style.gridTemplateAreas = "'auto auto' 'auto auto'";
   }
}

let pageloadbar;
function loadingbar() {
   if (Math.random() > .80) { document.querySelector(".meter").classList.add("red-load"); }
   else if (Math.random() > .60) { document.querySelector(".meter").classList.add("orange-load"); }
   else if (Math.random() > .40) { document.querySelector(".meter").classList.add("yellow-load"); }
   else if (Math.random() > .20) { document.querySelector(".meter").classList.add("green-load"); }
   else if (Math.random() > .10) { document.querySelector(".meter").classList.add("blue-load"); }
   else { document.querySelector(".meter").classList.add("purple-load"); }
   
   let loadProgress = 0;
   pageloadbar = setInterval(() => {
      loadProgress += 2;
      document.querySelector("#page-loading-bar").style.width = loadProgress + "%";
      document.querySelector(".load-display").textContent = loadProgress + "%";
      if (loadProgress >= 100) { clearInterval(pageloadbar); }
   }, 30);
}
function openPanels() {
   if (gameData.settingsOpen) { showObj('.settingShadow'); }
   if (gameData.marketOpen) { showObj('.marketShadow'); }
   if (gameData.blackMarketOpen) { showObj('.marketShadow'); showObj('.blackMarketShadow'); gameData.marketOpen = true; }
   if (gameData.tasksOpen) { taskBar("close"); }
   if (gameData.shopOpen) { toggleWindow('shop'); }
   if (gameData.genelabOpen) { toggleWindow('genelab'); }
}
function cursorInit() {
   setInterval(() => {
      gameData.plots.forEach((val, i, arr) => {
         let veg = val.plant;
         document.querySelector(`#plot${i}`).addEventListener("click", event => {
            if (fertilizerCursor === "active" && arr[i].isGrowing()) { fertilize(i, veg); fertilizeHover(); }
         });
         document.querySelector(`#plot${i}`).addEventListener("mouseenter", event => {
            if (mouseDown === 1 && tendCursor === "active" && !arr[i].isGrowing()) { tendTo(i, veg); }
         });
      });
   }, 1000);
}
function setupDynamHov() {
   dynamHov = document.createElement("SPAN");
   document.body.appendChild(dynamHov);
   dynamHov.style.position = "fixed";
   dynamHov.classList.add("dynamicHover");
}
function saveSetup() {
   // For keeping Infinity the same after saving
   const replacer = (key, value) => {
      if (value instanceof Function) { return value.toString(); }
      else if (value === NaN) { return 'NaN'; }
      else if (value === Infinity) { return 'Infinity'; }
      else if (typeof value === 'undefined') { return 'undefined'; }
      else { return value; }
   }

   const initalGameDataKeys = Object.keys(initGameData);
   for (key of initalGameDataKeys) { if (gameData[key] === undefined) { gameData[key] = initGameData[key]; } }
}
function setupShop() {
   if (gameData.plantSeeds.length < 8) {
      document.querySelectorAll(".buy-plots-seeds")[0].style.display = "inline-block";
      document.querySelector(".buy-seeds-image").src = `Images/Vegetables/${gameData.plotPlants[0]}.png`;
      document.querySelector(".buy-seeds-button").textContent = `Buy ${gameData.plotPlants[0]} seeds for ${gameInfo[gameData.plotPlants[0] + "Seeds"]} coins!`;
      document.querySelector(".buy-seeds-button").onclick = () => {
         if (gameData.coins >= gameInfo[gameData.plotPlants[0] + "Seeds"]) {
            let plant = gameData.plotPlants.shift();
            gameData.coins -= gameInfo[plant + "Seeds"];
            gameData.plantSeeds.push(plant);
            save();
            location.reload();
         }
      };   
   }
   if (gameData.plots.length <= 9) {
      document.querySelectorAll(".buy-plots-seeds")[1].style.display = "inline-block";
      document.querySelector(".buy-plots-image").src = "./Images/Plots/plot.png";
      document.querySelector(".buy-plots-button").textContent = `Buy a new plot for ${gameData.plotPrices[0]} coins!`;
      document.querySelector(".buy-plots-button").onclick = () => {
         if (gameData.coins >= gameData.plotPrices[0]) {
            gameData.coins -= gameData.plotPrices.shift();
            gameData.plots.push(new Plot("Empty", gameData.plantSeeds[gameData.plantSeeds.length - 1]));
            save();
            location.reload();
         }
      };
   }
}

// Saves the game
function save() {
   localStorage.setItem("vegetabledashsave", JSON.stringify(gameData));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Loops
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Reduce and consolidate loops

function runLoops() {
   let oneSecondLoop = setInterval(() => {
      save();
      displayWeatherTimeLeft();
      incidents();
      checkForTasks();
      mainLoop();
      vegetableCheck();
   }, 1000);
   let hundremMSLoop = setInterval(function() {
      weatherEffects();
      // Cursors
      if (tendCursor === "active" && mouseDown === 1) { plntMouseWasDown = true; }
      if (tendCursor !== "active") { plntMouseWasDown = false; }
      if (mouseDown === 0 && plntMouseWasDown === true) { tendDrag(); }
   }, 100);
   let fivehundredMSLoop = setInterval(function() {
      giveTasks();
      showTasks();
      updateMarket();
      checkMarket();
      updateMainValues();
   }, 500);
}

function mainLoop() {
   const hours = new Date().getHours();
   if (hours > 6 && hours < 20) { document.body.style.backgroundImage = `url('Images/Background/${bgImg[1]}.svg')`; }
   else { document.body.style.backgroundImage = `url('Images/Background/${bgImg[0]}.svg')`; }
   document.querySelector(".police-chance").textContent = (gameData.black.catchChance).toFixed(2);
   document.querySelector("#doughnuts").textContent = `${toWord(gameData.doughnuts, "short")} Doughnuts`;
   document.querySelector("#fertilizer").dataset.info = `${Math.round(gameData.fertilizers)} bags of Fertilizers <br> Click + Place to apply`;
}
function vegetableCheck() {
   if (seedOwned("peas")) {
      updateDisplay("peas");
      !vegetablesOwned.includes("peas") ? vegetablesOwned.push("peas") : null;
   } if (seedOwned("corn")) {
      updateDisplay("corn");
      checkTasks("unlockThe_cornPlot");
      !vegetablesOwned.includes("corn") ? vegetablesOwned.push("corn") : null;
   } if (seedOwned("strawberries")) {
      updateDisplay("strawberries");
      updateDisplay("doughnuts");
      !vegetablesOwned.includes("strawberries") ? vegetablesOwned.push("strawberries") : null;
   } if (seedOwned("eggplants")) {
      updateDisplay("eggplants");
      !vegetablesOwned.includes("eggplants") ? vegetablesOwned.push("eggplants") : null;
   } if (seedOwned("pumpkins")) {
      updateDisplay("pumpkins");
      !vegetablesOwned.includes("pumpkins") ? vegetablesOwned.push("pumpkins") : null;
   } if (seedOwned("cabbage")) {
      updateDisplay("cabbage");
      !vegetablesOwned.includes("cabbage") ? vegetablesOwned.push("cabbage") : null;
   } if (seedOwned("dandelion")) {
      updateDisplay("dandelion");
      !vegetablesOwned.includes("dandelion") ? vegetablesOwned.push("dandelion") : null;
   } if (seedOwned("rhubarb")) {
      updateDisplay("rhubarb");
      !vegetablesOwned.includes("rhubarb") ? vegetablesOwned.push("rhubarb") : null;
   }
}
function weatherEffects() {
   if (gameData.weather === "sunny") { gameData.marketResetBonus = 0.03; }
   else { gameData.marketResetBonus = 0; }
   if (gameData.weather === "snowy" && gameData.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] / 3);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      notify(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.hasBeenPunished = true;
   }
   if (gameData.weather === "flood" && gameData.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] / 5);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      notify(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.hasBeenPunished = true;
   }
   if (gameData.weather === "frost" && gameData.hasBeenPunished === false) {
      gameData.plots.forEach((val, i, arr) => {
         if (arr[i].isGrowing() && Math.random() > .5) {
            arr[i].status = "withered";
            showObj(`.btn${i}`);
         }
      });
      gameData.hasBeenPunished = true;
   }
   // Choose next weathertime
   if (Date.now() >= gameData.newWeatherTime) {
      gameData.lastWeather = gameData.weather;
      gameData.weather = gameData.nextWeather;
      chooseWeather();
      gameData.newWeatherTime = Date.now() + 360000; // 6 Minutes (360000)
   }
   // Update Display
   if (gameData.weather === "sunny") { weatherDisplay("Sunny", "Benefits: +3% market reset harvest chance", "sunny.svg"); }
   if (gameData.weather === "rainy") { weatherDisplay("Rainy", "Benefits: +1 produce", "rain.svg"); }
   if (gameData.weather === "partlyCloudy") { weatherDisplay("Partly Cloudy", "Effects: None", "overcast.svg"); }
   if (gameData.weather === "partlySunny") { weatherDisplay("Partly Sunny", "Effects: None", "partly-cloudy.svg"); }
   if (gameData.weather === "snowy") { weatherDisplay("Snowy", "Detriments: -1/3% of a stored vegetable", "snow.svg"); }
   if (gameData.weather === "cloudy") { weatherDisplay("Cloudy", "Detriments: +25% growing time", "cloudy.svg"); }
   if (gameData.weather === "frost") { weatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (gameData.weather === "flood") { weatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }
   if (gameData.lastWeather === "sunny") { lastWeather("sunny.svg"); }
   if (gameData.lastWeather === "rainy") { lastWeather("rain.svg"); }
   if (gameData.lastWeather === "partlyCloudy") { lastWeather("overcast.svg"); }
   if (gameData.lastWeather === "partlySunny") { lastWeather("partly-cloudy.svg"); }
   if (gameData.lastWeather === "snowy") { lastWeather("snow.svg"); }
   if (gameData.lastWeather === "cloudy") { lastWeather("cloudy.svg"); }
   if (gameData.lastWeather === "frost") { lastWeather("frost.svg"); }
   if (gameData.lastWeather === "flood") { lastWeather("flood.svg"); }
   if (gameData.nextWeather === "sunny") { nextWeather("sunny.svg"); }
   if (gameData.nextWeather === "rainy") { nextWeather("rain.svg"); }
   if (gameData.nextWeather === "partlyCloudy") { nextWeather("overcast.svg"); }
   if (gameData.nextWeather === "partlySunny") { nextWeather("partly-cloudy.svg"); }
   if (gameData.nextWeather === "snowy") { nextWeather("snow.svg"); }
   if (gameData.nextWeather === "cloudy") { nextWeather("cloudy.svg"); }
   if (gameData.nextWeather === "frost") { nextWeather("frost.svg"); }
   if (gameData.nextWeather === "flood") { nextWeather("flood.svg"); }
   function lastWeather(url) { document.querySelector(".weather-last").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function nextWeather(url) { document.querySelector(".weather-next").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function weatherDisplay(weather, text, url) {
      document.querySelector(".weather-name").textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`;
   }
}
function displayWeatherTimeLeft() {
   let secondsLeft = Math.round((gameData.newWeatherTime - Date.now()) / 1000);
   let minutes = Math.floor(secondsLeft / 60) - (Math.floor(secondsLeft / 3600) * 60);
   let seconds = secondsLeft % 60;
   if (seconds < 10) { seconds = `0${seconds}`; }
   document.querySelector(".weather-time").textContent = `Next Weather: ${minutes}:${seconds}`;
}
function incidents() {
   // Disaster Time!
   if (Date.now() >= gameData.disasterTime) { luckyRoll(); gameData.disasterTime = Date.now() + 480000; }
   // To weed or not to weed
   if (Date.now() >= gameData.weedSeason) {
      let myRand = Math.random();
      if (myRand <= .80) { addWeed(); }
      gameData.weedSeason = Date.now() + 1800000;
   }  
}
function checkForTasks() {
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
}
function updateMainValues() {
   document.querySelector(".main-values-coins").textContent = `${Math.round(gameData.coins)} Coins`;
   document.querySelector(".main-values-genes").textContent = `${Math.round(gameData.genes)} Genes`;
}
function updateDisplay(veg) {
   let displayParents = document.querySelectorAll(`.${veg}Display`);
   displayParents.forEach((val, i, arr) => {
      document.querySelectorAll(`.${veg}Display`)[i].style.display = "block";
   });
   let displays = document.querySelectorAll(`.${veg}`);
   displays.forEach((val, i, arr) => {
      document.querySelectorAll(`.${veg}`)[i].textContent = `${toWord(gameData[veg], "short")} Bushels of ${capitalize(veg)}`;
   });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function diff(n, x) { return n / x; }
function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function commas(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function random(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function scrollToSection(id) { document.getElementById(id).scrollIntoView(); }
function reverseString(str) {
   let splitString = str.split("");
   return splitString.reverse().join("");
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
function notify(text) {
   let alert = document.querySelector(".alert").cloneNode(true);
   document.querySelector(".alert-box").insertBefore(alert, document.querySelector(".alert-box").firstChild);
   alert.style.display = "block";
   alert.textContent = text;
   let removeAnimation = setTimeout(alertAnimation => { alert.classList.add("alertAnimation"); }, 6000);
   let removeElement = setTimeout(removeAnimation => { alert.classList.remove("alertAnimation"); alert.remove(); }, 7000);
   alert.onclick = () => {
      alert.classList.add("alertAnimation");
      setTimeout(removeAnimation => { alert.remove(); }, 1000);
      clearTimeout(removeAnimation);
      clearTimeout(removeElement);
   };
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
function findAvg(array) {
   let total = 0;
   for(let i = 0; i < array.length; i++) { total += array[i]; }
   return total / array.length;
}
function seedOwned(veg) {
   if (gameData.plantSeeds.includes(veg)) { return true; }
   else { return false; }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Weather
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
   if (weatherChance(0, .15) === true) { gameData.nextWeather = "sunny"; }
   if (weatherChance(.15, .30) === true) { gameData.nextWeather = "rainy"; }
   if (weatherChance(.30, .55) === true) { gameData.nextWeather = "partlySunny"; }
   if (weatherChance(.55, .80) === true) { gameData.nextWeather = "partlyCloudy"; }
   if (weatherChance(.80, .85) === true) { gameData.nextWeather = "snowy"; }
   if (weatherChance(.85, .93) === true) { gameData.nextWeather = "cloudy"; }
   if (weatherChance(.93, .95) === true) { gameData.nextWeather = "frost"; }
   if (weatherChance(.95, 1.01) === true) { gameData.nextWeather = "flood"; }
   if (gameData.weather === "snowy" || "frost" || "flood") { gameData.hasBeenPunished = false; }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function harvestLuck(veg) {
   if (Math.random() < 0.10) {
      gameData[veg] += 2;
      fadeTextAppear(`A bumper crop! You collected \n 2 extra ${capitalize(veg)}!`, "#00de88");
   }
   if (Math.random() < (0.05 + gameData.marketResetBonus)) {
      gameData.marketResets++;
      fadeTextAppear(`You found a market reset!`, "#00de88");
   }
   if (Math.random() < 0.30) {
      let luckDNA = random(1, 4);
      gameData.genes += luckDNA;
      fadeTextAppear(`You extracted ${luckDNA} genes while harvesting!`, "#00de88");
   }
}
function marketLuck() {
   if (Math.random() < 0.01) {
      gameData.marketResets++;
      notify(`You collected a market reset! You now have ${gameData.marketResets}`);
   }
}
function blackMarketLuck() {
   if (Math.random() < gameData.black.catchChance) {
      notify("The police caught you! You were fined 6000 coins");
      gameData.coins -= 6000;
   }
}
function luckyRoll() {
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(gameData[vegLost] / 3);
   if (Math.random() < .08) {
      gameData[vegLost] -= amountLost;
      notify(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
    }
    if (Math.random() < .02) {
      gameData[vegLost] -= amountLost;
      notify(`A hacker has hacked your account (not really)! You lost ${amountLost} of your ${vegLost}!`);
    }
}

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
      notify(`You made 1 fertilizer out of the composted weed fragments!`);
   }
   else { notify(`You collected a weed fragment! You now have ${gameData.weedPieces}/5`); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Active Cursors
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function tendDrag() {
   if (tendCursor === "active") {
      tendCursor = "not active";
      document.querySelector(".land").style.cursor = "auto";
   }
   else {
      tendCursor = "active";
      document.querySelector(".land").style.cursor = "url('Images/Cursors/sickle.png'), auto";
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Theme
function whatTheme() {
   if (gameData.theme === "dark") { darkTheme(); }
   else if (gameData.theme === "light") { lightTheme(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.documentElement.style.setProperty("--background-blurbox-color", "#00000088"); gameData.theme = "dark";
   document.documentElement.style.setProperty("--theme-color", "#2b2b2b"); gameData.theme = "dark";
   document.documentElement.style.setProperty("--text-color", "#f5f5f5"); gameData.theme = "dark";
}
function lightTheme() {
   document.documentElement.style.setProperty("--background-blurbox-color", "#ffffff30"); gameData.theme = "light";
   document.documentElement.style.setProperty("--theme-color", "#f5f5f5"); gameData.theme = "light";
   document.documentElement.style.setProperty("--text-color", "#2b2b2b"); gameData.theme = "light";
}

// RESTART
function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure) {
      let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure) {
         gameData = "restarted";
         save();
         location.reload();
      }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// General
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function fadeTextAppear(txt, txtColor) {
   let newText = document.createElement("P");
   newText.textContent = txt;
   newText.classList.add("plant-luck-text");
   document.querySelector(".plant-harvest-luck").appendChild(newText);
   newText.style.color = txtColor;
   setTimeout(() => { newText.remove(); }, 6000);
}

// Task Effect
let openTaskHov = [];
let openTaskUnHov = [];
function taskHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).classList.add("task-block-active");
   }, 750);
}
function taskUnHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskUnHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).classList.remove("task-block-active");
   }, 250);
}

// Modals
function plotUnlockedModal(veg) {
   if (document.querySelector(`#info${veg}`).style.opacity === "1") { hideObj(`#info${veg}`); }
   else { showObj(`#info${veg}`); }
}

// Context Menu
function contextMenu() {
   document.addEventListener("contextmenu", function(e) {
      let posX = e.clientX;
      let posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   }, false);
   document.addEventListener("click", function(e) {
      rightClickMenu.display = "none";
   }, false);
}
function menu(x, y) {
   rightClickMenu.top = y + "px";
   rightClickMenu.left = x + "px";
   rightClickMenu.display = "block";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function aEL(key, func) {
   document.addEventListener("keyup", function(event) {
      event.preventDefault(); if (event.shiftKey && event.keyCode === key) { func(); }
   });
}

// Update changes for users!!!
aEL(84, taskBar); // Shift + Q
aEL(83, settingModal); // Shift + S
aEL(80, tendDrag); // Shift + T
aEL(70, fertilizeHover); // Shift + F
aEL(77, toggleMarket); // Shift + M
aEL(65, tendAll); // Shift + A

// Quick double click menu
let pressCount = 0;
let quickInformation = "closed";
let quickInfoMenu = document.querySelector(".qIM");
document.addEventListener("keyup", function(event) {
   if (event.key === "Shift") {
      pressCount++;
      setTimeout(() => {
         if (pressCount >= 2) {
            if (quickInformation === "closed") {
               quickInfoMenu.style.display = "block";
               quickInformation = "opened";
               var updateMovingInfo = setInterval(() => {
                  quickInfoMenu.style.top = `${mouseY + 15}px`;
                  quickInfoMenu.style.left = `${mouseX + 15}px`;
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

// Other
function tendAll() {
   gameData.plots.forEach((val, i, arr) => {
      if (!val.isGrowing()) { tendTo(i, val.plant); }
   });
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
function settingModal() {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
}
function toggleMarket() {
   if (document.querySelector(".marketShadow").style.opacity === "0") { showObj(".marketShadow"); }
   else { hideObj(".marketShadow"); }
}

function fertilize(i, veg) {
   if (gameData.fertilizers >= 1) {
      gameData.fertilizers -= 1;
      gameData.plots[i].status = "Ready";
      gameData.plots[i].bushels++;
      checkTasks("tryFertilizer");
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dynamic hover
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var dynamHov = document.querySelector(".dynamic-hover");
function info(THIS) {
   dynamHov.innerHTML = THIS.dataset.info;
   let updateHovText = setInterval(() => {
      dynamHov.innerHTML = THIS.dataset.info;
   }, 200);
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => {
      dynamHov.style.opacity = "0";
      clearInterval(updateHovText);
   }
}

// Dynamic hover
var hover;
var mouseX;
var mouseY;
function getCoords(e) {
   mouseX = e.clientX;
   mouseY = e.clientY;
   dynamHov.style.left = mouseX + 15 + "px";
   dynamHov.style.top = mouseY + "px";
}
