/* Hazard detection
This macro is set to work with the Hidden Pit hazard on page 522 of the CRB, but it is intended to be changed to suit your hazard
Note that the macro will only trigger if the token has the "Search" effect active from the PF2E exploration effects module. This way, tokens that aren't searching don't get a chance to spot the hazard.

Required Macros: Monk's Active Tiles, PF2E exploration effects

Tile Settings:
    History: on
    When: on enter
    Once per token: yes

Actions
    Run Macro
        Choose this macro
        Run as: GM
*/


let hazardDesc = `The wooden surface ahead of you has a faint seam that suggests the section swings open.` //text you want to whisper to the player if they succeed their perception check
let DC = 18 //perception DC to spot the hazard
let hazardName = `Hidden Pit` //Name of the hazard
let GMID = []
Array.from(game.users).filter(n => n.role == 4).forEach(user => GMID.push(user.id))
let profReq = 0 //the required proficiency level to spot the hazard
/*profReq - Proficiency Requirement
    untrained = 0
    trained = 1
    expert = 2
    master = 3
    legendary = 4*/

perceptionCheck()

// console.log(`Search exists: `+Array.from(token.actor.items).filter(n => n.name == "Search").length);
// let effectlist = JSON.stringify(Array.from(token.actor.items).filter(n => n.type == "effect"))
// console.log(`Effects active: ` + effectlist);

async function perceptionCheck(){
        if(Array.from(token.actor.items).filter(n => n.name == "Search" && n.type == "effect").length == 1 && token.actor.attributes.perception.rank >= profReq){
            let spotCheck = new Roll(`1d20 + ${token.actor.data.data.attributes.perception.value}`)
            await spotCheck.evaluate()
            console.log(spotCheck.total);   
            if(spotCheck.total >= DC){
                game.togglePause(true, true)
                let tokenUser = Object.entries(_token.actor.data.permission).filter(p=>p[1]===3).map(p=>p[0])
                console.log(tokenUser)
	            ChatMessage.create({ content: `You peer ahead of you and spot something odd.\n`+ hazardDesc, user: [Array.from(game.users)[0].id], whisper:tokenUser})
            }else{
                ChatMessage.create({content: token.name + ` failed their perception check to spot the ` + hazardName + `.`, whisper: GMID})
                return
            }
        }
    }


