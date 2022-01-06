let tD;

var rawTaskData = {
numOTasks: 7, // Real number: 12
listOfTasks: ["jebsPeaSalad", "useMarketResets", "tryFertilizer", "jebsGrilledCorn", "josephinesDandelionSalad", "unlockThe_cornPlot", "seeBlackMarket", "tryPoliceDoughnuts", "bakeSale_cornBread", "bakeSale_peaSnacks", "bakeSale_strawberryJam", "bakeSale_pumpkinPie"],
// jebsPeaSalad
t1: {
   name: "jebsPeaSalad",
   taskGiver: {
      name: "Farmer Jebediah",
      image: "Tasks/farmer.svg",
   },
   demand: {
      text: "Submit 25 Peas",
      code: "if (gameData.peas >= 25) { gameData.peas -= 25; checkTasks('jebsPeaSalad'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?",
      ready: "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!"
   },
   reward: {
      item: "fertilizers",
      amount: 2,
      text: "Collect 2 Fertilizer",
      code: "collectTaskReward('jebsPeaSalad')"
   },
   conditions: {
      c1: [false], // Condition 1 - check if another task is finished
      c2: [false], // Condition 2 - check if a variable is larger than a number OR if a tasklist is started
      c3: [false]  // Condtion 3 - check if a plot is unlocked
   }
},
// useMarketResets
t2: {
   name: "useMarketResets",
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Use 1 Market Reset",
      code: "return;"
   },
   text: {
      notReady: "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?",
      ready: "Thank you for completing that small task for me! Here, take some seeds!"
   },
   reward: {
      item: "seeds",
      amount: 250,
      text: "Collect 250 Seeds",
      code: "collectTaskReward('useMarketResets')"
   },
   conditions: {
      c1: ["t1"],
      c2: ["marketResets", 1],
      c3: [false]
   }
},
// tryFertilizer
t3: {
   name: "tryFertilizer",
   taskGiver: {
      name: "Grandpa Jenkins",
      image: "Tasks/jenkins.png",
   },
   demand: {
      text: "Use 1 Fertilizer",
      code: "return;"
   },
   text: {
      notReady: "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!",
      ready: "Wow, just look at those plants grow! Here, take these, I've had them lying about for years!"
   },
   reward: {
      item: "marketResets",
      amount: 2,
      text: "Collect 2 Market Resets",
      code: "collectTaskReward('tryFertilizer')"
   },
   conditions: {
      c1: ["t1"],
      c2: ["fertilizers", 1],
      c3: [false]
   }
},
// jebsGrilledCorn
t4: {
   name: "jebsGrilledCorn",
   tG: "Farmer Jebediah",
   tGI: "Tasks/farmer.svg",
   tD: "Submit 45 Corn",
   tDC: "if (produce.corn >= 45) { produce.corn -= 45; checkTasks('jebsGrilledCorn'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "I'm inviting some family over, and I want to serve corn on the cob. I'm going to need to get come corn. Could you get them for me?",
   rT: "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!",
   reward: {
      item: "marketResets",
      amount: 8,
      text: "Collect 8 Market Resets",
      code: "collectTaskReward('jebsGrilledCorn')"
   },
   conditions: {
      c1: [false],
      c2: [false],
      c3: ["cornStatus"]
   }
},
// josephinesDandelionSalad
t5: {
   name: "josephinesDandelionSalad",
   tG: "Grandma Josephine",
   tGI: "Tasks/granny.png",
   tD: "Submit 6 Dandelions",
   tDC: "if (produce.dandelion >= 6) { produce.dandelion -= 6; checkTasks('josephinesDandelionSalad'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Introducing dandelion salad!",
   rT: "Take that, Happy Place Farm! Our profits have increased by 20%, and their quarterly earnings fell by 35%! Hurrah for dandelion salad!",
   cRT: "Collect 15,000 Seeds",
   cRC: "collectTaskReward('josephinesDandelionSalad')",
   rIT: "seeds",
   rA: 15000,
   conditions: {
      c1: [false],
      c2: [false],
      c3: ["dandelionStatus"]
   }
},
// unlockThe_cornPlot
t6: {
   name: "unlockThe_cornPlot",
   tG: "Grandpa Jenkins",
   tGI: "Tasks/jenkins.png",
   tD: "Unlock the second plot",
   tDC: "",
   nRT: "You need to diversify your farm. Unlock the second plot for a new plant!",
   rT: "Ooooh, look! It's corn! Whoopie!",
   cRT: "Collect 1 Fertilizer",
   cRC: "collectTaskReward('unlockThe_cornPlot')",
   rIT: "fertilizers",
   rA: 1,
   conditions: {
      c1: [false],
      c2: [false],
      c3: [false]
   }
   // [[are there additon conditons, [gameData, [tasknumber], [taskname]]],
   // [are there more conditions, [gamedata, [tasknumber], [taskname]]]]
},
// seeBlackMarket
t7: {
   name: "seeBlackMarket",
   tG: "Shade E. Charekter",
   tGI: "Tasks/shade-e.svg",
   tD: "Accept a Black Market offer",
   tDC: "",
   nRT: "My friend has an offer to make you, meet him in the dark alleyway behind the marketplace.",
   rT: "Well done. Keep up the bad work.",
   cRT: "Collect 5 Doughnuts",
   cRC: "collectTaskReward('seeBlackMarket')",
   rIT: "doughnuts",
   rA: 5,
   conditions: {
      c1: ["t2"],
      c2: [false],
      c3: ["strawberriesStatus"]
   }
},
// tryPoliceDoughnuts
t8: {
   name: "tryPoliceDoughnuts",
   tG: "Shade E. Charekter",
   tGI: "Tasks/shade-e.svg",
   tD: "Use 1 Doughnut",
   tDC: "",
   nRT: "After accepting or declining a few offers, the police will get suspicious. Feed them doughnuts to satiate their wrath.",
   rT: "Very good. Here, take some cash.",
   cRT: "Collect 7,500 Seeds",
   cRC: "collectTaskReward('tryPoliceDoughnuts')",
   rIT: "seeds",
   rA: 7500,
   conditions: {
      c1: ["t7"],
      c2: [false],
      c3: [false]
   }
},
/*
// bakeSale_cornBread
t9: {
   n: "bakeSale_cornBread",
   tG: "Grandma Josephine",
   tGI: "Tasks/granny.png",
   tD: "Submit 20 Corn",
   tDC: "if (produce.corn >= 20) { produce.corn -= 20; checkTasks('bakeSale_cornBread'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "I have a wonderful lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal faviorite!",
   rT: "Just you wait! This bake sale is just beginning!",
   cRT: "Collect 5 Seeds",
   cRC: "collectTaskReward('bakeSale_cornBread')",
   rIT: "seeds",
   rA: 5,
   conditions: [[false], [true, ["bakeSale"], "progressing"]]
},
// bakeSale_peaSnacks
t10: {
   n: "bakeSale_peaSnacks",
   tG: "Grandma Josephine",
   tGI: "Tasks/granny.png",
   tD: "Submit 60 Peas",
   tDC: "if (produce.peas >= 60) { produce.peas -= 60; checkTasks('bakeSale_peaSnacks'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Next, let's make some crunchy pea snacks!",
   rT: "We may not have sold much yet, but we've barely started!",
   cRT: "Collect 10 Seeds",
   cRC: "collectTaskReward('bakeSale_peaSnacks')",
   rIT: "seeds",
   rA: 10,
   conditions: {
      c1: [true, "t9"],
      c2: [false]
   }
},
// bakeSale_strawberryJam
t11: {
   n: "bakeSale_strawberryJam",
   tG: "Grandma Josephine",
   tGI: "Tasks/granny.png",
   tD: "Submit 15 Strawberries",
   tDC: "if (produce.strawberries >= 15) { produce.strawberries -= 15; checkTasks('bakeSale_strawberryJam'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!",
   rT: "Be patient, for great rewards come to those who wait!",
   cRT: "Collect 15 Seeds",
   cRC: "collectTaskReward('bakeSale_strawberryJam')",
   rIT: "seeds",
   rA: 15,
   conditions: [[true, [["t10"]], [false]]
},
//bakeSale_pumpkinPie
t12: {
   n: "bakeSale_pumpkinPie",
   tG: "Grandma Josephine",
   tGI: "Tasks/granny.png",
   tD: "Submit 10 Pumpkins",
   tDC: "if (produce.pumpkins >= 10) { produce.pumpkins -= 10; checkTasks('bakeSale_pumpkinPie'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }",
   nRT: "Not all pumpkin pies are great, but my recipe is! Let's make a few!",
   rT: "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!",
   cRT: "Collect 75,000 Seeds",
   cRC: "collectTaskReward('bakeSale_pumpkinPie')",
   rIT: "seeds",
   rA: 75000,
   conditions: [[true, [["t11"]], [false]]
}
*/
}
