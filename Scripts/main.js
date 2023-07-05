/* Copyright November 4th 2021 by Editor Rust
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Loops
Immeditly Run
Static Functions
*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Run Immediately on Load
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// These functions are run when the game loads, making it easier to find bugs
var playerName = "bro";
var start = false;
gameData = localStorage.getItem("vegetabledashsave");
// gameData.intro = "not started";

// Declare the varibles
let reloader;
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
   console.log(document.readyState);
   switch (document.readyState) {
      case "interactive":
         loadingbar();
         break;
      case "complete":
         console.log("complete");
         goAhead();
         function goAhead() {
            if (gameData == undefined || gameData == null || gameData.intro !== "finished") {
               reloader = false;
               $("head").append('<link rel="stylesheet" type="text/css" href="Styles/intro.css">');
               runIntro();
            }
            
            console.log(`hi ${playerName}`);
            clearInterval(loadbar);
            document.querySelector(".loading-progress").style.width = "100%";
            document.querySelector(".load-display").textContent = "100%";
            setTimeout(() => { $(".cover").hide(); }, 500);
            init();
         }
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
}

let loadbar;
function loadingbar() {
   if (Math.random() > .80) { document.querySelector(".meter").classList.add("red-load"); }
   else if (Math.random() > .60) { document.querySelector(".meter").classList.add("orange-load"); }
   else if (Math.random() > .40) { document.querySelector(".meter").classList.add("yellow-load"); }
   else if (Math.random() > .20) { document.querySelector(".meter").classList.add("green-load"); }
   else if (Math.random() > .10) { document.querySelector(".meter").classList.add("blue-load"); }
   else { document.querySelector(".meter").classList.add("purple-load"); }
   
   let everytime = 2222 / 100;
   let loadProgress = 0;
   loadbar = setInterval(() => {
      loadProgress += 3;
      document.querySelector(".loading-progress").style.width = loadProgress + "%";
      document.querySelector(".load-display").textContent = loadProgress + "%";
      if (loadProgress >= 97) { clearInterval(loadbar); }
   }, everytime);
   
   $(".meter > span").each(function () {
      $(this)
      .data("origWidth", $(this).width())
      .width(0)
      .animate( { width: $(this).data("origWidth") }, 1 );
   });
}
function openPanels() {
   if (gameData.helpOpen) { showObj('.help-shadow'); }
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
         $(`#plot${i}`).mouseenter(() => {
            if (mouseDown === 1 && tendCursor === "active" && !arr[i].isGrowing()) { tendTo(i, veg); }
         });
      });
   }, 1000);
}
function setupDynamHov() {
   dynamHov = document.createElement("SPAN");
   document.body.appendChild(dynamHov);
   dynamHov.style.position = "fixed";
   if (gameData.theme === "light") { dynamHov.classList.add("dynamicHover"); }
   else { dynamHov.classList.add("dynamicHoverDark"); }
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
            reloader = true;
            save();
         }
      };   
   }
   if (gameData.plots.length <= 9) {
      document.querySelectorAll(".buy-plots-seeds")[1].style.display = "inline-block";
      document.querySelector(".buy-plots-image").src = "./Images/Plots/plot.png";
      document.querySelector(".buy-plots-button").textContent = `Buy a new plot for ${gameData.plotPrices[0]}`;
      document.querySelector(".buy-plots-button").onclick = () => {
         if (gameData.coins >= gameData.plotPrices[0]) {
            gameData.coins -= gameData.plotPrices.shift();
            gameData.plots.push(new Plot("Empty", gameData.plantSeeds[gameData.plantSeeds.length - 1]));
            reloader = true;
            save();
         }
      };
   }
}

// Save's up here just 'cause it's important (I know that grammer isn't proper, but neither is this executive decision)
function save() {
   let saveJSON = JSON.stringify(gameData);
   localStorage.setItem("vegetabledashsave", saveJSON);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Loops
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// These are the loops, so useful but always causing trouble. Maybe make less of them?

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
   if (hours > 6 && hours < 20) { document.body.style.backgroundImage = `url('./Images/Background/${bgImg[1]}.svg')`; }
   else { document.body.style.backgroundImage = `url('./Images/Background/${bgImg[0]}.svg')`; }
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
      document.querySelector(".tm-tb-co").style.opacity = "1";
      !vegetablesOwned.includes("corn") ? vegetablesOwned.push("corn") : null;
   } if (seedOwned("strawberries")) {
      updateDisplay("strawberries");
      updateDisplay("doughnuts");
      document.querySelector(".tm-tb-st").style.opacity = "1";
      !vegetablesOwned.includes("strawberries") ? vegetablesOwned.push("strawberries") : null;
   } if (seedOwned("eggplants")) {
      updateDisplay("eggplants");
      document.querySelector(".tm-tb-eg").style.opacity = "1";
      !vegetablesOwned.includes("eggplants") ? vegetablesOwned.push("eggplants") : null;
   } if (seedOwned("pumpkins")) {
      updateDisplay("pumpkins");
      document.querySelector(".tm-tb-pu").style.opacity = "1";
      !vegetablesOwned.includes("pumpkins") ? vegetablesOwned.push("pumpkins") : null;
   } if (seedOwned("cabbage")) {
      updateDisplay("cabbage");
      document.querySelector(".tm-tb-ca").style.opacity = "1";
      !vegetablesOwned.includes("cabbage") ? vegetablesOwned.push("cabbage") : null;
   } if (seedOwned("dandelion")) {
      updateDisplay("dandelion");
      document.querySelector(".tm-tb-da").style.opacity = "1";
      !vegetablesOwned.includes("dandelion") ? vegetablesOwned.push("dandelion") : null;
   } if (seedOwned("rhubarb")) {
      updateDisplay("rhubarb");
      document.querySelector(".tm-tb-rh").style.opacity = "1";
      !vegetablesOwned.includes("rhubarb") ? vegetablesOwned.push("rhubarb") : null;
   }
}
function weatherEffects() {
   if (gameData.weather === "sunny") { gameData.marketResetBonus = 0.03; }
   else { gameData.marketResetBonus = 0; }
   if (gameData.weather === "snowy" && gameData.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] /= 3);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      callAlert(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.hasBeenPunished = true;
   }
   if (gameData.weather === "flood" && gameData.hasBeenPunished === false) {
      let unluckyVeg = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] /= 5);
      if (amountLost > 0) { gameData[unluckyVeg] - amountLost; }
      callAlert(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
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
//
// Static Functions
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// All the functions that aren't run immediatly (at least not hear)
// This helps with debugging

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
function callAlert(text) {
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
// Market
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function checkMarket() {
   let marketItem = document.getElementsByClassName("market-item");
   marketItem[10].style.display = "block";
   marketItem[0].style.display = "inline-block";
   if (seedOwned("corn")) { marketItem[1].style.display = "inline-block"; marketItem[8].style.display = "block"; }
   if (seedOwned("strawberries")) { marketItem[2].style.display = "inline-block"; marketItem[9].style.display = "block"; }
   if (seedOwned("eggplants")) { marketItem[3].style.display = "inline-block"; }
   if (seedOwned("pumpkins")) { marketItem[4].style.display = "inline-block"; }
   if (seedOwned("cabbage")) { marketItem[5].style.display = "inline-block"; }
   if (seedOwned("dandelion")) { marketItem[6].style.display = "inline-block"; }
   if (seedOwned("rhubarb")) { marketItem[7].style.display = "inline-block"; }
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
      document.querySelector(`.${veg.toLowerCase()}-market-item`).textContent = `${veg} \r\n ${toWord(gameData[veg.toLowerCase()])}`;
      document.querySelector(`.${veg.toLowerCase()}-buy`).dataset.info = `Buy for ${toWord(gameData["buy" + veg], "short")}`;
      document.querySelector(`.${veg.toLowerCase()}-sell`).dataset.info = `Sell for ${toWord(gameData["sell" + veg], "short")}`;

   }
   document.querySelector(".market-resets").textContent = `You have ${gameData.marketResets}`;
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
function buyProduce(produce) {
   let produceCase = capitalize(produce);
   if (event.ctrlKey && gameData.coins >= calcInflation(10)) {
      for (i = 0; i < 10; i++) { buy(); } marketLuck();
   }
   else if (event.shiftKey && gameData.coins >= calcInflation(5)) {
      for (i = 0; i < 5; i++) { buy(); } marketLuck();
   }
   else if (gameData.coins >= gameData["buy" + produceCase]) { buy(); marketLuck(); }
   else { fadeTextAppear(`Not enough coins`, false, "#de0000"); }
   function buy() {
      gameData[produce] += 5;
      gameData.coins -= Math.round(gameData["buy" + produceCase]);
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
function sellProduce(produce) {
   let produceCase = capitalize(produce);
   if (event.ctrlKey && gameData[produce] >= 50) {
      for (i = 0; i < 10; i++) { sell(); } marketLuck();
   }
   else if (event.shiftKey && gameData[produce] >= 25) {
      for (i = 0; i < 5; i++) { sell(); } marketLuck();
   }
   else if (gameData[produce] >= 5) { sell(); marketLuck(); }
   else { fadeTextAppear(`Not enough produce`, false, "#de0000"); }
   function sell() {
      gameData[produce] -= 5;
      gameData.coins += Math.round(gameData["sell" + produceCase]);
      gameData["buy" + produceCase] *= 0.98;
      gameData["sell" + produceCase] *= 0.92;
   }
}

// Market Exchanges
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
   else { fadeTextAppear(`Not enough produce`, false, "#de0000"); }
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
   if (gameData.coins >= gameData.black.cost) {
      gameData.coins -= gameData.black.cost;
      blackMarketValues();
      blackMarketLuck();
      newBlackOffer();
      gameData.black.catchChance += .01;
      if (gameData.black.item === "Market Resets") { gameData.marketResets += gameData.black.quantity; }
      if (gameData.black.item === "Fertilizer") { gameData.fertilizers += gameData.black.quantity; }
      if (gameData.black.item === "Doughnuts") { gameData.doughnuts += gameData.black.quantity; }
      checkTasks("seeBlackMarket");
   }
   else { fadeTextAppear(`Not enough coins`, false, "#de0000"); }
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
      fadeTextAppear(`-1 Doughnut`, false, "#de0000");
      checkTasks("tryPoliceDoughnuts");
   }
   else { fadeTextAppear(`Not enough doughnuts`, false, "#de0000"); }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
   if (seedOwned("pumpkins")) { gameData.bakeSale = "progressing"; }
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
         if (seedOwned(gameData[conditions["c3"][0]])) { trueList.is4 = true; }
      } else { trueList.is4 = false; }
      if (trueList.is1 && trueList.is2 && trueList.is3 && trueList.is4) { return true; }
      else { return false; }
   }
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
      fadeTextAppear(`A bumper crop! You collected \n 2 extra ${capitalize(veg)}!`, "vegLuck", "#00de88");
   }
   if (Math.random() < (0.05 + gameData.marketResetBonus)) {
      gameData.marketResets++;
      fadeTextAppear(`You found a market \n reset (${gameData.marketResets} total) while harvesting your ${veg} plot!`, "vegLuck", "#00de88");
   }
   if (Math.random() < 0.30) {
      let luckDNA = random(1, 4);
      gameData.genes += luckDNA;
      fadeTextAppear(`You extracted ${luckDNA} DNA while harvesting you ${veg} plot!`, "vegLuck", "#00de88");
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
      callAlert("The police caught you! You were fined 6000 coins");
      gameData.coins -= 6000;
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
   else if (gameData.theme === "random") { randTheme(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.querySelector(".toolbar").style.backgroundColor = "#111"; gameData.theme = "dark";
}
function randTheme() {
   document.querySelector(".toolbar").style.backgroundColor = genColor(); gameData.theme = "random";
}
function lightTheme() {
   document.querySelector(".toolbar").style.backgroundColor = "#f5f5f5"; gameData.theme = "light";
}

// RESTART
function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure) {
      let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure) {
         gameData = initGameData;
         reloader = true;
         save();
      }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function runIntro() {
   gameData = initGameData;
   gameData.disasterTime = Date.now() + 480000;
   gameData.plots.push(new Plot("Empty", "peas"));
   showObj(".welcome");
   chooseWeather();
   blackMarketValues();
   newBlackOffer();
   save();
}
function goIntro() {
   introData = { hello: false, meetGramps: false, planting: false, gameDataBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
   hideObj(".welcome");
   showObj(".introDarkShadow");
   intro();
}
function intro() {
   let introText = document.querySelector(".intro-text");
   if (introData.hello === false) { introData.hello = true; }
   else {
      if (introData.meetGramps === false) {
         $(".intro-img").attr("src", "Images/Tasks/jenkins.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. My son, Farmer Jebidiah, wants me to teach you how to run a farm. Let's begin!";
         introData.meetGramps = true;
      } else {
         if (introData.planting === false) {
            introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press that little almanac button, choose your seed, and when it's done, press Harvest!";
            document.getElementById("plot0").style.zIndex = "100000";
            introData.planting = true;
         } else {
            if (introData.gameDataBar === false) {
               $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
               introText.textContent = "This toolbar shows the amount of produce you have, holds the fertilizer for growing plants quickly, and the sickle for harvesting.";
               document.getElementById("plot0").style.zIndex = "0";
               document.querySelector(".toolbar").style.zIndex = "100000";
               introData.gameDataBar = true;
            } else {
               if (introData.weather === false) {
                  $(".intro-img").attr("src", "Images/Tasks/jenkins.png");
                  introText.textContent = "Keep an eye on the weather, because it will affect you plants! Sometimes it will help, while other times it could ruin your crop!";
                  document.querySelector(".toolbar").style.zIndex = "0";
                  document.querySelector(".weather-short").style.zIndex = "100000";
                  introData.weather = true;
               } else {
                  if (introData.meetGran === false) {
                     $(".intro-img").attr("src", "Images/Tasks/granny.png");
                     introText.textContent = "Nice to meet you! I'm Grandma Josephine, and I'll teach you the economics of running a farm.";
                     document.querySelector(".weather-short").style.zIndex = "0";
                     introData.meetGran = true;
                  } else {
                     if (introData.market === false) {
                        introText.textContent = "This is the market, were you can gain coins by selling produce, which are useful for many things, like opening more plots.";
                        showObj(".marketShadow"); gameData.marketOpen = true;
                        introData.market = true;
                     }
                     else {
                        if (introData.tasks === false) {
                           $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
                           introText.textContent = "This is your tasklist, where you can get rewards for doing chores around the farm.";
                           hideObj(".marketShadow"); gameData.marketOpen = false;
                           taskBar("close");
                           introData.tasks = true;
                        }
                        else {
                           if (introData.help === false) {
                              $(".intro-img").attr("src", "Images/Tasks/farmer.svg");
                              introText.textContent = "That's it! If you need more help, just check out the small help icon in the top left corner. Be sure to check out the shortcuts section for helpful tips!";
                              document.querySelector(".tasks").style.zIndex = "0";
                              taskBar("open");
                              introData.help = true;
                           }
                           else { location.reload(); }
                        }
                     }
                  }
               }
            }
         }
      }
   }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dynamic hover
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function info(THIS) {
   dynamHov.innerHTML = THIS.dataset.info;
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => { dynamHov.style.opacity = "0"; }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// General
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function fadeTextAppear(txt, extraClass, txtColor) {
   let fadeText = document.querySelector(".fade-text").cloneNode();
   fadeText.textContent = txt;
   document.querySelector("body").appendChild(fadeText);
   if (extraClass != false) { fadeText.classList.add(extraClass); }
   if (txtColor) {
      fadeText.style.color = txtColor;
      fadeText.style.textShadow = `0 0 .2vh ${txtColor}`;
   }
   fadeText.style.left = `${mouseX}px`;
   fadeText.style.top = `${mouseY}px`;
}

$('.help-subjects-item').click(function () {
   $('.help-subjects-item-active').removeClass("help-subjects-item-active");
   $(this).addClass("help-subjects-item-active");
});

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function fertilize(i, veg) {
   if (gameData.fertilizers >= 1) {
      gameData.fertilizers -= 1;
      gameData.plots[i].status = "Ready";
      gameData.plots[i].bushels++;
      checkTasks("tryFertilizer");
   }
}

class Plot {
   constructor(state, plant) {
      this.status = state;
      this.plant = plant;
      this.bushels = 1;
      // Traits - coming, SOOOOOOOOON!
      // this.firstBoon;
      // this.secndBoon;
      // this.thirdBoon;
   }
   getState() {
      if (this.status == "Ready") { return "Ready"; }
      if (this.status == "Empty") { return "Empty"; }
      if (this.status == "withered") { return "withered"; }
   }
   isGrowing() {
      if (["Ready", "Empty", "withered"].includes(this.status)) { return false; }
      else { return true; }
}
   harvestReady() {
      if (this.status == "Ready") { return true; }
      else { return false; }
   }
   onChange(func) {
      let oldPlant = this.plant;
      setInterval(() => {
         if (oldPlant != this.plant) {
            func();
            oldPlant = this.plant;
         }
      }, 500);
   }
}

function initPlots() {
   gameData.plots.forEach((val, i, arr) => {
      let array = arr.shift();
      gameData.plots.push(new Plot(array.status, array.plant, array.bushels));
   });
   gameData.plots.forEach((val, i) => {
      let index = i;
      let plotBody = document.createElement("DIV");
      plotBody.classList.add("plot");
      plotBody.id = `plot${index}`;
      document.querySelector(".land").appendChild(plotBody);

      ourNum = i;
      plotBody.innerHTML = `
      <div class="plant-progress plant-progress-${i}">
         <span class="plant-progress-view-${i}">
            <span><p class="plant-progress-text-${i}">0%</p></span>
         </span>
      </div>
      <div class="countdown time-left">
         <span class="time-left-${index}">00:01:19</span>
         <img src="Images/Icons/clock.svg">
      </div>
      <img src="Images/Vegetables/${val.plant}.png" class="veg-icon plant-icon-${index}">
      <button class="almanacBtn almanac${index}" onclick="toggleAlmanac(${index})">
         <img src="Images/Global Assets/almanac.png" class="almanac">
      </button>
      <button class="btn${index} btn" onclick="tendTo(${index}, '${val.plant}')">Grow ${val.plant}!</button>
      <ul class="shop-window" id="shop${index}"></ul>
      `;

      gameData.plantSeeds.forEach((value) => {
         let listItem = document.createElement("LI");
         let listImg = document.createElement("IMG");
         listImg.classList.add("store-icon");
         listImg.src = `Images/Vegetables/${value}.png`;
         listImg.onclick = () => { tendTo(index, value); };
         listItem.appendChild(listImg);
         plotBody.querySelector(".shop-window").appendChild(listItem);
      });
      if (gameData.plots[index].isGrowing() || gameData.plots[index].status == "Ready") {
         plantGrowthLoop(index);
         document.querySelector(`.almanac${index}`).disabled = true;
      }
   });

   gameData.plots.forEach((val, i, arr) => {
      gameData.plots[i].onChange(() => {
         document.querySelector(`.plant-icon-${i}`).src = `Images/Vegetables/${val.plant}.png`;
      });
   });



   var ourNum;
   let loadProgress = { lp0: 1 };
   let loadbar = { lb0: null }
   loadProgress[`lp${ourNum}`] = 0;
   loadbar[`lb${ourNum}`] = setInterval(() => {
      loadProgress[`lp${ourNum}`] += 1;
      document.querySelector(`.plant-progress-view-${ourNum}`).style.width = loadProgress[`lp${ourNum}`] + "%";
      document.querySelector(`.plant-progress-text-${ourNum}`).textContent = loadProgress[`lp${ourNum}`] + "%";
      if (loadProgress[`lp${ourNum}`] == 100) { clearInterval(loadbar[`lb${ourNum}`]); }
   }, 20);

   $(`.plant-progress-view-${ourNum} > span`).each(function () {
      $(this)
      .data("origWidth", $(this).width())
      .width(0)
      .animate( { width: $(this).data("origWidth") }, 1 );
   });
}

function toggleAlmanac(index) {
   if (document.getElementById(`shop${index}`).style.height === "95%") {
      document.getElementById(`shop${index}`).style.height = "0";
   } else {
      document.getElementById(`shop${index}`).style.height = "95%";
   }
}

function tendTo(pos, veg) {
   document.getElementById(`shop${pos}`).style.height = "0";
   document.querySelector(`.almanac${pos}`).disabled = true;
   // Harvest
   if (gameData.plots[pos].harvestReady()) {
      document.querySelector(`.almanac${pos}`).disabled = false;
      gameData.plots[pos].status = "Empty";
      // Chances
      harvestLuck(veg);
      // Decide how much to add (if statment to prevent NaN on first time)
      if (!Number.isFinite(gameData.plots[pos].bushels)) { gameData.plots[pos].bushels = 1; }
      gameData[veg] += gameData.plots[pos].bushels;
      gameData.plots[pos].bushels = 1;
      // Styles
      document.querySelector(`.btn${pos}`).textContent = `Plant ${veg}!`;
      document.querySelector(`#plot${pos}`).style.backgroundImage = "url(Images/Plots/plot.png)";
   }
   // Plant
   else {
      gameData.plots[pos].plant = veg;
      let currentTime = Date.now();
      let harvestTime = gameInfo[`${veg}Time`][2] / 4;
      if (gameData.weather === "cloudy") { harvestTime = gameInfo[`${veg}Time`][2] + harvestTime; }
      else { harvestTime = gameInfo[`${veg}Time`][2]; }
      gameData.plots[pos].status = currentTime + harvestTime;
      if (gameData.weather === "rainy") { gameData.plots[pos].bushels++; }
      plantCountdown(pos);
      plantGrowthLoop(pos);
   }
}

function plantCountdown(i) {
   if (!gameData.plots[i].isGrowing()) { return; }
   let countDown = document.querySelector(`.time-left-${i}`);
   let endTime = gameData.plots[i].status;
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

function plantGrowthLoop(plotIndex) {
   let plant = gameData.plots[plotIndex].plant;
   let urls = gameInfo[plant + "URLs"];
   let plotImg = document.querySelector(`#plot${plotIndex}`).style;
   let buttton = document.querySelector(`.btn${plotIndex}`);
   let growthLoop = setInterval(() => {
      if (gameData.plots[plotIndex].status == "Ready") {
         // Button
         showObj(`.btn${plotIndex}`);
         // Image and end loop
         plotImg.backgroundImage = `url(Images/Plots/${urls[2]})`;
         clearInterval(growthLoop);
         return;
      }
      // Changes images depening on odd state
      if (gameData.plots[plotIndex].status == "Empty") { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      if (gameData.plots[plotIndex].status == "withered") { plotImg.backgroundImage = `url(Images/Plots/withered.png)`; }
      // If the plant is growing
      if (gameData.plots[plotIndex].isGrowing()) {
         // Update time
         plantCountdown(plotIndex);
         // Check what third of growth the plant is is
         let checkTimeOne = gameData.plots[plotIndex].status - gameInfo[`${plant}Time`][0];
         let checkTimeTwo = gameData.plots[plotIndex].status - gameInfo[`${plant}Time`][1];
         // Check if it's ready 
         if (Date.now() >= gameData.plots[plotIndex].status) { gameData.plots[plotIndex].status = "Ready"; }
         // Otherwise, display the images
         else if (Date.now() >= checkTimeOne) { plotImg.backgroundImage = `url(Images/Plots/${urls[1]})`; }
         else if (Date.now() >= checkTimeTwo) { plotImg.backgroundImage = `url(Images/Plots/${urls[0]})`; }
         else { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      }
   }, 1000);
   // Button
   buttton.textContent = `Harvest ${plant}!`;
   hideObj(`.btn${plotIndex}`);
}

// Gene labs?
// Chat task system







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





// for (i = 1; i < 6; i++) {
//    let progressbar = document.createElement("DIV");
//    progressbar.innerHTML = `
//       <div class="plant-progress plant-progress-${i}">
//          <span class="plant-progress-view-${i}">
//             <span><p class="plant-progress-text-${i}">0%</p></span>
//          </span>
//       </div>
//    `;
//    document.querySelector(".BM-menu").appendChild(progressbar);

//    let ourNum = i;
//    let loadProgress = { lp0: 1 };
//    let loadbar = { lb0: null }
//    loadProgress[`lp${ourNum}`] = 0;
//    loadbar[`lb${ourNum}`] = setInterval(() => {
//       loadProgress[`lp${ourNum}`] += 1;
//       document.querySelector(`.plant-progress-view-${ourNum}`).style.width = loadProgress[`lp${ourNum}`] + "%";
//       document.querySelector(`.plant-progress-text-${ourNum}`).textContent = loadProgress[`lp${ourNum}`] + "%";
//       if (loadProgress[`lp${ourNum}`] == 100) { clearInterval(loadbar[`lb${ourNum}`]); }
//    }, 20);

//    $(`.plant-progress-view-${ourNum} > span`).each(function () {
//       $(this)
//       .data("origWidth", $(this).width())
//       .width(0)
//       .animate( { width: $(this).data("origWidth") }, 1 );
//    });
// }