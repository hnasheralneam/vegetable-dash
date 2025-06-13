let gridEl = document.querySelector(".grid");

let grid = [];
let moving = false;
let heldInterval;
let lastPos = [];
let activeBuilding;
let activeCell;
let cellOffsetX = 0;
let cellOffsetY = 0;
let imagePreviewElement;

let inventory;
let gridBuildings;


const GridSaveManager = {
   decrementInventoryItem(handle) {
      let itemIndex = inventory.findIndex((arr) => arr[0] == handle);
      inventory[itemIndex][1]--;
      if (inventory[itemIndex][1] === 0) inventory.splice(itemIndex, 1);
      populateInventoryElements();
      GridSaveManager.saveInventory();
   },
   incrementInventoryItem(handle) {
      let itemIndex = inventory.findIndex((arr) => arr[0] == handle);
      if (itemIndex != -1) inventory[itemIndex][1]++;
      else inventory.push([handle, 1]);
      populateInventoryElements();
      GridSaveManager.saveInventory();
   },
   getInventoryElementAmount(handle) {
      let itemIndex = inventory.findIndex((arr) => arr[0] == handle);
      if (itemIndex == -1) return 0;
      else return inventory[itemIndex][1];
   },
   loadInventory() {
      let savedInventory = localStorage.getItem("vegetabledash-inventory");
      if (savedInventory) inventory = JSON.parse(savedInventory);
      else {
         inventory = [
            ["plot", 1],
            ["fertilizer", 1],
            ["bush", 1]
         ];
         if (gameData.coins > 0) {
            alert("Vegetable Dash has had some major updates since you last played, you may want to reset for the best experience. Tip: you can reset the game in the settings.");
         }
      }
      return inventory;
   },
   saveInventory() {
      localStorage.setItem("vegetabledash-inventory", JSON.stringify(inventory));
   },

   addGridItem(handle, id, position, data) {
      gridBuildings.push({ handle, id, position, data });
      GridSaveManager.saveGridData();
   },
   moveGridItem(id, newPosition) {
      let itemIndex = gridBuildings.findIndex((arr) => arr.id == id);
      gridBuildings[itemIndex].position = newPosition;
      GridSaveManager.saveGridData();
   },
   removeGridItem(id) {
      gridBuildings = gridBuildings.filter(item => item.id !== id);
      GridSaveManager.saveGridData();
   },
   saveGridData() {
      localStorage.setItem("vegetabledash-grid", JSON.stringify(gridBuildings));
   },
   loadGrid() {
      let savedGrid = localStorage.getItem("vegetabledash-grid");
      if (savedGrid) gridBuildings = JSON.parse(savedGrid);
      else gridBuildings = [];
      return gridBuildings;
   }
};

document.body.addEventListener("mouseup", (e) => {
   const target = document.elementFromPoint(e.clientX, e.clientY);
   if (target && target.closest(".inventory-grandparent")) {
      if (moving) {
         moving = false;
         if (activeBuilding) {
            if (activeBuilding.handle === "plot") {
               let userOkayWithIt = confirm("Are you sure you want to put this plot in storage? It will remove any growth progress");
               if (userOkayWithIt) storeItem();
               else {
                  cancelMove();
                  imagePreviewElement.remove();
                  clearPreview();
               }
            }
            else storeItem();
         }
      }
      function storeItem() {
         GridSaveManager.incrementInventoryItem(activeBuilding.handle);
         GridSaveManager.removeGridItem(activeBuilding.id);
         postMoveCleanup();
         activeBuilding.domElement.remove();
      }
      clearTimeout(heldInterval);
   }
   else {
      if (moving) {
         activeBuilding.domElement.remove();
         cancelMove();
      }
      clearTimeout(heldInterval);
   }
});


function findPlaceForBuilding(building) {
   for (let i = 0; i < gameData.grid.rows; i++) {
      for (let j = 0; j < gameData.grid.cols; j++) {
         if (canPlaceBuilding(building, { x: i, y: j })) {
            return { x: i, y: j };
         }
      }
   }
   return { x: -1, y: -1 };
}

