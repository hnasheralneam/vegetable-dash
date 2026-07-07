let gameInfo = {
   // Growing times
   peasTime: [3500, 7000, 10000],
   cornTime: [10000, 20000, 30000],
   strawberriesTime: [30000, 60000, 90000],
   eggplantsTime: [100000, 200000, 300000],
   pumpkinsTime: [300000, 600000, 900000],
   cabbageTime: [900000, 1800000, 2700000],
   dandelionTime: [2400000, 4800000, 7200000],
   rhubarbTime: [4800000, 9600000, 14400000],
   // Seed prices
   cornSeeds: 150,
   strawberriesSeeds: 500,
   eggplantsSeeds: 2000,
   pumpkinsSeeds: 7500,
   cabbageSeeds: 20000,
   dandelionSeeds: 75000,
   rhubarbSeeds: 125000,
   // URLs
   peasURLs: ["Peas/growing.png", "Peas/flowering.png", "Peas/fruiting.png"],
   cornURLs: ["growing.png", "Corn/growing.png", "Corn/fruiting.png"],
   strawberriesURLs: ["Strawberry/growing.png", "Strawberry/flowering.png", "Strawberry/fruiting.png"],
   eggplantsURLs: ["Eggplant/growing.png", "Eggplant/flowering.png", "Eggplant/fruiting.png"],
   pumpkinsURLs: ["growing.png", "Pumpkin/growing.png", "Pumpkin/fruiting.png"],
   cabbageURLs: ["growing.png", "Cabbage/growing.png", "Cabbage/fruiting.png"],
   dandelionURLs: ["Dandelion/flowering.png", "Dandelion/flowering.png", "Dandelion/fruiting.png"],
   rhubarbURLs: ["growing.png", "Rhubarb/growing.png", "Rhubarb/fruiting.png"]
};

let buildings = {
   fountain: {
      handle: "fountain",
      name: "Fountain",
      image: "images/Grid/fountain.png",
      height: 2,
      width: 3
   },
   fertilizer: {
      handle: "fertilizer",
      name: "Fertilizer Bag",
      image: "images/Grid/fertilizer.png",
      html: `<div class="fertilizer-interaction-overlay"
               id="fertilizer"
               onclick="fertilizeHover()" 
               onmouseover="info(this)" 
               data-info="Activate Fertilizer Cursor" 
               style="position: absolute; top: 0; left: 0; width: 100%; height: 100%">
            </div>`,
      height: 2,
      width: 2
   },
   plot: {
      handle: "plot",
      name: "Plot",
      image: "images/Grid/plot.png",
      html: `<div class='plot-interaction-overlay'></div>`,
      data: {
         status: "Empty",
         plant: "peas",
         bushels: 1
      },
      height: 6,
      width: 6
   },
   bush: {
      handle: "bush",
      name: "Shrubbery",
      image: "images/Grid/bush.png",
      height: 1,
      width: 3
   },
   tree: {
      handle: "tree",
      name: "Decorative Tree",
      image: "images/Grid/tree.png",
      height: 2,
      width: 4
   },
   pumpkinplant: {
      handle: "pumpkinplant",
      name: "Decorative Pumpkin Plant",
      image: "images/Grid/pumpkin-plant.png",
      height: 4,
      width: 6
   }
};

let shopDecorations = [
   {
      // fetch name from building
      handle: "fountain",
      // fetch image from building
      // fetch size from building
      description: "A beautiful fountain to make your farm more delightful.",
      cost: 800
   },
   {
      handle: "bush",
      description: "A simple bush, perfect for use in the construction of a shrubbery.",
      cost: 150
   },
   {
      handle: "tree",
      description: "A tree I found, it has leaves and wood and roots and everything.",
      cost: 650
   },
   {
      handle: "pumpkinplant",
      description: "A pleasant pumpkin plant, ripe with orange pumpkins, perfect for adding a dot of color to your farm.",
      cost: 1200
   }
];