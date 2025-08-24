import k from "./kaplayCtx";
import loadSprites from "../public/loadSprites.js";

loadSprites();

let key = 0;

const map = k.add([
    k.sprite("scene1"),
    k.pos(0),
    k.scale(3)
    
])

const SPEED = 300;

const player = k.make([
    k.sprite("eliza", { anim: "idle-down" }),
    k.pos(),
    k.anchor("center"),
    k.scale(4),
    k.area({
        shape: new k.Rect(k.vec2(0,3),12,17)
    }),
    k.body(),
    
    { speed: SPEED }
]);

player.move()


async function makeTile(){

    try{
        const mapData = await(await fetch("assets/map.json")).json();
        const layers = mapData.layers

        console.log(layers)
        for(const layer of layers){
            if(layer.name === "boundaries"){
                for(const obj of layer.objects){
                    map.add([
                        
                        k.area({
                            shape: new k.Rect(k.vec2(0),obj.width, obj.height)
                        }),
                        k.body({ isStatic: true }),
                        k.pos(obj.x, obj.y),
                        obj.name
                    ])
                }
                 continue;
            }
            if(layer.name === "key"){
                const keyObj = layer.objects[0];
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0),keyObj.width, keyObj.height)
                    }),
                    k.pos(keyObj.x, keyObj.y),
                    keyObj.name
                ])
            }

            if (layer.name === "spawnpoint") {
            for (const entity of layer.objects) {
                if (entity.name === "spawnpoint") {

                player.pos = k.vec2(
                    (map.pos.x + entity.x)*3,
                    (map.pos.y + entity.y)*3
                );


                k.add(player);
                continue;
        }
      }
    }
        }
 
        const keyFound = player.onCollide("key",()=>{
            k.debug.log("You found the key!!!");
            key = 1;
            keyFound.cancel();
        })
    

    


    }catch(error){
        console.error(error)
    }

}

makeTile()



let lastDir = "down";


player.onUpdate(() => {
    const dir = k.vec2(0, 0);

    k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left") return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, 1);
    })
    

    if (k.isKeyDown("w")) dir.y = -1;
    if (k.isKeyDown("s")) dir.y = 1;
    if (k.isKeyDown("a")) dir.x = -1;
    if (k.isKeyDown("d")) dir.x = 1;

    if (dir.x !== 0 || dir.y !== 0) {
        const unit = dir.unit().scale(player.speed);
        player.move(unit);

        // ---- Animations for 8-way ----
        if (dir.x < 0 && dir.y < 0) { if (player.getCurAnim()?.name !== "walk-top-left")player.play("walk-top-left"); lastDir = "top-left"; }
        else if (dir.x > 0 && dir.y < 0) { if (player.getCurAnim()?.name !== "walk-top-right")player.play("walk-top-right"); lastDir = "top-right"; }
        else if (dir.x < 0 && dir.y > 0) { if (player.getCurAnim()?.name !== "walk-bottom-left")player.play("walk-bottom-left"); lastDir = "bottom-left"; }
        else if (dir.x > 0 && dir.y > 0) { if (player.getCurAnim()?.name !== "walk-bottom-right")player.play("walk-bottom-right"); lastDir = "bottom-right"; }
        else if (dir.x < 0) { if (player.getCurAnim()?.name !== "walk-left")player.play("walk-left"); lastDir = "left"; }
        else if (dir.x > 0) { if (player.getCurAnim()?.name !== "walk-right")player.play("walk-right"); lastDir = "right"; }
        else if (dir.y < 0) { if (player.getCurAnim()?.name !== "walk-up")player.play("walk-up"); lastDir = "up"; }
        else if (dir.y > 0) { if (player.getCurAnim()?.name !== "walk-down")player.play("walk-down"); lastDir = "down"; }
    }
    
    k.setCamPos(player.pos)

    
});

// ---- Idle states ----
k.onKeyRelease(() => {
    if (k.isKeyDown("w") || k.isKeyDown("a") || k.isKeyDown("s") || k.isKeyDown("d")) {
        return; // still moving, do nothing
    }
    switch (lastDir) {
        case "up": player.play("idle-up"); break;
        case "down": player.play("idle-down"); break;
        case "left": player.play("idle-left"); break;
        case "right": player.play("idle-right"); break;
        case "top-left": player.play("idle-top-left"); break;
        case "top-right": player.play("idle-top-right"); break;
        case "bottom-left": player.play("idle-bottom-left"); break;
        case "bottom-right": player.play("idle-bottom-right"); break;
    }
});


export default k;
