/* Copyright July 13th 2023 by Editor Rust */
/* Version 0.1.4 */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loadSave() {
   let saveCheck = JSON.parse(localStorage.getItem("vegetabledashsave"));
   if ((saveCheck == "restarted") || (Object.is(saveCheck, null))) {
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
      // Sets data object to save
      gameData = JSON.parse(localStorage.getItem("vegetabledashsave"));
      init();
   }
}

// Declare the varibles
let randomWeatherNum = (Math.random()).toFixed(2);
let offerVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let costVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let rightClickMenu = document.querySelector("#menu").style;

let dynamHov = document.querySelector(".dynamic-hover");


let hover;
let mouseX;
let mouseY;


// Active cursor varibles
let mouseDown = 0;
document.body.onmousedown = function() { mouseDown = 1; }
document.body.onmouseup = function() { mouseDown = 0; }
let mouseWasDown = false;
let plntMouseWasDown = false;
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
         clearInterval(pageloadbar);
         document.querySelector(".loading-progress").style.width = "100%";
         document.querySelector(".load-display").textContent = "100%";
         document.querySelector(".cover").remove();

         loadSave();
         break;
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Init
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function init() {
   // Creates plot elements
   initPlots();
   // Open saved panels
   initPanels();
   // Set theme from save
   initTheme();
   // Creates hover element
   initDynamHov();
   // Adds event listeners
   initTendAndFertilizeCursors();
   // Displays market stalls for owned seeds
   initMarketStalls();
   // Starts save and other loops
   initLoops();
   // Sets up context menu
   initContextMenu();
   // Sets up items avalible in shop
   initShop();
   // Sets all display values
   initDisplay();

   // Displays black market values
   displayBlackMarketValues();

   // Implements effects of current weather
   weatherEffects();
   // Creates a market exchange
   generateExchange();

   // Make plots bigger if there are only a few
   initPlotSize();


   // Add old weeds
   for (let i = 0; i < gameData.weedsLeft; i++) { addWeed(true); }

   // Show doughnuts in quick info menu if strawberries are unlocked
   if (seedOwned("strawberries")) {
      document.querySelector(".doughnutsDisplay").style.display = "block";
   }

   // Adds new game data to old saves
   for (const [key, value] of Object.entries(initGameData)) {
      if (typeof gameData[key] == "undefined") gameData[key] = value;
   }
}

function initPanels() {
   if (gameData.panels.settings) { showObj('.settingShadow'); }
   if (gameData.panels.market) { showObj('.marketShadow'); }
   if (gameData.panels.blackMarket) { showObj('.marketShadow'); showObj('.blackMarketShadow'); gameData.panels.market = true; }
   if (gameData.panels.tasks) { taskBar("close"); }
   if (gameData.panels.shop) { toggleWindow('shop'); }
   if (gameData.panels.genelab) { toggleWindow('genelab'); }
}

function initTheme() {
   if (gameData.theme === "light") { lightTheme(); }
   else { darkTheme(); }
}

function initDynamHov() {
   dynamHov = document.createElement("SPAN");
   document.body.appendChild(dynamHov);
   dynamHov.style.position = "fixed";
   dynamHov.classList.add("dynamicHover");
}

function initTendAndFertilizeCursors() {
   gameData.plots.forEach((val, i, arr) => {
      let veg = val.plant;
      document.querySelector(`#plot${i}`).addEventListener("click", event => {
         if (fertilizerCursor === "active" && arr[i].isGrowing()) { fertilize(i, veg); fertilizeHover(); }
      });
      document.querySelector(`#plot${i}`).addEventListener("mouseenter", event => {
         if (mouseDown === 1 && tendCursor === "active" && !arr[i].isGrowing()) { tendTo(i, veg); }
      });
   });
}

function initContextMenu() {
   document.addEventListener("contextmenu", function(e) {
      let posX = e.clientX;
      let posY = e.clientY;

      rightClickMenu.top = posY + "px";
      rightClickMenu.left = posX + "px";
      rightClickMenu.display = "block";

      e.preventDefault();
   }, false);
   document.addEventListener("click", function(e) {
      rightClickMenu.display = "none";
   }, false);
}

