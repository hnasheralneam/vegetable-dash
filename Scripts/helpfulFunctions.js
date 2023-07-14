//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helper Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Misc
function info(THIS) {
   dynamHov.innerHTML = THIS.dataset.info;
   let updateHovText = setInterval(() => {
      dynamHov.innerHTML = THIS.dataset.info;
   }, 200);
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => {
      dynamHov.style.opacity = "0";
      clearInterval(updateHovText);
   }
}

function notify(text) {
   let alert = document.querySelector(".alert").cloneNode(true);
   document.querySelector(".alert-box").insertBefore(alert, document.querySelector(".alert-box").firstChild);
   alert.style.display = "block";
   alert.textContent = text;
   let removeAnimation = setTimeout(alertAnimation => { alert.classList.add("alertAnimation"); }, 6000);
   let removeElement = setTimeout(removeAnimation => { alert.classList.remove("alertAnimation"); alert.remove(); }, 7000);
   alert.onclick = () => {
      alert.classList.add("alertAnimation");
      setTimeout(removeAnimation => { alert.remove(); }, 1000);
      clearTimeout(removeAnimation);
      clearTimeout(removeElement);
   };
}

function fadeTextAppear(txt, txtColor) {
   let newText = document.createElement("P");
   newText.textContent = txt;
   newText.classList.add("plant-luck-text");
   document.querySelector(".plant-harvest-luck").appendChild(newText);
   newText.style.color = txtColor;
   setTimeout(() => { newText.remove(); }, 6000);
}

function scrollToShopSection(window, id) {
   document.querySelector(`#page-${window}-${id}`).scrollIntoView();
   document.querySelectorAll(`.active-tab.tab-${window}`)[0].classList.remove("active-tab");
   document.querySelector(`.tab-${window}-${id}`).classList.add("active-tab");
}

function toggleWindow(id) {
   let thisWindow = document.querySelector(`.window-${id}`);
   if (thisWindow.style.opacity == "1") {
      thisWindow.style.opacity = "0";
      thisWindow.style.pointerEvents = "none";
      thisWindow.style.zIndex = "-1000";
   }
   else {
      thisWindow.style.opacity = "1";
      thisWindow.style.pointerEvents = "auto";
      thisWindow.style.zIndex = "1000";
   }
}

function seedOwned(veg) {
   if (gameData.plantSeeds.includes(veg)) { return true; }
   else { return false; }
}


// Task hover effect
// Task Effect
let openTaskHov = [];
let openTaskUnHov = [];
function taskHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).classList.add("task-block-active");
   }, 750);
}
function taskUnHover(num) {
   clearTimeout(openTaskHov[num]);
   clearTimeout(openTaskUnHov[num]);
   openTaskUnHov[num] = setTimeout(() => {
      document.querySelector(`.task-block-${num}`).classList.remove("task-block-active");
   }, 250);
}


// Generally useful
function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

function random(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function scrollToSection(id) { document.getElementById(id).scrollIntoView(); }

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
   let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   let color = '#';
   for (let i = 0; i < 6; i++) { let index = random(0, 15); color += hex[index]; }
   return color;
}