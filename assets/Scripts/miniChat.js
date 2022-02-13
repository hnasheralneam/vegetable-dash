/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Main
//
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

document.querySelectorAll(".message-right").forEach((obj, i, arr) => {
   $(obj).children(".delete-msg").submit(function(event) {
      console.log(events)
      event.preventDefault();
      $.post("/delete-message", {
         msgId: this.msgId.value
      }).done(function(data) {
         deleteChatMessage(data);
      });
   });
});

$("#post-chat-msg").submit(function(event) {
   event.preventDefault();
   $.post("/chat-message", {
      input: this.message.value,
      datePosted: new Date()
   }).done(function(data) {
      addChatMessage(data);
   });
});

function addChatMessage(msgData) {
   let newMessage = document.querySelectorAll(".message-right")[0].cloneNode(true);
   newMessage.dataset.id = msgData._id;
   newMessage.querySelector(".chat-text").textContent = msgData.input;
   newMessage.querySelector(".image-right").title = msgData.user;
   newMessage.querySelector(".image-right").src = `Avatars/${msgData.avatar}.png`;
   let now = new Date();
   newMessage.querySelector(".time").textContent = `${now.getHours()}:${now.getMinutes()} on ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
   document.querySelector(".messages").appendChild(newMessage);
}

function editChatMessage(msgData) {
   let msgEl = document.querySelector(`[data-id='${msgData._id}']`);
   console.log(msgEl, msgData._id);
   document.querySelectorAll(".message").forEach((data) => {
      console.log(data.dataset);
   });
}

function deleteChatMessage(msgData) {
   let msgEl = document.querySelector(`[data-id='${msgData._id}']`);
   msgEl.remove();
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
