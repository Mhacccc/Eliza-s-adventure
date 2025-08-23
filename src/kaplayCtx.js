import kaplay from "kaplay";

const k = kaplay({

    background: [0,0,0],
    touchToMouse:true,
    global:false,
    pixelDensity: devicePixelRatio,
    debug: true,
    canvas:document.getElementById('game'),

})



export default k;