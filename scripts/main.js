//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loadSave() {
   let saveCheck = JSON.parse(localStorage.getItem("vegetabledashsave"));
   if ((saveCheck == "restarted") || (Object.is(saveCheck, null))) {
      gameData = initGameData;

      const script = document.createElement("script");
      script.src = "scripts/intro.js";
      document.body.appendChild(script);

      // !! Start setup !!
      const link = document.createElement("link");
      link.href = "styles/intro.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);


      gameData = initGameData;
      gameData.disasterTime = Date.now() + 480000;

      loadGrid();
      addBuildingToGridByHandle("plot");

      init();
      setTimeout(() => {
         runIntro();
      }, 200);
   }
   else {
      // Sets data object to save
      gameData = JSON.parse(localStorage.getItem("vegetabledashsave"));
      loadGrid();
      init();
   }
}

// Declare the varibles
let offerVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let costVeg = { vegetable: null, worth: null, amount: null, totalVal: null };
let rightClickMenu = document.querySelector("#menu").style;

let dynamHov = document.querySelector(".dynamic-hover");

let hover;
let mouseX;
let mouseY;

// Active cursor varibles
let mouseDown = 0;
document.body.onmousedown = () => { mouseDown = 1; }
document.body.onmouseup = () => { mouseDown = 0; }
let mouseWasDown = false;
let plntMouseWasDown = false;
let tendCursor = "not active";
let fertilizerCursor = "not active";

// Background Image
let bgImgArr = [["lake-night", "lake-day"], ["mountian-night", "mountian-day"]];
let bgImg = bgImgArr[Math.floor(Math.random() * bgImgArr.length)];