function initShop() {
   if (gameData.plantSeeds.length < 8) {
      document.querySelectorAll(".buy-plots-seeds")[0].style.display = "inline-block";
      document.querySelector(".buy-seeds-image").src = `Images/Vegetables/${gameData.plotPlants[0]}.png`;
      document.querySelector(".buy-seeds-button").textContent = `Buy ${gameData.plotPlants[0]} seeds for ${toWord(gameInfo[gameData.plotPlants[0] + "Seeds"])} coins!`;
      document.querySelector(".buy-seeds-button").onclick = () => {
         if (gameData.coins >= gameInfo[gameData.plotPlants[0] + "Seeds"]) {
            let plant = gameData.plotPlants.shift();
            gameData.coins -= gameInfo[plant + "Seeds"];
            updateCoins();
            gameData.plantSeeds.push(plant);
            save();
            location.reload();
         }
      };
   }
   if (gameData.plots.length < 9) {
      document.querySelectorAll(".buy-plots-seeds")[1].style.display = "inline-block";
      document.querySelector(".buy-plots-image").src = "./Images/Plots/plot.png";
      document.querySelector(".buy-plots-button").textContent = `Buy a new plot for ${toWord(gameData.plotPrices[0])} coins!`;
      document.querySelector(".buy-plots-button").onclick = () => {
         if (gameData.coins >= gameData.plotPrices[0]) {
            gameData.coins -= gameData.plotPrices.shift();
            updateCoins();
            gameData.plots.push(new Plot("Empty", gameData.plantSeeds[gameData.plantSeeds.length - 1]));
            save();
            location.reload();
         }
      };
   }
}

