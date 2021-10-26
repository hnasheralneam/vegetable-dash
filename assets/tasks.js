let tD;

var rawTaskData = {
numOTasks: 12,
listOfTasks: ["jebsPeaSalad", "useMarketResets", "tryFertilizer", "jebsGrilledCorn", "josephinesDandelionSalad", "unlockThe_cornPlot", "seeBlackMarket", "tryPoliceDoughnuts", "bakeSale_cornBread", "bakeSale_peaSnacks", "bakeSale_strawberryJam", "bakeSale_pumpkinPie"],
// jebsPeaSalad
t1: {
   n: "jebsPeaSalad", // Task name
   tG: "Farmer Jebediah", // Task giver
   tGI: "Images/Tasks/farmer.svg", // Task giver imate
   tD: "Submit 25 Peas", // Task demand
   tDC: "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('jebsPeaSalad'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }", // Task demand code
   nRT: "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", // Not ready text
   rT: "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!", // Ready text
   cRT: "Collect 2 Fertilizer", // Collect reward text
   cRC: "collectTaskReward('jebsPeaSalad')", // Collect reward code
   rIT: "fertilizers", // Reward type
   rA: 2, // Reward amount
   c: [[false], [false]] // Conditions
},
// useMarketResets
t2: {
   n: "useMarketResets",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Use 1 Market Reset",
   tDC: "",
   nRT: "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?",
   rT: "Thank you for completing that small task for me! Here, take some seeds!",
   cRT: "Collect 250 Seeds",
   cRC: "collectTaskReward('useMarketResets')",
   rIT: "seeds",
   rA: 250,
   c: [[true, [tD, ["t1"], ["n"]]], [true, ["marketData", "marketResets"], 1]]
},
// tryFertilizer
t3: {
   n: "tryFertilizer",
   tG: "Grandpa Jenkins",
   tGI: "Images/Tasks/jenkins.png",
   tD: "Use 1 Fertilizer",
   tDC: "",
   nRT: "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!",
   rT: "Wow, just look at those plants grow! Here, take these, I've had them lying about for years!",
   cRT: "Collect 2 Market Resets",
   cRC: "collectTaskReward('tryFertilizer')",
   rIT: "marketResets",
   rA: 2,
   c: [[true, [tD, ["t1"], ["n"]]], [true, ["marketData", "fertilizers"], 1]]
},
// jebsGrilledCorn
t4: {
   n: "jebsGrilledCorn",
   tG: "Farmer Jebediah",
   tGI: "Images/Tasks/farmer.svg",
   tD: "Submit 45 Corn",
   tDC: "if (produce.corn >= 45) { produce.corn -= 45; checkTasks('jebsGrilledCorn'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "I'm inviting some family over, and I want to serve corn on the cob. I'm going to need to get come corn. Could you get them for me?",
   rT: "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!",
   cRT: "Collect 8 Market Resets",
   cRC: "collectTaskReward('jebsGrilledCorn')",
   rIT: "marketResets",
   rA: 8,
   c: [[false], [true, ["plots", "cornplot"], "unlocked"]]
},
// josephinesDandelionSalad
t5: {
   n: "josephinesDandelionSalad",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Submit 6 Dandelions",
   tDC: "if (produce.dandelion >= 6) { produce.dandelion -= 6; checkTasks('josephinesDandelionSalad'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Introducing dandelion salad!",
   rT: "Take that, Happy Place Farm! Our profits have increased by 20%, and their quarterly earnings fell by 35%! Hurrah for dandelion salad!",
   cRT: "Collect 15,000 Seeds",
   cRC: "collectTaskReward('josephinesDandelionSalad')",
   rIT: "seeds",
   rA: 15000,
   c: [[false], [true, ["plots", "dandelionplot"], "unlocked"]]
},
// unlockThe_cornPlot
t6: {
   n: "unlockThe_cornPlot",
   tG: "Grandpa Jenkins",
   tGI: "Images/Tasks/jenkins.png",
   tD: "Unlock the second plot",
   tDC: "",
   nRT: "You need to diversify your farm. Unlock the second plot for a new plant!",
   rT: "Ooooh, look! It's corn! Whoopie!",
   cRT: "Collect 1 Fertilizer",
   cRC: "collectTaskReward('unlockThe_cornPlot')",
   rIT: "fertilizers",
   rA: 1,
   c: [[false], [true, ["plots", "cornplot"], "locked"]]
},
// seeBlackMarket
t7: {
   n: "seeBlackMarket",
   tG: "Shade E. Charekter",
   tGI: "Images/Tasks/shade-e.svg",
   tD: "Accept a Black Market offer",
   tDC: "",
   nRT: "My friend has an offer to make you, meet him in the dark alleyway behind the marketplace.",
   rT: "Well done. Keep up the bad work.",
   cRT: "Collect 5 Doughnuts",
   cRC: "collectTaskReward('seeBlackMarket')",
   rIT: "doughnuts",
   rA: 5,
   c: [[true, [tD, ["t2"], ["n"]]], [true, ["plots", "strawberryplot"], "unlocked"]]
},
// tryPoliceDoughnuts
t8: {
   n: "tryPoliceDoughnuts",
   tG: "Shade E. Charekter",
   tGI: "Images/Tasks/shade-e.svg",
   tD: "Use 1 Doughnut",
   tDC: "",
   nRT: "After accepting or declining a few offers, the police will get suspicious. Feed them doughnuts to satiate their wrath.",
   rT: "Very good. Here, take some cash.",
   cRT: "Collect 7,500 Seeds",
   cRC: "collectTaskReward('tryPoliceDoughnuts')",
   rIT: "seeds",
   rA: 7500,
   c: [[true, [tD, ["t7"], ["n"]]], [false]]
},
// bakeSale_cornBread
t9: {
   n: "bakeSale_cornBread",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Submit 20 Corn",
   tDC: "if (produce.corn >= 20) { produce.corn -= 20; checkTasks('bakeSale_cornBread'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "I have a wonderful lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal faviorite!",
   rT: "Just you wait! This bake sale is just beginning!",
   cRT: "Collect 5 Seeds",
   cRC: "collectTaskReward('bakeSale_cornBread')",
   rIT: "seeds",
   rA: 5,
   c: [[false], [true, ["taskList", "bakeSale"], "progressing"]]
},
// bakeSale_peaSnacks
t10: {
   n: "bakeSale_peaSnacks",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Submit 60 Peas",
   tDC: "if (produce.peas >= 60) { produce.peas -= 60; checkTasks('bakeSale_peaSnacks'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Next, let's make some crunchy pea snacks!",
   rT: "We may not have sold much yet, but we've barely started!",
   cRT: "Collect 10 Seeds",
   cRC: "collectTaskReward('bakeSale_peaSnacks')",
   rIT: "seeds",
   rA: 10,
   c: [[true, [tD, ["t9"], ["n"]]], [false]]
},
// bakeSale_strawberryJam
t11: {
   n: "bakeSale_strawberryJam",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Submit 15 Strawberries",
   tDC: "if (produce.strawberries >= 15) { produce.strawberries -= 15; checkTasks('bakeSale_strawberryJam'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!",
   rT: "Be patient, for great rewards come to those who wait!",
   cRT: "Collect 15 Seeds",
   cRC: "collectTaskReward('bakeSale_strawberryJam')",
   rIT: "seeds",
   rA: 15,
   c: [[true, [tD, ["t10"], ["n"]]], [false]]
},
//bakeSale_pumpkinPie
t12: {
   n: "bakeSale_pumpkinPie",
   tG: "Grandma Josephine",
   tGI: "Images/Tasks/granny.png",
   tD: "Submit 10 Pumpkins",
   tDC: "if (produce.pumpkins >= 10) { produce.pumpkins -= 10; checkTasks('bakeSale_pumpkinPie'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Not all pumpkin pies are great, but my recipe is! Let's make a few!",
   rT: "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!",
   cRT: "Collect 75,000 Seeds",
   cRC: "collectTaskReward('bakeSale_pumpkinPie')",
   rIT: "seeds",
   rA: 75000,
   c: [[true, [tD, ["t11"], ["n"]]], [false]]
}
}
