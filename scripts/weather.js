//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Weather
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function weatherChance(rand, min, max) {
   return min <= rand && rand < max;
}

function chooseWeather() {
   let rand = (Math.random()).toFixed(2);
   if (weatherChance(rand, 0, .15)) { gameData.nextWeather = "sunny"; }
   if (weatherChance(rand, .15, .30)) { gameData.nextWeather = "rainy"; }
   if (weatherChance(rand, .30, .55)) { gameData.nextWeather = "partlySunny"; }
   if (weatherChance(rand, .55, .80)) { gameData.nextWeather = "partlyCloudy"; }
   if (weatherChance(rand, .80, .85)) { gameData.nextWeather = "snowy"; }
   if (weatherChance(rand, .85, .93)) { gameData.nextWeather = "cloudy"; }
   if (weatherChance(rand, .93, .95)) { gameData.nextWeather = "frost"; }
   if (weatherChance(rand, .95, 1.01)) { gameData.nextWeather = "flood"; }
   if (["snowy", "frost", "flood"].includes(gameData.weather)) { gameData.hasBeenPunished = false; }
   weatherEffects();
   updateWeatherDisplay();
}

function weatherEffects() {
   if (gameData.weather === "sunny") { gameData.marketResetBonus = 0.03; }
   else { gameData.marketResetBonus = 0; }
   if (gameData.weather === "snowy" && gameData.hasBeenPunished === false) {
      let unluckyVeg = gameData.plantSeeds[Math.floor(Math.random() * gameData.plantSeeds.length)];
      let amountLost = Math.floor(gameData[unluckyVeg] / 3);
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
         notify(`It has flooded! You lost ${amountLost} ${unluckyVeg}!`);
      }
      gameData.hasBeenPunished = true;
   }
   if (gameData.weather === "frost" && gameData.hasBeenPunished === false) {
      getPlotArrays().forEach(({ id, data }) => {
         if (isGrowing(data.status) && Math.random() > .5) {
            Plot.setStatus(id, "withered");
            showObj(`.btn${id}`);
         }
      });
      gameData.hasBeenPunished = true;
   }
}