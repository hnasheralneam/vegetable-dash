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
   if (gameData.weather === "rainy") { weatherDisplay("Rainy", "Benefits: +1 produce per harvest", "rain.svg"); }
   if (gameData.weather === "partlyCloudy") { weatherDisplay("Partly Cloudy", "Effects: None", "overcast.svg"); }
   if (gameData.weather === "partlySunny") { weatherDisplay("Partly Sunny", "Effects: None", "partly-cloudy.svg"); }
   if (gameData.weather === "snowy") { weatherDisplay("Snowy", "Detriments: -1/3% of a stored vegetable", "snow.svg"); }
   if (gameData.weather === "cloudy") { weatherDisplay("Cloudy", "Detriments: +25% growing time", "cloudy.svg"); }
   if (gameData.weather === "frost") { weatherDisplay("Frost", "Detriments: 50% chance plants will wither", "frost.svg"); }
   if (gameData.weather === "flood") { weatherDisplay("Flooding", "Detriments: -20% of a stored vegetable", "flood.svg"); }
   if (gameData.lastWeather === "sunny") { lastWeather("sunny.svg"); }
   if (gameData.lastWeather === "rainy") { lastWeather("rain.svg"); }
   if (gameData.lastWeather === "partlyCloudy") { lastWeather("overcast.svg"); }
   if (gameData.lastWeather === "partlySunny") { lastWeather("partly-cloudy.svg"); }
   if (gameData.lastWeather === "snowy") { lastWeather("snow.svg"); }
   if (gameData.lastWeather === "cloudy") { lastWeather("cloudy.svg"); }
   if (gameData.lastWeather === "frost") { lastWeather("frost.svg"); }
   if (gameData.lastWeather === "flood") { lastWeather("flood.svg"); }
   if (gameData.nextWeather === "sunny") { nextWeather("sunny.svg"); }
   if (gameData.nextWeather === "rainy") { nextWeather("rain.svg"); }
   if (gameData.nextWeather === "partlyCloudy") { nextWeather("overcast.svg"); }
   if (gameData.nextWeather === "partlySunny") { nextWeather("partly-cloudy.svg"); }
   if (gameData.nextWeather === "snowy") { nextWeather("snow.svg"); }
   if (gameData.nextWeather === "cloudy") { nextWeather("cloudy.svg"); }
   if (gameData.nextWeather === "frost") { nextWeather("frost.svg"); }
   if (gameData.nextWeather === "flood") { nextWeather("flood.svg"); }
   function lastWeather(url) { document.querySelector(".weather-last").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
   function nextWeather(url) { document.querySelector(".weather-next").style.background = `url("Images/Weather/${url}") no-repeat center center / contain`; }
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
      document.querySelector(`.${veg.toLowerCase()}-buy`).dataset.info = `Buy for ${toWord(Math.round(gameData["vegCost"][veg]["buy"]), "short")}`;
      document.querySelector(`.${veg.toLowerCase()}-sell`).dataset.info = `Sell for ${toWord(Math.round(gameData["vegCost"][veg]["sell"]), "short")}`;
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
   document.querySelector(`.${veg}-market-item`).textContent = `${capitalize(veg)} \r\n ${toWord(gameData[veg])}`;
}