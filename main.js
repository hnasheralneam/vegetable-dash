/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Incidents          | Whoops, did I spell that wrong? - IN PROGRESS
Unlock Plots       | Functions that unlock plots
Introduction       | Welcome new players
Quests             | Earn things - IN PROGRESS
Market             | Trade things
Main Loop & Setup  | Main loop and setup
Helpful Functions  | Some helpful functions
Commands           | Command Panel, right click menu
Settings & Produce | Update Sidebar
Save               | Save the game data, restart
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data | 57 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
   pumpkins: "empty",
}
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
}
let initalPlots = {
   price2: 150,
   price3: 750,
   price4: 3750,
   price5: "your soul (or $$$ - we don't accept credit)",
   price6: 120000,
   price7: "undeterimed",
   price8: "undeterimed",
   price9: "undeterimed",
   // Unlocked/locked
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
   pumpkinplot: "locked",
}
let initalMarketData = {
   seeds: 0,
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 250,
   sellStrawberries: 250,
   buyEggplants: 750,
   sellEggplants: 750,
   buyPumpkins: null,
   sellPumpkins: null,
}
let initalSettings = {
   theme: "dark",
   intro: "unfinished",
}

let settings = initalSettings;
let plotStatus = initalPlotStatus;
let produce = initalProduce;
let plots = initalPlots;
let marketData = initalMarketData;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables | 61 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Vegetable Modals
function infoModal(veg) {
   let modalID = "#info" + veg;
   if (document.querySelector(modalID).style.opacity === "1") { hideObj(modalID); }
   else { showObj(modalID); }
}

// Harvest and plant
function harvest(veg) {
   // Create proper IDs
   let plntID = "grow" + veg;
   let hrvstID = "harvest" + veg;
   // Set plot status to empty
   plotStatus[veg.toLowerCase()] = "empty";
   // Add one to peas
   produce[veg.toLowerCase()]++;
   // Hide harvest button, display grow button
   hideObj(`#${hrvstID}`);
   showObj(`#${plntID}`);
   marketData.seeds++;
}
function plant(veg, timeOne, timeTwo, pltNumber, url) {
   let vegPlot = document.querySelector("#plot" + pltNumber);
   let imgUrl = "url(Images/Vegetables/" + url + ")";
   setTimeout(() => { plotStatus[veg] = "growing"; }, timeOne);
   setTimeout(() => { plotStatus[veg] = "ready"; }, timeTwo);
   hideObj("#grow" + capitalize(veg));

   setInterval(vegStatus, 1500);
   function vegStatus() {
      if (plotStatus[veg] === "ready") {
         vegPlot.style.backgroundImage = String(imgUrl);
         showObj("#harvest" + capitalize(veg));
      }
      else if (plotStatus[veg] === "growing") { vegPlot.style.backgroundImage = "url(Images/Plots/growing.png)"; }
      else { vegPlot.style.backgroundImage = "url(Images/Plots/plot.png)"; }
   }
}
function plantStrawberries() {
   setTimeout(() => { plotStatus.strawberries = "sprouting"; }, 20000);
   setTimeout(() => { plotStatus.strawberries = "flowering"; }, 60000);
   setTimeout(() => { plotStatus.strawberries = "fruiting"; }, 120000);
   hideObj("#growStrawberries");
}
function strawberriesStatus() {
   let plotId = document.getElementById("plot3");
   if (plotStatus.strawberries === "fruiting") {
      plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/grown-strawberries.png)";
      showObj("#harvestStrawberries");
   }
   else if (plotStatus.strawberries === "flowering") { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/flowering-strawberries.png)"; }
   else if (plotStatus.strawberries === "sprouting") { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/growing-strawberries.png)"; }
   else { plotId.style.backgroundImage = "url(Images/Plots/plot.png)"; }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents | 0 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Run function every time you harvest/trade
function harvestLuck() {

}

function marketLuck() {

}

