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



async function makeTile(){

    try{
        const mapData = await(await fetch("assets/map.json")).json();
        const layers = mapData.layers

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

            if(layer.name==="door"){
                const obj = layer.objects[0];
                map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0),obj.width, obj.height)
                        }),
                        k.pos(obj.x, obj.y),
                        obj.name
                ])
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
// show
setTimeout(() => {
  window.showDialog([
    "You wake up in the middle of the night, your head heavy and your thoughts unclear.",
    "The place looks like a hotel lobby, but it feels wrong—too quiet, too empty.",
    "You don’t remember coming here.",
    "Across the room, a single door waits. Something inside you says you have to leave… now."
  ]);
}, 500);


// example with your collisions:
const doorLocked = player.onCollide("door", () => {
  if (key === 1) {
    window.showDialog("Door unlocked!!! Click the door to enter");
    doorLocked.cancel();
  } else {
    window.showDialog("The door is locked. You need to find the key.");
  }
});





const keyFound = player.onCollide("key", () => {
  window.showDialog("YOU FOUND A KEY LYING ON THE FLOOR!!!!! Maybe it opens the door.");
  key = 1;
  keyFound.cancel(); // recommended so it can't retrigger
});

k.onClick("door",()=>{
    if(key>0){
        k.go("scene-2")
    }
    
})

    }catch(error){
        console.error(error)
    }

}






let lastDir = "down";

// Mouse click movement
function makeMouseControll(){

  return k.onMouseDown((btn) => {
  if (btn !== "left" || player.isInDialogue) return;

  const worldMousePos = k.toWorld(k.mousePos());
  player.moveTo(worldMousePos, player.speed);

  // Compute angle from player -> mouse in degrees (-180..180]
  const dx = worldMousePos.x - player.pos.x;
  const dy = worldMousePos.y - player.pos.y;
  const deg = Math.atan2(dy, dx) * 180 / Math.PI;

  // 8-way sectors (22.5° each side of the cardinals)
  if (deg > -22.5 && deg <= 22.5) {
    playDir("walk-right", "right");
  } else if (deg > 22.5 && deg <= 67.5) {
    playDir("walk-bottom-right", "bottom-right");
  } else if (deg > 67.5 && deg <= 112.5) {
    playDir("walk-down", "down");
  } else if (deg > 112.5 && deg <= 157.5) {
    playDir("walk-bottom-left", "bottom-left");
  } else if (deg > 157.5 || deg <= -157.5) {
    playDir("walk-left", "left");
  } else if (deg > -157.5 && deg <= -112.5) {
    playDir("walk-top-left", "top-left");
  } else if (deg > -112.5 && deg <= -67.5) {
    playDir("walk-up", "up");
  } else if (deg > -67.5 && deg <= -22.5) {
    playDir("walk-top-right", "top-right");
  }

  function playDir(anim, dir) {
    if (player.getCurAnim()?.name !== anim) player.play(anim);
    lastDir = dir
  }
});
}

makeMouseControll()


player.onUpdate(() => {
    const dir = k.vec2(0, 0);

    

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

    // ---- Idle states ----
k.onKeyRelease(() => {
    if (k.isKeyDown("w") || k.isKeyDown("a") || k.isKeyDown("s") || k.isKeyDown("d")) {
        return; // still moving, do nothing
    }
    idleDir();
});

k.onMouseRelease(()=>{
    idleDir();
})

function idleDir(){
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
}


    
});



k.scene("scene-2",async ()=>{
  await k.wait(1)
      const map2 = k.add([
            k.sprite("scene2"),
            k.scale(3),
            k.pos(0),
      ])
      


    const mapData= await (await fetch("assets/scene2-map.json")).json();
    const layers = mapData.layers

    for(const layer of layers){
      if(layer.name==="boundaries"){
        for(const boundary of layer.objects){
            map2.add([
              k.area({
                shape: new k.Rect(k.vec2(0),boundary.width,boundary.height)
              }),
              k.pos(boundary.x,boundary.y),
              k.body({isStatic: true}),
              boundary.name
            ])
        }
      }
      if(layer.name === "spawnpoint"){
        const spawnpoint = layer.objects[0];
        player.pos = k.vec2((map2.pos.x + spawnpoint.x)*3, (map2.pos.y + spawnpoint.y)*3)
        k.add(player)
        await k.loop(0.1,()=>{
            player.move(0,-player.speed)
            if (player.getCurAnim()?.name !== "walk-up")player.play("walk-up") 
        },8)  
        player.play("idle-up")
        
      }


    }
    player.onCollide("right-gate",()=>{
      k.go("right-scene")
    })
    
      


  
  makeMouseControll()
  

    k.add([
            k.sprite("scene2-walkthrough"),
            k.scale(3),
            k.pos(0),
      ])
  
      

})

k.scene("right-scene",async()=>{
  await k.wait(1.5)
        const rightMap = k.add([
            k.sprite("right-scene"),
            k.scale(3),
            k.pos(0),
      ])

    const mapData= await (await fetch("assets/right-scene.json")).json();
    const layers = mapData.layers
    for (const layer of layers) {
      if (layer.name === "boundaries") {
        for (const boundary of layer.objects) {
          rightMap.add([
            k.area({
              shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
            }),
            k.pos(boundary.x, boundary.y),
            k.body({ isStatic: true }),
            boundary.name
          ]);
        }
      }
      if (layer.name === "spawnpoint") {
        const spawnpoint = layer.objects[0];
        player.pos = k.vec2((rightMap.pos.x + spawnpoint.x) * 3, (rightMap.pos.y + spawnpoint.y) * 3);
        k.add(player);
        await k.loop(0.1, () => {
          player.move(player.speed, 0);
          if (player.getCurAnim()?.name !== "walk-right") player.play("walk-right");
        }, 8);
        player.play("idle-right");
      }
    }

        k.add([
            k.sprite("right-scene-upmost"),
            k.scale(3),
            k.pos(0),
      ])

      player.onCollide("deadman",()=>{
       
          window.showDialog("Please, Help me!!!");

      })
      player.onCollide("Password",()=>{
          
  
          window.showDialog("Enter PassWord")
          


          
      })
      
      makeMouseControll()

})

makeTile()


export default k;
