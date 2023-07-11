//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setTask(task) {
   if (gameData.taskBox1 === "unoccupied") { gameData[`${task}Num`] = 1; }
   else if (gameData.taskBox2 === "unoccupied") { gameData[`${task}Num`] = 2; }
   else if (gameData.taskBox3 === "unoccupied") { gameData[`${task}Num`] = 3; }
   else if (gameData.taskBox4 === "unoccupied") { gameData[`${task}Num`] = 4; }
   else { gameData[`${task}Num`] = "Full"; }
   if (gameData[`${task}Num`] === "Full") { task = "waiting"; return; }
   gameData[`taskBox${gameData[`${task}Num`]}`] = `occupied ${task}`;
}
function startTask(num, buttonTxt, buttonOnClick, infoTxt, taskGiver, taskGiverImg, task) {
   gameData[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   showObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
   document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", `javascript: ${buttonOnClick}` );
   document.querySelector(`.task-info-${num}`).textContent = infoTxt;
   document.querySelector(`.task-info-giver-${num}`).textContent = taskGiver;
   document.querySelector(`.task-info-img-${num}`).src = `Images/${taskGiverImg}`;
   gameData["taskBox" + num] = "occupied " + task;
}
function clearTask(num) {
   hideObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).textContent = "";
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: " );
   document.querySelector(`.task-info-${num}`).textContent = "";
   document.querySelector(`.task-info-giver-${num}`).textContent = "";
   document.querySelector(`.task-info-img-${num}`).src = "";
   gameData["taskBox" + num] = "unoccupied";
}
function oldTaskCheck(task) {
   if (gameData.taskBox1 === `occupied ${task}`) { return 1; }
   else if (gameData.taskBox2 === `occupied ${task}`) { return 2; }
   else if (gameData.taskBox3 === `occupied ${task}`) { return 3; }
   else if (gameData.taskBox4 === `occupied ${task}`) { return 4; }
   else { return false; }
}
function taskAlreadyUp(task) {
   let value = {};
   for (i = 1; i < 5; i++) {
      if (gameData["taskBox" + i] === task) { value[i] = true; }
      else { value[i] = false; }
   }
   if (value[1] === false && value[2] === false && value[3] === false && value[4] === false) { return false }
   else { return true }
}
function checkTasks(task) { if (gameData[task] === "active") { gameData[task] = "ready"; } }
function collectTaskReward(task) {
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (task === tD[`t${i}`]["name"]) {
         gameData[tD[`t${i}`]["reward"]["item"]] += tD[`t${i}`]["reward"]["amount"];
      }
   }
   gameData[task] = "complete";
   clearTask(gameData[task + "Num"]);
}
function showTasks() {
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (ifCheck(tD[`t${i}`]["name"])) { setTask(tD[`t${i}`]["name"]); }
      if (oldTaskCheck(tD[`t${i}`]["name"]) != false) {
         if (gameData[tD[`t${i}`]["name"]] === "ready") {
            startTask(`${oldTaskCheck(tD[`t${i}`]["name"])}`,
            tD[`t${i}`]["reward"]["text"],
            tD[`t${i}`]["reward"]["code"],
            tD[`t${i}`]["text"]["ready"],
            tD[`t${i}`]["taskGiver"]["name"],
            tD[`t${i}`]["taskGiver"]["image"],
            tD[`t${i}`]["name"]);
         }
         else {
            startTask(`${oldTaskCheck(tD[`t${i}`]["name"])}`,
            tD[`t${i}`]["demand"]["text"],
            tD[`t${i}`]["demand"]["code"],
            tD[`t${i}`]["text"]["notReady"],
            tD[`t${i}`]["taskGiver"]["name"],
            tD[`t${i}`]["taskGiver"]["image"],
            tD[`t${i}`]["name"]);
         }
      }
   }
   function ifCheck(task) {
      if (!taskAlreadyUp(`occupied ${task}`) && (gameData[task] === "active" || gameData[task] === "waiting")) { return true; }
      else { return false; }
   }
}
function giveTasks() {
   if (seedOwned("pumpkins")) { gameData.bakeSale = "progressing"; }
   for (let i = 1; i <= tD.numOTasks; i++) {
      if (checkIf(tD[`t${i}`]["name"], tD[`t${i}`]["conditions"])) { gameData[tD[`t${i}`]["name"]] = "active"; }
   }
   function checkIf(name, conditions) {
      let trueList = { is1: false, is2: false, is3: false, is4: false }
      if (gameData[name] != "complete" && gameData[name] != "ready") { trueList.is1 = true; }
      if (conditions["c1"][0] !== false) {
         let taskCheckingNumber = conditions["c1"][0];
         let stateOfThatTask = gameData[tD[taskCheckingNumber]["name"]];
         if (stateOfThatTask === "complete") { trueList.is2 = true; }
      } else { trueList.is2 = false; }
      if (conditions["c2"][0] !== "false") {
         if (typeof conditions["c2"][1] === "number") {
            if (gameData[conditions["c2"][0]] >= conditions["c2"][1]) { trueList.is3 = true; }
         }
         else if (gameData[conditions["c2"][0]] === conditions["c2"][1]) { trueList.is3 = true; }
      } else { trueList.is3 = false; }
      if (conditions["c3"][0] !== "false") {
         if (seedOwned(gameData[conditions["c3"][0]])) { trueList.is4 = true; }
      } else { trueList.is4 = false; }
      if (trueList.is1 && trueList.is2 && trueList.is3 && trueList.is4) { return true; }
      else { return false; }
   }
}
