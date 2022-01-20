
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

// Add value to schema (make sure to add to schema as well)
UserData.updateMany(
   { avatar: { $exists: false }},
   { $set: { avatar: "squirrel" }},
   { multi: true },
   (err, oth) => { if (err) return console.error(err); else { console.log(oth); } }
);

// Empty schema
Chat.deleteMany({}, function (err) { if (err) { console.log(err) } else { console.log("success"); } });




// old stuff
// UserData.find((err, users) => {
//    if (err) return console.error(err);
//    else { users.forEach((user) => {
//       console.log(user.name + ": " + user._id)
//    }) }
// });

let deleteAccounts = ["611fffc185217656a4d2efdd", "612000b638cb86545c1aa764", "6120062162cea635e071caeb", "6189808795088605f2170c66", "61953484c220b90ba7e5fdf0", "61dc764d11d94c001625430c", "61dc764e11d94c001625430e", "61df034a68456900166701fb", "61e3211f1a61db247e594661", "61e34784c5450c0016d2615e", "61e347a9c5450c0016d26164", "61e347c74faf4c0016bcc681", "61e5d0e2f4cc5d399df0e62d", "61e5d10e33b3263ab5b1cce2", "61e5d1789d899f3ca39b069f", "61e5d251da94753e06d2621e", "61e5d2d884e3963f42a8b4a7", "61e5d2f2af2aa54002a91706", "61e5d308ca9d1f40ca3fa67c", "61e5d577fb15714a33504aa9", "61e6cd6d993f0100167ee6cc"];

for (i in deleteAccounts) {
   UserData.findByIdAndRemove(deleteAccounts[i], (err, doc) => {
      if (err) { return console.error(err); }
      else { console.log(doc); }
   })
}

// info loop
UserData.find((err, users) => {
   if (err) return console.error(err);
   else { users.forEach((user) => {
      console.log(user.userCode + ": " + user.name)
   }) }
});