main()
async function main(){
let caster = canvas.tokens.controlled[0]

//error checking for the specific caster who can cast Animate Dead
//Should probably revise to work by checking whether the selected token has the spell on their sheet
if (canvas.tokens.controlled[0] == undefined || caster.data.name != `Asha`){
    ui.notifications.error("Please select Asha's Token.")
    return;
}

//drawing a result from a prepared rollable table and spawning the resulting actor's token
let spellLevel = 1
let animDead = await game.tables.getName("Animate Dead (lvl" + spellLevel + ")").draw()
let minionName = animDead.results[0].data.text
console.log(minionName)
//spawning using warpgate
let minionID = await warpgate.spawn(minionName, {token: {alpha:0}})
const spawnedMinion = canvas.tokens.get(minionID[0])

//constructing an array of random points within 3 squares of the placed token
let randomLocArray = Array.from({length: 8}, function getRandomCoord(){
    let xCoord = (Math.random() * (3 - -3) + -3) * 100 + spawnedMinion.data.x
    let yCoord = (Math.random() * (3 - -3) + -3) * 100 + spawnedMinion.data.y
    return {x:xCoord, y:yCoord}
})

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