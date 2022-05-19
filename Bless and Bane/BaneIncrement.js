let caster = canvas.tokens.controlled[0]
let baneAnim = Sequencer.EffectManager.getEffects({origin:"baneAnim",source:caster})[0] //locates the bane animation created by bane_Animation
let incrementValue = 3; //3 is the value for radius = 1 square

main()

function main(){  
//checks to ensure a single token is selected
  if (canvas.tokens.controlled.length == 0){
  ui.notifications.error("Select the token on which a bane effect is active.")
  return
}else if (canvas.tokens.controlled.length > 1){
  ui.notifications.error("Select only one token with bless active.")
  return
} 

//checks to make sure bane is active on the selected token
if (Sequencer.EffectManager.getEffects({origin:"baneAnim",source:caster})[0] === undefined){
  ui.notifications.error("There are no instances of the bane effect active on this token.")
  return
}

//increments the radius of the effect by 1 square
baneAnim.update({ 
    size: {
      width: baneAnim.data.size.width + incrementValue,
      height: baneAnim.data.size.height + incrementValue,
      gridUnits: true
    }
  })}
