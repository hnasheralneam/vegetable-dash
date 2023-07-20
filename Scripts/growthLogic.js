//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Plot {
   constructor(state, plant) {
      this.status = state;
      this.plant = plant;
      this.bushels = 1;
      // Traits - soon
      // this.firstBoon;
      // this.secndBoon;
      // this.thirdBoon;
   }
   getState() {
      if (this.status == "Ready") { return "Ready"; }
      if (this.status == "Empty") { return "Empty"; }
      if (this.status == "withered") { return "withered"; }
   }
   isGrowing() {
      if (["Ready", "Empty", "withered"].includes(this.status)) { return false; }
      else { return true; }
   }
   harvestReady() {
      if (this.status == "Ready") { return true; }
      else { return false; }
   }
}

function initPlots() {
   gameData.plots.forEach((val, i, arr) => {
      let array = arr.shift();
      gameData.plots.push(new Plot(array.status, array.plant, array.bushels));
   });
   gameData.plots.forEach((val, i) => {
      let index = i;
      let plotBody = document.createElement("DIV");
      plotBody.classList.add("plot");
      plotBody.id = `plot${index}`;
      document.querySelector(".land").appendChild(plotBody);

      ourNum = i;
      plotBody.innerHTML = `
      ${gameData.plantLoadingBars ?
         `<div class="plant-progress plant-progress-${i}">
         <span class="plant-progress-view plant-progress-view-${i}">
            <span><p class="plant-progress-text plant-progress-text-${i}">Empty</p></span>
         </span>
      </div>`
      : ""}
      <div class="countdown time-left">
         <span class="time-left-${index}"></span>
         <img src="Images/Icons/clock.svg">
      </div>
      <img src="Images/Vegetables/${val.plant}.png" class="veg-icon plant-icon-${index}" src="Images/Vegetables/${val.plant}.png">
      <button class="almanacBtn almanac${index}" onclick="toggleAlmanac(${index})">
         <img src="Images/General/almanac.png" class="almanac">
      </button>
      <button class="btn${index} btn" onclick="tendTo(${index}, '${val.plant}')">Grow ${val.plant}!</button>
      <ul class="shop-window" id="shop${index}"></ul>
      `;

      gameData.plantSeeds.forEach((value) => {
         let listItem = document.createElement("LI");
         let listImg = document.createElement("IMG");
         listImg.classList.add("store-icon");
         listImg.src = `Images/Vegetables/${value}.png`;
         listImg.dataset.info = `Grows in ${formatTime(gameInfo[value + "Time"][2])}`;
         listImg.onmouseover = () => { info(listImg); };
         listImg.onclick = () => { tendTo(index, value); };
         listItem.appendChild(listImg);
         plotBody.querySelector(".shop-window").appendChild(listItem);
      });
      if (gameData.plots[index].isGrowing() || gameData.plots[index].status == "Ready") {
         plantGrowthLoop(index);
         document.querySelector(`.almanac${index}`).disabled = true;
         if (gameData.plantLoadingBars) updatePlantLoadBar(index);
      }
   });
}

function toggleAlmanac(index) {
   if (document.getElementById(`shop${index}`).style.height === "95%") {
      document.getElementById(`shop${index}`).style.height = "0";
   } else {
      document.getElementById(`shop${index}`).style.height = "95%";
   }
}

function tendTo(pos, veg) {
   document.getElementById(`shop${pos}`).style.height = "0";
   document.querySelector(`.almanac${pos}`).disabled = true;
   // Harvest
   if (gameData.plots[pos].harvestReady()) {
      document.title = "Vegetable Dash";
      document.querySelector(`.almanac${pos}`).disabled = false;
      gameData.plots[pos].status = "Empty";
      // Chances
      harvestLuck(veg);
      // Decide yield (if statment to prevent NaN on first time)
      if (!Number.isFinite(gameData.plots[pos].bushels)) { gameData.plots[pos].bushels = 1; }
      gameData[veg] += gameData.plots[pos].bushels;
      updateVeg(veg);
      gameData.plots[pos].bushels = 1;
      // Styles
      document.querySelector(`.btn${pos}`).textContent = `Plant ${veg}!`;
      document.querySelector(`#plot${pos}`).style.backgroundImage = "url(Images/Plots/plot.png)";
      // Clear load bar
      if (gameData.plantLoadingBars) {
         document.querySelector(`.plant-progress-view-${pos}`).style.width = "0%";
         document.querySelector(`.plant-progress-text-${pos}`).textContent =  "Empty";
      }
   }
   // Plant
   else {
      gameData.plots[pos].plant = veg;
      document.querySelector(`.btn${pos}`).onclick = () => { tendTo(pos, veg); };
      let currentTime = Date.now();
      let harvestTime = gameInfo[`${veg}Time`][2] / 4;
      if (gameData.weather === "cloudy") { harvestTime = gameInfo[`${veg}Time`][2] + harvestTime; }
      else { harvestTime = gameInfo[`${veg}Time`][2]; }
      gameData.plots[pos].status = currentTime + harvestTime;
      if (gameData.weather === "rainy") { gameData.plots[pos].bushels++; }
      plantCountdown(pos);
      plantGrowthLoop(pos);
      document.querySelector(`.plant-icon-${pos}`).src = `Images/Vegetables/${veg}.png`;
      // Start load bar
      if (gameData.plantLoadingBars) updatePlantLoadBar(pos);
   }
}

