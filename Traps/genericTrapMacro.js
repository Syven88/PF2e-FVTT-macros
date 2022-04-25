/*Trap Macro
This macro should be changed to suit the trap you want to represent, but as a sample it currently shows the Hidden Pit hazard on page 522 of the CRB
Required modules: Monk's Active Tiles, JB2A and Sequencer (if you want animations)

Tile Settings:
    All settings: default
    Actions:
        Stop token movement
            Snap to grid: yes
        Open an actor sheet
            Select the actor sheet of the trap, for your reference
            Show To: GM only
        Run Macro
            Select this macro
            Run as: GM
        Pause Game
        Request Saving Throw
            Select Entity: Triggering token
            Request: saving throw as appropriate
            DC: as appropriate
            Flavor text: Whatever you want to show to the players as they make their saving throw
            Bypass Dialog: Yes, if you want
        Activate/Deactivate (note that this only activates after the player makes the saving throw)
            Select Entity: This tile
            State: Deactivate        
*/



let alertText = "A groaning creak splits the air as the floor beneath " + token.name + " gives way!" //text you want to post to chat to tell the players what's going on
let animationBool = false //whether you want an animation to play or not
let animationPath = `` //database path of the animation
let GMID = [""] //find your GM id by typing "game.userID" in the console, and paste that within the quotes and brackets

ChatMessage.create({ content: alertText, user: GMID})

if(animationBool){
new Sequence()
    .effect()
        .delay(1000)
        .file(animationPath)
        .atLocation(token)
        .scaleToObject(1)
    .play()
}
