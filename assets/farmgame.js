// Varibles
const settings = {
    theme: "dark"
}
const resources = {
    workers: 5,
    availableWorkers: 5,
    lumber: 75,
    planks: 75,
    straw: 50
}
const buildings = {
    basicHuts: 5,
    hasMill: true,
    hasBakery: true,
    hasWoodworkery: false,
    hasLumbercollectioncamp: false,
}
const operationsRunning = [];

// Init
function init() {
    for (let i = 0; i < buildings.basicHuts; i++) {
        let newHut = document.createElement("IMG");
        newHut.src = "New Vegetable/Passive Buildings/basic-hut.png";
        newHut.classList.add("building");
        document.querySelector(".passiveBuildings").appendChild(newHut);
    }
    if (buildings.hasMill) {
        let millDiv = document.createElement("DIV");
        millDiv.classList.add("millDiv");
        millDiv.classList.add("workBuildingDiv");
        document.querySelector(".workBuildings").appendChild(millDiv);
        createAndPlaceImg("Work Buildings/mill.jpg", ".millDiv", "building");
        // Give nice hover
        millDiv.dataset.info = "Mill! (4 Workers)";
        millDiv.onmouseover = () => { info(millDiv); };
    }
    if (buildings.hasBakery) {
        let bakeryDiv = document.createElement("DIV");
        bakeryDiv.classList.add("bakeryDiv");
        bakeryDiv.classList.add("workBuildingDiv");
        document.querySelector(".workBuildings").appendChild(bakeryDiv);
        createAndPlaceImg("Work Buildings/bakery.png", ".bakeryDiv", "building");
        // Give nice hover
        bakeryDiv.dataset.info = "Bakery! (2 Workers)";
        bakeryDiv.onmouseover = () => { info(bakeryDiv); };
        // Other Stuff
        let bakeryItem1 = document.createElement("IMG");
        bakeryItem1.src = `New Vegetable/bakery-bun.png`;
        bakeryItem1.onclick = () => { bake("bun") };
        bakeryItem1.title = "5 Min";
        bakeryItem1.classList.add("workBuildingItem");
        document.querySelector(".bakeryDiv").appendChild(bakeryItem1);
        // 2
        let bakeryItem2 = document.createElement("IMG");
        bakeryItem2.src = `New Vegetable/bakery-bagel.png`;
        bakeryItem2.onclick = () => { bake("bagel") };
        bakeryItem2.title = "15 Min";
        bakeryItem2.classList.add("workBuildingItem");
        document.querySelector(".bakeryDiv").appendChild(bakeryItem2);
        // 3
        let bakeryItem3 = document.createElement("IMG");
        bakeryItem3.src = `New Vegetable/bakery-breadloaf.png`;
        bakeryItem3.onclick = () => { bake("breadloaf") };
        bakeryItem3.title = "45 Min";
        bakeryItem3.classList.add("workBuildingItem");
        document.querySelector(".bakeryDiv").appendChild(bakeryItem3);
        // 4
        let bakeryItem4 = document.createElement("IMG");
        bakeryItem4.src = `New Vegetable/bakery-bagette.png`;
        bakeryItem4.onclick = () => { bake("bagette") };
        bakeryItem4.title = "1 Hour 30 Min";
        bakeryItem4.classList.add("workBuildingItem");
        document.querySelector(".bakeryDiv").appendChild(bakeryItem4);
    }
    if (buildings.hasWoodworkery) { createAndPlaceImg("woodworkery.jpg", ".workBuildings", "building"); }
    if (buildings.hasLumbercollectioncamp) { createAndPlaceImg("lumbercollectioncamp.jpg", ".workBuildings", "building"); }
    // Game Loop
    setInterval(() => {
        operationsRunning.forEach((arr, index, obj) => {
            switch (arr[0]) {
                case  "construction":
                    switch (arr[1]) {
                        case  "basicHut":
                            if (Date.now() >= arr[3]) {
                                toConsole("Basic Hut Construction Complete!")
                                handleFinishedOperations(arr);
                                obj.splice(index, 1);
                            }
                    }
            }
            // if (Date.now() >= arr[1]) {
            //     handleFinishedOperations(arr);
            //     obj.splice(index, 1);
            // }
        });
        document.querySelector(".workers").dataset.info = `${resources.workers} Workers, ${resources.availableWorkers} Available`;
        document.querySelector(".lumber").dataset.info = `${resources.lumber} Lumber`;
        document.querySelector(".planks").dataset.info = `${resources.planks} Planks`;
    }, 500);
}
init();

