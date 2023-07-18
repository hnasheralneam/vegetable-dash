//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Weather
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function weatherChance(min, max) {
   let value = {};
   for (i = min; i < max; i += .01) {
      if (randomWeatherNum === i.toFixed(2)) { value[i] = true; }
      else { value[i.toFixed(2)] = false; }
   }
   return !Object.keys(value).every((k) => !value[k]);
}

function chooseWeather() {
   randomWeatherNum = (Math.random()).toFixed(2);
   if (weatherChance(0, .15) === true) { gameData.nextWeather = "sunny"; }
   if (weatherChance(.15, .30) === true) { gameData.nextWeather = "rainy"; }
   if (weatherChance(.30, .55) === true) { gameData.nextWeather = "partlySunny"; }
   if (weatherChance(.55, .80) === true) { gameData.nextWeather = "partlyCloudy"; }
   if (weatherChance(.80, .85) === true) { gameData.nextWeather = "snowy"; }
   if (weatherChance(.85, .93) === true) { gameData.nextWeather = "cloudy"; }
   if (weatherChance(.93, .95) === true) { gameData.nextWeather = "frost"; }
   if (weatherChance(.95, 1.01) === true) { gameData.nextWeather = "flood"; }
   if (gameData.weather === "snowy" || "frost" || "flood") { gameData.hasBeenPunished = false; }
   weatherEffects();
   updateWeatherDisplay();
}

function weatherEffects() {
   if (gameData.weather === "sunny") { gameData.marketResetBonus = 0.03; }
   else { gameData.marketResetBonus = 0; }
   if (gameData.weather === "snowy" && gameData.hasBeenPunished === false) {
      let unluckyVeg = gameData.plantSeeds[Math.floor(Math.random() * gameData.plantSeeds.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] / 3);
      console.log(amountLost);
      if (amountLost > 0) {
         gameData[unluckyVeg] -= amountLost;
         updateVeg(unluckyVeg);
         notify(`It has snowed! You lost ${amountLost} ${unluckyVeg}!`);
         gameData.hasBeenPunished = true;
      }
   }
   if (gameData.weather === "flood" && gameData.hasBeenPunished === false) {
      let unluckyVeg = gameData.plantSeeds[Math.floor(Math.random() * gameData.plantSeeds.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] / 5);
      if (amountLost > 0) {
         gameData[unluckyVeg] -= amountLost;
         updateVeg(unluckyVeg);
      }
      notify(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      gameData.hasBeenPunished = true;
   }
   if (gameData.weather === "frost" && gameData.hasBeenPunished === false) {
      gameData.plots.forEach((val, i, arr) => {
         if (arr[i].isGrowing() && Math.random() > .5) {
            arr[i].status = "withered";
            showObj(`.btn${i}`);
         }
      });
      gameData.hasBeenPunished = true;
   }
}