function initPlotSize() {
   if (gameData.plots.length <= 4) {
      if (gameData.plots.length === 1) {
         document.querySelector(".land").style.gridTemplateAreas = "'auto'";
      } else {
         document.querySelector(".land").style.gridTemplateAreas = "'auto auto' 'auto auto'";
      }
   }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Loops
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initLoops() {
   let oneSecondLoop = setInterval(() => {
      save();
      weatherCheck();
      updateBgImgTheme();
      incidents();

      // Do not know if they are needed
      checkForTasks();
      giveTasks();
      showTasks();
   }, 1000);
   let hundremMSLoop = setInterval(() => {
      // Can refactor
      // Cursors
      if (tendCursor === "active" && mouseDown === 1) { plntMouseWasDown = true; }
      if (tendCursor !== "active") { plntMouseWasDown = false; }
      if (mouseDown === 0 && plntMouseWasDown === true) { tendDrag(); }
   }, 100);
}

function save() {
   localStorage.setItem("vegetabledashsave", JSON.stringify(gameData));
}

function weatherCheck() {
   // Choose next weathertime
   if (Date.now() >= gameData.newWeatherTime) {
      gameData.lastWeather = gameData.weather;
      gameData.weather = gameData.nextWeather;
      chooseWeather();
      gameData.newWeatherTime = Date.now() + 360000; // 6 Minutes (360000)
   }
   // Display time left for current weather
   let secondsLeft = Math.round((gameData.newWeatherTime - Date.now()) / 1000);
   let minutes = Math.floor(secondsLeft / 60) - (Math.floor(secondsLeft / 3600) * 60);
   let seconds = secondsLeft % 60;
   if (seconds < 10) { seconds = `0${seconds}`; }
   document.querySelector(".weather-time").textContent = `Next Weather: ${minutes}:${seconds}`;
}

function updateBgImgTheme() {
   const hours = new Date().getHours();
   if (hours > 6 && hours < 20) { document.body.style.backgroundImage = `url('Images/Background/${bgImg[1]}.svg')`; }
   else { document.body.style.backgroundImage = `url('Images/Background/${bgImg[0]}.svg')`; }
}

function incidents() {
   // Disaster Time!
   if (Date.now() >= gameData.disasterTime) {
      luckyRoll();
      gameData.disasterTime = Date.now() + 480000;
   }
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function harvestLuck(veg) {
   if (Math.random() < 0.10) {
      gameData[veg] += 2;
      updateVeg(veg);
      fadeTextAppear(`A bumper crop! You collected \n 2 extra ${capitalize(veg)}!`, "#00de88");
   }
   if (Math.random() < (0.05 + gameData.marketResetBonus)) {
      gameData.marketResets++;
      updateMarketResets();
      fadeTextAppear(`You found a market reset!`, "#00de88");
   }
   if (Math.random() < 0.30) {
      let luckDNA = random(1, 4);
      gameData.genes += luckDNA;
      updateGenes();
      // fadeTextAppear(`You extracted ${luckDNA} genes while harvesting!`, "#00de88");
   }
}
function marketLuck() {
   if (Math.random() < 0.01) {
      gameData.marketResets++;
      updateMarketResets();
      notify(`You collected a market reset! You now have ${gameData.marketResets}`);
   }
}
function blackMarketLuck() {
   if (Math.random() < gameData.black.catchChance) {
      notify("The police caught you! You were fined 6000 coins");
      gameData.coins -= 6000;
      updateCoins();
   }
}
function luckyRoll() {
   let vegLost = gameData.plantSeeds[Math.floor(Math.random() * gameData.plantSeeds.length)];
   let amountLost = Math.floor(gameData[vegLost] / 3);
   if (Math.random() < .08) {
      gameData[vegLost] -= amountLost;
      updateVeg(vegLost);
      notify(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
    }
    if (Math.random() < .02) {
      gameData[vegLost] -= amountLost;
      updateVeg(vegLost);
      notify(`A hacker has hacked your account (not really)! You lost ${amountLost} of your ${vegLost}!`);
    }
}

// Weeds
function addWeed(check) {
   let weedBoxHeight = document.querySelector(".land").clientHeight;
   let weedBoxWidth = document.querySelector(".land").clientWidth;
   let weed = document.querySelector(".weed").cloneNode();
   document.querySelector(".land").appendChild(weed);
   let randomtop = (Math.floor(Math.random() * weedBoxHeight) - 25);
   let randomleft = (Math.floor(Math.random() * weedBoxWidth) - 25);
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
      updateFertilizer();
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

// Get coords
document.addEventListener("mousemove", (e) => {
   mouseX = e.clientX;
   mouseY = e.clientY;
   dynamHov.style.left = mouseX + 15 + "px";
   dynamHov.style.top = mouseY + "px";
   if (quickInformation === "opened") {
      quickInfoMenu.style.left = mouseX + 15 + "px";
      quickInfoMenu.style.top = mouseY + "px";
   }
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Theme
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

// Restart
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

function exportData() {
   let textboxElement = document.querySelector(".exportdata");
   textboxElement.value = JSON.stringify(gameData);
   textboxElement.select();
   textboxElement.setSelectionRange(0, 99999); // For mobile
   navigator.clipboard.writeText(textboxElement.value);
   notify("Copied save data to clipboard!");
}

function importData() {
   if (confirm("This will delete your current save! Do you want to continue?")) {
       if (confirm("You can't undo this!")) {
           let inputedData = prompt("Enter your save...");
           gameData = JSON.parse(inputedData);
           save();
           location.reload();
       }
   }
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
            } else {
               quickInfoMenu.style.display = "none";
               quickInformation = "closed";
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
      gameData.panels.tasks = true;
   }
   else if (whatToDo === "open") {
      document.querySelector(".tasks").style.left = "-80vh";
      document.querySelector(".taskShadow").style.display = "none";
      gameData.panels.tasks = false;
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
      updateFertilizer();
      gameData.plots[i].status = "Ready";
      gameData.plots[i].bushels++;
      checkTasks("tryFertilizer");
      document.querySelector(`.time-left-${i}`).textContent = "00:00:00";
   }
}