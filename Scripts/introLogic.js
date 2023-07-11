//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function runIntro() {
   showObj(".welcome");
   chooseWeather();
   blackMarketValues();
   newBlackOffer();
   save();
}
function goIntro() {
   introData = { hello: false, meetGramps: false, planting: false, gameDataBar: false, meetGran: false, market: false, tasks: false, weather: false, help: false, }
   hideObj(".welcome");
   showObj(".introDarkShadow");
   intro();
}
function intro() {
   let introText = document.querySelector(".intro-text");
   if (introData.hello === false) { introData.hello = true; }
   else {
      if (introData.meetGramps === false) {
         document.querySelector(".intro-img").src = "Images/Tasks/jenkins.svg";
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. My son, Farmer Jebidiah, wants me to teach you how to run a farm. Let's begin!";
         introData.meetGramps = true;
      } else {
         if (introData.planting === false) {
            introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press that little almanac button, choose your seed, and when it's done, press Harvest!";
            document.getElementById("plot0").style.zIndex = "100000";
            introData.planting = true;
         } else {
            if (introData.gameDataBar === false) {
               document.querySelector(".intro-img").src = "Images/Tasks/farmer.svg";
               introText.textContent = "This toolbar shows the amount of produce you have.";
               document.getElementById("plot0").style.zIndex = "0";
               document.querySelector(".toolbar").style.zIndex = "100000";
               introData.gameDataBar = true;
            } else {
               if (introData.weather === false) {
                  document.querySelector(".intro-img").src = "Images/Tasks/jenkins.svg";
                  introText.textContent = "Keep an eye on the weather, because it will affect you plants! Sometimes it will help, while other times it could ruin your crop!";
                  document.querySelector(".toolbar").style.zIndex = "0";
                  document.querySelector(".weather-short").style.zIndex = "100000";
                  introData.weather = true;
               } else {
                  if (introData.meetGran === false) {
                     document.querySelector(".intro-img").src = "Images/Tasks/granny.png";
                     introText.textContent = "Nice to meet you! I'm Grandma Josephine, and I'll teach you the economics of running a farm.";
                     document.querySelector(".weather-short").style.zIndex = "0";
                     introData.meetGran = true;
                  } else {
                     if (introData.market === false) {
                        introText.textContent = "This is the market, were you can gain coins by selling produce, which are useful for many things, like opening more plots.";
                        showObj(".marketShadow"); gameData.marketOpen = true;
                        introData.market = true;
                     }
                     else {
                        if (introData.tasks === false) {
                           document.querySelector(".intro-img").src = "Images/Tasks/farmer.svg";
                           introText.textContent = "This is your tasklist, where you can get rewards for doing chores around the farm.";
                           hideObj(".marketShadow"); gameData.marketOpen = false;
                           taskBar("close");
                           introData.tasks = true;
                        }
                        else {
                           if (introData.help === false) {
                              document.querySelector(".intro-img").src = "Images/Tasks/farmer.svg";
                              introText.textContent = "That's it! If you need more help, just check out the small help icon in the top left corner. Be sure to check out the shortcuts section for helpful tips!";
                              document.querySelector(".tasks").style.zIndex = "0";
                              taskBar("open");
                              introData.help = true;
                           }
                           else { location.reload(); }
                        }
                     }
                  }
               }
            }
         }
      }
   }
}