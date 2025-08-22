import kaplay from "kaplay";

const k = kaplay({

    background: [10,22,35],
    touchToMouse:true,
    global:false,
    pixelDensity: 2,
    debug: true,
    canvas:document.getElementById('game'),

})

export default k;