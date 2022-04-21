let caster = canvas.tokens.controlled[0]

new Sequence("Bane")
    .effect()
        .file("jb2a.bless.400px.intro.purple")
        .atLocation(caster)
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.bless.400px.loop.purple")
        .atLocation(caster)
        .persist() //ensures the animation continues to loop rather than fading away
        .attachTo(caster) //ensures the animation will move with the caster
        .belowTokens(true) //ensures the animation will not obscure any tokens
        .origin("BaneAnim") //adds a tag to the animation for reference by the increment macro
        .name("Bane") //adds a name so it can be easily identified in the effects manager
        .size(4, {gridUnits:true}) //sets the size to be 4 squares in diameter; the origin square, the squares on either side, and another for half a square's overlap on either side
    .play()