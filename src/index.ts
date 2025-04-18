import kaboom from "kaboom";
import Player from "./assets/player";
import DeathUI from "./assets/DeathUI";
import "./styles.scss";
import Game from './assets/game-costumer';

const kb = kaboom({
    canvas: document.getElementById("my-canvas") as HTMLCanvasElement,
    background: "#000000",
});

const {
    loadSprite,
    loadSpriteAtlas,
    loadSound,
} = kb;

loadSprite("starship", "./sprites/spaceship-2.png");
loadSprite("starship-enemy", "./sprites/spaceship.png");
loadSprite("bullet-enemy", "./sprites/bullet-enemy.png");
loadSprite("asteroid", "./sprites/asteroid.png");

loadSpriteAtlas("./sprites/bullet.png", {
    "bullet": {
        x: 0,
        y: 0,
        width: 76,
        height: 19,
        sliceX: 4,
        sliceY: 1,
        anims: {
            shoot: {
                from: 0,
                to: 3,
                loop: true,
            }
        }

    }
});

loadSpriteAtlas("./sprites/coins.png", {
    "coin": {
        x: 0,
        y: 0,
        height: 32,
        width: 128,
        sliceX: 4,
        anims: {
            idle: {
                from: 0,
                to: 0,
                loop: true,
            },
        }
    }
});

loadSprite("missile", "./sprites/rocket.png");

loadSpriteAtlas("./sprites/explosion.png", {
    "explosion": {
        x: 0,
        y: 0, 
        width: 80,
        height: 16,
        sliceX: 5,
        anims: {
            explode: {
                from: 0,
                to: 4,
                loop: false,
            }
        }
    }
})





loadSound("shoot", "./audio/laser-effect.wav");
loadSound("asteroid-explode", "./audio/asteroid-explode.wav");
loadSound("bullet-impact-into-asteroid", "./audio/bullet-impact-into-asteroid.wav");
loadSound("push-coin", "./audio/push-coin.wav");

const deathUIElement = document.getElementById('death-content-id') as HTMLDivElement;
const restartButton = document.getElementById('restart-button-id') as HTMLButtonElement;

const player = new Player(kb);

const game = new Game(kb, player);

const deathUI = new DeathUI(deathUIElement, restartButton, player);