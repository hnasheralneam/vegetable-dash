/* =============
// Data
============= */
// System variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios")
const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

// My varibles
let signedIn = false;
let signedInUser = "(not signed in)";

// GitHub OAuth varibles
let github_access_token = "";
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// More system stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
mongoose.set("useFindAndModify", false);

// Mongoose things
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// nodemailer things
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.VD_EMAIL,
      pass: process.env.VD_EMAIL_PASSCODE
  }
});

// System things
connection.on('error', console.error.bind(console, 'Connection error: '));

// Schemas
const useDataSchema = new mongoose.Schema({
   name: String,
   email: String,
   passcode: String,
   avatar: String,
   githubClientId: String,
   dateAccountStarted: Date,
   lastPlayed: Date,
   dashcoins: Number,
   friends: [],
   friendInvitesSent: [],
   friendInvitesRecived: [],
   gameSave: {}
});

const chatSchema = new mongoose.Schema({
   input: String,
   user: String,
   avatar: Number,
   datePosted: Object
});

const UserData = mongoose.model('UserData', useDataSchema);
const Chat = mongoose.model("Chat", chatSchema);

/* =============
// Processing
============= */

function sendEmail(title, text, recipient) {
   var mailOptions = {
      from: "vegetabledash@gmail.com",
      to: recipient,
      subject: title,
      html: text
   };
   
   transporter.sendMail(mailOptions, function(err, info){
      if (err) { console.log(err); }
   });
}

setInterval(() => {
   if (signedInUser != "(not signed in)") {
      UserData.findOne({ name: signedInUser.name }, (err, user) => {
         if (err) return console.error(err);
         else { signedInUser = user; }
      });
   }
}, 1000);

/* =============
// Get requests
============= */

// Final destanations
app.get("/", (req, res) => {
   UserData.find((err, users) => {
      if (err) return console.error(err);
      else {
         Chat.find(function(err, found) {
            if (err) { console.log(err); }
            else { res.render("home", { user: signedInUser, UserData: UserData, users: users, foundItems: found, client_id: githubClientId }); }
         });
      }
   });
});

app.get("/vegetable-dash", (req, res) => {
   if (signedInUser !== "not signed in") {
      UserData.find((err, users) => {
         if (err) return console.error(err);
         else {
            Chat.find(function(err, found) {
               if (err) { console.log(err); }
               else { res.render("index", { user: signedInUser, UserData: UserData, users: users, foundItems: found }); }
            });
         }
      });
   }
   else { res.render("signin", { text: "Sign into your account!" }); }
});

app.get("/chat", (req, res) => {
   Chat.find(function(err, found) {
      if (err) { console.log(err); }
      else { res.render("chat", { user: signedInUser, UserData: UserData, foundItems: found }); }
   })
});

// Temporary landings
app.get("/create-account", (req, res) => {
   res.render("signup", { errText: "Create your account. WARNING: do not use your real name or a password from another account, for none of the data is encrypted." });
});

app.get("/sign-in", (req, res) => {
   if (!signedIn) { res.render("signin", { text: "Sign into your account!" }); }
   else { res.redirect("/"); }
});

