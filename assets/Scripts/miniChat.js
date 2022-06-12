/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Main
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

document.querySelectorAll(".message-right").forEach((obj, i, arr) => {
   document.querySelectorAll(".remove-msg")[i].onsubmit = function(event) {
      event.preventDefault();
      $.post("/delete-message", {
         msgId: this.msgId.value
      }).done(function(data) {
         obj.remove();
      });
   }
});

$("#post-chat-msg").submit(function(event) {
   if (this.message.value != "") {
      event.preventDefault();
      $.post("/chat-message", {
         input: this.message.value,
         datePosted: new Date()
      }).done(function(data) {
         addChatMessage(data);
      });
   }
});

function addChatMessage(msgData) {
   document.querySelector(".input").value = "";
   let newMessage = document.querySelectorAll(".message-right")[0].cloneNode(true);
   newMessage.dataset.id = msgData._id;
   newMessage.querySelector(".chat-text").textContent = msgData.input;
   newMessage.querySelector(".image-right").title = msgData.user;
   newMessage.querySelector(".image-right").src = `Images/Avatars/${msgData.avatar}.png`;
   newMessage.querySelector(".msgIdDel").value = msgData._id;
   let now = new Date();
   newMessage.querySelector(".time").textContent = `${now.getHours()}:${now.getMinutes()} on ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
   document.querySelector(".messages").appendChild(newMessage);
   console.log(newMessage)
}

function editChatMessage(msgData) {
   let msgEl = document.querySelector(`[data-id='${msgData._id}']`);
   // console.log(msgEl, msgData._id);
   // document.querySelectorAll(".message").forEach((data) => {
   //    console.log(data.dataset);
   // });
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
   if (switchMenu.style.left == "100%") { switchMenu.style.left = "0"; }
   else { switchMenu.style.left = "100%"; }
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
         if (thisPressCount >= 2) { toggleChat();console.log("hi"); }
         thisPressCount = 0;
      }, 250);
   }
});