// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let plotStatus = {
   peas: "empty",
   corn: "empty",
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Communal Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function growing() {
   plotStatus.peas = "growing";
}

function harvest() {
   plotStatus.peas = "empty";
   document.getElementById("grow1").style.display = "block";
   document.getElementById("harvest1").style.display = "none";
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function plantPeas() {
   setTimeout(growing, 2000);
   setTimeout(harvestReadyPeas, 5000);
   document.getElementById("grow1").style.display = "none";
}

function harvestReadyPeas() {
   plotStatus.peas = "ready";
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Status
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function peaStatus() {
   if (plotStatus.peas === "ready") {
      document.getElementById("plot1").style.background = "url(../Images/Plots/grown-pea.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
      document.getElementById("harvest1").style.display = "block";
   }
   else if (plotStatus.peas === "growing") {
      document.getElementById("plot1").style.background = "url(../Images/Plots/growing.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
   }
   else {
      document.getElementById("plot1").style.background = "url(../Images/Plots/plot.png)";
      document.getElementById("plot1").style.backgroundSize = "cover";
   }
}

// Check Plant Status
var plantStatus = window.setInterval(function() {
   peaStatus();
}, 200)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// just Because
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function openLock() {
   // Opening lock animation
}
