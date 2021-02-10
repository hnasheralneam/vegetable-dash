/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Ideas              | Thoughts, plots, the lot
Game Data          | All game information stored in object variables
Veg Info Modals    | Info about vegetables
Harvest & Plant    | Harvest function
Peas               | All about the first plot
Store              | Update the store
Purchase Plots     | Functions that unlock plots
Setup              | Prepare game for returning player
Settings           | So far, just restart
Save               | Save the game data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Initate JavaScript strict mode
"use strict";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Set plot status of each plot (Empty, growing, done)
let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
}

// Set the amount of player produce
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
}

// Set the prices of each plot
let initalPlots = {
   // Plot Prices
   plot1Price: 0,
   plot2Price: 25,
   plot3PeaPrice: 75,
   plot3CornPrice: 25,
   plot4PeaPrice: 125,
   plot4CornPrice: 75,
   plot4StrawberryPrice: 25,
   plot5Price: "undeterimed",
   plot6Price: "undeterimed",
   plot7Price: "undeterimed",
   plot8Price: "undeterimed",
   plot9Price: "undeterimed",
   // Unlocked/locked
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
}

let plotStatus = initalPlotStatus;
let produce = initalProduce;
let plots = initalPlots;
//
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetable Info Modals
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function infoModal(veg) {
   // Set modal block ID
   let modalID = "info" + veg;
   let modalElement = document.getElementById(modalID);
   // If modal is open, close it
   if (modalElement.style.visibility === "visible") {
      modalElement.style.visibility = "collapse";
   }
   // Otherwise, open it
   else {
      modalElement.style.visibility = "visible";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Toggle Sidebar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let sidebarIsOpen = true;
function toggleSidebar() {
   if (sidebarIsOpen === true) {
      document.querySelector(".sidebar").style.right = "-100%";
      document.querySelector(".land").style.right = "-30%";
      sidebarIsOpen = false;
   }
   else if (sidebarIsOpen === false) {
      document.querySelector(".sidebar").style.right = "0";
      document.querySelector(".land").style.right = "0";
      sidebarIsOpen = true;
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Harvest & Plant
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function harvest(veg) {
   // Create proper IDs
   let plntID = "grow" + veg;
   let hrvstID = "harvest" + veg;

   // If veg is equal to peas
   if (veg === 'Peas') {
      // Set plot status to empty
      plotStatus.peas = "empty";
      // Add one to peas
      produce.peas++;
   }
   if (veg === "Corn") {
      plotStatus.corn = "empty";
      produce.corn++;
   }
   if (veg === "Strawberries") {
      plotStatus.strawberries = "empty";
      produce.strawberries++;
   }
   if (veg === "Eggplants") {
      plotStatus.eggplant = "empty";
      produce.eggplants++;
   }
   // Hide harvest button
   document.getElementById(hrvstID).style.opacity = "0";
   document.getElementById(hrvstID).style.zIndex = "-1";
   // Display grow button
   document.getElementById(plntID).style.opacity = "1";
   document.getElementById(plntID).style.zIndex = "1";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Set peaPlot to pea plot div in HTML
let peaPlot = document.getElementById("plot1");
// Set pea plant button
let peaPlntBtn = document.getElementById("growPeas");
// Set pea harvets button
let peaHvstBtn = document.getElementById("harvestPeas");

// Triggred by onclick of grow peas
function plantPeas() {
   // Set timeout for growingPeas and  readyPeas
   setTimeout(growingPeas, 2000); // Change the status if peas to growing in 2 seconds
   setTimeout(readyPeas, 5000); // Change the status of peas to ready in 5 seconds
   // Remove the grow peas button
   peaPlntBtn.style.opacity = "0";
}

function growingPeas() {plotStatus.peas = "growing";}
function readyPeas() {plotStatus.peas = "ready";}

function peaStatus() {
   // If pea status is equal to the string "ready"
   if (plotStatus.peas === "ready") {
      // Change background images to grow peas images
      peaPlot.style.background = "url(Images/Vegetables/Peas/grown-pea.png)";
      peaPlot.style.backgroundSize = "cover";
      // Show the harvest button and put it on top
      peaHvstBtn.style.opacity = "1";
      peaHvstBtn.style.zIndex = "1";
      // Put the grow peas button under
      peaPlntBtn.style.zIndex = "-1";
   }
   // If pea status is equal to the string "ready"
   else if (plotStatus.peas === "growing") {
      // Change background images to sprouting plant image
      peaPlot.style.background = "url(Images/Plots/growing.png)";
      peaPlot.style.backgroundSize = "cover";
   }
   // Otherwise
   else {
      // Change background images to empty plot image
      peaPlot.style.background = "url(Images/Plots/plot.png)";
      peaPlot.style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Corn
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let cornPlot = document.getElementById("plot2");
let cornPlntBtn = document.getElementById("growCorn");
let cornHvstBtn = document.getElementById("harvestCorn");

function plantCorn() {
   setTimeout(growingCorn, 8000);
   setTimeout(readyCorn, 12000);
   cornPlntBtn.style.opacity = "0";
}

function growingCorn() {plotStatus.corn = "growing";}
function readyCorn() {plotStatus.corn = "ready";}

function cornStatus() {
   if (plotStatus.corn === "ready") {
      cornPlot.style.background = "url(Images/Vegetables/Corn/grown-corn.png)";
      cornPlot.style.backgroundSize = "cover";
      cornHvstBtn.style.opacity = "1";
      cornHvstBtn.style.zIndex = "1";
      cornPlntBtn.style.zIndex = "-1";
   }
   else if (plotStatus.corn === "growing") {
      cornPlot.style.background = "url(Images/Plots/growing.png)";
      cornPlot.style.backgroundSize = "cover";
   }
   else {
      cornPlot.style.background = "url(Images/Plots/plot.png)";
      cornPlot.style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Strawberries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let strawberriesPlot = document.getElementById("plot3");
let strawberriesPlntBtn = document.getElementById("growStrawberries");
let strawberriesHvstBtn = document.getElementById("harvestStrawberries");

function plantStrawberries() {
   setTimeout(sproutingStrawberries, 20000);
   setTimeout(floweringStrawberries, 60000);
   setTimeout(fruitingStrawberries, 120000);
   strawberriesPlntBtn.style.opacity = "0";
}

function sproutingStrawberries() {plotStatus.strawberries = "sprouting";}
function floweringStrawberries() {plotStatus.strawberries = "flowering";}
function fruitingStrawberries() {plotStatus.strawberries = "fruiting";}

function strawberriesStatus() {
   if (plotStatus.strawberries === "fruiting") {
      strawberriesPlot.style.background = "url(Images/Fruits/Strawberries/grown-strawberries.png)";
      strawberriesPlot.style.backgroundSize = "cover";
      strawberriesHvstBtn.style.opacity = "1";
      strawberriesHvstBtn.style.zIndex = "1";
      strawberriesPlntBtn.style.zIndex = "-1";
   }
   else if (plotStatus.strawberries === "flowering") {
      strawberriesPlot.style.background = "url(Images/Fruits/Strawberries/flowering-strawberries.png)";
      strawberriesPlot.style.backgroundSize = "cover";
   }
   else if (plotStatus.strawberries === "sprouting") {
      strawberriesPlot.style.background = "url(Images/Fruits/Strawberries/growing-strawberries.png)";
      strawberriesPlot.style.backgroundSize = "cover";
   }
   else {
      strawberriesPlot.style.background = "url(Images/Plots/plot.png)";
      strawberriesPlot.style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Eggplant
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let eggplantPlot = document.getElementById("plot4");
let eggplantPlntBtn = document.getElementById("growEggplants");
let eggplantHvstBtn = document.getElementById("harvestEggplants");

function plantEggplants() {
   setTimeout(growingEggplant, 120000);
   setTimeout(readyEggplant, 480000);
   eggplantPlntBtn.style.opacity = "0";
}

function growingEggplant() {plotStatus.eggplant = "growing";}
function readyEggplant() {plotStatus.eggplant = "ready";}

function eggplantStatus() {
   if (plotStatus.eggplant === "ready") {
      eggplantPlot.style.background = "url(Images/Vegetables/Eggplant/grown-eggplant.png)";
      eggplantPlot.style.backgroundSize = "cover";
      eggplantHvstBtn.style.opacity = "1";
      eggplantHvstBtn.style.zIndex = "1";
      eggplantPlntBtn.style.zIndex = "-1";
   }
   else if (plotStatus.eggplant === "growing") {
      eggplantPlot.style.background = "url(Images/Plots/growing.png)";
      eggplantPlot.style.backgroundSize = "cover";
   }
   else {
      eggplantPlot.style.background = "url(Images/Plots/plot.png)";
      eggplantPlot.style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Purchase Plots
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Plot 1 starts unlocked
function purchasePlot2() {
   // If there are enough peas
   if (produce.peas >= plots.plot2Price) {
      // Substract that amount
      produce.peas -= plots.plot2Price;
      // And run unlocking plot animation
      openCornLock();
   }
}

function purchasePlot3() {
   if (produce.peas >= plots.plot3PeaPrice && produce.corn >= plots.plot3CornPrice) {
      produce.peas -= plots.plot3PeaPrice;
      produce.corn -= plots.plot3CornPrice;
      openStrawberryLock();
   }
}

function purchasePlot4() {
   if (produce.peas >= plots.plot4PeaPrice && produce.corn >= plots.plot4CornPrice  && produce.strawberries >= plots.plot4StrawberryPrice) {
      produce.peas -= plots.plot4PeaPrice;
      produce.corn -= plots.plot4CornPrice;
      produce.strawberries >= plots.plot4StrawberryPrice;
      openEggplantLock();
   }
}

function openCornLock() {
   // Add the lock image an extra class for the opening lock animation
   document.getElementById("lock2").classList.add("removing-lock");
   // Remove the lock in 2.5 seconds, the amount of time it takes for the animaiton
   setTimeout(removeLock, 2500);
   // Unlock third plot purchase
   document.getElementById("lock3Text").innerHTML = 'This plot is locked <br> Pay 75 bushels of peas and 25 bushels of corn to unlock <br> <button class="purchase-plot" onclick="purchasePlot3()">Purchase Plot</button>';
}

function openStrawberryLock() {
   document.getElementById("lock3").classList.add("removing-lock");
   setTimeout(removeStrawberryLock, 2500);
   document.getElementById("lock4Text").innerHTML = 'This plot is locked <br> Pay 125 bushels of peas, 75 bushels of corn, and 25 bushels of strawberries to unlock <br> <button class="purchase-plot" onclick="purchasePlot4()">Purchase Plot</button>';
}

function openEggplantLock() {
   document.getElementById("lock4").classList.add("removing-lock");
   setTimeout(removeEggplantLock, 2500);
}

function removeLock() {
   // Sets the lock as the variable lock2
   let lock2 = document.getElementById("lockedDiv2");
   // Remove the element
   lock2.remove();
   // And reveal the div beneath
   document.getElementById("openPlot2").style.display = "block";
   // Add item to plots
   plots.cornplot = "unlocked";
}

function removeStrawberryLock() {
   let lock3 = document.getElementById("lockedDiv3");
   lock3.remove();
   document.getElementById("openPlot3").style.display = "block";
   plots.strawberryplot = "unlocked";
}

function removeEggplantLock() {
   let lock4 = document.getElementById("lockedDiv4");
   lock4.remove();
   document.getElementById("openPlot4").style.display = "block";
   plots.eggplantplot = "unlocked";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Intoduction
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let introIsDone = true;
let introPartsDone = {
   hello: "no",
   meetGramps: "no",
   planting: "no",
   sidebar: "no",
   meetGran: "no",
   bushes: "no",
   restarting: "no",
   nearlyDone: "no",
   quests: "no",
   thatsIt: "no",
}

function runIntro() {
   if (introIsDone === false) {
      document.querySelector(".intro-container").style.display = "grid";
      intro();
   }
}

function intro() {
   // Set important DOM objects
   let introShadow = document.querySelector(".introDarkShadow");
   let qstRibbon = document.getElementById("questRibbon");
   let introBlock = document.querySelector(".intro-character");
   let introImg = document.querySelector(".intro-img");
   let introText = document.querySelector(".intro-text");
   // Dark background for focus, hidden ribbon
   introShadow.style.visibility = "visible";
   qstRibbon.style.zIndex = "0.2";
   ifHello();
   // Running intro
   function ifHello() {
      if (introPartsDone.hello === "no") {
         introPartsDone.hello = "yes";
      }
      else {
         meetGrapms();
      }
   }
   function meetGrapms() {
      if (introPartsDone.meetGramps === "no") {
         $(".intro-img").attr("src", "Images/Intro/gramps.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin', the good ol' way!";
         introPartsDone.meetGramps = "yes";
      }
      else {
         planting();
      }
   }
   function planting() {
      if (introPartsDone.planting === "no") {
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press Grow Peas, and when it's done, press Harvest Peas!";
         document.querySelector(".plant-quest-arrow").style.display = "block";
         document.getElementById("plot1").style.zIndex = "1";
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
         introText.textContent = "This sidebar is were you keep control of the farm. You can control many things, but Grandma Josephine will talk about that.";
         document.querySelector("#information").style.zIndex = "1";
         introPartsDone.sidebar = "yes";
      }
      else {
         document.querySelector("#information").style.zIndex = "0";
         meetGran();
      }
   }
   function meetGran() {
      if (introPartsDone.meetGran === "no") {
         $(".intro-img").attr("src", "Images/Intro/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
         introPartsDone.meetGran = "yes";
      }
      else {
         bushels();
      }
   }
   function bushels() {
      if (introPartsDone.bushels === "no") {
         introText.textContent = "Here you find the amount of resouces you have. Watch it wisely, and make sure you don't spend them all!";
         document.querySelector("#peaBushels").style.zIndex = "1";
         introPartsDone.bushels = "yes";
      }
      else {
         restarting();
      }
   }
   function restarting() {
      if (introPartsDone.restarting === "no") {
         introPartsDone.restarting = "yes";
      }
      else {
         nearlyDone();
      }
   }
   function nearlyDone() {
      if (introPartsDone.nearlyDone === "no") {
         introPartsDone.nearlyDone = "yes";
      }
      else {
         quests();
      }
   }
   function quests() {
      if (introPartsDone.quests === "no") {
         introPartsDone.quests = "yes";
      }
      else {
         thatsIt();
      }
   }
   function thatsIt() {
      if (introPartsDone.thatsIt === "no") {
         document.querySelector(".intro-container").style.display = "none";
         introShadow.style.visibility = "collapse";
         qstRibbon.style.zIndex = "1";
         introPartsDone.thatsIt = "yes";
      }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Quests
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let questStatus =  {
   // Started ect.
   meetJeb: "",
}

// Toggle quest bar
document.addEventListener("keyup", function(event) {
   if (event.ctrlKey && event.keyCode === 81) {
      if (document.querySelector("#questContent").style.width === "500px") {
         closequestbar();
      }
      else {
         questbar();
      }
   }
});

function questbar() {
   document.querySelector("#questContent").style.width = "500px";
   document.getElementById("innerQuestContent").style.display = "block";
   document.getElementById("questRibbon").style.left = "500px";
   document.getElementById("darkShadow").style.visibility = "visible";
}

function closequestbar() {
   document.getElementById("questContent").style.width = "0";
   document.getElementById("innerQuestContent").style.display = "none";
   document.getElementById("questRibbon").style.left = "0";
   document.getElementById("darkShadow").style.visibility = "collapse";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let seeds = 500;
let producePrices = {
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 250,
   sellStrawberries: 250,
   buyEggplants: 500,
   sellEggplants: 500,
}

function openMarket() {
   document.querySelector(".marketShadow").style.visibility = "visibility";
   document.querySelector(".market").style.visibility = "visibility";
}

function closeMarket() {
   document.querySelector(".marketShadow").style.visibility = "collapse";
   document.querySelector(".market").style.visibility = "collapse";
}

function buyPeas() {
   if (seeds >= producePrices.buyPeas) {
      produce.peas += 5;
      seeds -= producePrices.buyPeas;
      producePrices.buyPeas *= 1.08;
      producePrices.sellPeas *= 1.08;
   }
}

function sellPeas() {
   if (produce.peas >= 5) {
      produce.peas -= 5;
      seeds += producePrices.sellPeas;
      producePrices.buyPeas *= 0.92;
      producePrices.sellPeas *= 0.92;
   }
}

var updateMarket = window.setInterval(function() {
   document.getElementsByClassName("market-item-content")[0].textContent = `Seeds: ${Math.floor(seeds)}`;
   document.getElementsByClassName("market-item-content")[1].textContent = `Peas: ${produce.peas}
   Cost: ${Math.floor(producePrices.buyPeas)} Seeds
   Sell: ${Math.floor(producePrices.sellPeas)} Seeds`;
   // document.getElementsByClassName("market-item-content")[2].textContent = `Buy Corn
   // Cost: 75 Seeds
   // Sell: 75 Seeds`;
   document.getElementsByClassName("market-item-content")[3].textContent = `Buy Strawberries
   Cost: 250 Seeds
   Sell: 250 Seeds`;
   document.getElementsByClassName("market-item-content")[4].textContent = `Buy Eggplant \r\n Cost: 500 Seeds \r\n Sell: 500 Seeds`;
}, 250)


let blackMarketItem = document.createElement("DIV");
blackMarketItem.textContent = `hi`;
document.querySelector(".market-item").appendChild(blackMarketItem);

let sellerName = ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)];
let sellItem = ["Cheese", "Currency", "Watering Cans", "Fertilizer"][Math.floor(Math.random() * 4)];
let sellItemQuantity = Math.floor(Math.random() * (25 - 5)) + 5;
let seedCost = Math.floor(Math.random() * (8000 - 2000)) + 2000;

document.getElementsByClassName("market-item-content")[2].textContent = `Offer by ${sellerName}
Selling ${sellItemQuantity} ${sellItem}
for ${seedCost} Seeds`;

function deny() {
   sellerName = ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)];
   sellItem = ["Cheese", "Currency", "Watering Cans", "Fertilizer"][Math.floor(Math.random() * 4)];
   sellItemQuantity = Math.floor(Math.random() * (25 - 5)) + 5;
   seedCost = Math.floor(Math.random() * (8000 - 2000)) + 2000;
   document.getElementsByClassName("market-item-content")[2].textContent = `Offer by ${sellerName}
   Selling ${sellItemQuantity} ${sellItem}
   for ${seedCost} Seeds`;
   document.getElementsByClassName("market-item")[2].style.backgroundColor = generateColor();
}


// Random Color
function rand(min, max) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.round(randomNum);
}

let generateColor = function () {
   let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   let color = '#';
   for (let i = 0; i < 6; i++) {
      let index = rand(0, 15);
      color += hex[index];
   }
   return color;
};

document.getElementsByClassName("market-item")[2].style.backgroundColor = generateColor();

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Right Click Menu
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let rightClickMenu = document.getElementById("menu").style;
if (document.addEventListener) {
   document.addEventListener('contextmenu', function(e) {
      var posX = e.clientX;
      var posY = e.clientY;
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
// Fresh Produce | Store
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function produceDisplay() {
   // Updates the amount of produce in store
   // If the plot is unlocked
   if (plots.peaplot === "unlocked") {
      // Show the element
      document.getElementById("peaBushels").style.visibility = "visible";
      // Display the amount of that product
      document.getElementById("peaBushels").innerHTML = `${produce.peas} Bushels of Peas`;
   }
   if (plots.cornplot === "unlocked") {
      document.getElementById("cornBushels").style.visibility = "visible";
      document.getElementById("cornBushels").innerHTML = `${produce.corn} Bushels of Corn`;
   }
   if (plots.strawberryplot === "unlocked") {
      document.getElementById("strawberryBushels").style.visibility = "visible";
      document.getElementById("strawberryBushels").innerHTML = `${produce.strawberries} Bushels of Strawberries`;
   }
   if (plots.eggplantplot === "unlocked") {
      document.getElementById("eggplantBushels").style.visibility = "visible";
      document.getElementById("eggplantBushels").innerHTML = `${produce.eggplants} Bushels of Eggplants`;
   }
}

var plantStatus = window.setInterval(function() {
   // Check plant status
   peaStatus();
   cornStatus();
   strawberriesStatus();
   eggplantStatus();
   // Update store
   produceDisplay();
}, 200)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function setup() {
   // Run product display
   produceDisplay();
   // Check if intro is needed
   runIntro();

   if (plots.cornplot === "unlocked") {
      openCornLock();
   }
   if (plots.strawberryplot === "unlocked") {
      openStrawberryLock();
   }
   if (plots.eggplantplot === "unlocked") {
      openEggplantLock();
   }
}

// Run function setup when page loads
window.addEventListener('load', (event) => {
   setup();
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function restart() {
   plotStatus = initalPlotStatus;
   produce = initalProduce;
   plots = initalPlots;
}

function restart() {
   // Confirm Restart
   var areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   // If restart is confirmed
   if (areYouSure == true) {
      // Ask again
      var areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      // If restart is still confirmed
      if (areYouReallySure == true) {
         // Set game data to inital values
         plotStatus = initalPlotStatus;
         produce = initalProduce;
         plots = initalPlots;
         // Set save as blank
         localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
         localStorage.setItem("produce", JSON.stringify(produce));
         localStorage.setItem("plots", JSON.stringify(plots));
         // Reload the page
         window.location.href = "#";
      }
   }
}

// Music
let myAudio =document.querySelector(".mozart");

function togglePlay() {
  return myAudio.paused ? myAudio.play() : myAudio.pause();
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Set game data variables to local storage
var saveLoop = window.setInterval(function() {
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
}, 1000)

// Find the items from loacl storage and assign to key
var savegame = {
   plotStatus: JSON.parse(localStorage.getItem("plotStatus")),
   produce: JSON.parse(localStorage.getItem("produce")),
   plots: JSON.parse(localStorage.getItem("plots")),
}

// Set varibles as the saved items
plotStatus = savegame.plotStatus;
produce = savegame.produce;
plots = savegame.plots;

// If savegame is empty
if (savegame !== null) {
   // Set defaults
   savegame.plotStatus = plotStatus;
   savegame.produce = produce;
   savegame.plots = plots;
   // Then set varibles to saved items
   plotStatus = savegame.plotStatus;
   produce = savegame.produce;
   plots = savegame.plots;
}