function populateInventoryElements() {
   let inventoryBox = document.querySelector(".inventory");
   inventoryBox.innerHTML = "";
   inventory.forEach((data) => {
      let buildingId = data[0];
      let quantity = data[1];
      let building = buildings[buildingId];

      let element = document.createElement("div");
      element.classList.add("inventory-item");
      element.innerHTML = `
      <img src="${building.image}">
      <p>${building.name}</p>
      <p>${building.height}x${building.width}</p>
      <p>quantity ${quantity}</p>
   `;
      element.addEventListener("click", () => {
         addBuildingToGrid(building);
      });
      inventoryBox.appendChild(element);
   });
}

function addBuildingToGrid(building)  {
   let position = findPlaceForBuilding(building);
   if (position.x === -1) {
      alert("no space! clear up the board first");
      return;
   }
   let newBuilding = structuredClone(building);
   newBuilding.id = window.crypto.randomUUID();
   GridSaveManager.decrementInventoryItem(building.handle);
   GridSaveManager.addGridItem(building.handle, newBuilding.id, position, newBuilding.data);
   placeBuilding(newBuilding, position);
}

function addBuildingToGridByHandle(handle) {
   const building = buildings[handle];
   addBuildingToGrid(building);
}

function populateGridBuildings() {
   gridBuildings.forEach((building) => {
      let buildingData = buildings[building.handle];
      let newBuilding = structuredClone(buildingData);
      newBuilding.id = building.id;
      placeBuilding(newBuilding, building.position);
   });
}

// listeners
document.querySelector(".grid").addEventListener("mousedown", () => {
   if (!activeCell || moving) return;

   let i = activeCell.position.x;
   let j = activeCell.position.y;
   if (!grid[i][j]["filled"]) return;
   if (gameData.panels.inventory) startDrag();
   else {
      heldInterval = setTimeout(() => {
         if (!gameData.panels.inventory) inventoryBar("close");
         startDrag();
      }, 650);
   }
   function startDrag() {
      if (!activeCell) return;
      clearTimeout(heldInterval);
      moving = true;

      // TO-DO
      // WHAT IT NEEDS TO DO HERE IS GET THE SQUARE THE MOUSE IS OVER

      lastPos = [i, j];
      activeBuilding = grid[i][j]["building"];
      if (activeBuilding.domElement) {
         activeBuilding.domElement.style.opacity = "var(--building-opacity)";
         activeBuilding.domElement.style.pointerEvents = "none";
      }

      let firstCellOfBuildingPosition = getBuildingTopLeftPosition();
      cellOffsetX = i - firstCellOfBuildingPosition.x;
      cellOffsetY = j - firstCellOfBuildingPosition.y;

      document.querySelector(":root").style.setProperty("--moving-full-color", "#eeeeee40");
      removeBuilding(activeBuilding);
      updateArea(i, j, activeBuilding.height, activeBuilding.width);
   }
});

// functions
function generateGrid() {
   if (!gameData.grid) {
      gameData.grid = initGameData.grid;
      save();
   }
   if (gridEl) gridEl.style.gridTemplateColumns = `repeat(${gameData.grid.cols}, 1fr)`;
   for (let i = 0; i < gameData.grid.rows; i++) {
      grid[i] = [];
      for (let j = 0; j < gameData.grid.cols; j++) {
         let cell = document.createElement("div");
         cell.classList.add("grid-box");
         grid[i][j] = {
            element: cell,
            filled: false,
            building: undefined,
            position: {
               x: i,
               y: j
            }
         }
         gridEl.appendChild(cell);
         addTracking(i, j);
      }
   }
}





function createImagePreviewElement() {
   imagePreviewElement = document.createElement("div");
   imagePreviewElement.style.opacity = "var(--building-opacity)";
   imagePreviewElement.style.pointerEvents = "none";
   imagePreviewElement.style.position = "absolute";
   imagePreviewElement.style.right = "0";
   imagePreviewElement.style.bottom = "0";
}


