require('dotenv').config();
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

let signedIn = false;
let signedInUser = "(not signed in)";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/assets"));

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_URL}`, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection

connection.on('error', console.error.bind(console, 'Connection error: '));

var useDataSchema = new mongoose.Schema({
   name: String,
   email: String,
   passcode: String
});

var namesList = [];
var dataDone = false;
var UserData = mongoose.model('UserData', useDataSchema);

UserData.find((err, users) => {
   if (err) return console.error(err);
   for (i = 0; i < users.length; i++) { if (!namesList.includes(users[i].name)) { namesList.push(users[i].name); } }
}).then(item => { dataDone = true; })

function addNewUser(name, email, passcode) {
   if (dataDone === false) { setTimeout(addNow, 250); }
   else { addNow(); }
   function addNow() {
      if (namesList.includes(name)) { console.log("Choose a different name! (This one is taken!)"); return false; }
      else if (passcode.length !== 4) { console.log(passcode.length, "Passcode must be 4 numbers long!"); return false; }
      else if (parseInt(passcode) === NaN) { console.log("Passcode must contain only numbers!"); return false; }
      else {
         var newUser = new UserData({ name: name, email: email, passcode: passcode });
         newUser.save(function (err, newUser) {
            if (err) return console.error(err);
            else { console.log("You succesfully created your account!"); }
         });
      }
   }
}

// force good accounts
// UserData.findByIdAndRemove("612015dbdf91cf6ce81ef6ab", function (err) { if (err) { console.log(err) } });

// Sign up
app.get("/create-account", (req, res) => { res.render("signup"); });
app.post("/create-account", (req, res) => {
   addNewUser(req.body.name, req.body.emil, req.body.pscd);
   res.redirect("/account-created");
});
// Finished signing up
app.get("/account-created", (req, res) => { res.send("You succesfully created your account!<br><a href='/'>Back to homepage</a>"); });
// Other
app.get("/vegetable-dash", (req, res) => {
   if (signedInUser !== "not signed in") { res.render("vegetable-dash", { signedInUser }); }
   else { res.render("signin", { error: { is: false } }); }
});
//Sign in
app.get("/sign-in", (req, res) => {
   console.log(signedIn);
   if (!signedIn) { res.render("signin", { error: { is: false } }); }
   else { res.render("index", { userFrom: signedInUser }); }
});
app.post("/play", (req, res) => {
   UserData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.render("signin", { error: { is: true, more: "The data dosen't line up. Try again!" } }); }
      else if (user) {
         signedIn = true;
         signedInUser = user;
         res.render("index", { userFrom: signedInUser });
      }
   });
});
// Home page
app.get("/", (req, res) => {
   res.render("home", { user: signedInUser });
});

app.get("/sign-out", (req, res) => {
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.render("home", { user: signedInUser });
});

app.listen(port);