// Other other
function handleFinishedOperations(arr) {
    switch (arr[0]) {
        case  "construction":
            console.log(arr[2])
            document.getElementById(arr[2]).remove();
            switch (arr[1]) {
                case  "basicHut":
                    basicHutIsBuilt();
            }
    }
}

// Specific Functions
function build_BasicHut() {
    if (resources.availableWorkers >= 2 && resources.lumber >= 25 && resources.straw >= 15) {
        resources.availableWorkers -= 2;
        toConsole("- 2 Workers (Busy) <br> - 25 Planks <br> - 25 Straw", "loss")
        resources.planks -= 25;
        resources.straw -= 15;
        let builtTime = Date.now() + 2000; // 900000 | 15 minutes
        let thisId = uniqueId();
        // operationsRunning.push(["construction_basicHut", builtTime]);
        operationsRunning.push(["construction", "basicHut", thisId, builtTime]);
        createAndPlaceImgWthHov("Passive Buildings/basic-hut.png", ".taskOccuring", "building", "Hut - using 2 workers, takes 15 minutes", thisId);
    }
    else {
        toConsole("Not enough materials (Needs: 2 Workers, 25 Planks, and 25 Straw)", "loss");
    }
}
function basicHutIsBuilt() {
    resources.workers += 1;
    resources.availableWorkers += 3;
    buildings.basicHuts++;
    toConsole("+ 2 Workers (Task Completed) <br> + 1 Worker <br> +1 Basic Hut", "gain")
    createAndPlaceImg("Passive Buildings/basic-hut.png", ".passiveBuildings", "building");
}

// Create Elements
function createAndPlaceImg(src, destination, cssClass) {
    let element = document.createElement("IMG");
    element.src = `New Vegetable/${src}`;
    element.classList.add(cssClass);
    document.querySelector(destination).appendChild(element);
}
function createAndPlaceImgWthHov(src, destination, cssClass, hovText, id) {
    let element = document.createElement("IMG");
    element.src = `New Vegetable/${src}`;
    element.dataset.info = hovText;
    element.onmouseover = () => { info(element); };
    element.classList.add(cssClass);
    if (id) { element.id = id; }
    document.querySelector(destination).appendChild(element);
}

// Other Functions
function toConsole(text, color) {
    let newEntry = document.createElement("P");
    newEntry.innerHTML = text;
    switch (color) {
        case "neutral":
            newEntry.classList.add("consoleTextNeutral");
            break;
        case "loss":
            newEntry.classList.add("consoleTextLoss");
            break;
        case "gain":
            newEntry.classList.add("consoleTextGain");
    }
    document.querySelector(".console").prepend(newEntry);
}
const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };

// Dynamic hover
let dynamHov = document.createElement("SPAN");
document.body.appendChild(dynamHov);
dynamHov.style.position = "fixed";
if (settings.theme === "light") { dynamHov.classList.add("dynamicHover"); }
else { dynamHov.classList.add("dynamicHoverDark"); }

function getCoords(e) {
   dynamHov.style.top = `${event.clientY}px`;
   dynamHov.style.left = `${event.clientX + 25}px`;
}
function info(THIS) {
   dynamHov.textContent = THIS.dataset.info;
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => { dynamHov.style.opacity = "0"; }
}
