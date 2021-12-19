// Declare varibles
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
let myVideoStream;
var peer = new Peer(undefined, { path: "/peerjs", host: "/", port: "443", });
myVideo.muted = true;

// Get name
const user = prompt("Enter your name");












// Other
navigator.mediaDevices
.getUserMedia({ audio: true, video: true, })
.then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        video.classList.add("somthing");
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });
});

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
}

peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
});

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
    });
}















// Buttons
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

// Stop audio
muteButton.addEventListener("click", () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        html = `<i class="fas fa-microphone-slash"></i>`;
        muteButton.classList.toggle("background__red");
        muteButton.innerHTML = html;
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        html = `<i class="fas fa-microphone"></i>`;
        muteButton.classList.toggle("background__red");
        muteButton.innerHTML = html;
    }
});

// Stop video
stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

// Invite prompt
inviteButton.addEventListener("click", (e) => {
    prompt("Copy this link and send it to people you want to meet with", window.location.href);
});

// Chat
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
    if (text.value.length !== 0) {
        socket.emit("message", text.value);
        text.value = "";
    }
});

text.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && text.value.length !== 0) {
        socket.emit("message", text.value);
        text.value = "";
    }
});

socket.on("createMessage", (message, userName) => {
    messages.innerHTML =
        messages.innerHTML +
            `<div class="message">
                <b><i class="far fa-user-circle"></i> <span> ${
                    userName === user ? "me" : userName
                }</span> </b>
            <span>${message}</span>
        </div>`;
});