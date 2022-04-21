//vardef
let caster = canvas.tokens.controlled[0]
let spellTarget = Array.from(game.user.targets)[0]

let d = new Dialog({
    title: "Harm",
    content: "<p>How many actions are you using to cast Harm?</p>",
    buttons: {
    one: {
    icon: '<span class="pf2-icon">1</span>',
    label: "One Action",
    callback: () => {
        oneActionHarm()
        }
    },
    two: {
    icon: '<span class="pf2-icon">2</span>',
    label: "Two Actions",
    callback: () => {
        twoActionHarm()
        }
    },
    three:{
    icon: `<span class="pf2-icon">3</span>`,
    label: "Three Actions",
    callback: () => {
        threeActionHarm()
        }
    }
    },
    default: "Two Actions"
})

main()

function main(){
    if(caster != undefined){
        d.render(true);
    }else{
        ui.notifications.error(`You must select the token of the caster!`)
        return;
    }    
}

//Defining unique behavior for each kind of effect


function oneActionHarm(){
    //error checking for multiple targets
    if (game.user.targets.size!= 1){
        ui.notifications.error("Select only one target!")
        return;
    }
    if(canvas.grid.measureDistance(caster,spellTarget) < 7.5){
            console.log("Close enough to touch!")
            // checks whether the target is undead or not
            oneActionHarmAnimation()
        }else{
            console.log(`Too far to touch!`); 
            ui.notifications.error(`Your target is further than touch distance away! Try again.`);
            return;
        }    
}

function twoActionHarm(){
    //error checking for multiple targets
    if (game.user.targets.size!= 1){
        ui.notifications.error("Select only one target!")
        return;
    }
    if(canvas.grid.measureDistance(caster,spellTarget) <= 30){
        console.log("Within 30 feet!")
        // checks whether the target is undead or not
        twoActionHarmAnimation()
    }else{
        console.log(`Farther than 30 feet!`); 
        ui.notifications.error(`Your target is further than 30 feet away! Try again.`);
        return;
    }
}

function threeActionHarm(){
    //divide up all tokens within range into an array for living and an array for undead
    let tokensOnMap = Array.from(canvas.tokens.placeables)
    let tokensInRange = tokensOnMap.filter(distance => canvas.grid.measureDistance(distance,caster)<=30)
    let tokenTraitsInRange = tokensInRange.map(x => x.actor.traits)
    let undeadTokensInRange = []
    let livingTokensInRange = []
    for(let i=0;i<tokensInRange.length;i++){
        if(Array.from(tokenTraitsInRange[i]).includes(`undead`)){
            undeadTokensInRange.push(tokensInRange[i])
        }else if(!Array.from(tokenTraitsInRange[i]).includes(`undead`)&&!Array.from(tokenTraitsInRange[i]).includes(`construct`)){
            livingTokensInRange.push(tokensInRange[i])
        }
    }
    console.log(undeadTokensInRange)
    console.log(livingTokensInRange)
    new Sequence()
        .effect()
            .atLocation(caster)
            .randomRotation()
            .size(15, {gridUnits: true})
            .file("jb2a.healing_generic.burst.purplepink")
            .waitUntilFinished(-1500)
        .play()
    for(let i=0;i<undeadTokensInRange.length;i++){
        new Sequence("Heal Undead")
            .effect()
                .atLocation(undeadTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file("jb2a.cure_wounds.400px.purple")
            .play()
    }
    for(let i=0;i<livingTokensInRange.length;i++){
        new Sequence("Harm living")
            .effect()
                .atLocation(livingTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file("jb2a.divine_smite.caster.dark_purple")
            .effect()
                .atLocation(livingTokensInRange[i])
                .scaleToObject()
                .file("jb2a.toll_the_dead.purple.skull_smoke")
                .delay(500)
            .play()
    }
}

//Defining animations for each kind of effect
    function oneActionHarmAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
        //trigger energy strand from caster to target, then trigger healing burst on target
        new Sequence("Heal undead")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file("jb2a.cure_wounds.400px.purple")
            .play()
        }else{
        //trigger energy strand from caster to target, then trigger damaging burst on target
        new Sequence("Harm living")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file("jb2a.divine_smite.caster.dark_purple")
            .effect()
                .atLocation(spellTarget)
                .scaleToObject()
                .file("jb2a.toll_the_dead.purple.skull_smoke")
                .delay(500)
            .play()
        }
    }
    function twoActionHarmAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
            //trigger energy strand from caster to target, then trigger healing burst on target
            new Sequence("Heal undead")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file("jb2a.energy_strands.range.standard.dark_purple")
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file("jb2a.cure_wounds.400px.purple")
                .play()
        }else{
            //trigger energy strand from caster to target, then trigger damaging burst on target
            new Sequence("Harm living")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file("jb2a.energy_strands.range.standard.dark_purple")
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file("jb2a.divine_smite.caster.dark_purple")
                .effect()
                    .atLocation(spellTarget)
                    .scaleToObject()
                    .file("jb2a.toll_the_dead.purple.skull_smoke")
                    .delay(500)
                .play()
        }
    }
    function threeActionHarmAnimation(){
        
    }