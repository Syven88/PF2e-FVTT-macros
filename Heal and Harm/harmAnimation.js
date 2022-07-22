//vardef
let caster = canvas.tokens.controlled[0]
let spellTarget = Array.from(game.user.targets)[0]
let actionsUsed
let harmingDie
let spellTargetName = ``

let harmingSingleAnim
let harmingHealAnim = "jb2a.healing_generic.200px.purple"
let harmingAreaAnim
let harmingStrandAnim = "jb2a.energy_strands.range.standard.purple"

if(game.modules.get("jb2a_patreon")?.active){
    harmingSingleAnim = "jb2a.divine_smite.target.dark_purple"
    harmingAreaAnim = "jb2a.healing_generic.burst.purplepink"
}else if(!game.modules.get("jb2a_patreon")?.active && game.modules.get("JB2A_DnD5e")?.active){
    console.log("The jb2a patreon module is not enabled!")
    harmingSingleAnim = "jb2a.divine_smite.target.blueyellow"
    harmingAreaAnim = "jb2a.detect_magic.circle.blue"
}else{
    ui.notifications.error("The jb2a module is not present or enabled!")
    return
}

async function main(){
    if(canvas.tokens.controlled.length != 0){
        if(CheckFeat(`harming-hands`)){
            harmingDie = `d10`
        }else{
            harmingDie = `d8`
        }

        if (!caster.actor.itemTypes.spell.some(s => s.slug === 'harm')){
            ui.notifications.error(`This character can't cast spells or doesn't have harm prepared.`)
            return
        }
        harmActions.render(true);
    }else{
        ui.notifications.error(`You must select the token of the caster!`)
        return;
    }
}

let harmActions = new Dialog({
    title: "harm",
    content: "<p>How many actions are you using to cast harm?</p>",
    buttons: {
    one: {
    icon: '<span class="pf2-icon">1</span>',
    label: "One Action",
    callback: () => {
        oneActionharm()
        }
    },
    two: {
    icon: '<span class="pf2-icon">2</span>',
    label: "Two Actions",
    callback: () => {
        twoActionharm()
        }
    },
    three:{
    icon: `<span class="pf2-icon">3</span>`,
    label: "Three Actions",
    callback: () => {
        threeActionharm()
        }
    }
    },
    default: "Two Actions"
})

let rollFormula = ``    
let spellNumeral

function rollTheDice(){
    console.log(`Actions used: `+ actionsUsed);

    if(actionsUsed == 1 || actionsUsed == 3){
        rollFormula = spellNumeral + harmingDie
    }else if(actionsUsed == 2){
        rollFormula = spellNumeral + harmingDie + `+` + spellNumeral*8
    }else if(actionsUsed == 2){
        rollFormula = spellNumeral + harmingDie + `+` + spellNumeral*8
    }else{console.log(`Error in rollTheDice function!`);}    
    console.log(`Roll formula: ` + rollFormula);
    ui.chat.processMessage(`/r `+rollFormula+` #`+actionsUsed+` action harm at `+selectedSpellLevel+` targeting `+spellTargetName)
}

const spellLevels = [`10th Level`, `9th Level`,`8th Level`,`7th Level`,`6th Level`,`5th Level`,`4th Level`,`3rd Level`,`2nd Level`,`1st Level`];
const spLevelOptions = spellLevels.slice(-Math.ceil(caster?.actor.level/2)).reduce((acc, e) => acc += `<option value="${e}">${e}</option>`, ``)
const content = `
<form> 
    <div class="form-group"> 
        <label for="spellLevel-select">Spell Level</label>
            <div class="form-fields">
                <select id="spellLevel-select">${spLevelOptions}</select> 
            </div> 
        </div> 
    </form>`

let selectedSpellLevel

let harmLevel = new Dialog({
    content,
    title: "Select Spell Level",
    buttons: {go: {
        icon: `<i class="fas fa-check"></i>`,
        label: `Confirm`,
        callback: async (html) => {
                selectedSpellLevel = html[0].querySelector("select[id='spellLevel-select']").value;
                spellNumeral = 10-spellLevels.indexOf(selectedSpellLevel)
                console.log(`Spell Level: `+spellNumeral);
                rollTheDice()
            }
        },
        cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: `Cancel`
        }
    },
    default: "go"
})
//Defining unique behavior for each kind of effect

function oneActionharm(){
    //error checking for multiple targets
    if (game.user.targets.size > 1){
        ui.notifications.error("Select only one target!")
        return;
    }else if(game.user.targets.size == 0){
        ui.notifications.error(`Please select a target!`)
        return;
    }
    if(canvas.grid.measureDistance(caster,spellTarget) < 7.5){
            console.log("Close enough to touch!")
            // checks whether the target is undead or not
            oneActionharmAnimation()
            actionsUsed = 1;
        }else{
            console.log(`Too far to touch!`); 
            ui.notifications.error(`Your target is further than touch distance away! Try again.`);
            return;
        }
        spellTargetName = spellTarget.name
        harmLevel.render(true)
}

function twoActionharm(){
    //error checking for multiple targets
    if (game.user.targets.size > 1){
        ui.notifications.error("Select only one target!")
        return;
    }else if(game.user.targets.size == 0){
        ui.notifications.error(`Please select a target!`)
        return;
    }
    if(canvas.grid.measureDistance(caster,spellTarget) <= 30){
        console.log("Within 30 feet!")
        // checks whether the target is undead or not
        twoActionharmAnimation()
        actionsUsed = 2;
    }else{
        console.log(`Farther than 30 feet!`); 
        ui.notifications.error(`Your target is further than 30 feet away! Try again.`);
        return;
    }
    spellTargetName = spellTarget.name
    harmLevel.render(true)
}

function threeActionharm(){
    //divide up all tokens within range into an array for living and an array for undead
    let tokensOnMap = Array.from(canvas.tokens.placeables)
    let tokensInRange = tokensOnMap.filter(distance => canvas.grid.measureDistance(distance,caster)<=30)
    let tokenTraitsInRange = tokensInRange.map(x => x.actor.traits)
    let undeadTokensInRange = []
    let livingTokensInRange = []
    spellTargetName = `all creatures within 30 feet.`
    actionsUsed = 3
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
            .file(harmingAreaAnim)
            .waitUntilFinished(-1500)
        .play()
    for(let i=0;i<undeadTokensInRange.length;i++){
        new Sequence("Heal Undead")
            .effect()
                .atLocation(undeadTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file(harmingHealAnim)
            .play()
    }
    for(let i=0;i<livingTokensInRange.length;i++){
        new Sequence("Harm living")
            .effect()
                .atLocation(livingTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file(harmingSingleAnim)
            .play()
    }
    harmLevel.render(true)
}

//Defining animations for each kind of effect
    function oneActionharmAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
        //trigger energy strand from caster to target, then trigger healing burst on target
        new Sequence("Heal undead")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file(harmingHealAnim)
            .play()
        }else{
        //trigger energy strand from caster to target, then trigger harming burst on target
        new Sequence("Harm living")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file(harmingSingleAnim)
            .play()
        }
    }
    function twoActionharmAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
            //trigger energy strand from caster to target, then trigger healing burst on target
            new Sequence("Heal undead")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file(harmingStrandAnim)
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file(harmingHealAnim)
                .play()
        }else{
            //trigger energy strand from caster to target, then trigger damaging burst on target
            new Sequence("Harm living")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file(harmingStrandAnim)
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file(harmingSingleAnim)
                .play()
        }
    }

function CheckFeat(slug) {
    if (caster.actor.itemTypes.feat.find((i) => i.slug === slug)) {
        return true;
    }
    return false;
    }

main()
