let caster = canvas.tokens.controlled[0]
let blessAnim = Sequencer.EffectManager.getEffects({origin:"blessAnim",source:caster})[0] //locates the bless animation created by Bless_Animation
let incrementValue = 3; //3 is the value for radius = 1 square

main()

function main(){  
//checks to ensure a single token is selected
  if (canvas.tokens.controlled.length == 0){
  ui.notifications.error("Select the token on which a bless effect is active.")
  return
}else if(canvas.tokens.controlled.length > 1){
  ui.notifications.error("Select only one token.")
  return
}

//checks to make sure bless is active on the selected token
if (Sequencer.EffectManager.getEffects({origin:"blessAnim",source:caster})[0] === undefined){
  ui.notifications.error(`There are no instances of the bless effect active on this token.`)
  return
}

//increments the radius of the effect by 1 square
blessAnim.update({ 
    size: {
      width: blessAnim.data.size.width + incrementValue,
      height: blessAnim.data.size.height + incrementValue,
      gridUnits: true
    }
  })}
