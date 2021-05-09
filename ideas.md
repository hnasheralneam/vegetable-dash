# Ideas
## In progress
- **Multi-plant plot opening**
   - On click of almanac, open multiplot choice
   - If multiple plants in one plot, plant choices in row
   - Background slightly transparent
   - Check in beta (CSS fulfilled, JavaScript in progress)
- **Quests**

## Thinking
- **Pay seeds to plant vegetables**
- **Scythes?**
   - Use them somehow (harvest x3?)
- **Auto harvest**
   - Allow automatic harvesting (Purchased, of course)
   - [Code](#Auto Harvest)
- **Unlock time**
   - Take time for plots to unlock
- **Pages**
   - Multiple pages, transparent white arrow/center plot to move
   - First page vegetables
   - Second page fruit
   - Third page grains
   - Animals | Sorry, if this ever happens it will be years in the future
- **Center plot**
   - Center plot is multiple vegetable plot
   - Unlock all other plots first
   - More information on beta branch

# Code
### Auto harvest
```
   // Automate harvesting while inactive
   if (poltStatus.peas = "ready") {
      setTimeout(document.getElementById("harvestPeas").click());
   }
```

```
// set check plant loop for each on load

// harvest() {
//    timePlanted[veg] = date now;
//    time [veg] should be harvested = timePlanted[veg] + time growing;
// }
//
// check time() {
//    if (time now - time [veg] should be harvested >= 0) {
//       veg is ready
//    }
// }
```
