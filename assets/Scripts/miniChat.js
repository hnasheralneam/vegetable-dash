/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Main
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

init();
function init() {
   // Deleting messages
   document.querySelectorAll(".message-right").forEach((obj, i, arr) => {
      document.querySelectorAll(".remove-msg")[i].onsubmit = function(event) {
         event.preventDefault();
         $.post("/delete-message", {
            msgId: this.msgId.value
         }).done(function() { obj.remove(); });
      }
   });
   // Editing messages
   document.querySelectorAll(".message-right").forEach((obj, i, arr) => {
      document.querySelectorAll(".change-msg")[i].onsubmit = function(event) {
         let message = this.newMessage.value;
         event.preventDefault();
         $.post("/edit-message", {
            msgId: this.msgId.value,
            newMessage: message
         }).done(function(data) {
            document.querySelectorAll(".chat-text")[i].textContent = message;
            document.querySelectorAll(".chat-edit-img")[i].click();
         });
      }
   });
   document.querySelector(".messages").appendChild(document.getElementById("post-chat-msg"));
}

$("#post-chat-msg").submit(function(event) {
   if (this.message.value != "") {
      event.preventDefault();
      $.post("/chat-message", {
         input: this.message.value,
         datePosted: new Date()
      }).done(function(data) { addChatMessage(data); });
   }
});

function addChatMessage(msgData) {
   document.querySelector(".input").value = "";
   let newMessage = document.querySelector(".message-right-template").cloneNode(true);
   newMessage.dataset.id = msgData._id;
   newMessage.querySelector(".chat-text-template").classList.add("chat-text");
   newMessage.querySelector(".chat-text-template").classList.remove("chat-text-template");
   newMessage.querySelector(".chat-text").textContent = msgData.input;
   newMessage.querySelector(".image-right").title = msgData.user;
   newMessage.querySelector(".image-right").src = `Images/Avatars/${msgData.avatar}.png`;
   newMessage.querySelector(".msgIdDel").value = msgData._id;
   let now = new Date();
   newMessage.querySelector(".time").textContent = `${now.getHours()}:${now.getMinutes()} on ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
   document.querySelector(".messages").appendChild(newMessage);
   // Removing template
   newMessage.classList.add("message-right");
   newMessage.classList.remove("message-right-template");
   newMessage.querySelector(".chat-edit-img-template").classList.add("chat-edit-img");
   newMessage.querySelector(".chat-edit-img-template").classList.remove("chat-edit-img-template");
   newMessage.querySelector(".change-msg-template").classList.add("change-msg");
   newMessage.querySelector(".change-msg-template").classList.remove("change-msg-template");
   newMessage.querySelector(".remove-msg-template").classList.add("remove-msg");
   newMessage.querySelector(".remove-msg-template").classList.remove("remove-msg-template");
   init();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Main
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function scrlToBottom() {
   var objDiv = document.querySelector(".chatbox");
   objDiv.scrollTop = objDiv.scrollHeight;
}
function scrlToTop() {
   var objDiv = document.querySelector(".chatbox");
   objDiv.scrollTop = 0;
}

function toggleChat() {
   if (document.querySelector('.chatbox').classList.contains("open")) {
      document.querySelector('.chatbox').classList.remove("open");
      scrlToTop();
   }
   else {
      document.querySelector('.chatbox').classList.add("open");
      scrlToBottom();
   }
}

function toggleChatMenu() {
   let switchMenu = document.querySelector(".menu-switchchat");
   if (switchMenu.style.right == "0vw") {
      document.querySelector(".messages").style.display = "block";
      switchMenu.style.right = "30vw";
   }
   else {
      document.querySelector(".messages").style.display = "none";
      switchMenu.style.right = "0vw";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Toggle
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let thisPressCount = 0;
document.addEventListener("keyup", function(event) {
   if (event.key === "c") {
      thisPressCount++;
      setTimeout(() => {
         if (thisPressCount >= 2) { toggleChat(); }
         thisPressCount = 0;
      }, 250);
   }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Dynamic hover
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let mouseX, mouseY;

document.onreadystatechange = function () {
   if (document.readyState === "complete") {
      document.addEventListener("mousemove", e => { getCoords(e); });
   }
}

function getCoords(e) {
   mouseX = event.clientX;
   mouseY = event.clientY;
   dynamHov.style.top = `${event.clientY}px`;
   dynamHov.style.left = `${event.clientX + 25}px`;
}

var dynamHov = document.createElement("SPAN");
document.body.appendChild(dynamHov);
dynamHov.style.position = "fixed";
dynamHov.classList.add("dynamicHover");

function info(THIS) {
   dynamHov.textContent = THIS.dataset.info;
   dynamHov.style.opacity = "1";
   THIS.onmouseleave = () => { dynamHov.style.opacity = "0"; }
}