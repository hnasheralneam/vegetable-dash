//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Tasks
for (i = 1; i <= 4; i++) { hideObj(`.task-info-button-${i}`); }


/*
giver requests
- collect n coins
- give n coins
- unlock n veg seeds
- unlock nth plot
- use n market resets/fertilizer/police doughnuts
- make exchange/bm deal
- sell/buy n veg

reasons a task starts
- game started
- another task completed
- plot/veg unlocked
*/

// See if conditions are met for assigning any tasks
function assignTasks() {
   // Loop through tasks from taskInfo
   Object.keys(taskInfo).forEach((key,) => {
      // If there are no conditions, and it is not reached, set as active
      if (taskInfo[key].conditions.type.length == 0) {
         if (gameData["tasks"][key]["status"] == "unreached") {
            gameData["tasks"][key]["status"] = "active";
         }
      }
      // If conditions are met, set task to active in gameData
      else if (taskInfo[key].conditions.type.length > 0) {
         let needs = {
            have: true,
            complete: true,
            unlockedSeed: true
         }
         if (taskInfo[key].conditions.type.indexOf("have") > -1) { needs.have = taskInfo[key].conditions.type.indexOf("have"); }
         if (taskInfo[key].conditions.type.indexOf("complete") > -1) { needs.complete = taskInfo[key].conditions.type.indexOf("complete"); }
         if (taskInfo[key].conditions.type.indexOf("unlockedSeed") > -1) { needs.unlockedSeed = taskInfo[key].conditions.type.indexOf("unlockedSeed"); }

         // If you have enough of the required item, set as complete
         if (needs.have !== false && needs.have !== true) {
            if (gameData[taskInfo[key].conditions.completeRequirement[needs.have][0]] >= taskInfo[key].conditions.completeRequirement[needs.have][1]) {
               needs.have = true;
            }
            else { needs.have = false; }
         }
         // If the required task is complete, set as complete
         if (needs.complete !== false && needs.complete !== true) {
            if (gameData["tasks"][taskInfo[key].conditions.completeRequirement[needs.complete]]["status"] == "complete") {
               needs.complete = true;
            }
            else { needs.complete = false; }
         }
         // If the required seed is unlocked, set as complete
         if (needs.unlockedSeed !== false && needs.unlockedSeed !== true) {
            if (seedOwned(taskInfo[key].conditions.completeRequirement[needs.unlockedSeed])) {
               needs.unlockedSeed = true;
            }
            else { needs.unlockedSeed = false; }
         }
         if (needs.have && needs.complete && needs.unlockedSeed) {
            if (gameData["tasks"][key]["status"] == "unreached") {
               gameData["tasks"][key]["status"] = "active";
            }
         }
      }
   });
}

function displayTasks() {
   Object.keys(taskInfo).forEach((key,) => {
      if (checkIfReady(key)) {
         // If the task does not have a spot, give it one
         setTaskSpot(key);
         // Display the tasks
         showTaskInfo(key);
      }
   });


   // If task meets conditions
   function checkIfReady(task) {
      // If task is active, waiting, or ready
      if (gameData["tasks"][task]["status"] != "unreached" && gameData["tasks"][task]["status"] != "complete") return true;
      else return false;
   }

   // Decides which task box to put the task in
   function setTaskSpot(task) {
      if (findTaskSpot(task) !== false) return;
      let openSpot = "Full";
      if (gameData.tasktab1 === "open") { openSpot = 1; }
      else if (gameData.tasktab2 === "open") { openSpot = 2; }
      else if (gameData.tasktab3 === "open") { openSpot = 3; }
      else if (gameData.tasktab4 === "open") { openSpot = 4; }

      if (openSpot === "Full") {
         gameData["tasks"][task]["status"] = "waiting";
         return;
      }
      gameData[`tasktab${openSpot}`] = task;
   }

   function showTaskInfo(task) {
      let taskSpot = findTaskSpot(task);
      // Continue if the task has a spot
      if (taskSpot === false) { return; }
      // If the status of the task is ready
      if (gameData["tasks"][task]["status"] === "ready") {
         startTask(taskSpot, taskInfo[task]["reward"]["text"], taskInfo[task]["reward"]["code"], taskInfo[task]["text"]["ready"], task);
      }
      // Otherwise display unfinished text
      else {
         startTask(taskSpot, taskInfo[task]["demand"]["text"], taskInfo[task]["demand"]["code"], taskInfo[task]["text"]["notReady"], task);
      }


      function startTask(num, buttonTxt, buttonOnClick, infoTxt, task) {
         if (num === "Full") { task = "waiting"; return; }
         let info = taskInfo[task];
         showObj(`.task-info-button-${num}`);
         document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
         document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
         document.querySelector(`.task-info-button-${num}`).onclick = () => { buttonOnClick(); }
         document.querySelector(`.task-info-${num}`).textContent = infoTxt;
         document.querySelector(`.task-info-giver-${num}`).textContent = info.giver;
         document.querySelector(`.task-info-img-${num}`).src = `Images/${info.giverImage}`;
         gameData["tasktab" + num] = task;
      }
   }
}


// Checks if there is a ready task
function readyTaskCheck() {
   if (aTaskIsReady()) { document.querySelector(".aTaskIsReady").style.opacity = "1"; }
   else { document.querySelector(".aTaskIsReady").style.opacity = "0"; }

   function aTaskIsReady() {
      if (gameData.tasktab1 != "open" && gameData["tasks"][gameData.tasktab1]["status"] == "ready") return true;
      else if (gameData.tasktab2 != "open" && gameData["tasks"][gameData.tasktab2]["status"] == "ready") return true;
      else if (gameData.tasktab3 != "open" && gameData["tasks"][gameData.tasktab3]["status"] == "ready") return true;
      else if (gameData.tasktab4 != "open" && gameData["tasks"][gameData.tasktab4]["status"] == "ready") return true;
      else return false;
   }
}

function checkTasks(task) {
   if (gameData["tasks"][task]["status"] === "active") {
      gameData["tasks"][task]["status"] = "ready";
   }
}

function collectTaskReward(task) {
   gameData[taskInfo[task]["reward"]["item"]] += taskInfo[task]["reward"]["amount"];
   updateDoughnuts();
   updateFertilizer();
   updateMarketResets();
   updateCoins();

   gameData["tasks"][task]["status"] = "complete";
   clearTask(task);

   function clearTask() {
      let num = findTaskSpot(task);
      hideObj(`.task-info-button-${num}`);
      document.querySelector(`.task-info-button-${num}`).textContent = "";
      document.querySelector(`.task-info-button-${num}`).onclick = () => { };
      document.querySelector(`.task-info-${num}`).textContent = "";
      document.querySelector(`.task-info-giver-${num}`).textContent = "";
      document.querySelector(`.task-info-img-${num}`).src = "";
      gameData["tasktab" + num] = "open";
   }
}

// Checks if the task is already displayed
function findTaskSpot(task) {
   if (gameData.tasktab1 === task) { return 1; }
   else if (gameData.tasktab2 === task) { return 2; }
   else if (gameData.tasktab3 === task) { return 3; }
   else if (gameData.tasktab4 === task) { return 4; }
   else { return false; }
}