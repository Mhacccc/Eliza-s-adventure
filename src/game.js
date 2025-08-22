import k from "./kaplayCtx";
import loadSprites from "../public/loadSprites.js";

const SPEED = 300;

loadSprites();

k.scene("game", () => {
    const player = k.add([
        k.sprite("eliza", { anim: "idle-down" }),
        k.pos(k.center()),
        k.scale(4),
        k.anchor("center"),
        k.area(),
        k.body(),
    ]);

    let lastDir = "down"; // default facing direction

    // ---- Movement + Diagonals ----
    k.onUpdate(() => {
        if (k.isKeyDown("w") && k.isKeyDown("a")) {
            player.move(-SPEED, -SPEED);
            if (player.getCurAnim()?.name !== "walk-top-left") {
                player.play("walk-top-left");
            }
            lastDir = "top-left";
        } else if (k.isKeyDown("w") && k.isKeyDown("d")) {
            player.move(SPEED, -SPEED);
            if (player.getCurAnim()?.name !== "walk-top-right") {
                player.play("walk-top-right");
            }
            lastDir = "top-right";
        } else if (k.isKeyDown("s") && k.isKeyDown("a")) {
            player.move(-SPEED, SPEED);
            if (player.getCurAnim()?.name !== "walk-bottom-left") {
                player.play("walk-bottom-left");
            }
            lastDir = "bottom-left";
        } else if (k.isKeyDown("s") && k.isKeyDown("d")) {
            player.move(SPEED, SPEED);
            if (player.getCurAnim()?.name !== "walk-bottom-right") {
                player.play("walk-bottom-right");
            }
            lastDir = "bottom-right";
        } else if (k.isKeyDown("w")) {
            player.move(0, -SPEED);
            if (player.getCurAnim()?.name !== "walk-up") {
                player.play("walk-up");
            }
            lastDir = "up";
        } else if (k.isKeyDown("s")) {
            player.move(0, SPEED);
            if (player.getCurAnim()?.name !== "walk-down") {
                player.play("walk-down");
            }
            lastDir = "down";
        } else if (k.isKeyDown("a")) {
            player.move(-SPEED, 0);
            if (player.getCurAnim()?.name !== "walk-left") {
                player.play("walk-left");
            }
            lastDir = "left";
        } else if (k.isKeyDown("d")) {
            player.move(SPEED, 0);
            if (player.getCurAnim()?.name !== "walk-right") {
                player.play("walk-right");
            }
            lastDir = "right";
        }

    });

    // ---- Idle Animations (based on lastDir) ----
    k.onKeyRelease(() => {
        if (k.isKeyDown("w") || k.isKeyDown("a") || k.isKeyDown("s") || k.isKeyDown("d")) {
            // still holding some key → let movement handle it
            return;
        }
        // if no keys are pressed → idle based on lastDir
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
});

export default k.go("game");
