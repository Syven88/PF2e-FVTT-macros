/* Trap detection
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


let trapDesc = `The wooden surface ahead of you has a faint seam that suggests the section swings open.` //text you want to whisper to the player if they succeed their perception check
let DC = 18 //perception DC to spot the hazard
let trapName = `Hidden Pit` //Name of the haunt
let profReq = 0 //the required proficiency level to spot the haunt
/*profReq - Proficiency Requirement
    untrained = 0
    trained = 1
    expert = 2
    master = 3
    legendary = 4*/

perceptionCheck()

async function perceptionCheck(){
        if(Array.from(token.actor.items).filter(n => n.name == "Search").length == 1 && token.actor.attributes.perception.rank >= profReq){
            let spotCheck = new Roll(`1d20 + ${token.actor.data.data.attributes.perception.value}`)
            await spotCheck.evaluate()
            console.log(spotCheck.total);   
            if(spotCheck.total >= DC){
                game.togglePause(true, true)
                let tokenUser = Object.entries(_token.actor.data.permission).filter(p=>p[1]===3).map(p=>p[0])
                console.log(tokenUser)
	            ChatMessage.create({ content: `You peer ahead of you and spot something odd.\n`+ trapDesc, user: "lBYzWiB1X8BBUOP6", whisper:tokenUser})
            }else{
                ChatMessage.create({content: token.name + ` failed their perception check to spot the ` + trapName + `.`, whisper: [Array.from(game.users)[0].id]})
                return
            }
        }
    }