import k from "../src/kaplayCtx";
        
export default function loadSprites(){
    k.loadSprite("eliza","/public/assets/char_8-direction.png",{
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
    k.loadSprite("scene1","/public/assets/scene1-map.png")

}