document.onreadystatechange = () => {
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
   let random = Math.random();
   if (random > .80) { document.querySelector(".meter").classList.add("red-load"); }
   else if (random > .60) { document.querySelector(".meter").classList.add("orange-load"); }
   else if (random > .40) { document.querySelector(".meter").classList.add("yellow-load"); }
   else if (random > .20) { document.querySelector(".meter").classList.add("green-load"); }
   else if (random > .10) { document.querySelector(".meter").classList.add("blue-load"); }
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
   initPanels(); // Open saved panels
   initTheme(); // Set theme from save
   applyBlurPreference();
   initDynamHov(); // Creates hover element
   initMarketStalls(); // Displays market stalls for owned seeds
   initLoops(); // Starts save and other loops
   initContextMenu();
   initShop(); // Sets up items avalible in shop
   initDisplay(); // Sets all display values
   displayBlackMarketValues();
   weatherEffects(); // Implements effects of current weather
   generateExchange(); // Creates a market exchange

   // Add old weeds
   for (let i = 0; i < gameData.weedsLeft; i++) { addWeed(true); }

   // Show doughnuts in quick info menu if strawberries are unlocked
   if (seedOwned("strawberries")) { document.querySelector(".doughnutsDisplay").style.display = "block"; }

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
   if (gameData.panels.inventory) { inventoryBar("close"); }
   else  { inventoryBar("open"); }
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
      document.querySelector(".buy-seeds-image").src = `images/Vegetables/${gameData.plotPlants[0]}.png`;
      document.querySelector(".buy-seeds-button").innerHTML = `
         <div>
            <h3>Buy ${gameData.plotPlants[0]} seeds for ${toWord(gameInfo[gameData.plotPlants[0] + "Seeds"])} coins!</h3>
            <i>Sells for ${toWord(gameData.vegCost[gameData.plotPlants[0]]["sell"])} coins</i><br>
            <i>Grows in ${formatTime(gameInfo[gameData.plotPlants[0] + "Time"][2])}</i>
      `;
      document.querySelector(".buy-seeds-button").onclick = () => {
         if (gameData.coins >= gameInfo[gameData.plotPlants[0] + "Seeds"]) {
            let plant = gameData.plotPlants.shift();
            gameData.coins -= gameInfo[plant + "Seeds"];
            updateCoins();
            gameData.plantSeeds.push(plant);
            if (plant == "corn") checkTasks("gramp2");
            save();
            location.reload();
         }
         else { fadeTextAppear(`Not enough coins - you need ${toWord(gameInfo[gameData.plotPlants[0] + "Seeds"] - gameData.coins)} more`, "#de0000"); }
      };
   }
   let totalPlotCount = getPlotArrays().length + GridSaveManager.getInventoryElementAmount("plot");
   if (totalPlotCount < 9) {
      document.querySelectorAll(".buy-plots-seeds")[1].style.display = "inline-block";
      document.querySelector(".buy-plots-image").src = "./images/Plots/plot.png";
      document.querySelector(".buy-plots-button").textContent = `Buy a new plot for ${toWord(gameData.plotPrices[0])} coins!`;
      document.querySelector(".buy-plots-button").addEventListener("click", () => {
         if (gameData.coins >= gameData.plotPrices[0]) {
            gameData.coins -= gameData.plotPrices.shift();
            updateCoins();
            GridSaveManager.incrementInventoryItem("plot");
            addBuildingToGridByHandle("plot");
            save();
            location.reload();
         }
         else fadeTextAppear(`Not enough coins - you need ${toWord(gameData.plotPrices[0] - gameData.coins)} more`, "#de0000");
      });
   }
   else {
      document.querySelectorAll(".buy-plots-seeds")[1].style.display = "inline-block";
      document.querySelectorAll(".buy-plots-seeds")[1].innerHTML = "<p>You cannot buy any more plots</p>";
   }
   let itemsElement = document.querySelector(".decoration-items");
   shopDecorations.forEach(({ handle, description, cost }) => {
      let name = buildings[handle].name;
      let imageSource = buildings[handle].image;
      let dimensions = buildings[handle].width + " x " + buildings[handle].height;

      let element = document.createElement("div");
      element.classList.add("decoration-item");
      element.innerHTML = `
         <img src="${imageSource}">
         <h2>${name}</h2>
         <p>${description}</p>
         <p>Dimensions: ${dimensions}</p>
         <button class="buy-plots-button">Purchase for ${toWord(cost)} coins</button>
         <br>
      `;
      element.querySelector("button").addEventListener("click", () => {
         if (gameData.coins >= cost) {
            gameData.coins -= cost;
            updateCoins();
            GridSaveManager.incrementInventoryItem(handle);
            fadeTextAppear(`You purchased a ${name}, it is now in your inventory`);
            save();
         }
         else {
            fadeTextAppear(`Not enough coins - you need ${toWord(cost - gameData.coins)} more`, "#de0000");
         }
      });
      itemsElement.append(element);
   });
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

      assignTasks();
      displayTasks();
      readyTaskCheck();
   }, 1000);
   let hundremMSLoop = setInterval(() => {
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
   if (hours > 6 && hours < 20) { document.body.style.backgroundImage = `url('images/Background/${bgImg[1]}.svg')`; }
   else { document.body.style.backgroundImage = `url('images/Background/${bgImg[0]}.svg')`; }
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
   if (Math.random() < .02) {
      gameData[vegLost] -= amountLost;
      updateVeg(vegLost);
      notify(`A hacker has hacked your account (not really)! You lost ${amountLost} of your ${vegLost}!`);
   } else if (Math.random() < .08) {
      gameData[vegLost] -= amountLost;
      updateVeg(vegLost);
      notify(`A pirate has pillaged your plots! You lost ${amountLost} of your ${vegLost}!`);
   }
}

// Weeds
function addWeed(check) {
   let weedBoxHeight = document.querySelector(".grid-grandparent").clientHeight;
   let weedBoxWidth = document.querySelector(".grid-grandparent").clientWidth;
   let weed = document.querySelector(".weed").cloneNode(true);
   document.querySelector(".grid-grandparent").appendChild(weed);
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
      document.querySelector(".grid-grandparent").style.cursor = "auto";
   }
   else {
      tendCursor = "active";
      document.querySelector(".grid-grandparent").style.cursor = "url('images/Cursors/sickle.png'), auto";
   }
}
function fertilizeHover() {
   if (fertilizerCursor === "active") {
      fertilizerCursor = "not active";
      document.querySelector(".grid-grandparent").style.cursor = "auto";
   }
   else {
      if (gameData.fertilizers < 1) {
         // alert
         notify("You don't have any fertilizers");
         return;
      }
      fertilizerCursor = "active";
      document.querySelector(".grid-grandparent").style.cursor = "url('images/Cursors/fertilizer.png'), auto";
   }
}

