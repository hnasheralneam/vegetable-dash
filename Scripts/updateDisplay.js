// Update all
function initDisplay() {
   updateWeatherDisplay();

   updateFertilizer();
   updateDoughnuts();
   updatePoliceChance();
   updateMarketResets();
   updateMarketSalePrices();
   updateCoins();
   updateGenes();
   updateVegetables();
}

// Weather display
function updateWeatherDisplay() {
   if (gameData.weather === "sunny") { weatherDisplay("Sunny", "Benefits: +3% market reset harvest chance", "sunny.svg"); }
   if (gameData.weather === "rainy") { weatherDisplay("Rainy", "Benefits: +1 produce per harvest", "rainy.svg"); }
   if (gameData.weather === "partlyCloudy") { weatherDisplay("Partly Cloudy", "Effects: None", "partlyCloudy.svg"); }
   if (gameData.weather === "partlySunny") { weatherDisplay("Partly Sunny", "Effects: None", "partlySunny.svg"); }
   if (gameData.weather === "snowy") { weatherDisplay("Snowy", "Detriments: Lose -1/3 of a stored vegetable", "snowy.svg"); }
   if (gameData.weather === "cloudy") { weatherDisplay("Cloudy", "Detriments: +25% growing time", "cloudy.svg"); }
   if (gameData.weather === "frost") { weatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (gameData.weather === "flood") { weatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }

   document.querySelector(".weather-last").style.background = `url("Images/Weather/${gameData.lastWeather}.svg") no-repeat center center / contain`;
   document.querySelector(".weather-next").style.background = `url("Images/Weather/${gameData.nextWeather}.svg") no-repeat center center / contain`;

   function weatherDisplay(weather, text, url) {
      document.querySelector(".weather-name").textContent = weather;
      document.querySelector(".weather-description").innerHTML = text;
      document.querySelector(".weather-img").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`;
   }
}

// Fertilizer
function updateFertilizer() {
   document.querySelector("#fertilizer").dataset.info = `${Math.round(gameData.fertilizers)} bags of Fertilizers <br> Click + Place to apply`;
}

// Black Market
function updateDoughnuts() {
   document.querySelector(".doughnuts").textContent = `${toWord(gameData.doughnuts)} Doughnuts`;
   document.querySelector(".doughnuts-in-bm").textContent = `${toWord(gameData.doughnuts)} Doughnuts`;
}

function updatePoliceChance() {
   document.querySelector(".police-chance").textContent = (gameData.black.catchChance).toFixed(2);
}

// Market
function updateMarketResets() {
   document.querySelector(".market-resets").textContent = `You have ${gameData.marketResets}`;
}

function updateMarketSalePrices() {
   gameData.plantSeeds.forEach(veg => {
      if (document.querySelector(`.${veg.toLowerCase()}-buy`)) {
         document.querySelector(`.${veg.toLowerCase()}-buy`).dataset.info = `Buy for ${toWord(Math.round(gameData["vegCost"][veg]["buy"]), "short")}`;
         document.querySelector(`.${veg.toLowerCase()}-sell`).dataset.info = `Sell for ${toWord(Math.round(gameData["vegCost"][veg]["sell"]), "short")}`;
      }
   });
}

// Coins
function updateCoins() {
   document.querySelector(".main-values-coins").textContent = `${toWord(gameData.coins)} Coins`;
}

// Genes
function updateGenes() {
   document.querySelector(".main-values-genes").textContent = `${toWord(gameData.genes)} Genes`;
}

// Vegetable amounts
function updateVegetables() {
   gameData.plantSeeds.forEach(veg => {
      updateVeg(veg);
   });
}

function updateVeg(veg) {
   let displayParents = document.querySelectorAll(`.${veg}Display`);
   displayParents.forEach((val, i, arr) => {
      document.querySelectorAll(`.${veg}Display`)[i].style.display = "block";
   });
   let displays = document.querySelectorAll(`.${veg}`);
   displays.forEach((val, i, arr) => {
      document.querySelectorAll(`.${veg}`)[i].textContent = `${toWord(gameData[veg], "short")} Bushels of ${capitalize(veg)}`;
   });
   // Update vegetable values in market
   if (document.querySelector(`.${veg}-market-item`)) document.querySelector(`.${veg}-market-item`).textContent = `${capitalize(veg)} \r\n ${toWord(gameData[veg])}`;
}