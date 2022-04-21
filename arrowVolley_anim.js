//Required modules
//Warpgate, jb2a's animations, sequencer


ui.notifications.info("Set origin location.")
let originLoc = await warpgate.crosshairs.show()
ui.notifications.info("Set target location.")
let targetLoc = await warpgate.crosshairs.show()

new Sequence()
    .effect()
        .atLocation({x:originLoc.x, y:originLoc.y})
        .file("jb2a.arrow.physical.white.01")
        .repeats(6,0,100) //creates six arrows that fire from the origin point to the target point
        .stretchTo({x:targetLoc.x,y:targetLoc.y})
        .randomOffset(5) //fires the arrows at slightly different trajectory from the others to suggest multiple archers
    .play()