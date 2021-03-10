<!-- Quests -->
<div class="dark-shadow" id="darkShadow" onclick="questbar()">
   <div class="quests">
      <img class="quest-ribbon" id="questRibbon" src="Images/Quests/short-ribbon.png" alt="Ribbon!" onclick="questbar()">
      <div class="dark-shadow" id="darkShadow" onclick="questbar()"></div>
      <div class="quest-content" id="questContent">
         <div class="inner-quest-content" id="innerQuestContent">
            <h1 class="quest-coming">Quests - Coming Soon!</h1>
            <div class="quest-block" id="jeb-quest">
               <img id="jeb-image" src="Images/Quests/farmer.png" alt="Farmer Jebediah">
               <img class="quest-gold-separator" src="Images/Quests/gold-separator.png" alt="Separator">
               <p class="quest-text">Greetings. I am Farmer Jebediah, and I will be showing you around the farm.</p>
            </div>
            <div class="quest-block" id="gramps-quest">
               <img id="grandpa-image" src="Images/Quests/gramps.png" alt="Grandpa Jenkins">
               <img class="quest-gold-separator" src="Images/Quests/gold-separator.png" alt="Separator">
               <p class="quest-text">Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin'!</p>
            </div>
            <div class="quest-block" id="grandma-quest">
               <img id="grandma-image" src="Images/Quests/granny.png" alt="Grandma Josephine">
               <img class="quest-gold-separator" src="Images/Quests/gold-separator.png" alt="Separator">
               <p class="quest-text">Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.</p>
            </div>
            <p style="margin-left: 35%">(Crtl + Q to toggle quest bar)</p>
            <p style="margin-left: 35%">(Shift + W to toggle settings)</p>
         </div>
      </div>
   </div>
</div>






/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Quests
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

.quest-content {
   position: fixed;
   top: 8%;
   left: 0;
   height: 80%;
   width: 0;
   background-color: #f9f9f9;
   border-top-right-radius: 2vh;
   border-bottom-right-radius: 2vh;
   transition: 0.8s;
   overflow: scroll;
}

.inner-quest-content {
   display: none;
   font-family: "Nunito";
   margin: 10vh;
}

.quest-ribbon {
   position: fixed;
   top: 12%;
   left: 0;
   display: block;
   opacity: 1;
   height: 18vh;
   z-index: 0.95;
   transition: 0.8s;
}

.dark-shadow {
   visibility: collapse;
   position: fixed;
   z-index: 0;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.7);
}

.quest-gold-separator {
   height: 35vh;
   width: 5vh;
   margin: 0 2vh;
}


.quest-block {
   border-radius: 4vh;
   background-color: #fbf4d5;
   width: 100%;
   height: 35vh;
   margin: 5vh auto;
   overflow: hidden;
   display: grid;
   grid-template-columns: 46% 4% 46%;
   box-shadow: 0 0 .3vh #262626;
   transition: 0.5s;
   position: relative;
}

.quest-block:hover {
   box-shadow: 0 0 5vh #262626;
}

.quest-text {
   margin: 2vh;
   font-size: 115%;
   width: 50%;
}

#jeb-image {
   margin: auto;
   height: 28vh;
}

#grandpa-image {
   margin: -50px auto;
   height: 240px;
}

#grandma-image {
   margin: -5px 0 0 8px;
   height: 150px;
}






/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Quests
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

questbarIsOpen = false;
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 81) { questbar(); } });
function questbar() {
   if (questbarIsOpen === true) {
      document.getElementById("questContent").style.width = "-100%";
      document.getElementById("questRibbon").style.left = "0";
      hideObj(".questDarkShadow");
      questbarIsOpen = false;
   }
   else {
      document.querySelector("#questContent").style.left = "100%";
      document.querySelector("#questRibbon").style.left = "125vh";
      showObj(".questDarkShadow");
      questbarIsOpen = true;
   }
}
