// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let plotStatus = {
   peas: "empty",
   corn: "empty",
}

let produce = {
   peas: 0,
   corn: 0,
}

let plots = {
   // P;lot status: open, opening, or locked
   polt1: "open",
   plot2: "locked",
   plot3: "locked",
   plot4: "locked",
   plot5: "locked",
   plot6: "locked",
   plot7: "locked",
   plot8: "locked",
   plot9: "locked",
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Communal Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function growing() {
   plotStatus.peas = "growing";
}

function harvest() {
   plotStatus.peas = "empty";
   document.getElementById("grow1").style.opacity = "1";
   document.getElementById("harvest1").style.display = "none";
   produce.peas++;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Purchase Plots
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Plot 1 starts unlocked
function purchasePlot2() {
   if (produce.peas >= plots.plot2Price) {
      produce.peas -= plots.plot2Price;
      openLock();
   }
}

function openLock() {
   document.getElementById("lock2").classList.add("removing-lock");
   setTimeout(removeLock, 2500);
}

function removeLock() {
   let lock = document.getElementById("lockedDiv2");
   lock.remove();
   document.getElementById("openPlot2").style.display = "block";
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Crop Time Remaining
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

  return {
    total,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
   const clock = document.getElementById(id);
   const hoursSpan = clock.querySelector('.hours');
   const minutesSpan = clock.querySelector('.minutes');
   const secondsSpan = clock.querySelector('.seconds');

   function updateClock() {
      const t = getTimeRemaining(endtime);
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
      if (t.total <= 0) {
         clearInterval(timeinterval);
      }
   }
   updateClock();
   const timeinterval = setInterval(updateClock, 1000);
}

const deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);
*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function plantPeas() {
   setTimeout(growing, 2000);
   setTimeout(harvestReadyPeas, 5000);
   document.getElementById("grow1").style.opacity = "0";
}

function plantCorn() {
   setTimeout(growing, 2000);
   setTimeout(harvestReadyCorn, 5000);
   document.getElementById("grow2").style.opacity = "0";
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
   produceDisplay();
}, 200)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Fresh Produce | Store
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function produceDisplay() {
   document.getElementById("peaBushels").innerHTML = `${produce.peas} Bushels of Peas`
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setup() {
   produceDisplay();
}

window.onload = setup();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var saveLoop = window.setInterval(function() {
   localStorage.setItem("produce", JSON.stringify(produce));
}, 1000)

var savegame = {
   produce: JSON.parse(localStorage.getItem("produce")),
}

produce = savegame.produce;

if (savegame !== null) {
   savegame.produce = produce;
}
