//vardef
let caster = canvas.tokens.controlled[0]
let spellTarget = Array.from(game.user.targets)[0]

//error checking for multiple targets
if (game.user.targets.size> 1){
    ui.notifications.error("Select only one target!")
    return;
}

//trigger energy strand from caster to target, then trigger healing burst on target
new Sequence("Stabilize")    
        .effect()
            .atLocation(caster)
            .stretchTo(spellTarget)
            .file("jb2a.energy_strands.range.standard.dark_green")
            .waitUntilFinished(-1000)
        .effect()
            .atLocation(spellTarget)
            .randomRotation()
            .file("jb2a.healing_generic.200px.green")
        .play()