// Varibles
const player = {
    points: 0,
}
const settings = {
    theme: "dark"
}
const resources = {
    workers: 5,
    availableWorkers: 5,
    lumber: 75,
    planks: 75,
    straw: 50,
    wheat: 10,
    wheatGrain: 25,
    wheatGrainBuns: 0,
    wheatGrainBagels: 0,
    wheatGrainBreadloafs: 0,
    wheatGrainBaguettes: 0
}
const buildings = {
    basicHuts: 5,
    hasMill: true,
    millAvailable: false,
    hasBakery: true,
    bakeryAvailable: false,
    hasWoodworkery: false,
    woodworkeryAvailable: false,
    hasLumbercollectioncamp: false,
    lumbercollectioncampAvailable: false

}
const operationsRunning = [];

let bakery = document.createElement("DIV");
let mill =  document.createElement("DIV");

// Note: Create threshing floor, thresh 1 wheat for 2 straw and 1 wheatGrain

// Init
function init() {
    for (let i = 0; i < buildings.basicHuts; i++) {
        let newHut = document.createElement("IMG");
        newHut.src = "New Vegetable/Passive Buildings/basic-hut.png";
        newHut.classList.add("building");
        document.querySelector(".passiveBuildings").appendChild(newHut);
    }
    if (buildings.hasMill) {
        createWorkBuilding("millAvailable", mill, "mill", "Mill! <br> (Needs 3 workers to operate)");
    }
    if (buildings.hasBakery) {
        createWorkBuilding("bakeryAvailable", bakery, "bakery", "Bakery! <br> (Needs 2 workers to operate)");
        createWorkBuildingItem("Bakery", "bun", "5 Min");
        createWorkBuildingItem("Bakery", "bagel", "15 Min");
        createWorkBuildingItem("Bakery", "breadloaf", "45 Min");
        createWorkBuildingItem("Bakery", "baguette", "1 Hour 30 Min");
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
                break;
                case "baking":
                    switch (arr[1]) {
                        case  "bun":
                            if (Date.now() >= arr[3]) {
                                toConsole("Bun Baking Complete! <br> (Mmmm, that delicous scent)")
                                handleFinishedOperations(arr);
                                obj.splice(index, 1);
                            }
                        break;
                        case "bagel":
                            if (Date.now() >= arr[3]) {
                                toConsole("Bagel Baking Complete!")
                                handleFinishedOperations(arr);
                                obj.splice(index, 1);
                            }
                        break;
                        case "breadloaf":
                            if (Date.now() >= arr[3]) {
                                toConsole("Breadloaf Baking Complete!")
                                handleFinishedOperations(arr);
                                obj.splice(index, 1);
                            }
                        break;
                        case "baguette":
                            if (Date.now() >= arr[3]) {
                                toConsole("Baguette Baking Complete!")
                                handleFinishedOperations(arr);
                                obj.splice(index, 1);
                            }
                    }
            }
        });
        document.querySelector(".workers").dataset.info = `${resources.workers} Workers <br> ${resources.availableWorkers} Available`;
        document.querySelector(".lumber").dataset.info = `${resources.lumber} Lumber`;
        document.querySelector(".planks").dataset.info = `${resources.planks} Planks`;
    }, 500);
}
init();

// Other other
function handleFinishedOperations(arr) {
    switch (arr[0]) {
        case  "construction":
            document.getElementById(arr[2]).remove();
            switch (arr[1]) {
                case "basicHut":
                    basicHutIsBuilt();
            }
        case "baking":
            document.querySelector(".workBuildings").appendChild(bakery);
            buildings.bakeryAvailable = true;
            bakery.dataset.info = "Bakery! <br> (Needs 2 workers to operate)";
            switch (arr[1]) {
                case "bun": baked(arr[1]);
                break;
                case "bagel": baked(arr[1]);
                break;
                case "breadloaf": baked(arr[1]);
                break;
                case "baguette": baked(arr[1]);
            }
    }
}

