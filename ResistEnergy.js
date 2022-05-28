//This macro will prompt the user to select the resisted damage type and play an appropriate-looking animation to indicate their choice.
//This requires the following modules: Sequencer, JB2A's Patreon Complete Collection
//The Patreon collection can be substituted by replacing the animations with alternatives from their free collection

let caster = canvas.tokens.controlled[0]
let casterName = canvas.tokens.controlled[0].name

//error checking - multiple or no targets selected
if (canvas.tokens.controlled.length > 1){
    ui.notifications.error("Select only one target!")
    return
}else if(canvas.tokens.controlled.length === 0){
    ui.notifications.error("Please target a token!")
}

//Dialog that prompts the user to choose a damage type.
let d = new Dialog({
    title: "Resist Energy",
    content: "<p>Choose a damage type to be resisted.</p>",
    buttons: {
    one: {
        label: "Acid",
        callback: () => {
            acidAnimation()
            }
    },
    two: {
        label: "Cold",
        callback: () => {
            coldAnimation()
            }
    },
    three:{
        label: "Electricity",
        callback: () => {
            elecAnimation()
            }
    },
    four:{
        label: "Fire",
        callback: () => {
            fireAnimation()
            }
    },
    five:{
        label: "Sonic",
        callback: () => {
            sonicAnimation()
            }
    },
    six:{
        label: "None/Remove",
        callback: () => {
            removeResistEnergy()
            }
    }
    }
}).render(true)

function acidAnimation(){
    new Sequence()
        .effect()
            .file(`jb2a.shield_themed.above.fire.03.dark_green`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Acid (Above); Active on ` + casterName)
        .effect()
            .file(`jb2a.shield_themed.below.fire.03.dark_green`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .belowTokens()
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Acid (Below); Active on ` + casterName)
        .play()
        ui.notifications.warn(`Don't forget to apply the spell effect in addition to the animation!`)
}

function coldAnimation(){
    new Sequence()
        .effect()
            .file(`jb2a.shield_themed.above.ice.01.blue`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Cold (Above); Active on ` + casterName)
        .effect()
            .file(`jb2a.shield_themed.below.ice.01.blue`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .belowTokens()
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Cold (Below); Active on ` + casterName)
        .play()
        ui.notifications.warn(`Don't forget to apply the spell effect in addition to the animation!`)
}

function elecAnimation(){
    new Sequence()
        .effect()
            .file(`jb2a.token_border.circle.static.blue.010`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Electricity; Active on ` + casterName)
        .play()
        ui.notifications.warn(`Don't forget to apply the spell effect in addition to the animation!`)
}

function fireAnimation(){
    new Sequence()
        .effect()
            .file(`jb2a.shield_themed.above.fire.03.orange`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Fire (Above); Active on ` + casterName)
        .effect()
            .file(`jb2a.shield_themed.below.fire.03.orange`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.7)
            .belowTokens()
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Fire (Below); Active on ` + casterName)
        .play()
        ui.notifications.warn(`Don't forget to apply the spell effect in addition to the animation!`)
}

function sonicAnimation(){
    new Sequence()
        .effect()
            .file(`jb2a.energy_field.01.blue`)
            .attachTo(caster)
            .persist()
            .scaleToObject(1.5)
            .fadeIn(1000, {ease: `easeInOutCubic`})
            .fadeOut(1000, {ease: `easeOutSine`})
            .name(`Resist Sonic; Active on ` + casterName)
        .play()
    ui.notifications.warn(`Don't forget to apply the spell effect in addition to the animation!`)
}

//Checks for and removes only animations previously added by this macro
function removeResistEnergy(){
    if (Sequencer.EffectManager.getEffects({name:`Resist *`}).length > 0){
        Sequencer.EffectManager.endEffects({name:`Resist *`})
    } else {ui.notifications.info(`No Resist Energy animations detected on ` + casterName + "."); return;}
}