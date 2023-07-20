const taskInfo = {
   jeb1: {
      title: "Jebediah's Pea Salad",
      giver: "Farmer Jebediah",
      giverImage: "Tasks/farmer.svg",
      demand: {
         text: "Submit 6 Peas",
         code: () => {
            if (gameData.peas >= 6) {
               gameData.peas -= 6;
               updateVeg('peas');
               checkTasks('jeb1');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${6 - gameData.peas} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?",
         ready: "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!"
      },
      reward: {
         item: "fertilizers",
         amount: 2,
         text: "Collect 2 Fertilizer",
         code: () => {
            collectTaskReward('jeb1');
         }
      },
      conditions: {
         type: []
      }
   },
   gram1: {
      title: "Reseting the Market",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Use 1 Market Reset",
         code: () => {
            return;
         }
      },
      text: {
         notReady: "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?",
         ready: "Ahh! That's much better. Here, take some coins!"
      },
      reward: {
         item: "coins",
         amount: 250,
         text: "Collect 250 Coins",
         code: () => {
            collectTaskReward('gram1');
         }
      },
      conditions: {
         type: ["complete", "have"],
         completeRequirement: ["jeb1", ["marketResets", 1]]
      }
   },
   gramp1: {
      title: "Trying Fertilizer",
      giver: "Grandpa Jenkins",
      giverImage: "Tasks/jenkins.svg",
      demand: {
         text: "Use 1 Fertilizer",
         code: () => {
            return;
         }
      },
      text: {
         notReady: "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yield and take 30 minutes off the growing time!",
         ready: "Wow, just look at those plants grow! Thanks for that. Here, take these, I've had them lying about for years!"
      },
      reward: {
         item: "marketResets",
         amount: 2,
         text: "Collect 2 Market Resets",
         code: () => {
            collectTaskReward('gramp1');
         }
      },
      conditions: {
         type: ["have"],
         completeRequirement: [["fertilizers", 1]]
      }
   },
   jeb2: {
      title: "Jebediah's Grilled Corn",
      giver: "Farmer Jebediah",
      giverImage: "Tasks/farmer.svg",
      demand: {
         text: "Submit 25 Corn",
         code: () => {
            if (gameData.corn >= 25) {
               gameData.corn -= 25;
               updateVeg('corn');
               checkTasks('jeb2');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${25 - gameData.corn} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "I'm inviting some family over, and I want to serve corn on the cob. ...It seems I got everything excepet the corn. Could you get some for me?",
         ready: "What a wonderful time we all had! Did you like the food? My family did, and they sent you some gifts!"
      },
      reward: {
         item: "marketResets",
         amount: 8,
         text: "Collect 8 Market Resets",
         code: () => {
            collectTaskReward('jeb2');
         }
      },
      conditions: {
         type: ["unlockedSeed"],
         completeRequirement: ["corn"]
      }
   },
   gram2: {
      title: "Josephine's Dandelion Salad",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Submit 6 Dandelions",
         code: () => {
            if (gameData.dandelion >= 6) {
               gameData.dandelion -= 6;
               updateVeg('dandelion');
               checkTasks('gram2');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${6 - gameData.dandelion} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "What an outrage! I have found that we have been losing profit to a competing company, Happy Place Farms! Their top product is lettuce salad, but I think we can do better! Introducing: dandelion salad!",
         ready: "Take that, Happy Place Farm! Our profits have increased by 12.4%, and their quarterly earnings fell by 17.9%! Hurrah for dandelion salad!"
      },
      reward: {
         item: "coins",
         amount: 35000,
         text: "Collect 35,000 Coins",
         code: () => {
            collectTaskReward('gram2');
         }
      },
      conditions: {
         type: ["unlockedSeed"],
         completeRequirement: ["dandelion"]
      }
   },
   gramp2: {
      title: "Unlocking Corn seeds",
      giver: "Grandpa Jenkins",
      giverImage: "Tasks/jenkins.svg",
      demand: {
         text: "Unlock the next seed",
         code: () => {
            return;
         }
      },
      text: {
         notReady: "You need to diversify your farm. Buy a second seed for a new plant to grow!",
         ready: "Ooooh, look! It's corn! Whoopie!"
      },
      reward: {
         item: "fertilizers",
         amount: 1,
         text: "Collect 1 Fertilizer",
         code: () => {
            collectTaskReward('gramp2');
         }
      },
      conditions: {
         type: [],
      }
   },
   shade1: {
      title: "Seeing the Black Market",
      giver: "Shade E. Charekter",
      giverImage: "Tasks/shade-e.svg",
      demand: {
         text: "Accept a Black Market offer",
         code: () => {
            return;
         }
      },
      text: {
         notReady: "My friend has an offer to make you, meet him in the dark alleyway behind the marketplace.",
         ready: "Well done. Keep up the bad work."
      },
      reward: {
         item: "doughnuts",
         amount: 5,
         text: "Collect 5 Doughnuts",
         code: () => {
            collectTaskReward('shade1');
         }
      },
      conditions: {
         type: ["complete", "unlockedSeed"],
         completeRequirement: ["gram1", "strawberries"]
      }
   },
   shade2: {
      title: "Feeding the Police",
      giver: "Shade E. Charekter",
      giverImage: "Tasks/shade-e.svg",
      demand: {
         text: "Use 1 Doughnut",
         code: () => {
            return;
         }
      },
      text: {
         notReady: "After accepting or declining a few offers, the police will get suspicious. Feed them doughnuts to satiate their wrath.",
         ready: "Very good. Here, take some cash."
      },
      reward: {
         item: "coins",
         amount: 10000,
         text: "Collect 10,000 Coins",
         code: () => {
            collectTaskReward('shade2');
         }
      },
      conditions: {
         type: ["complete"],
         completeRequirement: ["shade1"]
      }
   },
   gram3: {
      title: "Bake Sale: Cornbread",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Submit 20 Corn",
         code: () => {
            if (gameData.corn >= 20) {
               gameData.corn -= 20;
               updateVeg('corn');
               checkTasks('gram3');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${20 - gameData.corn} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "I have a wonderfully lucrative idea! We can hold a bake sale with plenty of delicious foods! Let's start with cornbread, my personal favorite!",
         ready: "Just you wait! This bake sale is just beginning!"
      },
      reward: {
         item: "coins",
         amount: 5,
         text: "Collect 5 Coins",
         code: () => {
            collectTaskReward('gram3');
         }
      },
      conditions: {
         type: ["complete", "unlockedSeed"],
         completeRequirement: ["gram1", "pumpkins"]
      }
   },
   gram4: {
      title: "Bake Sale: Pea Snacks",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Submit 35 Peas",
         code: () => {
            if (gameData.peas >= 35) {
               gameData.peas -= 35;
               updateVeg('peas');
               checkTasks('gram4');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${35 - gameData.peas} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "Next, let's make some crunchy pea snacks!",
         ready: "We may not have sold much yet, but we've barely started!"
      },
      reward: {
         item: "coins",
         amount: 10,
         text: "Collect 10 Coins",
         code: () => {
            collectTaskReward('gram4');
         }
      },
      conditions: {
         type: ["complete"],
         completeRequirement: ["gram3"]
      }
   },
   gram5: {
      title: "Bake Sale: Strawberry Jam",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Submit 15 Strawberries",
         code: () => {
            if (gameData.strawberries >= 15) {
               gameData.strawberries -= 15;
               updateVeg('strawberries');
               checkTasks('gram5');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${15 - gameData.strawberries} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "Do you like spreading nice, sweet, jam on toast? I sure do, and so will our customers!",
         ready: "I can feel it! Just wait a little bit more!"
      },
      reward: {
         item: "coins",
         amount: 15,
         text: "Collect 15 Coins",
         code: () => {
            collectTaskReward('gram5');
         }
      },
      conditions: {
         type: ["complete"],
         completeRequirement: ["gram4"]
      }
   },
   gram6: {
      title: "Bake Sale: Pumpkin Pie",
      giver: "Grandma Josephine",
      giverImage: "Tasks/granny.png",
      demand: {
         text: "Submit 12 Pumpkins",
         code: () => {
            if (gameData.pumpkins >= 12) {
               gameData.pumpkins -= 12;
               updateVeg('pumpkins');
               checkTasks('gram6');
            }
            else {
               fadeTextAppear(`Not enough produce - you need ${12 - gameData.pumpkins} more`, '#de0000');
            }
         }
      },
      text: {
         notReady: "Not all pumpkin pies are great, but my recipe is! Let's make a few!",
         ready: "Ha ha! Look at that, this bake sale sure was a success! Look at these profit margins!"
      },
      reward: {
         item: "coins",
         amount: 75000,
         text: "Collect 75,000 Coins",
         code: () => {
            collectTaskReward('gram6');
         }
      },
      conditions: {
         type: ["complete"],
         completeRequirement: ["gram5"]
      }
   }
}