// let rand = Math.random();
// let amount = 30;
// if (rand < 0.15) { callAlert(`It snowed! You lost ${amount}% of your vegetables!`); } // 15% percent
// if (rand < 0.02) { callAlert(`It rained! Your harvest had 2x as much profit!`); } // 2% percent
//
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// let luckyRoll = window.setInterval(function() {
//    let rand = Math.random();
//    let bonusAmount = [1.5, 2, 2.5][Math.floor(Math.random() * 3)];
//    let dwarvesLost = Math.floor(gameData.dwarfNumber / 8);
//    if (rand > .92) {
//       callAlert(`A mine shaft collapsed! ${dwarvesLost} dwarfs perished.`);
//       // Must add this to main
//       for dwarvesLost {
//          gameData.dwarfGold -= gameData.dwarfProfit;
//          gameData.dwarfNumber--;
//       }
//    }
//    if (rand > .85) {
//       callAlert(`${["Large underground gold reserve found!", "Old Ican temple with vast stores of gold found!"][Math.floor(Math.random() * 2)]} Gold earnings x${bonusAmount} for 30 seconds!`);
//       bonusNumber = bonusAmount;
//       setTimeout(resetBonus, 30000);
//       function resetBonus() { bonusNumber = 1; }
//    }
//    console.log("End");
// }, 300000)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots | 52 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function checkLocks() {
   if (plots.cornplot === "unlocked") { openLock("corn", 2) }
   if (plots.strawberryplot === "unlocked") { openLock("strawberry", 3) }
   if (plots.eggplantplot === "unlocked") { openLock("eggplant", 4) }
   if (plots.pumpkinplot === "unlocked") { openLock("pumpkin", 6) }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (marketData.seeds >= plots["price" + plotNum]) {
      marketData.seeds -= plots["price" + plotNum];
      if (number == "2") { openLock("corn", 2) }
      if (number == "3") { openLock("strawberry", 3) }
      if (number == "4") { openLock("eggplant", 4) }
      if (number == "6") { openLock("pumpkin", 6) }
   }
}
function openLock(pltVeg, num) {
   let vegetable = pltVeg;
   document.getElementById("lock" + num).classList.add("removing-lock");
   setTimeout(fndLock, 2500);
   function fndLock() {
      if (vegetable === "corn") {
         document.getElementById("lockedDiv2").remove();
         document.getElementById("openPlot2").style.display = "block";
         document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay 750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`;
         plots.cornplot = "unlocked";
      }
      if (vegetable === "strawberry") {
         document.getElementById("lockedDiv3").remove();
         document.getElementById("openPlot3").style.display = "block";
         document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay 3750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`;
         plots.strawberryplot = "unlocked";
      }
      if (vegetable === "eggplant") {
         document.getElementById("lockedDiv4").remove();
         document.getElementById("openPlot4").style.display = "block";
         document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${plots.price6} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`;
         plots.eggplantplot = "unlocked";
      }
      if (vegetable === "pumpkin") {
         document.getElementById("lockedDiv6").remove();
         document.getElementById("openPlot6").style.display = "block";
         document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay your soul to unlock <br> <button class="purchase-plot" onclick="callAlert('Error: Not signed into SoulPay+')">Requires SoulPay+</button>`;
         plots.pumpkinplot = "unlocked";
      }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Intoduction | 98 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let introPartsDone = {
   hello: "no",
   meetGramps: "no",
   planting: "no",
   sidebar: "no",
   meetGran: "no",
   bushels: "no",
   settings: "no",
   thatsIt: "no",
}
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
   if (introPartsDone.hello === "no") { introPartsDone.hello = "yes"; }
   else { meetGrapms(); }
   function meetGrapms() {
      if (introPartsDone.meetGramps === "no") {
         $(".intro-img").attr("src", "Images/Intro/gramps.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin', the good ol' way!";
         introPartsDone.meetGramps = "yes";
      }
      else { planting(); }
   }
   function planting() {
      if (introPartsDone.planting === "no") {
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press Grow Peas, and when it's done, press Harvest Peas!";
         document.querySelector(".plant-quest-arrow").style.display = "block";
         document.getElementById("plot1").style.zIndex = "100";
         introPartsDone.planting = "yes";
      }
      else {
         document.querySelector(".plant-quest-arrow").style.display = "none";
         document.getElementById("plot1").style.zIndex = "0";
         sidebar();
      }
   }
   function sidebar() {
      if (introPartsDone.sidebar === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "This sidebar is were you keep control of the farm. Grandma Josephine will talk about that.";
         document.querySelector(".sidebar").style.zIndex = "10";
         introBlock.style.height = "40vh";
         introBlock.style.width = "52%";
         introPartsDone.sidebar = "yes";
      }
      else { meetGran(); }
   }
   function meetGran() {
      if (introPartsDone.meetGran === "no") {
         $(".intro-img").attr("src", "Images/Intro/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
         introPartsDone.meetGran = "yes";
      }
      else { bushels(); }
   }
   function bushels() {
      if (introPartsDone.bushels === "no") {
         introText.textContent = "Here you find the amount of resouces you have. Spend it well!";
         introPartsDone.bushels = "yes";
      }
      else { settings(); }
   }
   function settings() {
      if (introPartsDone.settings === "no") {
         introText.textContent = "These are the settings, where you can restart, change the theme, and play classical music!";
         document.querySelector(".settings").style.boxShadow = "0 0 50px #f5f5f5";
         introPartsDone.settings = "yes";
      }
      else {
         document.querySelector(".settings").style.boxShadow = "none";
         document.querySelector(".sidebar").style.zIndex = "0";
         introBlock.style.height = "30vh";
         introBlock.style.width = "auto";
         thatsIt();
      }
   }
   function thatsIt() {
      if (introPartsDone.thatsIt === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "That's it! Now you can start working.";
         introPartsDone.thatsIt = "yes";
      }
      else { hideObj(".introDarkShadow"); }
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
   if (plots.cornplot === "locked") { marketItem[2].style.opacity = "0"; }
   if (plots.strawberryplot === "locked") { marketItem[3].style.opacity = "0"; }
   if (plots.eggplantplot === "locked") { marketItem[4].style.opacity = "0"; }
}
function buyProduce(produceRequested, produceCase) {
   if (marketData.seeds >= marketData["buy" + produceCase]) {
      produce[produceRequested] += 5;
      marketData.seeds -= marketData["buy" + produceCase];
      marketData["buy" + produceCase] *= 1.08;
      marketData["sell" + produceCase] *= 1.02;
      updateMarket();
      checkMarket();
   }
}
function sellProduce(produceRequested, produceCase) {
   if (produce[produceRequested] >= 5) {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
      updateMarket();
      checkMarket();
   }
}
function updateMarket() {
   let marketItem = document.getElementsByClassName("market-item-content");
   marketItem[0].textContent = `Seeds: ${Math.floor(marketData.seeds)}`;
   marketItem[1].textContent = `Peas: ${produce.peas}
   Cost: ${Math.floor(marketData.buyPeas)} Seeds
   Sell: ${Math.floor(marketData.sellPeas)} Seeds \r\n \r\n`;
   marketItem[2].textContent = `Corn: ${produce.corn}
   Cost: ${Math.floor(marketData.buyCorn)} Seeds
   Sell: ${Math.floor(marketData.sellCorn)} Seeds \r\n \r\n`;
   marketItem[3].textContent = `Strawberries: ${produce.strawberries}
   Cost: ${Math.floor(marketData.buyStrawberries)}
   Sell: ${Math.floor(marketData.sellStrawberries)} \r\n \r\n`;
   marketItem[4].textContent = `Eggplants: ${produce.eggplants}
   Cost: ${Math.floor(marketData.buyEggplants)}
   Sell: ${Math.floor(marketData.sellEggplants)} \r\n \r\n`;
}

// At cost of black market items allow reset of market values
function blackMarketValues() {
   sellerName = ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)];
   sellItem = ["Cheese", "Currency", "Watering Cans", "Fertilizer"][Math.floor(Math.random() * 4)];
   sellItemQuantity = Math.floor(Math.random() * (25 - 5)) + 5;
   seedCost = Math.floor(Math.random() * (8000 - 2000)) + 2000;

}
function newBlackOffer() { document.getElementsByClassName("market-item-content")[2].textContent = `Offer by ${sellerName} \n Selling ${sellItemQuantity} ${sellItem} \n for ${seedCost} Seeds`; }
function deny() { blackMarketValues(); newBlackOffer(); document.getElementsByClassName("market-item")[2].style.backgroundColor = genColor(); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop & Setup | 27 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var mainLoop = window.setInterval(function() {
   strawberriesStatus();
   updateMarket();
   checkMarket()
   // Update produce display
   document.querySelector("#seeds").textContent = `${Math.round(marketData.seeds)} Seeds`;
   if (plots.peaplot === "unlocked") { revealProduce("#peaBushels", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduce("#cornBushels", "corn"); }
   if (plots.strawberryplot === "unlocked") { revealProduce("#strawberryBushels", "strawberries"); }
   if (plots.eggplantplot === "unlocked") { revealProduce("#eggplantBushels", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduce("#pumpkinBushels", "pumpkins"); }
   function revealProduce(id, veg) {
      document.querySelector(".produce-tooltip-" + veg).style.display = "inline-block";
      document.querySelector(id).textContent = `${produce[veg]} Bushels of ${capitalize(veg)}`;
   }
}, 200)
function setup() {
   whatTheme();
   checkLocks();
}
window.addEventListener('load', (event) => { setup(); });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions | 22 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands | 73 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Command Panel
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 69) { openCommands(); } });
function openCommands() {
   if (document.querySelector(".commandsShadow").style.opacity === "0") { showObj(".commandsShadow"); }
   else { hideObj(".commandsShadow"); }
}
function commandBar() {
   if (document.querySelectorAll(".commandBarImg")[0].style.display === "inline-block") {
      document.querySelectorAll(".commandBarImg")[0].style.display = "none";
      document.querySelectorAll(".commandBarImg")[1].style.display = "none";
      document.querySelectorAll(".commandBarImg")[2].style.display = "none";
   }
   else {
      document.querySelectorAll(".commandBarImg")[0].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[1].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[2].style.display = "inline-block";
   }
}

document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 87) {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
} });

