/*This macro will allow someone casting a summon spell to define a creature to summon and play an animation at the summon location of the casters choice.
Required Modules: JB2A Animations (paid only), Sequencer, Warpgate
*/

//This should really be defined using a user prompt, but I don't know how to code a "select" dialog yet
let minionName = `SUMMONED CREATURE'S NAME HERE`

main()
async function main(){
let caster = canvas.tokens.controlled[0]

//error checking to ensure the user has a token selected
if (caster == undefined){
    ui.notifications.error("Please select the caster's token.")
    return;
}else if (canvas.tokens.controlled.length > 1){
    ui.notifications.error("Please select only one token.")
    return;
}else if (Array.from(game.actors.filter(n => n.name == minionName))[0] == undefined){
    ui.notifications.error("The minion specified does not exist. It's name may be typed incorrectly, or it may not exist as an item in the actors tab.")
    return;
}

//spawning using warpgate
let minionID = await warpgate.spawn(minionName, {token: {alpha:0}})
const spawnedMinion = canvas.tokens.get(minionID[0])

//constructing an array of random points within 3 squares of the placed token
let randomLocArray = Array.from({length: 8}, function getRandomCoord(){
    let xCoord = (Math.random() * (3 - -3) + -3) * 100 + spawnedMinion.data.x
    let yCoord = (Math.random() * (3 - -3) + -3) * 100 + spawnedMinion.data.y
    return {x:xCoord, y:yCoord}
})

console.log(`Array of random locations:`);
console.log(randomLocArray)

//animation
new Sequence()
    .effect() //drawing strand from caster to selected summon location
        .atLocation(caster)
        .file("jb2a.energy_strands.range.multiple.bluepink.02")
        .stretchTo(spawnedMinion)
        .duration(500)
        .waitUntilFinished()
    .effect() //burst at summon location
        .file("jb2a.impact.004.blue")
        .atLocation(spawnedMinion)
        .scale(0.5)
    .thenDo(function(){
    for (let index = 0; index < randomLocArray.length; index++) {
        new Sequence()
            .effect() //draw strands originating from the random locations towards the summon location
                .file("jb2a.energy_strands.range.standard.blue")
                .atLocation(randomLocArray[index])
                .stretchTo(spawnedMinion)
            .play()
        }})
    .play()

new Sequence()
    .wait(1000)
    .animation() //set the opacity of the summoned creature's token to completely transparent
        .on(spawnedMinion)
        .opacity(0)
    .effect() //create a portal where the minion is summonned; The portal is scaled to the size of the token being summoned
        .atLocation(spawnedMinion)
        .file("jb2a.portals.horizontal.vortex.blue")
        .belowTokens()
        .fadeIn(500)
        .scaleToObject(1.5)
        .animateProperty("spriteContainer", "scale.x", { from: 0, to: 2.0, delay: 200, duration: 500, ease: "easeInOutCubic"})
        .animateProperty("spriteContainer", "scale.y", { from: 0, to: 2.0, duration: 700, ease: "easeInOutCubic"})
        .animateProperty("spriteContainer", "scale.x", { from: 0.8, to: 0, delay: 2500, duration: 500, ease: "easeInElastic"})
        .animateProperty("spriteContainer", "scale.y", { from: 0.8, to: 0, delay: 2300, duration: 700, ease: "easeInElastic"})   
    .wait(1000)
    .effect() //the token scales up to full size to show it emerging from the portal
        .atLocation(spawnedMinion) 
        .animateProperty("spriteContainer", "scale.x", { from: 0, to: 1.0, duration: 700, ease: "easeOutCubic"})
        .animateProperty("spriteContainer", "scale.y", { from: 0, to: 1.0, duration: 700, ease: "easeOutCubic"})
        .from(spawnedMinion)
        .fadeIn(400)
    .wait(450)
    .animation()
        .on(spawnedMinion)
        .opacity(1.0)
    .play()
}

