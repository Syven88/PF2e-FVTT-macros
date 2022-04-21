//This macro was created to have two distinct hunt prey animations for the two rangers in this party. 
//Required modules: Sequencer, RF2e Ranged Combat, jb2a animations (patreon)

//vardef
let ranger = canvas.tokens.controlled[0]
let rangerName = canvas.tokens.controlled[0].name
let huntedPrey = Array.from(game.user.targets)[0]
let animationColor
let iconOffset
let effectName

//error checking - no token selected
if (canvas.tokens.controlled.length === 0){
    ui.notifications.error("Select your PC token!")
    return
}

//error checking - multiple or no targets selected
if (game.user.targets.size> 1){
    ui.notifications.error("Select only one target!")
    return
}else if(game.user.targets.size === 0){
    ui.notifications.error("Please target a token!")
}

//differentiating color per ranger so they don't overlap
if (canvas.tokens.controlled[0].name === 'Threshgarmre'){
    animationColor = ".blue"
    effectName = "Threshgarmre's Hunted Prey"
}else if(canvas.tokens.controlled[0].name === 'Orym'){
    animationColor = ".green"
    effectName = "Orym's Hunted Prey"
}else {
    ui.notifications.error("You're not Orym or Threshgarmre!")
    return
}

//placing the first mark furthest to the top and then the second below it, regardless of which color is applied first
if (Sequencer.EffectManager.getEffects({origin:"OrymhuntedPrey", object:huntedPrey}).length === 0 && Sequencer.EffectManager.getEffects({origin:"ThreshgarmrehuntedPrey", object:huntedPrey}).length === 0){
    iconOffset = {x: -25, y:25}
    console.log(`No hunted prey exists`)
} else {
    iconOffset = {x: -25, y:0}
    console.log(`hunted prey exists`)
}

//If the hunted prey icon from the ranger executing the macro exists, remove it instead of playing a new one. 
//If that would cause a second hunted prey icon to hang, adjust it's position so that it is in the corner instead.
if (Sequencer.EffectManager.getEffects({origin:rangerName + "huntedPrey"}).length === 1){
    console.log(rangerName + `'s hunted prey exists!`)
    ui.notifications.info("Removing existing hunted prey.")
    Sequencer.EffectManager.endEffects({origin:rangerName + "huntedPrey"})[0]
    canvas.tokens.controlled[0].actor.items.filter((i) => i.description == "<p>You have designated this creature as your prey.</p>")[0].delete()
    if (Sequencer.EffectManager.getEffects({name:`Hunted Prey`}).length === 1 && Sequencer.EffectManager.getEffects({name:`Hunted Prey`})[0].data.offset.y === 0){
        let existingIcon = Sequencer.EffectManager.getEffects({name:`Hunted Prey`})[0]
        existingIcon.update({offset:{x:-25,y:25}})
    }
    return
}

//animation params
new Sequence("Hunt Prey")    
        .effect() //flash of the full-size animation on the ranger
            .atLocation(ranger)
            .file("jb2a.hunters_mark.pulse.01" + animationColor)
        .effect() //attaching the hunters mark icon to the target
            .atLocation(huntedPrey)
            .attachTo(huntedPrey, {align: "top-right"}) 
            .offset(iconOffset) //allows for tweaks to location
            .file("jb2a.hunters_mark.loop.01" + animationColor)
            .persist()
            .scale(0.25)
            .fadeIn(500)
            .fadeOut(1000)
            .name(effectName) //names the animation so it can be easily identified in the effects manager
            .origin(rangerName + "huntedPrey")
        .play()

game.pf2eRangedCombat.huntPrey(); //applies the hunt prey condition from the ranged combat module to the target