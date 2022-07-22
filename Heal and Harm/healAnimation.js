//vardef
let caster = canvas.tokens.controlled[0]
let spellTarget = Array.from(game.user.targets)[0]
let actionsUsed
let healingDie
let spellTargetName = ``

let healingSingleAnim
let healingDamageAnim
let healingAreaAnim = "jb2a.healing_generic.burst.greenorange"
let healingStrandAnim

if(game.modules.get("jb2a_patreon")?.active){
    healingSingleAnim = "jb2a.explosion.05.greenorange"
    healingStrandAnim = "jb2a.energy_strands.range.standard.dark_green"
    healingDamageAnim = "jb2a.divine_smite.target.greenyellow"
}else if(!game.modules.get("jb2a_patreon")?.active && game.modules.get("JB2A_DnD5e")?.active){
    console.log("The jb2a patreon module is not enabled!")
    healingSingleAnim = "jb2a.healing_generic.200px.green"
    healingStrandAnim = "jb2a.energy_strands.range.standard.purple"
    healingDamageAnim = "jb2a.divine_smite.target.blueyellow"
}else{
    ui.notifications.error("The jb2a module is not present or enabled!")
    return
}

let healBonus = 0

async function main(){
    if(canvas.tokens.controlled.length != 0){
        if(CheckFeat(`healing-hands`)){
            healingDie = `d10`
        }else{
            healingDie = `d8`
        }
        
        if(CheckItem(`Staff of Healing`)){
            healBonus = 1
        }else if(CheckItem(`Staff of Healing (Greater)`)){
            healBonus = 2
        }else if(CheckItem(`Staff of Healing (Major)`)){
            healBonus = 3
        }else if(CheckItem(`Staff of Healing (True)`)){
            healBonus = 4
        }

        if (!caster.actor.itemTypes.spell.some(s => s.slug === 'heal')){
            ui.notifications.error(`This character can't cast spells or doesn't have heal prepared.`)
            return
        }
        healActions.render(true);
    }else{
        ui.notifications.error(`You must select the token of the caster!`)
        return;
    }
}

let healActions = new Dialog({
    title: "Heal",
    content: "<p>How many actions are you using to cast Heal?</p>",
    buttons: {
    one: {
    icon: '<span class="pf2-icon">1</span>',
    label: "One Action",
    callback: () => {
        oneActionHeal()
        }
    },
    two: {
    icon: '<span class="pf2-icon">2</span>',
    label: "Two Actions",
    callback: () => {
        twoActionHeal()
        }
    },
    three:{
    icon: `<span class="pf2-icon">3</span>`,
    label: "Three Actions",
    callback: () => {
        threeActionHeal()
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
        rollFormula = spellNumeral + healingDie + `+`+ healBonus
    }else if(actionsUsed == 2 && healBonus != 0){
        rollFormula = spellNumeral + healingDie + `+` + spellNumeral*8 + `+`+ healBonus
    }else if(actionsUsed == 2 && healBonus == 0){
        rollFormula = spellNumeral + healingDie + `+` + spellNumeral*8
    }else{console.log(`Error in rollTheDice function!`);}    
    console.log(`Roll formula: ` + rollFormula);
    ui.chat.processMessage(`/r `+rollFormula+` #`+actionsUsed+` action Heal at `+selectedSpellLevel+` targeting `+spellTargetName)
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

let healLevel = new Dialog({
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

function oneActionHeal(){
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
            oneActionHealAnimation()
            actionsUsed = 1;
        }else{
            console.log(`Too far to touch!`); 
            ui.notifications.error(`Your target is further than touch distance away! Try again.`);
            return;
        }
        spellTargetName = spellTarget.name
        healLevel.render(true)
}

function twoActionHeal(){
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
        twoActionHealAnimation()
        actionsUsed = 2;
    }else{
        console.log(`Farther than 30 feet!`); 
        ui.notifications.error(`Your target is further than 30 feet away! Try again.`);
        return;
    }
    spellTargetName = spellTarget.name
    healLevel.render(true)
}

function threeActionHeal(){
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
            .file(healingAreaAnim)
            .waitUntilFinished(-1500)
        .play()
    for(let i=0;i<undeadTokensInRange.length;i++){
        new Sequence("Damage Undead")
            .effect()
                .atLocation(undeadTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file(healingDamageAnim)
            .play()
    }
    for(let i=0;i<livingTokensInRange.length;i++){
        new Sequence("Heal living")
            .effect()
                .atLocation(livingTokensInRange[i])
                .randomRotation()
                .scaleToObject(1.25)
                .file(healingSingleAnim)
            .play()
    }
    healLevel.render(true)
}

//Defining animations for each kind of effect
    function oneActionHealAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
        //trigger energy strand from caster to target, then trigger damaging burst on target
        new Sequence("Damage undead")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file(healingDamageAnim)
            .play()
        }else{
        //trigger energy strand from caster to target, then trigger healing burst on target
        new Sequence("Heal living")
            .effect()
                .atLocation(spellTarget)
                .randomRotation()
                .scaleToObject(1.25)
                .file(healingSingleAnim)
            .play()
        }
    }
    function twoActionHealAnimation(){
        if(Array.from(spellTarget.actor.traits).includes(`undead`)){
            //trigger energy strand from caster to target, then trigger healing burst on target
            new Sequence("Damage undead")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file(healingStrandAnim)
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file(healingDamageAnim)
                .play()
        }else{
            //trigger energy strand from caster to target, then trigger damaging burst on target
            new Sequence("Heal living")    
                .effect()
                    .atLocation(caster)
                    .stretchTo(spellTarget)
                    .file(healingStrandAnim)
                    .waitUntilFinished(-1000)
                .effect()
                    .atLocation(spellTarget)
                    .randomRotation()
                    .scaleToObject(1.25)
                    .file(healingSingleAnim)
                .play()
        }
    }

function CheckFeat(slug) {
    if (caster.actor.itemTypes.feat.find((i) => i.slug === slug)) {
        return true;
    }
    return false;
    }

function CheckItem(slug) {
    if (caster.actor.inventory.find((i) => i.data.name === slug)) {
        return true;
    }
    return false;
    }

main()
