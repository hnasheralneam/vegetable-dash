/* =============
// Data
============= */
// System variables
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
const connection = mongoose.connection

// My varibles
let signedIn = false;
let signedInUser = "(not signed in)";
var namesList = [];
var dataDone = false;

// More system stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
mongoose.set("useFindAndModify", false);

// Mongoose things
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://Squirrel:HgtSzuyB8ookIVHq@test-user-data.daqv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });

// System things
connection.on('error', console.error.bind(console, 'Connection error: '));

// Schemas
const useDataSchema = new mongoose.Schema({
   name: String,
   email: String,
   passcode: String,
   avatar: String,
   dateAccountStarted: Number,
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

UserData.find((err, users) => {
   if (err) return console.error(err);
   for (i = 0; i < users.length; i++) {
      if (!namesList.includes(users[i].name)) { namesList.push(users[i].name); }
   }
}).then(item => { dataDone = true; })

/* =============
// Post requests
============= */

// Final destanations
app.get("/", (req, res) => {
   UserData.find((err, users) => {
      if (err) return console.error(err);
      else {
         Chat.find(function(err, found) {
            if (err) { console.log(err); }
            else { res.render("home", { user: signedInUser, UserData: UserData, users: users, foundItems: found }); }
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
   else { res.render("signin", { error: { is: false } }); }
});

app.get("/chat", (req, res) => {
   Chat.find(function(err, found) {
      if (err) { console.log(err); }
      else { res.render("chat", { user: signedInUser, UserData: UserData, foundItems: found }); }
   })
});











// For video
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// const io = require("socket.io")(server, { cors: { origin: "*" } });
// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, { debug: true, });

// app.use("/peerjs", peerServer);
// app.use(express.static("public"));

// app.get("/start-room", (req, res) => {
//    res.redirect(`/${uuidv4()}`);
// });

// app.get("/:room", (req, res) => {
//    res.render("room", { roomId: req.params.room });
// });

// io.on("connection", (socket) => {
//    socket.on("join-room", (roomId, userId, userName) => {
//       socket.join(roomId);
//       socket.to(roomId).broadcast.emit("user-connected", userId);
//       socket.on("message", (message) => {
//          io.to(roomId).emit("createMessage", message, userName);
//       });
//    });
// });

// server.listen(process.env.PORT || 3000);












// Temporary landings
app.get("/account-created", (req, res) => {
   res.send("You succesfully created your account!<br><a href='/'>Back to homepage</a>");
});

app.get("/create-account", (req, res) => {
   res.render("signup");
});

app.get("/sign-in", (req, res) => {
   if (!signedIn) { res.render("signin", { error: { is: false } }); }
   else {
      Chat.find(function(err, found) {
         if (err) { console.log(err); }
         else { res.redirect("/"); }
      });
   }
});

app.get("/sign-out", (req, res) => {
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

/* =============
// Redirect Requests
============= */

// Create chat message
app.post("/chat-message", (req, res) => {
   const newChat = new Chat({
      input: req.body.message,
      user: signedInUser.name,
      avatar: signedInUser.avatar,
      datePosted: new Date()
   });
   newChat.save(function(err){
      if (err) {
         console.log(err);
      } else {
         Chat.find(function(err, found) {
            if (err) { console.log(err); }
            else { res.redirect("back"); }
         })
      }
   });
});

// Create account
app.post("/create-account", (req, res) => {
   if (dataDone === false) { setTimeout(addNow, 250); }
   else { addNow(); }
   function addNow() {
      if (namesList.includes(req.body.name)) { console.log("Choose a different name! (This one is taken!)"); return false; }
      else if (parseInt(req.body.pscd) === NaN) { console.log("Passcode must contain only numbers!"); return false; }
      else {
         var newUser = new UserData({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd, dateAccountStarted: Date.now() });
         newUser.save(function (err, newUser) {
            if (err) return console.error(err);
         });
      }
   }
   res.redirect("/account-created");
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

// IMPORTANT: This is sign in
app.post("/play", (req, res) => {
   UserData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.render("signin", { error: { is: true, more: "The data dosen't line up. Try again!" } }); }
      else if (user) {
         signedIn = true;
         signedInUser = user;
         Chat.find(function(err, found) {
            if (err) { console.log(err); }
            else { res.redirect("back"); }
         });
      }
   });
});

// Add new friends - NEEDS FIXING
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
   res.redirect("/");
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
   res.redirect("/");
});

// Save Vegetable Dash data - NEEDS FIXING
app.post("/save-vegetable-dash", (req, res) => {
   let inputSave = JSON.parse(req.body.gamesave);
   UserData.findOneAndUpdate(
      { name: signedInUser.name },
      { gameSave: inputSave },
      { new: true },
      function (err, doc) { if (err) { return console.error(err); } else { res.redirect("back"); } }
   );
   
});

// That's it
app.listen(port);



// vegetable dash save
// fix friends (if broken)
// style friends modal
