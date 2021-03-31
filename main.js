/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Incidents          | Whoops, did I spell that wrong? - IN PROGRESS
Unlock Plots       | Functions that unlock plots
Introduction       | Welcome new players, should redo
Quests             | Earn things - IN PROGRESS
Market             | Trade things
Main Loop & Setup  | Main loop and setup
Helpful Functions  | Some helpful functions
Commands           | Command Panel, right click menu
Settings & Produce | Update Sidebar
Save               | Save the game data, restart
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data | 57 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
   pumpkins: "empty",
}
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
}
let initalPlots = {
   price2: 150,
   price3: 750,
   price4: 3750,
   price5: "your soul (or $$$ - we don't accept credit)",
   price6: 50000,
   price7: "undeterimed",
   price8: "undeterimed",
   price9: "undeterimed",
   // Unlocked/locked
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
   pumpkinplot: "locked",
}
let initalMarketData = {
   seeds: 0,
   marketResets: 0,
   // Vegetable prices
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 250,
   sellStrawberries: 250,
   buyEggplants: 750,
   sellEggplants: 750,
   buyPumpkins: 5000,
   sellPumpkins: 5000,
   sellerName: ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)],
   sellItem: ["Market Resets"][Math.floor(Math.random() * 1)],
   sellItemQuantity: Math.floor(Math.random() * (5 - 1)) + 1,
   seedCost: Math.floor(Math.random() * (10000 - 2000)) + 2000,
}
let initalSettings = {
   theme: "dark",
   intro: "unfinished",
}

let settings = initalSettings;
let plotStatus = initalPlotStatus;
let produce = initalProduce;
let plots = initalPlots;
let marketData = initalMarketData;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables | 61 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Vegetable Modals
function infoModal(veg) {
   let modalID = "#info" + veg;
   if (document.querySelector(modalID).style.opacity === "1") { hideObj(modalID); }
   else { showObj(modalID); }
}

