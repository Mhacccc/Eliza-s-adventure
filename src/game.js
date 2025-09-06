import k from "./kaplayCtx";
import loadSprites from "../public/loadSprites.js";
import { area } from "motion/react-client";




loadSprites();

let key = 0;
let gateKey = 1;
let finalDoorKey = 0;
let isGateOpen = false;
let isGateRemoved = false;
let isDoorRemoved = false;


const map = k.add([
    k.sprite("scene1"),
    k.pos(0),
    k.scale(3)
    
])

const SPEED = 300;

function createPlayer() {
    const newPlayer = k.make([
        k.sprite("eliza", { anim: "idle-down" }),
        k.pos(),
        k.anchor("center"),
        k.scale(4),
        k.area({
            shape: new k.Rect(k.vec2(0,3),12,17)
        }),
        k.body(),
        k.z(10),
        k.offscreen(),
        { speed: SPEED }
    ]);

    // Add player update behavior
    newPlayer.onUpdate(() => {
        const dir = k.vec2(0, 0);

        if (k.isKeyDown("w")) dir.y = -1;
        if (k.isKeyDown("s")) dir.y = 1;
        if (k.isKeyDown("a")) dir.x = -1;
        if (k.isKeyDown("d")) dir.x = 1;

        if (dir.x !== 0 || dir.y !== 0) {
            const unit = dir.unit().scale(newPlayer.speed);
            newPlayer.move(unit);

            // ---- Animations for 8-way ----
            if (dir.x < 0 && dir.y < 0) { if (newPlayer.getCurAnim()?.name !== "walk-top-left") newPlayer.play("walk-top-left"); lastDir = "top-left"; }
            else if (dir.x > 0 && dir.y < 0) { if (newPlayer.getCurAnim()?.name !== "walk-top-right") newPlayer.play("walk-top-right"); lastDir = "top-right"; }
            else if (dir.x < 0 && dir.y > 0) { if (newPlayer.getCurAnim()?.name !== "walk-bottom-left") newPlayer.play("walk-bottom-left"); lastDir = "bottom-left"; }
            else if (dir.x > 0 && dir.y > 0) { if (newPlayer.getCurAnim()?.name !== "walk-bottom-right") newPlayer.play("walk-bottom-right"); lastDir = "bottom-right"; }
            else if (dir.x < 0) { if (newPlayer.getCurAnim()?.name !== "walk-left") newPlayer.play("walk-left"); lastDir = "left"; }
            else if (dir.x > 0) { if (newPlayer.getCurAnim()?.name !== "walk-right") newPlayer.play("walk-right"); lastDir = "right"; }
            else if (dir.y < 0) { if (newPlayer.getCurAnim()?.name !== "walk-up") newPlayer.play("walk-up"); lastDir = "up"; }
            else if (dir.y > 0) { if (newPlayer.getCurAnim()?.name !== "walk-down") newPlayer.play("walk-down"); lastDir = "down"; }
        }
        
        k.setCamPos(newPlayer.pos);
    });

    // Add key release behavior for idle animations
    k.onKeyRelease(() => {
        if (k.isKeyDown("w") || k.isKeyDown("a") || k.isKeyDown("s") || k.isKeyDown("d")) {
            return; // still moving, do nothing
        }
        switch (lastDir) {
            case "up": newPlayer.play("idle-up"); break;
            case "down": newPlayer.play("idle-down"); break;
            case "left": newPlayer.play("idle-left"); break;
            case "right": newPlayer.play("idle-right"); break;
            case "top-left": newPlayer.play("idle-top-left"); break;
            case "top-right": newPlayer.play("idle-top-right"); break;
            case "bottom-left": newPlayer.play("idle-bottom-left"); break;
            case "bottom-right": newPlayer.play("idle-bottom-right"); break;
        }
    });

    // Add mouse movement behavior
    k.onMouseDown((btn) => {
        if (btn !== "left" || window.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        newPlayer.moveTo(worldMousePos, newPlayer.speed);

        // Compute angle from player -> mouse in degrees (-180..180]
        const dx = worldMousePos.x - newPlayer.pos.x;
        const dy = worldMousePos.y - newPlayer.pos.y;
        const deg = Math.atan2(dy, dx) * 180 / Math.PI;

        // 8-way sectors (22.5° each side of the cardinals)
        if (deg > -22.5 && deg <= 22.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-right") newPlayer.play("walk-right");
            lastDir = "right";
        } else if (deg > 22.5 && deg <= 67.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-bottom-right") newPlayer.play("walk-bottom-right");
            lastDir = "bottom-right";
        } else if (deg > 67.5 && deg <= 112.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-down") newPlayer.play("walk-down");
            lastDir = "down";
        } else if (deg > 112.5 && deg <= 157.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-bottom-left") newPlayer.play("walk-bottom-left");
            lastDir = "bottom-left";
        } else if (deg > 157.5 || deg <= -157.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-left") newPlayer.play("walk-left");
            lastDir = "left";
        } else if (deg > -157.5 && deg <= -112.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-top-left") newPlayer.play("walk-top-left");
            lastDir = "top-left";
        } else if (deg > -112.5 && deg <= -67.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-up") newPlayer.play("walk-up");
            lastDir = "up";
        } else if (deg > -67.5 && deg <= -22.5) {
            if (newPlayer.getCurAnim()?.name !== "walk-top-right") newPlayer.play("walk-top-right");
            lastDir = "top-right";
        }
    });

    // Add mouse release behavior for idle animations
    k.onMouseRelease(() => {
        switch (lastDir) {
            case "up": newPlayer.play("idle-up"); break;
            case "down": newPlayer.play("idle-down"); break;
            case "left": newPlayer.play("idle-left"); break;
            case "right": newPlayer.play("idle-right"); break;
            case "top-left": newPlayer.play("idle-top-left"); break;
            case "top-right": newPlayer.play("idle-top-right"); break;
            case "bottom-left": newPlayer.play("idle-bottom-left"); break;
            case "bottom-right": newPlayer.play("idle-bottom-right"); break;
        }
    });

    return newPlayer;
}

let player = createPlayer();



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



k.scene("scene-2",async (spawns="spawnpoint",idleSpawn="idle-up")=>{
    // Create container for better rendering performance
    const container = k.add([k.pos(0), k.z(0)]);

    const mapData= await (await fetch("assets/scene2-map.json")).json();
    const layers = mapData.layers;

    // Add base map to container
    const map2 = container.add([
            k.sprite("scene2"),
            k.scale(3),
            k.pos(0)
    ]);

    const doorFinal = map2.add([
        k.sprite("door-final",{
          frame: !isDoorRemoved?0:4
        }),
        k.pos(k.vec2(400,128))
      ])
      
    for(const layer of layers){
      if(layer.name==="boundaries"){
        // Batch add boundaries
        const boundaries = layer.objects.map(boundary => ({
          area: {
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
          },
          pos: k.vec2(boundary.x, boundary.y),
          body: { isStatic: true },
          id: boundary.name
        }));

        boundaries.forEach(b => {

          if(isDoorRemoved){
            if(b.id==="door-final"){
              console.log(b.id)
              return;
            }
          }
          map2.add([
            k.area(b.area),
            k.pos(b.pos),
            k.body(b.body),
            b.id
          ]);
        });
      }

     

      
      if(layer.name === spawns){
        const spawnpoint = layer.objects[0];
        
        // Create new player instance for this scene
        player.destroy();
        player = createPlayer();
        
        player.pos = k.vec2((map2.pos.x + spawnpoint.x)*3, (map2.pos.y + spawnpoint.y)*3);
        
        // Cache movement parameters
        const movement = {
          "spawnpoint": { x: 0, y: -player.speed, anim: "walk-up" },
          "right-spawnpoint": { x: -player.speed, y: 0, anim: "walk-left" },
          "left-spawnpoint": { x: player.speed, y: 0, anim: "walk-right" }
        }[spawns];

        k.add(player);
        
        // More efficient movement loop
         await k.loop(0.1, () => {
          player.move(movement.x, movement.y);
          if (player.getCurAnim()?.name !== movement.anim) {
            player.play(movement.anim);
          }
        }, 8);
        
        player.play(idleSpawn);
      }
    }

    player.onCollide("right-gate", () => {
      k.go("right-scene");
    });

    // Add walkthrough layer last to ensure proper z-indexing
    k.add([
            k.sprite("scene2-walkthrough"),
            k.scale(3),
            k.pos(0),
            k.z(20)
    ]);
  
    player.onCollide("door-final",async ()=>{

        if(finalDoorKey>0){
          doorFinal.play("door-final-open")
          await k.wait(0.5)
          map2.get("door-final")[0].paused = true
          isDoorRemoved = true
        }else{
          window.showDialog(["The door is locked.", "Find the key."])
        }

        
    })

})

k.scene("right-scene",async()=>{
  

    const mapData= await (await fetch("assets/right-scene.json")).json();
    const layers = mapData.layers
    const rightMap = k.add([
            k.sprite("right-scene"),
            k.scale(3),
            k.pos(0),

      ])
    const gate = rightMap.add([
            k.sprite("gate",{
              frame: !isGateOpen?0:4
            }),
            k.pos(320,112),
            "gate"
            
      ])   
 
 
    for (const layer of layers) {
      if (layer.name === "boundaries") {
        // Batch add boundaries
        const boundaries = layer.objects.map(boundary => ({
          area: {
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
          },
          pos: k.vec2(boundary.x, boundary.y),
          body: { isStatic: true },
          id: boundary.name
        }));

        boundaries.forEach(b => {
          rightMap.add([
            k.area(b.area),
            k.pos(b.pos),
            k.body(b.body),
            b.id
          ]);
        });
      }

      if (layer.name === "spawnpoint") {
        const spawnpoint = layer.objects[0];
        
        // Create new player instance for this scene
        player.destroy();
        player = createPlayer();
        
        player.pos = k.vec2((rightMap.pos.x + spawnpoint.x) * 3, (rightMap.pos.y + spawnpoint.y) * 3);
        k.add(player);

        let movementSteps = 0;
        player.play("walk-right");
        
        // Start movement loop without await
        k.loop(0.1, () => {
          player.move(player.speed, 0);
          if (player.getCurAnim()?.name !== "walk-right") {
            player.play("walk-right");
          }
          
          movementSteps++;
          if (movementSteps >= 8) {
            player.play("idle-right");
          }
        },8);
      }
    }
    
    if(isGateRemoved){
      rightMap.get("gate-locked")[0].destroy();
    }

        k.add([
            k.sprite("right-scene-upmost"),
            k.scale(3),
            k.pos(0),
            k.z(20)
      ])

      player.onCollide("deadman",()=>{
       
          window.showDialog("Please, Help me!!!");

      })
      player.onCollide("Password",()=>{
          
        
          window.showDialog(["This is a small vault...","The vault has password.",
                              "And There's a little hint.","It says...",
                              `When did you fall in love with mhac?`])

          k.onUpdate("Password",(password)=>{
            
            if(!isInDialogue){
              const pass = prompt("Use this format:    mm/dd/yy")
              if(pass==="12/16/22"||pass==="12/16/2022"){
              window.showDialog(["You got the key!!!","The key to final door."])
              finalDoorKey++
              k.destroy(password)
              }else{
                window.showDialog("Wrong password")
              }
              
            }
          })

         
                
      })

      player.onCollide("gate-locked",async()=>{
        if(gateKey === 0){
          window.showDialog("The gate is locked! You need to find the key")
          return;
        }
        gate.play("gate-open")
        await k.wait(0.3)
        rightMap.get("gate-locked")[0].destroy()
        isGateOpen = true;
        isGateRemoved = true;
      })
    


      player.onCollide("scene-2-right",()=>{
        k.go("scene-2","right-spawnpoint","idle-left")
      })
})

makeTile()



export default k;
