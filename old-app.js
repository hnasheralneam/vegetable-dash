
// Change data
 UserData.findOneAndUpdate({ name: "Squirrel", passcode: 0825 }, { password: 0258 }, { new: true });

// Remove data
UserData.findByIdAndRemove("612015dbdf91cf6ce81ef6ab", function (err) { if (err) { console.log(err) } });

// Find one
UserData.findOne({ name: signedInUser.name }, (err, user) => {
   if (err) return console.error(err);
   else {
      console.log(user.avatar, "hi");
   }
});

// Add value to schema
UserData.updateMany(
   { avatar: { $exists: false }},
   { $set: { avatar: "squirrel" }},
   { multi: true },
   (err, oth) => { if (err) return console.error(err); else { console.log(oth); } }
);

// Empty schema
Chat.deleteMany({}, function (err) { if (err) { console.log(err) } else {console.log("success")} });