// Specific Functions
// Basic Hut
function build_BasicHut() {
    if (resources.availableWorkers >= 2 && resources.lumber >= 25 && resources.straw >= 15) {
        resources.availableWorkers -= 2;
        toConsole("- 2 Workers (Busy) <br> - 25 Planks <br> - 25 Straw", "loss")
        resources.planks -= 25;
        resources.straw -= 15;
        let builtTime = Date.now() + 2000; // 900000 | 15 minutes
        let thisId = uniqueId();
        operationsRunning.push(["construction", "basicHut", thisId, builtTime]);
        createAndPlaceImgWthHov("Passive Buildings/basic-hut.png", ".taskOccuring", "building", "Basic Hut <br> Using 2 workers <br> Takes 15 minutes", thisId);
    }
    else {
        toConsole("Not enough materials <br> (Needs: 2 Workers, 25 Planks, and 25 Straw)", "insufficient");
    }
}
function basicHutIsBuilt() {
    resources.workers += 1;
    resources.availableWorkers += 3;
    buildings.basicHuts++;
    player.points += 25;
    toConsole("+ 2 Workers (Task Completed) <br> + 1 Worker <br> +1 Basic Hut", "gain")
    toConsole("+ 25 points", "neutral")
    createAndPlaceImg("Passive Buildings/basic-hut.png", ".passiveBuildings", "building");
}
// Bakery
function bake(item) {
    switch (item) {
        case "bun":
            if (buildings.bakeryAvailable && resources.availableWorkers >= 2 && resources.wheatGrain >= 2) {
                resources.availableWorkers -= 2;
                resources.wheatGrain -= 2;
                toConsole("- 2 Workers (Busy) <br> - 2 Wheat Grain", "loss")
                let readyTime = Date.now() + 5000; // 150000 | 2.5 minutes
                let thisId = uniqueId();
                operationsRunning.push(["baking", "bun", thisId, readyTime]);
                document.querySelector(".taskOccuring").appendChild(bakery);
                buildings.bakeryAvailable = false;
                bakery.dataset.info = "Baking Buns <br> Using 2 Workers <br> Takes 5 Minutes";
            }
            else { toConsole("Insufficient resources <br> Try again when you have 2 Workers avalible and 2 wheat grain.", "insufficient"); }
            break;
        case "bagel":
            if (buildings.bakeryAvailable && resources.availableWorkers >= 2 && resources.wheatGrain >= 5) {
                resources.availableWorkers -= 2;
                resources.wheatGrain -= 5;
                toConsole("- 2 Workers (Busy) <br> - 5 Wheat Grain", "loss")
                let readyTime = Date.now() + 5000; // 150000 | 2.5 minutes
                let thisId = uniqueId();
                operationsRunning.push(["baking", "bagel", thisId, readyTime]);
                let bakery = document.querySelector(".bakeryDiv");
                document.querySelector(".taskOccuring").appendChild(bakery);
                buildings.bakeryAvailable = false;
                bakery.dataset.info = "Baking Bagels <br> Using 2 Workers <br> Takes 15 Minutes";
            }
            else { toConsole("Insufficient resources <br> Try again when you have 2 Workers avalible and 5 wheat grain.", "insufficient"); }
            break;
        case "breadloaf":
            if (buildings.bakeryAvailable && resources.availableWorkers >= 2 && resources.wheatGrain >= 8) {
                resources.availableWorkers -= 2;
                resources.wheatGrain -= 8;
                toConsole("- 2 Workers (Busy) <br> - 8 Wheat Grain", "loss")
                let readyTime = Date.now() + 5000; // 150000 | 2.5 minutes
                let thisId = uniqueId();
                operationsRunning.push(["baking", "breadloaf", thisId, readyTime]);
                let bakery = document.querySelector(".bakeryDiv");
                document.querySelector(".taskOccuring").appendChild(bakery);
                buildings.bakeryAvailable = false;
                bakery.dataset.info = "Baking Breadloafs <br> Using 2 Workers <br> Takes 45 Minutes";
            }
            else { toConsole("Insufficient resources <br> Try again when you have 2 Workers avalible and 8 wheat grain.", "insufficient"); }
            break;
        case "baguette":
            if (buildings.bakeryAvailable && resources.availableWorkers >= 2 && resources.wheatGrain >= 12) {
                resources.availableWorkers -= 2;
                resources.wheatGrain -= 12;
                toConsole("- 2 Workers (Busy) <br> - 12 Wheat Grain", "loss")
                let readyTime = Date.now() + 5000; // 150000 | 2.5 minutes
                let thisId = uniqueId();
                operationsRunning.push(["baking", "baguette", thisId, readyTime]);
                let bakery = document.querySelector(".bakeryDiv");
                document.querySelector(".taskOccuring").appendChild(bakery);
                buildings.bakeryAvailable = false;
                bakery.dataset.info = "Baking Baguettes <br> Using 2 Workers <br> Takes 90 Minutes";
            }
            else { toConsole("Insufficient resources <br> Try again when you have 2 Workers avalible and 12 wheat grain.", "insufficient"); }
    }
}
function baked(item) {
    resources.availableWorkers += 2;
    toConsole("+ 2 Workers (Task Completed)", "gain");
    switch (item) {
        case "bun":
            resources.wheatGrainBuns++;
            player.points += 15;
            toConsole("+ 1 Bun", "gain");
            toConsole("+ 15 points", "neutral");
            break;
        case "bagel":
            resources.wheatGrainBagels++;
            player.points += 35;
            toConsole("+ 1 Bagel", "gain");
            toConsole("+ 35 points", "neutral");
            break;
        case "breadloaf":
            resources.wheatGrainBreadloafs++;
            player.points += 55;
            toConsole("+ 1 Breadloaf", "gain");
            toConsole("+ 55 points", "neutral");
            break;
        case "baguette":
            resources.wheatGrainBaguette++;
            player.points += 70;
            toConsole("+ 1 Baguette", "gain");
            toConsole("+ 70 points", "neutral");
    }
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
function createWorkBuildingItem(type, img, title) {
    let item = document.createElement("IMG");
    item.src = `New Vegetable/${type}/${img}.png`;
    item.onclick = () => { bake(img); };
    item.title = title;
    item.classList.add("workBuildingItem");
    document.querySelector(`.${type.toLowerCase()}Div`).appendChild(item);
}
function createWorkBuilding(makeAvalible, div, name, title) {
    buildings[makeAvalible] = true;
    let workBuilding = div;
    workBuilding.classList.add(`${name}Div`);
    workBuilding.classList.add("workBuildingDiv");
    document.querySelector(".workBuildings").appendChild(workBuilding);
    createAndPlaceImg(`Work Buildings/${name}.png`, `.${name}Div`, "building");
    workBuilding.dataset.info = title;
    workBuilding.onmouseover = () => { info(workBuilding); };
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
            break;
        case "insufficient": 
            newEntry.classList.add("consoleTextInsufficient");
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
   dynamHov.innerHTML = THIS.dataset.info;
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => { dynamHov.style.opacity = "0"; }
}
