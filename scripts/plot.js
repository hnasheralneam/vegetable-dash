//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Plot {
   static setPlant(id, plant) {
      getPlot(id).data.plant = plant;
      GridSaveManager.saveGridData(id);
   }
   static setStatus(id, status) {
      getPlot(id).data.status = status;
      GridSaveManager.saveGridData(id);
   }
   static setBushels(id, bushels) {
      getPlot(id).data.bushels = bushels;
      GridSaveManager.saveGridData(id);
   }
}

function getPlot(id) {
   return gridBuildings.find((item) => item.id === id);
}
function getPlotData(id) {
   return gridBuildings.find((item) => item.id === id).data;
}
function getPlotArrays() {
   return gridBuildings.filter((item) => item.handle === "plot");
}

// started
function createPlotHandler(id) {
   let data = getPlotData(id);
   let plotBody = document.querySelector("#i" + id);
   if (!plotBody) return;
   plotBody.classList.add("plot");
   plotBody.id = "plot" + id;
   plotBody.style.height = plotBody.parentElement.style.width;

   plotBody.innerHTML = `
      ${gameData.plantLoadingBars ?
      `<div class="plant-progress plant-progress-${id}" style="opacity: 0">
         <span class="plant-progress-view plant-progress-view-${id}">
            <span><p class="plant-progress-text plant-progress-text-${id}">Empty</p></span>
         </span>
      </div>` : ""}
      <div class="countdown time-left">
         <span class="time-left-${id}"></span>
         <img src="images/Icons/clock.svg">
      </div>
      <img src="images/Vegetables/${data.plant}.png" class="veg-icon plant-icon-${id}" src="images/Vegetables/${data.plant}.png">
      <button class="btn${id} btn"></button>
      <div class="shop-window" id="shop${id}"></div>
      <button class="almanacBtn almanac${id}"><img src="images/General/almanac.png" class="almanac"></button>
   `;
   let button = plotBody.querySelector(`.btn${id}`);
   button.onclick = () => { tendTo(id, data.plant); };
   button.textContent = `Grow ${data.plant}!`;
   let almanacButton = plotBody.querySelector(`.almanac${id}`);
   almanacButton.addEventListener("click", () => { toggleAlmanac(id); });

   plotBody.onclick = () => {
      if (fertilizerCursor === "active" && isGrowing(data.status)) {
         fertilize(id);
         fertilizeHover();
      }
   };

   gameData.plantSeeds.forEach((value) => {
      let listItem = document.createElement("LI");
      let listImg = document.createElement("IMG");
      listImg.classList.add("store-icon");
      listImg.src = `images/Vegetables/${value}.png`;
      listImg.dataset.info = `Grows in ${formatTime(gameInfo[value + "Time"][2])}`;
      listImg.onmouseover = () => { info(listImg); };
      listImg.onclick = () => { tendTo(id, value); };
      listItem.appendChild(listImg);
      plotBody.querySelector(".shop-window").appendChild(listItem);
   });
   if (isGrowing(data.status) || data.status == "Ready") {
      plantGrowthLoop(id);
      document.querySelector(`.almanac${id}`).disabled = true;
      document.querySelector(`.almanac${id}`).style.opacity = "0";
      if (gameData.plantLoadingBars) updatePlantLoadBar(id);
   }
}

function isGrowing(status) {
   if (["Ready", "Empty", "withered"].includes(status)) { return false; }
   else { return true; }
}

function toggleAlmanac(index) {
   if (document.getElementById(`shop${index}`).classList.contains("open")) {
      document.getElementById(`shop${index}`).classList.remove("open");
   } else {
      document.getElementById(`shop${index}`).classList.add("open");
   }
}

function tendTo(id, veg) {
   let data = getPlotData(id);
   document.getElementById(`shop${id}`).classList.remove("open");
   document.querySelector(`.almanac${id}`).disabled = true;
   document.querySelector(`.almanac${id}`).style.opacity = "0";
   // Harvest
   if (data.status == "Ready") {
      document.title = "Vegetable Dash";
      document.querySelector(`.almanac${id}`).disabled = false;
      document.querySelector(`.almanac${id}`).style.opacity = "1";
      Plot.setStatus(id, "Empty");
      harvestLuck(veg);
      if (!Number.isFinite(data.bushels)) Plot.setBushels(id, 1); // to handle initial NaN
      gameData[veg] += data.bushels;
      updateVeg(veg);
      Plot.setBushels(id, 1);

      document.querySelector(`.btn${id}`).textContent = `Plant ${veg}!`;
      document.querySelector(`#plot${id}`).style.backgroundImage = "url(images/Plots/plot.png)";
      if (gameData.plantLoadingBars) {
         document.querySelector(`.plant-progress-${id}`).style.opacity = "0";
         document.querySelector(`.plant-progress-view-${id}`).style.width = "0%";
         document.querySelector(`.plant-progress-text-${id}`).textContent =  "Empty";
      }
   }
   // Plant
   else {
      Plot.setPlant(id, veg);
      document.querySelector(`.btn${id}`).onclick = () => { tendTo(id, veg); };
      let currentTime = Date.now();
      let harvestTime = gameInfo[`${veg}Time`][2] / 4;
      if (gameData.weather === "cloudy") { harvestTime = gameInfo[`${veg}Time`][2] + harvestTime; }
      else { harvestTime = gameInfo[`${veg}Time`][2]; }
      Plot.setStatus(id, currentTime + harvestTime);
      if (gameData.weather === "rainy") { Plot.setBushels(id, data.bushels + 1); }
      plantCountdown(id);
      plantGrowthLoop(id);
      document.querySelector(`.plant-icon-${id}`).src = `images/Vegetables/${veg}.png`;
      // Start load bar
      if (gameData.plantLoadingBars) updatePlantLoadBar(id);
   }
}