function addTracking(i, j) {
   let cellObj = grid[i][j];
   let cell = cellObj.element;

   cell.addEventListener("mouseover", () => {
      activeCell = cellObj;
      if (moving) updateArea(i, j, activeBuilding.height, activeBuilding.width);
   });
   cell.addEventListener("mouseout", () => {
      if (activeBuilding)
         for (let row = i; row < i + activeBuilding.height; row++)
            for (let col = j; col < j + activeBuilding.width; col++)
               if (row < gameData.grid.rows && col < gameData.grid.cols) {
                  grid[row][col]["element"].classList.remove("preview-full");
                  grid[row][col]["element"].classList.remove("preview-empty");
               }
      activeCell = undefined;
   });
}

function cancelMove() {
   if (!moving) return;
   if (!activeCell) returnToCurrentPosition();
   else {
      let i = activeCell.position.x;
      let j = activeCell.position.y;
      if (canPlaceBuilding(activeBuilding, { x: i, y: j })) {
         placeBuilding(activeBuilding, { x: i, y: j });
         GridSaveManager.moveGridItem(activeBuilding.id, { x: i - cellOffsetX, y: j - cellOffsetY });
         updateArea(activeCell.position.x, activeCell.position.y, activeBuilding.height, activeBuilding.width);
      } else returnToCurrentPosition();
   }

   postMoveCleanup();

   function returnToCurrentPosition() {
      placeBuilding(activeBuilding, { x: lastPos[0], y: lastPos[1] });
      updateArea(lastPos[0] + cellOffsetX, lastPos[1] + cellOffsetY, activeBuilding.height, activeBuilding.width);
   }
}

function postMoveCleanup() {
   cellOffsetX = 0;
   cellOffsetY = 0;
   moving = false;
   document.querySelector(":root").style.setProperty("--moving-full-color", "#eeeeee40");
   clearPreview();
   imagePreviewElement.remove();
}

function getBuildingTopLeftPosition() {
   if (activeBuilding && activeBuilding.id) {
      const buildingData = gridBuildings.find(b => b.id === activeBuilding.id);
      if (buildingData) return buildingData.position;
   }
   return { x: -1, y: -1 };
}

function removeBuilding(buildingId) {
   grid.forEach((row) => {
      row.forEach((cell) => {
         if (cell["building"] === buildingId) {
            cell["filled"] = false;
            cell["building"] = undefined;
            cell["element"].classList.remove("full");
         }
      });
   });
}


function updateArea(activeX, activeY, height, width) {
   clearPreview();

   let buildingPosX = activeX - cellOffsetX;
   let buildingPosY = activeY - cellOffsetY;

   let lastItem;
   for (let i = buildingPosX; i < buildingPosX + height; i++) {
      for (let j = buildingPosY; j < buildingPosY + width; j++) {
         if (!grid[i] || !grid[i][j]) continue;
         const cell = grid[i][j]["element"];
         cell.classList.remove("full", "preview-full", "preview-empty");

         if (grid[i][j]["filled"]) {
            cell.classList.add("full");
            if (moving) cell.classList.add("preview-full");
         } else {
            if (moving) cell.classList.add("preview-empty");
         }
         lastItem = grid[i][j];
      }
   }
   if (lastItem && activeBuilding) {
      imagePreviewElement.innerHTML = "";

      let img = document.createElement("img");
      img.src = activeBuilding.image;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";
      imagePreviewElement.appendChild(img);

      if (activeBuilding.html) {
         let tempDiv = document.createElement("div");
         tempDiv.innerHTML = activeBuilding.html;
         while (tempDiv.firstChild) {
            imagePreviewElement.appendChild(tempDiv.firstChild);
         }
      }

      imagePreviewElement.style.zIndex = "100000";
      let cellSideLength = document.querySelector(".grid").firstElementChild.offsetWidth;
      if (cellSideLength > 0) imagePreviewElement.style.width = cellSideLength * activeBuilding.width + "px";
      lastItem.element.appendChild(imagePreviewElement);
   }
}

