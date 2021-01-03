/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | All game information stored in object variables
Peas               | All about the first plot
Store              | Update the store
Purchase Plots     | Functiona that unlock plots
Setup              | Prepare game for returning player
Save               | Save the game data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Initate JavaScript strict mode
"use strict";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Set plot status of each plot (Empty, growing, done)
let plotStatus = {
   peas: "empty",
   corn: "empty",
}

// Set the amount of player produce
let produce = {
   peas: 0,
   corn: 0,
}

// Set the prices of each plot
let plots = {
   // Plot Prices
   plot1Price: 0,
   plot2Price: 25,
   plot3Price: "undeterimed",
   plot4Price: "undeterimed",
   plot5Price: "undeterimed",
   plot6Price: "undeterimed",
   plot7Price: "undeterimed",
   plot8Price: "undeterimed",
   plot9Price: "undeterimed",
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Triggred by onclick of grow peas
function plantPeas() {
   // Set timeout for growingPeas and harvestReadyPeas
   setTimeout(growingPeas, 2000); // Change the status if peas to growing in 2 seconds
   setTimeout(readyPeas, 5000); // Change the status of peas to ready in 5 seconds
   // Remove the grow peas button
   document.getElementById("grow1").style.opacity = "0";
}

function growingPeas() {plotStatus.peas = "growing";}
function readyPeas() {plotStatus.peas = "ready";}

function harvest() {
   // Reset pea status to empty
   plotStatus.peas = "empty";
   // SHow the grow button
   document.getElementById("grow1").style.opacity = "1";
   // Remove the harvest button
   document.getElementById("harvest1").style.opacity = "0";
   // Put the harvets button on top
   document.getElementById("harvest1").style.zIndex = "-1";
   // Add one to peas
   produce.peas++;
}

function peaStatus() {
   // If pea status is equal to the string "ready"
   if (plotStatus.peas === "ready") {
      // Change background images to grow peas images
      document.getElementById("plot1").style.background = "url(../Images/Plots/grown-pea.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
      // Show the harvest button and put it on top
      document.getElementById("harvest1").style.opacity = "1";
      document.getElementById("harvest1").style.zIndex = "1";
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
// Fresh Produce | Store
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function produceDisplay() {
   // Updates the amount of produce in store
   document.getElementById("peaBushels").innerHTML = `${produce.peas} Bushels of Peas`
}

var plantStatus = window.setInterval(function() {
   // Check plant status
   peaStatus();
   // Update store
   produceDisplay();
}, 200)

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
      openLock();
   }
}

function openLock() {
   // Add the lock image an extra class for the opening lock animation
   document.getElementById("lock2").classList.add("removing-lock");
   // Remove the lock in 2.5 seconds, the amount of time it takes for the animaiton
   setTimeout(removeLock, 2500);
}

function removeLock() {
   // Sets the lock as the variable lock2
   let lock2 = document.getElementById("lockedDiv2");
   // Remove the element
   lock2.remove();
   // And reveal the div beneath
   document.getElementById("openPlot2").style.display = "block";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function setup() {
   // Run product display
   produceDisplay();
}

// Run function setup when page loads
window.onload = setup();

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
   plotStatus: JSON.parse(localStorage.getItem("produce")),
   produce: JSON.parse(localStorage.getItem("produce")),
   plots: JSON.parse(localStorage.getItem("produce")),
}

// Set varibles as the saved items
produce = savegame.produce;

// If savegame is empty
if (savegame !== null) {
   // Set defaults
   savegame.produce = produce;
}