function plantCountdown(i) {
   if (!gameData.plots[i].isGrowing()) { return; }
   let countDown = document.querySelector(`.time-left-${i}`);
   let endTime = gameData.plots[i].status;
   let secondsLeftms;
   secondsLeftms = endTime - Date.now();
   let formattedTime = formatPlantTime(secondsLeftms);
   countDown.textContent = formattedTime;
}

function formatPlantTime(time) {
   let secondsLeft = Math.round(time / 1000);
   let hours = Math.floor(secondsLeft / 3600);
   let minutes = Math.floor(secondsLeft / 60) - (hours * 60);
   let seconds = secondsLeft % 60;
   if (secondsLeft < 0) { return `00:00:00`; }
   if (hours < 10) { hours = `0${hours}`; }
   if (minutes < 10) { minutes = `0${minutes}`; }
   if (seconds < 10) { seconds = `0${seconds}`; }
   return `${hours}:${minutes}:${seconds}`;
}

function plantGrowthLoop(plotIndex) {
   let plant = gameData.plots[plotIndex].plant;
   let urls = gameInfo[plant + "URLs"];
   let plotImg = document.querySelector(`#plot${plotIndex}`).style;
   let buttton = document.querySelector(`.btn${plotIndex}`);
   let growthLoop = setInterval(() => {
      if (gameData.plots[plotIndex].status == "Ready") {
         // Button
         showObj(`.btn${plotIndex}`);
         // Image and end loop
         plotImg.backgroundImage = `url(Images/Plots/${urls[2]})`;
         clearInterval(growthLoop);
         return;
      }
      // Changes images depending on plot status
      if (gameData.plots[plotIndex].status == "Empty") { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      if (gameData.plots[plotIndex].status == "withered") { plotImg.backgroundImage = `url(Images/Plots/withered.png)`; }
      // If the plant is growing
      if (gameData.plots[plotIndex].isGrowing()) {
         // Update time
         plantCountdown(plotIndex);
         // Check what third of growth the plant is is
         let checkTimeOne = gameData.plots[plotIndex].status - gameInfo[`${plant}Time`][0];
         let checkTimeTwo = gameData.plots[plotIndex].status - gameInfo[`${plant}Time`][1];
         // Check if it's ready 
         if (Date.now() >= gameData.plots[plotIndex].status) {
            gameData.plots[plotIndex].status = "Ready";
            document.title = "(!) Vegetable Dash";
         }
         // Otherwise, display the images
         else if (Date.now() >= checkTimeOne) { plotImg.backgroundImage = `url(Images/Plots/${urls[1]})`; }
         else if (Date.now() >= checkTimeTwo) { plotImg.backgroundImage = `url(Images/Plots/${urls[0]})`; }
         else { plotImg.backgroundImage = "url(Images/Plots/plot.png)"; }
      }
   }, 1000);
   // Button
   buttton.textContent = `Harvest ${plant}!`;
   hideObj(`.btn${plotIndex}`);
}

function updatePlantLoadBar(plotIndex) {
   if (gameData.plots[plotIndex].status == "Ready") {
      setLoadbarAsDone(plotIndex);
   }
   else if (typeof gameData.plots[plotIndex].status == "number") {
      let growthTime = gameInfo[`${gameData.plots[plotIndex].plant}Time`][2];
      let interval = growthTime / 100;

      updateLoadbar(plotIndex);

      let updateLoadBarLoop = setInterval(() => {
         let percentThrough = updateLoadbar(plotIndex);

         if (percentThrough >= 100 || gameData.plots[plotIndex].status == "Ready") {
            setLoadbarAsDone(plotIndex);
            clearInterval(updateLoadBarLoop);
         }
      }, interval);
   }
}


function updateLoadbar(plotIndex) {
   const progressEl = document.querySelector(`.plant-progress-view-${plotIndex}`);
   const percentEl = document.querySelector(`.plant-progress-text-${plotIndex}`);

   let growthTime = gameInfo[`${gameData.plots[plotIndex].plant}Time`][2];
   let finishTime = gameData.plots[plotIndex].status;
   percentThrough = calcPercentThroughGrowth(growthTime, finishTime);

   progressEl.style.width = percentThrough + "%";
   percentEl.textContent = percentThrough + "%";

   return percentThrough;
}

function setLoadbarAsDone(plotIndex) {
   const progressEl = document.querySelector(`.plant-progress-view-${plotIndex}`);
   const percentEl = document.querySelector(`.plant-progress-text-${plotIndex}`);

   progressEl.style.width = "100%";
   percentEl.textContent = "Ready!";
}

function calcPercentThroughGrowth(total, current) {
   let now = Date.now();
   let timeLeft = current - now;
   let percent = (timeLeft / total) * 100;
   return 100 - Math.round(percent);
}