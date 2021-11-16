const resources = {
    workers: 5,
    availableWorkers: 5,
    lumber: 25,
    straw: 50
}
const buildings = {
    basicHuts: 5,
    hasBakery: true,
    hasWoodworkery: false,
    hasLumbercollectioncamp: false,
}
const operationsRunning = [];

function init() {
    for (let i = 0; i < buildings.basicHuts; i++) {
        let newHut = document.createElement("IMG");
        newHut.src = "New Vegetable/hut.png";
        newHut.classList.add("building");
        document.querySelector(".passiveBuildings").appendChild(newHut);
    }
    if (buildings.hasBakery) { createAndPlaceImg("bakery.jpg", ".workBuildings", "building"); }
    if (buildings.hasWoodworkery) { createAndPlaceImg("woodworkery.jpg", ".workBuildings", "building"); }
    if (buildings.hasLumbercollectioncamp) { createAndPlaceImg("lumbercollectioncamp.jpg", ".workBuildings", "building"); }
    // Game Loop
    setInterval(() => {
        operationsRunning.forEach((arr, index, obj) => {
            if (Date.now >= arr[1]) {
                handleFinishedOperations(arr);
                obj.splice(index, 1);
            }
        });
    }, 500);
}

init();

function createAndPlaceImg(src, destination, cssClass) {
    let element = document.createElement("IMG");
    element.src = `New Vegetable/${src}`;
    element.classList.add(cssClass);
    document.querySelector(destination).appendChild(element);
}
function build_BasicHut() {
    if (resources.availableWorkers >= 2 && resources.lumber >= 25 && resources.straw >= 15) {
        resources.availableWorkers -= 2;
        resources.lumber -= 25;
        resources.straw -= 15;
        let builtTime = Date.now() + 900000; // 15 minutes
        operationsRunning.push(["construction_basicHut", builtTime]);
    }
}
function handleFinishedOperations(arr) {
    if (arr[0] === "construction_basicHut") { basicHutIsBuilt(); }
}
function basicHutIsBuilt() {
    resources.workers += 1;
    resources.availableWorkers += 3;
    buildings.basicHuts++;
    createAndPlaceImg("hut.png", ".passiveBuildings", "building");
}