let caster = canvas.tokens.controlled[0]
let spellTarget = Array.from(game.user.targets)[0]

new Sequence()
    .effect()
        .file("modules/jb2a_patreon/Library/Generic/Marker/EnergyStrands_01_Regular_Purple_600x600.webm")
        .atLocation(spellTarget)
        .scale(.33)
        .fadeIn(500)
        .fadeOut(500)
    .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01")
        .atLocation(spellTarget)
        .stretchTo(caster)
    .play()