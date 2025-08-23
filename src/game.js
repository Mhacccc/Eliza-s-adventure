import k from "./kaplayCtx";
import loadSprites from "../public/loadSprites.js";

loadSprites();

k.add([
    k.sprite("scene1"),
    k.anchor("center"),
    k.pos(k.center()),
    k.scale(3)
])

const SPEED = 300;

const player = k.add([
    k.sprite("eliza", { anim: "idle-down" }),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(4),
    k.area(),
    k.body(),
    
    { speed: SPEED }
]);



let lastDir = "down";




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


export default k.go("game");