// Harvest and plant
function harvest(veg) {
   // Create proper IDs
   let plntID = "grow" + veg;
   let hrvstID = "harvest" + veg;
   // Set plot status to empty
   plotStatus[veg.toLowerCase()] = "empty";
   // Add one to peas
   produce[veg.toLowerCase()]++;
   // Hide harvest button, display grow button
   hideObj(`#${hrvstID}`);
   showObj(`#${plntID}`);
   marketData.seeds++;
   harvestLuck(veg);
}
function plant(veg, timeOne, timeTwo) {
   setTimeout(() => { plotStatus[veg] = "growing"; }, timeOne);
   setTimeout(() => { plotStatus[veg] = "ready"; }, timeTwo);
   hideObj("#grow" + capitalize(veg));
}
function fertilize(veg) {
   if (marketData.fertilizers >= 1) {
      marketData.fertilizers -= 1;
      plotStatus[veg] = "ready";
      produce[veg]++;
      checkTasks('fertilize', taskList.tryFertilizerNum);
   }
}
function plantStrawberries() {
   setTimeout(() => { plotStatus.strawberries = "sprouting"; }, 20000);
   setTimeout(() => { plotStatus.strawberries = "flowering"; }, 60000);
   setTimeout(() => { plotStatus.strawberries = "fruiting"; }, 120000);
   hideObj("#growStrawberries");
}
strawberriesStatus();
function strawberriesStatus() {
   let plotId = document.getElementById("plot3");
   if (plotStatus.strawberries === "fruiting") {
      plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/grown-strawberries.png)";
      showObj("#harvestStrawberries");
   }
   else if (plotStatus.strawberries === "flowering") { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/flowering-strawberries.png)"; }
   else if (plotStatus.strawberries === "sprouting") { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/growing-strawberries.png)"; }
   else { plotId.style.backgroundImage = "url(Images/Plots/plot.png)"; }
}
plantLoop("peas", 1, 'Peas/grown-pea.png');
plantLoop("corn", 2, 'Corn/grown-corn.png');
plantLoop("eggplants", 4, 'Eggplant/grown-eggplant.png');
plantLoop("pumpkins", 6, 'Pumpkins/grown-pumpkin.png');
function plantLoop(veg, pltNumber, url) {
   let vegPlot = document.querySelector("#plot" + pltNumber);
   let imgUrl = "url(Images/Vegetables/" + url + ")";
   setInterval(vegStatus, 1500);
   function vegStatus() {
      if (plotStatus[veg] === "ready") {
         vegPlot.style.backgroundImage = String(imgUrl);
         showObj("#harvest" + capitalize(veg));
      }
      else if (plotStatus[veg] === "growing") { vegPlot.style.backgroundImage = "url(Images/Plots/growing.png)"; }
      else { vegPlot.style.backgroundImage = "url(Images/Plots/plot.png)"; }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks | 100 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let taskList = {
   taskBox1: "unoccupied",
   taskBox2: "unoccupied",
   taskBox3: "unoccupied",
   taskBox4: "unoccupied",
   jebsPeaSalad: "active",
   jebsPeaSaladNum: 0,
   useMarketResets: "unreached",
   useMarketResetsNum: 0,
   tryFertilizer: "unreached",
   tryFertilizerNum: 0,
}

clearTask(1);
clearTask(2);
clearTask(3);
clearTask(4);
showTasks();

// Task Insensitive
function startTask(num, buttonTxt, buttonOnClick, infoTxt, taskGiver, taskGiverImg, task) {
   taskList[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   showObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
   document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", `javascript: ${buttonOnClick}` );
   document.querySelector(`.task-info-${num}`).textContent = infoTxt;
   document.querySelector(`.task-info-giver-${num}`).textContent = taskGiver;
   $(`.task-info-img-${num}`).attr("src", taskGiverImg);
   taskList["taskBox" + num] = "occupied " + task;
}
function clearTask(num) {
   hideObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).textContent = "";
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: " );
   document.querySelector(`.task-info-${num}`).textContent = "";
   document.querySelector(`.task-info-giver-${num}`).textContent = "";
   $(`.task-info-img-${num}`).attr("src", "Images/Global Assets/nothing.png");
   taskList["taskBox" + num] = "unoccupied";
}
function emptyTaskCheck(task) {
   if (taskList.taskBox1 === "unoccupied") { taskList[task] = 1; }
   else if (taskList.taskBox2 === "unoccupied") { taskList[task] = 2; }
   else if (taskList.taskBox3 === "unoccupied") { taskList[task] = 3; }
   else if (taskList.taskBox4 === "unoccupied") { taskList[task] = 4; }
   else { taskList[task] = "Full"; }
   return taskList[task];
}
function taskAlreadyUp(task) {
   let value = {};
   for (i = 1; i < 5; i++) {
      if (taskList["taskBox" + i] === task) { value[i] = true; }
      else { value[i] = false; }
   }
   if (value[1] === false && value[2] === false && value[3] === false && value[4] === false) { return false }
   else { return true }
}

// Task Sensitive
function giveTasks() {
   if (true && taskList.jebsPeaSalad != "complete") { taskList.jebsPeaSalad = "active" }
   if (taskList.jebsPeaSalad === "complete" && marketData.marketResets >= 1 && taskList.useMarketResets != "complete") { taskList.useMarketResets = "active" }
   if (taskList.jebsPeaSalad === "complete" && taskList.tryFertilizer != "complete") { taskList.tryFertilizer = "active" }
}
function showTasks() {
   if (taskAlreadyUp("occupied jebsPeaSalad") === false && taskList.jebsPeaSalad === "active" || taskList.useMarketResets === "waiting") { startTask(emptyTaskCheck("jebsPeaSaladNum"), "Submit 25 Peas", "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('producePaid', taskList.jebsPeaSaladNum); }", "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
   if (taskAlreadyUp("occupied useMarketResets") === false && taskList.useMarketResets === "active" || taskList.useMarketResets === "waiting") { startTask(emptyTaskCheck("useMarketResetsNum"), "Use 1 Market Reset", " ", "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
   if (taskAlreadyUp("occupied tryFertilizer") === false && taskList.tryFertilizer === "active" || taskList.tryFertilizer === "waiting") { startTask(emptyTaskCheck("tryFertilizerNum"), "Use 1 Fertilizer", " ", "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
}
function checkTasks(origin, num) {
   if (taskList.jebsPeaSalad === "active" && origin === "producePaid") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 5 Fertilizer";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('jebsPeaSalad', taskList.jebsPeaSaladNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!";
   }
   if (taskList.useMarketResets === "active" && origin === "resetMarketValues") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 500 Seeds";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('useMarketResets', taskList.useMarketResetsNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "Thank you for completing that small task for me! Here, take 500 seeds!";
   }
   if (taskList.tryFertilizer === "active" && origin === "fertilize") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 2 Market Resets";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('tryFertilizer', taskList.tryFertilizerNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "Wow, just look at those plants grow! Here, take these, I've had them lying about for years.";
   }
}
function collectTaskReward(task, num) {
   if (task === "jebsPeaSalad") { marketData.fertilizers += 5; }
   if (task === "useMarketResets") { marketData.seeds += 500; }
   if (task === "tryFertilizer") { marketData.marketResets += 2; }
   taskList[task] = "complete";
   clearTask(num);
   giveTasks();
   showTasks();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents | 0 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let rand = Math.random();

function harvestLuck(veg) {
   rand = Math.random();
   if (rand < 0.20) {
      callAlert(`You collected extra seeds!`);
      marketData.seeds += 5;
   }
   if (rand < 0.10) {
      callAlert(`It rained! You collected extra produce!`);
      produce[veg.toLowerCase()]++
      produce[veg.toLowerCase()]++
   }
   if (rand < 0.05) {
      marketData.marketResets++;
      callAlert(`You collected a market reset! You now have ${marketData.marketResets}`);
   }
}
function marketLuck() {
   rand = Math.random();
   if (rand < 0.01) {
      marketData.marketResets++;
      callAlert(`You collected a market reset! You now have ${marketData.marketResets}`);
   }
}
function blackMarketLuck() {
   rand = Math.random();
   if (rand < 0.02) {
      callAlert("The police caught you! They fined you 6000 Seeds");
      marketData.seeds -= 6000;
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let vegetablesOwned = [];
vegetablesOwned.push("peas")
function vegetablesOwnedLoop() {
   if (produce.peas >= "1" && !vegetablesOwned.includes("peas")) { vegetablesOwned.push("peas") }
   if (produce.corn >= "1" && !vegetablesOwned.includes("corn")) { vegetablesOwned.push("corn") }
   if (produce.strawberries >= "1" && !vegetablesOwned.includes("strawberries")) { vegetablesOwned.push("strawberries") }
   if (produce.eggplants >= "1" && !vegetablesOwned.includes("eggplants")) { vegetablesOwned.push("eggplants") }
   if (produce.pumpkins >= "1" && !vegetablesOwned.includes("pumpkins")) { vegetablesOwned.push("pumpkins") }
}

let luckyRoll = window.setInterval(function() {
   rand = Math.random();
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(produce[vegLost] / 3);
   if (rand < .08) {
      produce[vegLost] -= amountLost;
      callAlert(`It snowed! You lost ${amountLost} of your ${vegLost}!`);
    }
}, 300000)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots | 52 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function checkLocks() {
   if (plots.cornplot === "unlocked") { openLock("corn", 2) }
   if (plots.strawberryplot === "unlocked") { openLock("strawberry", 3) }
   if (plots.eggplantplot === "unlocked") { openLock("eggplant", 4) }
   if (plots.pumpkinplot === "unlocked") { openLock("pumpkin", 6) }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (marketData.seeds >= plots["price" + plotNum]) {
      marketData.seeds -= plots["price" + plotNum];
      marketData.marketResets++;
      if (number == "2") { openLock("corn", 2) }
      if (number == "3") { openLock("strawberry", 3) }
      if (number == "4") { openLock("eggplant", 4) }
      if (number == "6") { openLock("pumpkin", 6) }
   }
}
function openLock(pltVeg, num) {
   let vegetable = pltVeg;
   document.getElementById("lock" + num).classList.add("removing-lock");
   setTimeout(fndLock, 2500);
   function fndLock() {
      if (vegetable === "corn") {
         document.getElementById("lockedDiv2").remove();
         document.getElementById("openPlot2").style.display = "block";
         document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay 750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`;
         plots.cornplot = "unlocked";
      }
      if (vegetable === "strawberry") {
         document.getElementById("lockedDiv3").remove();
         document.getElementById("openPlot3").style.display = "block";
         document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay 3750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`;
         plots.strawberryplot = "unlocked";
      }
      if (vegetable === "eggplant") {
         document.getElementById("lockedDiv4").remove();
         document.getElementById("openPlot4").style.display = "block";
         document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${plots.price6} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`;
         plots.eggplantplot = "unlocked";
      }
      if (vegetable === "pumpkin") {
         document.getElementById("lockedDiv6").remove();
         document.getElementById("openPlot6").style.display = "block";
         document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay your soul to unlock <br> <button class="purchase-plot" onclick="callAlert('Error: Not signed into SoulPay+')">Requires SoulPay+</button>`;
         plots.pumpkinplot = "unlocked";
      }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Intoduction | 98 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let introPartsDone = {
   hello: "no",
   meetGramps: "no",
   planting: "no",
   sidebar: "no",
   meetGran: "no",
   bushels: "no",
   settings: "no",
   thatsIt: "no",
}
function runIntro() {
   plotStatus = initalPlotStatus;
   produce = initalProduce;
   plots = initalPlots;
   marketData = initalMarketData;
   settings = initalSettings;
   // Save
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
   localStorage.setItem("marketData", JSON.stringify(marketData));
   localStorage.setItem("settingData", JSON.stringify(settings));

   settings.intro = "finished";
   showObj(".welcome");
}
function goIntro() { hideObj(".welcome"); showObj(".introDarkShadow"); intro(); }
function intro() {
   let introShadow = document.querySelector(".introDarkShadow");
   let qstRibbon = document.getElementById("questRibbon");
   let introBlock = document.querySelector(".intro-container");
   let introImg = document.querySelector(".intro-img");
   let introText = document.querySelector(".intro-text");
   if (introPartsDone.hello === "no") { introPartsDone.hello = "yes"; }
   else { meetGrapms(); }
   function meetGrapms() {
      if (introPartsDone.meetGramps === "no") {
         $(".intro-img").attr("src", "Images/Intro/gramps.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin', the good ol' way!";
         introPartsDone.meetGramps = "yes";
      }
      else { planting(); }
   }
   function planting() {
      if (introPartsDone.planting === "no") {
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press Grow Peas, and when it's done, press Harvest Peas!";
         document.querySelector(".plant-quest-arrow").style.display = "block";
         document.getElementById("plot1").style.zIndex = "100";
         introPartsDone.planting = "yes";
      }
      else {
         document.querySelector(".plant-quest-arrow").style.display = "none";
         document.getElementById("plot1").style.zIndex = "0";
         sidebar();
      }
   }
   function sidebar() {
      if (introPartsDone.sidebar === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "This sidebar is were you keep control of the farm. Grandma Josephine will talk about that.";
         document.querySelector(".sidebar").style.zIndex = "10";
         introBlock.style.height = "40vh";
         introBlock.style.width = "52%";
         introPartsDone.sidebar = "yes";
      }
      else { meetGran(); }
   }
   function meetGran() {
      if (introPartsDone.meetGran === "no") {
         $(".intro-img").attr("src", "Images/Intro/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
         introPartsDone.meetGran = "yes";
      }
      else { bushels(); }
   }
   function bushels() {
      if (introPartsDone.bushels === "no") {
         introText.textContent = "Here you find the amount of resouces you have. Spend it well!";
         introPartsDone.bushels = "yes";
      }
      else { settings(); }
   }
   function settings() {
      if (introPartsDone.settings === "no") {
         introText.textContent = "These are the settings, where you can restart, change the theme, and play classical music!";
         document.querySelector(".settings").style.boxShadow = "0 0 50px #f5f5f5";
         introPartsDone.settings = "yes";
      }
      else {
         document.querySelector(".settings").style.boxShadow = "none";
         document.querySelector(".sidebar").style.zIndex = "0";
         introBlock.style.height = "30vh";
         introBlock.style.width = "auto";
         thatsIt();
      }
   }
   function thatsIt() {
      if (introPartsDone.thatsIt === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "That's it! Now you can start working.";
         introPartsDone.thatsIt = "yes";
      }
      else { hideObj(".introDarkShadow"); }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 77) {
   if (document.querySelector(".marketShadow").style.opacity === "0") { showObj(".marketShadow"); }
   else { hideObj(".marketShadow"); }
}})
function checkMarket() {
   let marketItem = document.getElementsByClassName("market-item");
   if (plots.cornplot === "locked") { marketItem[2].style.display = "none"; }
   if (plots.strawberryplot === "locked") { marketItem[3].style.display = "none"; }
   if (plots.eggplantplot === "locked") { marketItem[4].style.display = "none"; }
   if (plots.pumpkinplot === "locked") { marketItem[5].style.display = "none"; }
}
function buyProduce(produceRequested, produceCase) {
   if (marketData.seeds >= marketData["buy" + produceCase]) {
      produce[produceRequested] += 5;
      marketData.seeds -= marketData["buy" + produceCase];
      marketData["buy" + produceCase] *= 1.08;
      marketData["sell" + produceCase] *= 1.02;
      updateMarket();
      checkMarket();
      marketLuck();
   }
}
function sellProduce(produceRequested, produceCase) {
   if (produce[produceRequested] >= 5) {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
      updateMarket();
      checkMarket();
      marketLuck();
   }
}

function updateMarket() {
   document.querySelector(".special-market-item").textContent = `Seeds: ${Math.floor(marketData.seeds)}`;
   document.querySelector(".pea-market-item").textContent = `Peas: ${produce.peas}
   Cost: ${Math.floor(marketData.buyPeas)} Seeds
   Sell: ${Math.floor(marketData.sellPeas)} Seeds \r\n \r\n`;
   document.querySelector(".corn-market-item").textContent = `Corn: ${produce.corn}
   Cost: ${Math.floor(marketData.buyCorn)} Seeds
   Sell: ${Math.floor(marketData.sellCorn)} Seeds \r\n \r\n`;
   document.querySelector(".strawberry-market-item").textContent = `Strawberries: ${produce.strawberries}
   Cost: ${Math.floor(marketData.buyStrawberries)}
   Sell: ${Math.floor(marketData.sellStrawberries)} \r\n \r\n`;
   document.querySelector(".eggplant-market-item").textContent = `Eggplants: ${produce.eggplants}
   Cost: ${Math.floor(marketData.buyEggplants)}
   Sell: ${Math.floor(marketData.sellEggplants)} \r\n \r\n`;
   document.querySelector(".pumpkin-market-item").textContent = `Pumpkins: ${produce.pumpkins}
   Cost: ${Math.floor(marketData.buyPumpkins)}
   Sell: ${Math.floor(marketData.sellPumpkins)} \r\n \r\n`;
   document.querySelector(".reset-market-item").textContent = `You have ${marketData.marketResets} Market Resets`;
}
function resetMarketValues() {
   if (marketData.marketResets > 0) {
      marketData.marketResets--
      marketData.buyPeas = 25;
      marketData.sellPeas = 25;
      marketData.buyCorn = 75;
      marketData.sellCorn = 75;
      marketData.buyStrawberries = 250;
      marketData.sellStrawberries = 250;
      marketData.buyEggplants = 750;
      marketData.sellEggplants = 750;
      marketData.buyPumpkins = 5000;
      marketData.sellPumpkins = 5000;
      checkTasks("resetMarketValues", taskList.useMarketResetsNum);
   }
}

newBlackOffer();
function blackMarketValues() {
   marketData.sellerName = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel"][Math.floor(Math.random() * 6)];
   marketData.sellItem = ["Market Resets"][Math.floor(Math.random() * 1)];
   // sellItem = ["Watering Cans", "Compost", "Fertilizer", "Market Reset"][Math.floor(Math.random() * 4)];
   marketData.sellItemQuantity = Math.floor(Math.random() * (5 - 1)) + 1;
   marketData.seedCost = Math.floor(Math.random() * (10000 - 2000)) + 2000;
}

function newBlackOffer() { document.querySelector(".blackMarketOffer").textContent = `Offer by ${marketData.sellerName} \n Selling ${marketData.sellItemQuantity} ${marketData.sellItem} \n for ${marketData.seedCost} Seeds`; }

function accept() {
   if (marketData.seeds >= marketData.seedCost) {
      marketData.seeds -= marketData.seedCost;
      blackMarketLuck();
      blackMarketValues();
      newBlackOffer();
      if (marketData.sellItem === "Market Resets") { marketData.marketResets += marketData.sellItemQuantity; }
   }
}

function deny() {
   blackMarketLuck();
   blackMarketValues();
   newBlackOffer();
   document.querySelector(".blackMarketOffer").style.backgroundColor = genColor();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop & Setup | 27 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var mainLoop = window.setInterval(function() {
   strawberriesStatus();
   updateMarket();
   vegetablesOwnedLoop();
   giveTasks();
   // showTasks();
   // Update produce display
   document.querySelector("#seeds").textContent = `${Math.round(marketData.seeds)} Seeds`;
   if (plots.peaplot === "unlocked") { revealProduce("#peaBushels", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduce("#cornBushels", "corn"); }
   if (plots.strawberryplot === "unlocked") { revealProduce("#strawberryBushels", "strawberries"); }
   if (plots.eggplantplot === "unlocked") { revealProduce("#eggplantBushels", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduce("#pumpkinBushels", "pumpkins"); }
   function revealProduce(id, veg) {
      document.querySelector(".produce-tooltip-" + veg).style.display = "inline-block";
      document.querySelector(id).textContent = `${produce[veg]} Bushels of ${capitalize(veg)}`;
   }
}, 200)
function setup() {
   whatTheme();
   checkLocks();
   checkMarket();
}
window.addEventListener('load', (event) => { setup(); });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions | 22 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function hideObj(objId) {
   document.querySelector(objId).style.opacity = "0";
   document.querySelector(objId).style.pointerEvents = "none";
   document.querySelector(objId).style.zIndex = "0";
}
function showObj(objId) {
   document.querySelector(objId).style.opacity = "1";
   document.querySelector(objId).style.pointerEvents = "auto";
   document.querySelector(objId).style.zIndex = "1";
}
function genColor() {
   function rand(min, max) { let randomNum = Math.random() * (max - min) + min; return Math.round(randomNum); }
   let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   let color = '#';
   for (let i = 0; i < 6; i++) { let index = rand(0, 15); color += hex[index]; }
   return color;
}
function callAlert(text) {
   // Isn't it just great copying the code from other projects?
   let alert = document.querySelector(".alert");
   alert.style.opacity = "1";
   alert.style.pointerEvents = "auto";
   alert.textContent = text;
   setTimeout(alertAnimation => { document.querySelector('.alert').classList.add('alertAnimation'); }, 6000);
   setTimeout(removeAnimation => { document.querySelector('.alert').classList.remove('alertAnimation'); }, 9000);
   setTimeout(hideAlerts => { alert.style.opacity = "0"; alert.style.pointerEvents = "none"; }, 9000);
}
function scrollToSection(id) { document.getElementById(id).scrollIntoView(); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands | 73 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Command Panel
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 69) { openCommands(); } });
function openCommands() {
   if (document.querySelector(".commandsShadow").style.opacity === "0") { showObj(".commandsShadow"); }
   else { hideObj(".commandsShadow"); }
}
function commandBar() {
   if (document.querySelectorAll(".commandBarImg")[0].style.display === "inline-block") {
      document.querySelectorAll(".commandBarImg")[0].style.display = "none";
      document.querySelectorAll(".commandBarImg")[1].style.display = "none";
      document.querySelectorAll(".commandBarImg")[2].style.display = "none";
      document.querySelector(".slider").style.backgroundColor = "#cb9e00";
      document.querySelector(".slider").style.transform = "rotate(0)";
   }
   else {
      document.querySelectorAll(".commandBarImg")[0].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[1].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[2].style.display = "inline-block";
      document.querySelector(".slider").style.backgroundColor = "#ffca18";
      document.querySelector(".slider").style.transform = "rotate(180deg)";
   }
}

document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 87) {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
} });

// Right Click Menu
let rightClickMenu = document.getElementById("menu").style;
if (document.addEventListener) {
   document.addEventListener('contextmenu', function(e) {
      let posX = e.clientX;
      let posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   }, false);
   document.addEventListener('click', function(e) {
      rightClickMenu.display = "none";
   }, false);
}
else {
   document.attachEvent('oncontextmenu', function(e) {
      var posX = e.clientX;
      var posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   });
   document.attachEvent('onclick', function(e) {
      setTimeout(function() {
         rightClickMenu.display = "none";
      }, 501);
   });
}
function menu(x, y) {
   rightClickMenu.top = y + "px";
   rightClickMenu.left = x + "px";
   rightClickMenu.display = "block";
}

// Quests
questbarIsOpen = false;
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 81) { questbar(); } });
function questbar() {
   if (questbarIsOpen === true) {
      document.querySelector(".quests").style.left = "0";
      document.querySelector(".questShadow").style.display = "block";
      questbarIsOpen = false;
   }
   else {
      document.querySelector(".quests").style.left = "-80vh";
      document.querySelector(".questShadow").style.display = "none";
      questbarIsOpen = true;
   }
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings & Produce | 23 LINES=
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (settings.theme === "light") { light(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.querySelector('.sidebar').style.backgroundColor = '#111';
   document.querySelector('.sidebar').style.color = '#f5f5f5';
   settings.theme = "dark";
}
function light() {
   document.querySelector('.sidebar').style.backgroundColor = '#f5f5f5';
   document.querySelector('.sidebar').style.color = '#333';
   settings.theme = "light";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var saveLoop = window.setInterval(function() {
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
   localStorage.setItem("marketData", JSON.stringify(marketData));
   localStorage.setItem("settingData", JSON.stringify(settings));
}, 1000)

let savegame = {
   plotStatus: JSON.parse(localStorage.getItem("plotStatus")),
   produce: JSON.parse(localStorage.getItem("produce")),
   plots: JSON.parse(localStorage.getItem("plots")),
   marketData: JSON.parse(localStorage.getItem("marketData")),
   settings: JSON.parse(localStorage.getItem("settingData")),
}
plotStatus = savegame.plotStatus;
produce = savegame.produce;
plots = savegame.plots;
marketData = savegame.marketData;
settings = savegame.settings;

if (savegame !== null) {
   savegame.plotStatus = plotStatus;
   savegame.produce = produce;
   savegame.plots = plots;
   savegame.marketData = marketData;
   savegame.settings = settings;
}

if (settings) { } else { runIntro() }
if (settings.intro != "finished") { runIntro() }

function restart() {
   var areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure == true) {
      var areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure == true) {
         plotStatus = initalPlotStatus;
         produce = initalProduce;
         plots = initalPlots;
         marketData = initalMarketData;
         settings = initalSettings;
         // Save
         localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
         localStorage.setItem("produce", JSON.stringify(produce));
         localStorage.setItem("plots", JSON.stringify(plots));
         localStorage.setItem("marketData", JSON.stringify(marketData));
         localStorage.setItem("settingData", JSON.stringify(settings));
         // Reload
         location.reload();
      }
   }
}

// For export
// let save = [];
// save.push(plotStatus);
// save.push(produce);
// save.push(plots);
// save.push(marketData);
// save.push(settings);