function plantCountdown(id) {
   let data = getPlotData(id);

   if (!isGrowing(data.status)) return;
   let countDown = document.querySelector(`.time-left-${id}`);
   let endTime = data.status;
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

function plantGrowthLoop(id) {
   let data = getPlotData(id);

   let plant = data.plant;
   let urls = gameInfo[plant + "URLs"];
   let plotImg = document.querySelector(`#plot${id}`).style;
   let buttton = document.querySelector(`.btn${id}`);
   let growthLoop = setInterval(updatePlantGrowth, 1000);

   buttton.textContent = `Harvest ${plant}!`;
   hideObj(`.btn${id}`);
   updatePlantGrowth();

   function updatePlantGrowth() {
      if (data.status == "Ready") {
         showObj(`.btn${id}`);
         if (gameData.panels.inventory) document.querySelector(`.btn${id}`).style.pointerEvents = "none";
         plotImg.backgroundImage = `url(images/Plots/${urls[2]})`;
         clearInterval(growthLoop);
         return;
      }
      if (data.status == "Empty") plotImg.backgroundImage = "url(images/Plots/plot.png)";
      if (data.status == "withered") plotImg.backgroundImage = `url(images/Plots/withered.png)`;
      if (isGrowing(data.status)) {
         plantCountdown(id);
         let checkTimeOne = data.status - gameInfo[`${plant}Time`][0];
         let checkTimeTwo = data.status - gameInfo[`${plant}Time`][1];
         if (Date.now() >= data.status) {
            Plot.setStatus(id, "Ready");
            document.title = "(!) Vegetable Dash";
         }
         else if (Date.now() >= checkTimeOne) {
            if (Date.now() >= (data.status - 1000)) {
               setTimeout(() => {
                  updatePlantGrowth();
               }, (data.status - Date.now()));
            }
            plotImg.backgroundImage = `url(images/Plots/${urls[1]})`;
         }
         else if (Date.now() >= checkTimeTwo) plotImg.backgroundImage = `url(images/Plots/${urls[0]})`;
         else plotImg.backgroundImage = "url(images/Plots/plot.png)";
      }
   }
}

function updatePlantLoadBar(id) {
   let data = getPlotData(id);
   if (data.status == "Ready") {
      setLoadbarAsDone(id);
   }
   else if (typeof data.status == "number") {
      let growthTime = gameInfo[`${data.plant}Time`][2];
      let interval = growthTime / 100;
      if (interval < 50) interval = 50;


      updateLoadbar(id);

      let updateLoadBarLoop = setInterval(() => {
         let percentThrough = updateLoadbar(id);

         if (percentThrough >= 100 || data.status == "Ready") {
            setLoadbarAsDone(id);
            clearInterval(updateLoadBarLoop);
         }
      }, interval);
   }
}


function updateLoadbar(id) {
   let data = getPlotData(id);
   const progressEl = document.querySelector(`.plant-progress-view-${id}`);
   const percentEl = document.querySelector(`.plant-progress-text-${id}`);

   let growthTime = gameInfo[`${data.plant}Time`][2];
   let finishTime = data.status;
   percentThrough = calcPercentThroughGrowth(growthTime, finishTime);

   document.querySelector(`.plant-progress-${id}`).style.opacity = "1";
   progressEl.style.width = percentThrough + "%";
   percentEl.textContent = percentThrough + "%";

   return percentThrough;
}

function setLoadbarAsDone(id) {
   const progressEl = document.querySelector(`.plant-progress-view-${id}`);
   const percentEl = document.querySelector(`.plant-progress-text-${id}`);

   document.querySelector(`.plant-progress-${id}`).style.opacity = "0";
   progressEl.style.width = "100%";
   percentEl.textContent = "Ready!";
}

function calcPercentThroughGrowth(total, current) {
   let now = Date.now();
   let timeLeft = current - now;
   let percent = (timeLeft / total) * 100;
   return 100 - Math.round(percent);
}

function fertilize(id) {
   let data = getPlotData(id);
   if (gameData.fertilizers >= 1) {
      gameData.fertilizers -= 1;
      updateFertilizer();

      let twentyMinutes = 20 * 60000;
      Plot.setStatus(id, data.status - twentyMinutes);

      if (gameData.plantLoadingBars) {
         if (data.status <= Date.now()) setLoadbarAsDone(id);
         else updateLoadbar(id);
      }

      Plot.setBushels(id, data.bushels * 2);
      checkTasks("gramp1");
   }
}