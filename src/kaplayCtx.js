import kaplay from "kaplay";

const k = kaplay({

    background: [202, 191, 171],
    width: 1920,
    height: 1080,
    letterbox: true,
    touchToMouse:true,
    global:false,
    pixelDensity: 2,
    debug: true,
    canvas:document.getElementById('game'),

})

export default k;