app.get("/sign-out", (req, res) => {
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

// GitHub OAuth
app.get("/github/callback", (req, res) => {
   const requestToken = req.query.code;
   axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${requestToken}`,
      headers: { accept: "application/json" }
   }).then((response) => {
      github_access_token = response.data.access_token;
      checkGithub(response.data);
      res.redirect("/");
   });
});

async function checkGithub(githubData) {
   const ID = githubData.id;
   let accountExists = await UserData.findOne({ githubClientId: ID });
   if (accountExists) { signinGithub(ID); }
   else { createAccountGithub(githubData); }
}

function signinGithub(githubId) {
   UserData.findOne({ githubClientId: githubId }, (err, user) => {
      if (err) return console.error(err);
      else {
         signedIn = true;
         signedInUser = user;
      }
   });
}

function createAccountGithub(githubData) {
   const newUser = new UserData({
      name: githubData.login,
      email: githubData.email,
      passcode: false,
      dateAccountStarted: Date.now(),
      githubClientId: githubData.id
   });
   newUser.save(function (err, newUser) { if (err) return console.error(err); });
   // Send 'em an email
   sendEmail("🎉 Congratulations! 🎉 You have successfully created your Vegetable Dash account!", "<h2>🎉 Congratulations! 🎉</h2><h4>You have successfully created your Vegetable Dash account!</h4><p>We just wanted to let you know that you created your Vegetable Dash account, and there were no errors in doing so. I will respect the power that I hold with your email and will not send promotional emails unless you want me to. The only other emails I will send shall be triggered by your actions on my site. Good Luck!</p><i>-Squirrel</i><p>vegetabledash@gmail.com</p>", githubData.email);
}

/* =============
// Account
============= */

// Create account
app.post("/create-account", (req, res) => {
   heyThere();
   async function heyThere() {
      // Check name and email
      let isAlreadyUsedName = await UserData.findOne({ name: req.body.name });
      if (isAlreadyUsedName) { res.render("signup", { errText: "Choose a different name! (This one is taken!)" }); }
      else {
         let isAlreadyUsedEmil = await UserData.findOne({ name: req.body.emil });
         if (isAlreadyUsedEmil) { res.render("signup", { errText: "Email is already used." }); }
         else {
            // Create account
            if (parseInt(req.body.pscd) === NaN) { console.log("Passcode must contain only numbers!"); return false; }
            else {
               const newUser = new UserData({
                  name: req.body.name,
                  email: req.body.emil,
                  passcode: req.body.pscd,
                  dateAccountStarted: Date.now(),
                  githubClientId: "false"
               });
               newUser.save(function (err, newUser) { if (err) return console.error(err); });
               // Send 'em an email
               sendEmail("🎉 Congratulations! 🎉 You have successfully created your Vegetable Dash account!", "<h2>🎉 Congratulations! 🎉</h2><h4>You have successfully created your Vegetable Dash account!</h4><p>We just wanted to let you know that you created your Vegetable Dash account (${req.body.name}), and there were no errors in doing so. I will respect the power that I hold with your email and will not send promotional emails unless you want me to. The only other emails I will send shall be triggered by your actions on my site. Good Luck!</p><i>-Squirrel</i><p>vegetabledash@gmail.com</p>", req.body.emil);
               // Sign in and go home
               UserData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
                  if (err) return console.error(err);
                  else {
                     signedIn = true;
                     signedInUser = user;
                     res.redirect("back");
                  }
               });            
            }
         }
      }
   }
});

// Sign in
app.post("/signin", (req, res) => {
   UserData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.render("signin", { text: "The data dosen't line up. Try again!" }); }
      else if (user) {
         signedIn = true;
         signedInUser = user;
         res.redirect("back");
      }
   });
});

// Update avatar
app.post("/choose-avatar", (req, res) => {
   UserData.findOneAndUpdate(
      { name: signedInUser.name },
      { avatar: req.body.avatar },
      { new: true },
      (err, doc) => { if (err) return console.error(err); }
   );
   UserData.findOne({ name: signedInUser.name }, (err, user) => {
      if (err) return console.error(err);
      else {
         signedInUser = user;
         res.redirect("/");
      }
   });
});

/* =============
// Chat
============= */

app.post("/chat-message", (req, res) => {
   let timePosted = new Date(req.body.time);
   const newChat = new Chat({
      input: req.body.message,
      user: signedInUser.name,
      avatar: signedInUser.avatar,
      datePosted: timePosted
   });
   newChat.save(function(err){
      if (err) {
         console.log(err);
      } else { res.redirect("back"); }
   });
}); 

app.post("/edit-message", (req, res) => {
   Chat.findByIdAndUpdate(
      req.body.msgId,
      { input: req.body.newMessage,
         avatar: signedInUser.avatar },
      { new: true },
      (err, doc) => { if (err) return console.error(err); }
   );
   Chat.findOne({ name: signedInUser.name }, (err, doc) => {
      if (err) return console.error(err);
      else { res.redirect("/"); }
   });
});

app.post("/delete-message", (req, res) => {
   Chat.deleteOne(
      { _id: req.body.msgId },
      (err, doc) => { if (err) return console.error(err); }
   );
   Chat.findOne({ name: signedInUser.name }, (err, doc) => {
      if (err) return console.error(err);
      else { res.redirect("/"); }
   });
});

/* =============
// Friends
============= */

app.post("/send-friend-request", (req, res) => {
   let thisUser = req.body.thisUser;
   let thatUser = req.body.thatUser;
   UserData.findOneAndUpdate(
      { name: thisUser },
      { $addToSet: { friendInvitesSent: thatUser } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   UserData.findOneAndUpdate(
      { name: thatUser },
      { $addToSet: { friendInvitesRecived: thisUser } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   setTimeout(() => { res.redirect("/"); }, 1000);
});

app.post("/accept-friend-request", (req, res) => {
   let thisUser = req.body.thisUser;
   let thatUser = req.body.thatUser;
   UserData.findOneAndUpdate(
      { name: thisUser },
      { $push: { friends: thatUser }, $pull: { friendInvitesSent: thatUser, friendInvitesRecived: thatUser }, $inc: { dashcoins: 5 } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   UserData.findOneAndUpdate(
      { name: thatUser },
      { $push: { friends: thisUser }, $pull: { friendInvitesSent: thisUser, friendInvitesRecived: thisUser }, $inc: { dashcoins: 5 } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   setTimeout(() => { res.redirect("/"); }, 1000);
});

/* =============
// Vegetable Dash Save
============= */

app.post("/save-vegetable-dash", (req, res) => {
   let inputSave = req.body;
   UserData.findOneAndUpdate(
      { name: signedInUser.name },
      { gameSave: inputSave },
      { new: true },
      function (err, doc) { if (err) { return console.error(err); } else { res.send("Misson Success!"); } }
   );
});

/* =============
// Video
============= */

const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true, });

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/start-video", (req, res) => {
   res.redirect(`/video-chat/${uuidv4()}`);  
});

app.get("/video-chat/:room", (req, res) => {
   res.render("room", { roomId: req.params.room });
});

let listOfPeers = [];

peerServer.on("connection", (data) => {
   listOfPeers.push(data.id);
});

io.on("connection", (socket) => {
   // socket.broadcast.emit("user-connected", socket.id);
   let userId;
   socket.on("join-room", (roomId, usrId, userName) => {
      userId = usrId;
      socket.join(roomId);
      socket.emit("listOfPeers", listOfPeers);
      socket.broadcast.emit("user-connected", userId);
      socket.on("message", (message) => {
         io.to(roomId).emit("createMessage", message, userName);
      });
   });
   socket.on("disconnect", () => {
      if (listOfPeers.indexOf(5) > -1) { listOfPeers.splice(listOfPeers.indexOf(userId), 1); }
      socket.broadcast.emit("user-disconnected", userId);
   });
});

server.listen(port);