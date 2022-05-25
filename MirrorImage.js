//This macro will prompt the user to set the number of images granted by mirror image. The intent is that the caster will adjust the number of images as they are destroyed.
//Required modules: Token Magic FX

//Error Checking for selected token.
if (canvas.tokens.controlled.length == 0){
    ui.notifications.error(`Please select a token.`);
    return;
}else if(canvas.tokens.controlled.length > 1){
    ui.notifications.error(`Please select only one token.`)
    return;
}

//Dialong that prompts the number of images desired.
let d = new Dialog({
    title: "Mirror Image",
    content: "<p>What would you like to do?</p>",
    buttons: {
    one: {
        label: "Set three images",
        callback: () => {
            mirrorImage(4)
            }
    },
    two: {
        label: "Set two images",
        callback: () => {
            mirrorImage(3)
            }
    },
    three:{
        label: "Set one image",
        callback: () => {
            mirrorImage(2)
            }
    },
    four:{
        icon: `<span class="fas fa-times"></span>`,
        label: "Set zero images",
        callback: () => {
            removeEffects()
            }
    }
    },
    default: "Set zero images"
}).render(true)

//Function that applies the number of images specified in the dialog.
async function mirrorImage(numberOfEntities){
    let params =
[{
    filterType: "images",
    filterId: "myMirrorImages",
    time: 0,
    nbImage: numberOfEntities,
    alphaImg: 1.0,
    alphaChr: 0.0,
    blend: 2,
    ampX: 0.2,
    ampY: 0.2,
    zOrder: 20,
    animated :
    {
      time: 
      { 
        active: true, 
        speed: 0.0005, 
        animType: "move" 
      }
    }
}];

await TokenMagic.addUpdateFiltersOnSelected(params);
}

//Removes all images and resets the token to normal.
async function removeEffects(){
    await TokenMagic.deleteFiltersOnSelected("myMirrorImages");
}