function clearPreview() {
   imagePreviewElement.remove();
   document.querySelectorAll(".preview-full").forEach((element) => {
      element.classList.remove("preview-full");
   });
   document.querySelectorAll(".preview-empty").forEach((element) => {
      element.classList.remove("preview-empty");
   });
}

function canPlaceBuilding(building, position) {
   let buildingPosX = position.x - cellOffsetX;
   let buildingPosY = position.y - cellOffsetY;

   if (buildingPosX < 0 || buildingPosY < 0 ||
      buildingPosX + building.height > gameData.grid.rows ||
      buildingPosY + building.width > gameData.grid.cols) {
      return false;
   }

   for (let i = buildingPosX; i < buildingPosX + building.height; i++) {
      for (let j = buildingPosY; j < buildingPosY + building.width; j++) {
         if (grid[i][j]["filled"]) return false;
      }
   }
   return true;
}

function placeBuilding(building, position) {
   let buildingPosX = position.x - cellOffsetX;
   let buildingPosY = position.y - cellOffsetY;

   let lastItem;
   for (let i = buildingPosX; i < buildingPosX + building.height; i++) {
      for (let j = buildingPosY; j < buildingPosY + building.width; j++) {
         grid[i][j]["filled"] = true;
         grid[i][j]["element"].classList.add("full");
         grid[i][j]["building"] = building;
         lastItem = grid[i][j];
      }
   }

   let shouldCreatePlotHandler = false;
   if (!building.domElement) {
      building.domElement = document.createElement("div");
      building.domElement.style.position = "absolute";
      building.domElement.style.right = "0";
      building.domElement.style.bottom = "0";
      building.domElement.classList.add("grid-dom-element");

      if (building.handle != "plot" && building.domElement.innerHTML == "") {
         let img = document.createElement('img');
         img.src = building.image;
         img.style.width = "100%";
         img.style.height = "100%";
         img.style.objectFit = "contain";
         img.style.display = "block";
         building.domElement.appendChild(img);
      }
      else {
         shouldCreatePlotHandler = true;
      }

      if (building.html) {
         let tempDiv = document.createElement("div");
         tempDiv.innerHTML = building.html;

         if (building.handle === "plot") {
            let overlayElement = tempDiv.querySelector(".plot-interaction-overlay");
            overlayElement.id = "i" + building.id;
         }
         building.domElement.appendChild(tempDiv.firstChild);
      }
   }
   building.domElement.style.opacity = "var(--building-opacity)";
   building.domElement.style.pointerEvents = "none";

   // set element width
   const gridTestEl = document.querySelector(".grid");
   if (gridTestEl && gridTestEl.firstElementChild) {
      let cellSideLength = gridTestEl.firstElementChild.offsetWidth;
      if (cellSideLength > 0 && building.domElement) {
         building.domElement.style.width = cellSideLength * building.width + "px";
      }
   }

   lastItem.element.style.position = "relative";
   lastItem.element.appendChild(building.domElement);

   if (building.handle == "plot" && shouldCreatePlotHandler) {
      createPlotHandler(building.id);
   }
}

function loadGrid() {
   initGrid();
   GridSaveManager.loadInventory();
   GridSaveManager.loadGrid();
   populateInventoryElements();
   populateGridBuildings();
}

function initGrid() {
   generateGrid();
   createImagePreviewElement();
}

function setPointerEventsRecursive(element, value) {
   element.style.pointerEvents = value;
   for (let i = 0; i < element.children.length; i++) {
      setPointerEventsRecursive(element.children[i], value);
   }
}

function makeGridItemsInteractive(yes) {
   if (!yes) {
      document.querySelector(":root").style.setProperty("--building-opacity", "1");
      document.querySelectorAll(".grid-dom-element").forEach((element) => {
         setPointerEventsRecursive(element, "auto");
      });
   }
   else {
      document.querySelector(":root").style.setProperty("--building-opacity", ".6");
      document.querySelectorAll(".grid-dom-element").forEach((element) => {
         setPointerEventsRecursive(element, "none");
      });
   }
}