/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Idea               | Thoughts, plots, the lot
Game Data          | All game information stored in object variables
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
Ideas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*
//Automate harvesting while active
if (poltStatus.peas = "ready") {
   document.getElementById("harvest1").click();
}
*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Set plot status of each plot (Empty, growing, done)
let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
}

// Set the amount of player produce
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
}

// Set the prices of each plot
let initalPlots = {
   // Plot Prices
   plot1Price: 0,
   plot2Price: 25,
   plot3PeaPrice: 75,
   plot3CornPrice: 25,
   plot4Price: "undeterimed",
   plot5Price: "undeterimed",
   plot6Price: "undeterimed",
   plot7Price: "undeterimed",
   plot8Price: "undeterimed",
   plot9Price: "undeterimed",
   // Unlocked/locked
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
}

let plotStatus = initalPlotStatus;
let produce = initalProduce;
let plots = initalPlots;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Triggred by onclick of grow peas
function plantPeas() {
   // Set timeout for growingPeas and  readyPeas
   setTimeout(growingPeas, 2000); // Change the status if peas to growing in 2 seconds
   setTimeout(readyPeas, 5000); // Change the status of peas to ready in 5 seconds
   // Remove the grow peas button
   document.getElementById("grow1").style.opacity = "0";
}

function growingPeas() {plotStatus.peas = "growing";}
function readyPeas() {plotStatus.peas = "ready";}

function harvestPeas() {
   // Reset pea status to empty
   plotStatus.peas = "empty";
   // Show the grow button
   document.getElementById("grow1").style.opacity = "1";
   // Remove the harvest button
   document.getElementById("harvest1").style.opacity = "0";
   // Put the harvets button on top
   document.getElementById("harvest1").style.zIndex = "-1";
   // Put grow peas button on top
   document.getElementById("grow1").style.zIndex = "1";
   // Add one to peas
   produce.peas++;
}

/*
// Attempt at reducing to one harvest function
function harvest(veg, num) {
   plotStatus.veg = "empty";
   document.getElementById("grow" + num).style.opacity = "1";
   document.getElementById("harvest1" + num).style.opacity = "0";
   document.getElementById("harvest1" + num).style.zIndex = "-1";
   produce.veg++;
}
*/

function peaStatus() {
   // If pea status is equal to the string "ready"
   if (plotStatus.peas === "ready") {
      // Change background images to grow peas images
      document.getElementById("plot1").style.background = "url(../Images/Vegetables/Peas/grown-pea.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
      // Show the harvest button and put it on top
      document.getElementById("harvest1").style.opacity = "1";
      document.getElementById("harvest1").style.zIndex = "1";
      // Put the grow peas button under
      document.getElementById("grow1").style.zIndex = "-1";
   }
   // If pea status is equal to the string "ready"
   else if (plotStatus.peas === "growing") {
      // Change background images to sprouting plant image
      document.getElementById("plot1").style.background = "url(../Images/Plots/growing.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
   }
   // Otherwise
   else {
      // Change background images to empty plot image
      document.getElementById("plot1").style.background = "url(../Images/Plots/plot.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Corn
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function plantCorn() {
   setTimeout(growingCorn, 8000);
   setTimeout(readyCorn, 12000);
   document.getElementById("grow2").style.opacity = "0";
}

function growingCorn() {plotStatus.corn = "growing";}
function readyCorn() {plotStatus.corn = "ready";}

function harvestCorn() {
   plotStatus.corn = "empty";
   document.getElementById("grow2").style.opacity = "1";
   document.getElementById("harvest2").style.opacity = "0";
   document.getElementById("harvest2").style.zIndex = "-1";
   document.getElementById("grow2").style.zIndex = "1";
   produce.corn++;
}

function cornStatus() {
   if (plotStatus.corn === "ready") {
      document.getElementById("plot2").style.background = "url(../Images/Vegetables/Corn/grown-corn.png)";
      document.getElementById("plot2").style.backgroundSize = "cover";
      document.getElementById("harvest2").style.opacity = "1";
      document.getElementById("harvest2").style.zIndex = "1";
      document.getElementById("grow2").style.zIndex = "-1";
   }
   else if (plotStatus.corn === "growing") {
      document.getElementById("plot2").style.background = "url(../Images/Plots/growing.png)";
      document.getElementById("plot2").style.backgroundSize = "cover";
   }
   else {
      document.getElementById("plot2").style.background = "url(../Images/Plots/plot.png)";
      document.getElementById("plot2").style.backgroundSize = "cover";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Strawberries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function plantStrawberries() {
   setTimeout(sproutingStrawberries, 20000);
   setTimeout(floweringStrawberries, 60000);
   setTimeout(fruitingStrawberries, 120000);
   document.getElementById("grow3").style.opacity = "0";
}

function sproutingStrawberries() {plotStatus.strawberries = "sprouting";}
function floweringStrawberries() {plotStatus.strawberries = "flowering";}
function fruitingStrawberries() {plotStatus.strawberries = "fruiting";}

function harvestStrawberries() {
   plotStatus.strawberries = "empty";
   document.getElementById("grow3").style.opacity = "1";
   document.getElementById("harvest3").style.opacity = "0";
   document.getElementById("harvest3").style.zIndex = "-1";
   document.getElementById("grow3").style.zIndex = "1";
   produce.strawberries++;
}

function strawberriesStatus() {
   if (plotStatus.strawberries === "fruiting") {
      document.getElementById("plot3").style.background = "url(../Images/Fruits/Strawberries/grown-strawberries.png)";
      document.getElementById("plot3").style.backgroundSize = "cover";
      document.getElementById("harvest3").style.opacity = "1";
      document.getElementById("harvest3").style.zIndex = "1";
      document.getElementById("grow3").style.zIndex = "-1";
   }
   else if (plotStatus.strawberries === "flowering") {
      document.getElementById("plot3").style.background = "url(../Images/Fruits/Strawberries/flowering-strawberries.png)";
      document.getElementById("plot3").style.backgroundSize = "cover";
   }
   else if (plotStatus.strawberries === "sprouting") {
      document.getElementById("plot3").style.background = "url(../Images/Fruits/Strawberries/growing-strawberries.png)";
      document.getElementById("plot3").style.backgroundSize = "cover";
   }
   else {
      document.getElementById("plot3").style.background = "url(../Images/Plots/plot.png)";
      document.getElementById("plot3").style.backgroundSize = "cover";
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
   document.getElementById("lock3Text").innerHTML = 'This plot is locked <br> Pay 50 bushels of peas and 25 bushels of corn to unlock <br> <button class="purchase-plot" onclick="purchasePlot3()">Purchase Plot</button>';
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
}

var plantStatus = window.setInterval(function() {
   // Check plant status
   peaStatus();
   cornStatus();
   strawberriesStatus();
   // Update store
   produceDisplay();
}, 200)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function setup() {
   // Run product display
   produceDisplay();

   if (plots.cornplot === "unlocked") {
      setTimeout(openCornLock, 500);
   }
   if (plots.strawberryplot === "unlocked") {
      setTimeout(openStrawberryLock, 500);
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
