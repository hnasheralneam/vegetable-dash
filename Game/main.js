// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright Janurary 1st 2021
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let discoveredVegtables = {
   key: "value",
}

function plantPeas() {
   setInterval(growing, 2000);
   //setInterval(harvestReadyPeas, 5000);
}

function growing() {
   document.getElementById("plot1").style.background = "url(D:/Documents/GitHub/vegetable-dash/Images/growing.png)";
   document.getElementById("plot1").style.backgroundSize = "cover";
}

function harvestReadyPeas() {
   document.getElementById("plot1").style.background = "url(D:/Documents/GitHub/vegetable-dash/Images/grow-pea.png)";
   document.getElementById("plot1").style.backgroundSize = "cover";
   document.getElementById("plant1").style.display = "none";
   document.getElementById("harvest1").style.display = "block";
}

function harvest() {

}

window.onload = plantPeas();