// Get coords
document.addEventListener("mousemove", (e) => {
   mouseX = e.clientX;
   mouseY = e.clientY;
   if (dynamHov) {
      dynamHov.style.left = mouseX + 15 + "px";
      dynamHov.style.top = mouseY + "px";
   }
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
   document.documentElement.style.setProperty("--background-blurbox-color", "#eeeeee60"); gameData.theme = "light";
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
         localStorage.removeItem("vegetabledash-inventory");
         localStorage.removeItem("vegetabledash-grid");
         save();
         location.reload();
      }
   }
}

function exportData() {
   let textboxElement = document.querySelector(".exportdata");
   textboxElement.value = JSON.stringify({
      gameData: gameData,
      inventory: inventory,
      gridBuildings: gridBuildings
   });
   textboxElement.select();
   textboxElement.setSelectionRange(0, 99999); // For mobile
   navigator.clipboard.writeText(textboxElement.value);
   notify("Copied save data to clipboard!");
}

function importData() {
   if (confirm("This will delete your current save! Do you want to continue?")) {
       if (confirm("You can't undo this!")) {
         let inputedData = prompt("Enter your save...");
         let data = JSON.parse(inputedData);
         gameData = data.gameData;
         inventory = data.inventory;
         gridBuildings = data.gridBuildings;
         GridSaveManager.saveInventory();
         GridSaveManager.saveGridData();
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
aEL(81, taskBar); // Shift + Q
aEL(83, settingModal); // Shift + S
aEL(80, tendDrag); // Shift + T
aEL(70, fertilizeHover); // Shift + F
aEL(77, toggleMarket); // Shift + M
aEL(65, tendAll); // Shift + A
aEL(66, toggleSidebar); // Shift + B

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
   getPlotArrays().forEach(({ id, data }) => {
      if (!isGrowing(data.status)) tendTo(id, data.plant);
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
function inventoryBar(whatToDo) {
   if (whatToDo === "close") {
      document.querySelector(".inventory-grandparent").style.left = "0";
      document.querySelector(".inventoryShadow").style.display = "block";
      gameData.panels.inventory = true;
      makeGridItemsInteractive(true);
      document.querySelector(".grid-grandparent").style.justifyContent = "end";
      hideObj(".toolbar");
      hideObj(".weather-short");
   }
   else if (whatToDo === "open") {
      document.querySelector(".inventory-grandparent").style.left = "-28rem";
      document.querySelector(".inventoryShadow").style.display = "none";
      gameData.panels.inventory = false;
      makeGridItemsInteractive(false);
      document.querySelector(".grid-grandparent").style.justifyContent = "center";
      showObj(".toolbar");
      showObj(".weather-short");
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

let sidebarOntop = false;
function toggleSidebar() {
   let cntrlCmnd = document.querySelector(".cntrl-cmnd");
   if (cntrlCmnd.style.zIndex === "1001") { cntrlCmnd.style.zIndex = "1"; sidebarOntop = false; }
   else { cntrlCmnd.style.zIndex = "1001"; sidebarOntop = true; }
}

function closeAllPanels() {
   hideObj(".settingShadow");
   hideObj(".marketShadow");
   hideObj(".blackMarketShadow");
   if (gameData.panels.shop) toggleWindow("shop");
   taskBar("open");
   gameData.panels.settings = false;
   gameData.panels.market = false;
   gameData.panels.blackMarket = false;
   gameData.panels.shop = false;
   gameData.panels.tasks = false;
   gameData.panels.inventory = false;
   makeGridItemsInteractive(false);
}

function applyBlurPreference() {
   // Ensure blurEnabled exists, defaulting to true for older saves if not merged from initGameData
   if (typeof gameData.blurEnabled === "undefined") {
      gameData.blurEnabled = true;
   }
   updateBlurVisuals(gameData.blurEnabled);
}

function updateBlurVisuals(isEnabled) {
   const rootStyle = document.documentElement.style;
   const blurButton = document.getElementById("toggleBlurButton");

   if (isEnabled) {
      rootStyle.setProperty("--blur-amount", "5rem");
      if (blurButton) blurButton.textContent = "Disable Blur";
   } else {
      rootStyle.setProperty("--blur-amount", "0");
      if (blurButton) blurButton.textContent = "Enable Blur";
   }
}

function toggleBlur() {
   gameData.blurEnabled = !gameData.blurEnabled;
   updateBlurVisuals(gameData.blurEnabled);
   save(); // Save the preference
}
