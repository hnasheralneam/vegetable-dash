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
      code: "if (gameData.peas >= 25) { gameData.peas -= 25; checkTasks('jebsPeaSalad'); } else { fadeTextAppear(event, `Not enough produce - you need ${25 - gameData.peas} more`, false, '#de0000'); }"
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
      image: "Tasks/jenkins.svg",
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
   taskGiver: {
      name: "Farmer Jebediah",
      image: "Tasks/farmer.svg",
   },
   demand: {
      text: "Submit 45 Corn",
      code: "if (produce.corn >= 45) { produce.corn -= 45; checkTasks('jebsGrilledCorn'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "I'm inviting some family over, and I want to serve corn on the cob. I'm going to need to get come corn. Could you get them for me?",
      ready: "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!"
   },
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
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Submit 6 Dandelions",
      code: "if (produce.dandelion >= 6) { produce.dandelion -= 6; checkTasks('josephinesDandelionSalad'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Introducing; dandelion salad!",
      ready: "Take that, Happy Place Farm! Our profits have increased by 20%, and their quarterly earnings fell by 35%! Hurrah for dandelion salad!"
   },
   reward: {
      item: "seeds",
      amount: 15000,
      text: "Collect 15,000 Seeds",
      code: "collectTaskReward('josephinesDandelionSalad')"
   },
   conditions: {
      c1: [false],
      c2: [false],
      c3: ["dandelionStatus"]
   }
},
// unlockThe_cornPlot
t6: {
   name: "unlockThe_cornPlot",
   taskGiver: {
      name: "Grandpa Jenkins",
      image: "Tasks/jenkins.svg",
   },
   demand: {
      text: "Unlock the second plot",
      code: "return;"
   },
   text: {
      notReady: "You need to diversify your farm. Unlock the second plot for a new plant!",
      ready: "Ooooh, look! It's corn! Whoopie!"
   },
   reward: {
      item: "fertilizers",
      amount: 1,
      text: "Collect 1 Fertilizer",
      code: "collectTaskReward('unlockThe_cornPlot')"
   },
   conditions: {
      c1: [false],
      c2: [false],
      c3: [false]
   }
},
// seeBlackMarket
t7: {
   name: "seeBlackMarket",
   taskGiver: {
      name: "Shade E. Charekter",
      image: "Tasks/shade-e.svg",
   },
   demand: {
      text: "Accept a Black Market offer",
      code: "return;"
   },
   text: {
      notReady: "My friend has an offer to make you, meet him in the dark alleyway behind the marketplace.",
      ready: "Well done. Keep up the bad work."
   },
   reward: {
      item: "doughnuts",
      amount: 5,
      text: "Collect 5 Doughnuts",
      code: "collectTaskReward('seeBlackMarket')"
   },
   conditions: {
      c1: ["t2"],
      c2: [false],
      c3: ["strawberriesStatus"]
   }
},
// tryPoliceDoughnuts
t8: {
   name: "tryPoliceDoughnuts",
   taskGiver: {
      name: "Shade E. Charekter",
      image: "Tasks/shade-e.svg",
   },
   demand: {
      text: "Use 1 Doughnut",
      code: "return;"
   },
   text: {
      notReady: "After accepting or declining a few offers, the police will get suspicious. Feed them doughnuts to satiate their wrath.",
      ready: "Very good. Here, take some cash."
   },
   reward: {
      item: "seeds",
      amount: 7500,
      text: "Collect 7,500 Seeds",
      code: "collectTaskReward('tryPoliceDoughnuts')"
   },
   conditions: {
      c1: ["t7"],
      c2: [false],
      c3: [false]
   }
},
// bakeSale_cornBread
t9: {
   name: "bakeSale_cornBread",
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Submit 20 Corn",
      code: "if (produce.corn >= 20) { produce.corn -= 20; checkTasks('bakeSale_cornBread'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "I have a wonderful lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal faviorite!",
      ready: "Just you wait! This bake sale is just beginning!"
   },
   reward: {
      item: "seeds",
      amount: 5,
      text: "Collect 5 Seeds",
      code: "collectTaskReward('bakeSale_cornBread')"
   },
   conditions: {
      c1: [false],
      c2: ["bakeSale", "progressing"],
      c3: [false]
   }
},
// bakeSale_peaSnacks
t10: {
   name: "bakeSale_peaSnacks",
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Submit 60 Peas",
      code: "if (produce.peas >= 60) { produce.peas -= 60; checkTasks('bakeSale_peaSnacks'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "Next, let's make some crunchy pea snacks!",
      ready: "We may not have sold much yet, but we've barely started!"
   },
   reward: {
      item: "seeds",
      amount: 10,
      text: "Collect 10 Seeds",
      code: "collectTaskReward('bakeSale_peaSnacks')"
   },
   conditions: {
      c1: ["t9"],
      c2: [false],
      c3: [false]
   }
},
// bakeSale_strawberryJam
t11: {
   name: "bakeSale_strawberryJam",
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Submit 15 Strawberries",
      code: "if (produce.strawberries >= 15) { produce.strawberries -= 15; checkTasks('bakeSale_strawberryJam'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!",
      ready: "Be patient, for great rewards come to those who wait!"
   },
   reward: {
      item: "seeds",
      amount: 15,
      text: "Collect 15 Seeds",
      code: "collectTaskReward('bakeSale_strawberryJam')"
   },
   conditions: {
      c1: ["t10"],
      c2: [false],
      c3: [false]
   }
},
//bakeSale_pumpkinPie
t12: {
   name: "bakeSale_pumpkinPie",
   taskGiver: {
      name: "Grandma Josephine",
      image: "Tasks/granny.png",
   },
   demand: {
      text: "Submit 10 Pimpkins",
      code: "if (produce.pumpkins >= 10) { produce.pumpkins -= 10; checkTasks('bakeSale_pumpkinPie'); } else { fadeTextAppear(event, 'Not enough produce', false, '#de0000'); }"
   },
   text: {
      notReady: "Not all pumpkin pies are great, but my recipe is! Let's make a few!",
      ready: "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!"
   },
   reward: {
      item: "seeds",
      amount: 75000,
      text: "Collect 75,000 Seeds",
      code: "collectTaskReward('bakeSale_pumpkinPie')"
   },
   conditions: {
      c1: ["t11"],
      c2: [false],
      c3: [false]
   }
}
}
