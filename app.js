/*
Hey! I've commented all the code with explanitory tips, if it's missing somthing, please let me know!
*/
/* =============
// Data
============= */
// System variables (These are basically JS libraries)
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

// Start an express app. Express makes it easier to route things
const app = express();
// Choose the port it's running on. This checks if there's an enviroment variable (production), and if not, runs it on localhost 3000
const port = process.env.PORT || 3000;
// This starts mongoose, the library we're using to connect to the MongoDB database. It makes it easier to fetch and save data.
const connection = mongoose.connection;

// This will be changed later when the user signs in
let signedIn = false;
let signedInUser = "(not signed in)";

// GitHub OAuth varibles, for creating an account or signing in with GitHub
let github_access_token = "";
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// This basically sets and starts all the libraries
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// This sets the base filepath for assets to /assets. It can be changed to anything
app.use(express.static(__dirname + "/assets"));
// Ejs is the view engine, it lets use use system varibles in html
app.set("view engine", "ejs");
mongoose.set("useFindAndModify", false);

// Mongoose things
mongoose.Promise = global.Promise;
// Acutally connect to the database with the connection link. You'll need to create a user on the database so you'll get access
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// nodemailer things
// What this does is setup the mailer, so we can email people when they sign up. Eventually we'll use this to send change password emails
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
// These are the basic datasets. Anything being saved to Mongo must be in schema format. If you're adding a value, add it here then run some code from oldapp.js to set it for all old users
const useDataSchema = new mongoose.Schema({
   userCode: String,
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

// Set the schemas
const UserData = mongoose.model('UserData', useDataSchema);
const Chat = mongoose.model("Chat", chatSchema);

/* =============
// Processing
============= */

// The send email function, just to clean things up
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

// a loop to make sure someone's signed in
setInterval(() => {
   if (signedInUser != "(not signed in)" && signedInUser) {
      UserData.findOne({ name: signedInUser.name }, (err, user) => {
         if (err) return console.error(err);
         else { signedInUser = user; }
      });
   }
}, 1000);

// This needs to be fixed, what it should do is kick a user out if there not signed in
// app.get("/is-signed-in", (req, res) => {
//    if (signedInUser == "(not signed in)") { res.send([false, "Not signed in!"]); }
//    else { res.send([true, "It's all right!"]); }
// });

/* =============
// Get requests
============= */

// If someone in the browser types a /,  it's go to the homepage
app.get("/", (req, res) => {
   // This is how to get data from Mongo
   UserData.find((err, users) => {
      // You have to handle errors
      if (err) return console.error(err);
      // And if it works
      else {
         // Find the chat data
         Chat.find(function(err, found) {
            if (err) { console.log(err); }
            else {
               // Because we set the view engine as ejs, this will render the home.ejs file in the view foler
               // The second input is an object with the variables we'll send to the page
               res.render("home", { user: signedInUser, UserData: UserData, users: users, foundItems: found, client_id: githubClientId });
            }
         });
      }
   });
});

// Gets requests from /vegetable-dash
app.get("/vegetable-dash", (req, res) => {
   // If the user is signed in, go to the index file
   if (signedInUser !== "not signed in") {
      UserData.find((err, users) => {
         if (err) return console.error(err);
         else {
            Chat.find(function(err, found) {
               if (err) { console.log(err); }
               else { res.render("index", { user: signedInUser, UserData: UserData, users: users, foundItems: found, client_id: githubClientId }); }
            });
         }
      });
   }
   else { res.render("signin", { text: "Sign into your account!" }); }
});

// /chat in the searchbar
app.get("/chat", (req, res) => {
   // This is not an actuall page, it's just an expirement.
   Chat.find(function(err, found) {
      if (err) { console.log(err); }
      else { res.render("chat", { user: signedInUser, UserData: UserData, foundItems: found, client_id: githubClientId }); }
   })
});

// Temporary landings
app.get("/create-account", (req, res) => {
   // Err text will be displayed on the page. It's called errtext because we'll be sending any errers to the same place
   res.render("signup", { errText: "Create your account. WARNING: do not use your real name or a password from another account, for none of the data is encrypted." });
});

app.get("/sign-in", (req, res) => {
   // If you're already signed in, redirect to the homepage
   if (!signedIn) { res.render("signin", { text: "Sign into your account!" }); }
   else { res.redirect("/"); }
});

app.get("/sign-out", (req, res) => {
   // This is not an actuall page, because it immediatly send you back
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

// GitHub OAuth
app.get("/github/callback", (req, res) => {
   // Using the axios library, sign into or create an account with GitHub
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
      userCode: uuidv4(),
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
   // This is so it'll run asynchronous
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
                  userCode: uuidv4(),
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
                  else { res.redirect("/"); }
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
      (err, doc) => {
         if (err) return console.error(err);
         else { return doc; }
      }
   );
});

// Update account info
app.post("/change-account-info", (req, res) => {
   return heyThere();
   async function heyThere() {
      // Check name and email
      let isAlreadyUsedName = await UserData.findOne({ name: req.body.name });
      if (isAlreadyUsedName) { res.render("signup", { errText: "Choose a different name! (This one is taken!)" }); }
      else {
         let isAlreadyUsedEmil = await UserData.findOne({ name: req.body.emil });
         if (isAlreadyUsedEmil) { res.render("signup", { errText: "Email is already used." }); }
         else {
            UserData.findOneAndUpdate(
               { name: signedInUser.name },
               { avatar: req.body.avatar },
               { new: true },
               (err, doc) => {
                  if (err) return console.error(err);
                  else { return doc; }
               }
            );
            sendEmail("✉️ Email & Name Updated! ✉️", "<h2>✉️ Email & Name Updated! ✉️</h2><h4>You have successfully updated your Vegetable Dash account!</h4><p>I just wanted to let you know that your account info has just been changed. If it wasn't you who did it, your account has been comprimised, but you probably won't be getting this email, because the email was changed. Just wanted to let you know! </p><i>-Squirrel</i><p>vegetabledash@gmail.com</p>", req.body.emil);
         }
      }
   }
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
      { userCode: thisUser },
      { $addToSet: { friendInvitesSent: thatUser } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   UserData.findOneAndUpdate(
      { userCode: thatUser },
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
      { userCode: thisUser },
      { $push: { friends: thatUser }, $pull: { friendInvitesSent: thatUser, friendInvitesRecived: thatUser }, $inc: { dashcoins: 5 } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   UserData.findOneAndUpdate(
      { userCode: thatUser },
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

// All this stuff is experimental, I'm just testing it, so I don't fully understand it. I did only start developing like 2 years ago
const server = require("http").Server(app);
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

// This is what actually starts the server
server.listen(port);