import k from "../src/kaplayCtx";
        
export default function loadSprites(){
    k.loadSprite("eliza","./assets/char_8-direction.png",{
            sliceX:8,
            sliceY:12,
            anims:{
                "idle-down": 52,
                "idle-up": 48,
                "idle-left": 54,
                "idle-right": 50,
                "idle-top-left": 55,
                "idle-top-right": 49,
                "idle-bottom-left": 53,
                "idle-bottom-right": 51,
                "walk-down": {frames: [44,60],speed: 8,loop: true},
                "walk-up": {frames: [40,56],speed: 8,loop: true},
                "walk-left": {frames: [46,62],speed: 8,loop: true},
                "walk-right": {frames: [42,58],speed: 8,loop: true},
                "walk-top-right": {frames: [41,57],speed: 8,loop: true},
                "walk-top-left": {frames: [47,63],speed: 8,loop: true},
                "walk-bottom-right": {frames: [43,59],speed: 8,loop: true},
                "walk-bottom-left": {frames: [45,61],speed: 8,loop: true},
            }
        })
    k.loadSprite("poetry","./assets/POETRY.png")
    k.loadSprite("scene1","./assets/scene1-map.png");
    k.loadSprite("scene2","./assets/scene2-map.png");
    k.loadSprite("right-scene","./assets/right-scene.png");
    k.loadSprite("final-scene","./assets/final-scene.png")
    k.loadSprite("scene2-walkthrough","./assets/scene2-walk-through.png");
    k.loadSprite("right-scene-upmost","./assets/right-scene-upmost.png");
    k.loadSprite("gate","./assets/gate.png",{
        sliceX:8,
        anims:{
            "gate-close":0,
            "gate-open":{
                from: 0,
                to:4,
            },
            "gate-idle-open":4
        }
    })
    k.loadSprite("door-final","./assets/door-final.png",{
        sliceX:5,
        anims:{
            "door-final-locked": 0,
            "door-final-open":{
                from:0,
                to:4,
            },
            "door-idle-open":4,

        }
    })
}