// Right Click Menu
let rightClickMenu = document.getElementById("menu").style;
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings & Produce | 23 LINES=
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (settings.theme === "light") { light(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.querySelector('.sidebar').style.backgroundColor = '#111';
   document.querySelector('.sidebar').style.color = '#f5f5f5';
   settings.theme = "dark";
}
function light() {
   document.querySelector('.sidebar').style.backgroundColor = '#f5f5f5';
   document.querySelector('.sidebar').style.color = '#333';
   settings.theme = "light";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var saveLoop = window.setInterval(function() {
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
   localStorage.setItem("marketData", JSON.stringify(marketData));
   localStorage.setItem("settingData", JSON.stringify(settings));
}, 1000)

let savegame = {
   plotStatus: JSON.parse(localStorage.getItem("plotStatus")),
   produce: JSON.parse(localStorage.getItem("produce")),
   plots: JSON.parse(localStorage.getItem("plots")),
   marketData: JSON.parse(localStorage.getItem("marketData")),
   settings: JSON.parse(localStorage.getItem("settingData")),
}
plotStatus = savegame.plotStatus;
produce = savegame.produce;
plots = savegame.plots;
marketData = savegame.marketData;
settings = savegame.settings;

if (savegame !== null) {
   savegame.plotStatus = plotStatus;
   savegame.produce = produce;
   savegame.plots = plots;
   savegame.marketData = marketData;
   savegame.settings = settings;
}

if (settings) { } else { runIntro() }
if (settings.intro != "finished") { runIntro() }

function restart() {
   var areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure == true) {
      var areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure == true) {
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
         // Reload
         location.reload();
      }
   }
}

// For export
// let save = [];
// save.push(plotStatus);
// save.push(produce);
// save.push(plots);
// save.push(marketData);
// save.push(settings);
