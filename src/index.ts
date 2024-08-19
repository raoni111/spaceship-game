import kaboom from "kaboom";
import Player from "./assets/player";
import Asteroid from "./assets/asteroind"
import "./styles.scss";

const kb = kaboom({
    canvas: document.getElementById("my-canvas") as HTMLCanvasElement,
    background: "#000000",
});

const {
    loadSprite,
    loadSpriteAtlas,
    loadSound,
} = kb;

loadSprite("starship", "./sprites/spaceship.png");
loadSprite("bullet", "./sprites/bullet.png");
loadSprite("asteroid", "./sprites/asteroid.png");

loadSpriteAtlas("./sprites/coins.png", {
    "coin": {
        x: 0,
        y: 0,
        height: 171,
        width: 1210,
        sliceX: 6,
        anims: {
            idle: {
                from: 0,
                to: 5,
                loop: true,
            },
        }
    }
})

loadSound("shoot", "./audio/laser-effect.wav");
loadSound("asteroid-explode", "./audio/asteroid-explode.wav");
loadSound("bullet-impact-into-asteroid", "./audio/bullet-impact-into-asteroid.wav");
loadSound("push-coin", "./audio/push-coin.wav");

const player = new Player(kb);


setInterval(() => {
    const numberRang: number = Math.floor(kb.rand(0, 10));

    const asteroid = new Asteroid(kb, player.playerPos);
    const asteroid2 = new Asteroid(kb, player.playerPos);
}, 3000)

kb.onUpdate(() => {
    player.update();
});