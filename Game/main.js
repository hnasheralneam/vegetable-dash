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
   produce.peas++;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Crop Time Remaining
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
let hour, min, sec;

function peaTime() {
   hour = 0;
   min = 0;
   sec = 5;
   setInterval(function() {
      document.getElementById("peaTimeRemaining").innerHTML = `${hour} hours ${min} minutes ${sec} seconds`;
      sec--;
      if (sec === 00 && hour > 0) {
         min --;
         sec = 60;
      }
      if (min === 00 && hour > 0) {
         hour --;
         min = 60;
      }
      if (sec <= 0 && min === 0 && hour === 0 && plotStatus.peas === "empty") {
         document.getElementById("peaTimeRemaining").innerHTML = "...";
      }
      else if (sec <= 0 && min === 0 && hour === 0) {
         document.getElementById("peaTimeRemaining").innerHTML = "Done!";
      }
   }, 1000);
}
*/

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Peas
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function plantPeas() {
   setTimeout(growing, 2000);
   setTimeout(harvestReadyPeas, 5000);
   document.getElementById("grow1").style.display = "none";
   // peaTime();
   // hour = 0;
   // min = 0;
   // sec = 5;
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
// Just Because
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function openLock() {
   // Opening lock animation
}
