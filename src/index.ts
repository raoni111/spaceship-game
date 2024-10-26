import kaboom from "kaboom";
import Player from "./assets/player";
import Asteroid from "./assets/asteroind";
import Enemy from './assets/enemy';
import Missile from './assets/missile';
import ItemGenerator from './assets/itemGenerator';
import "./styles.scss";
import Explosion from "./assets/explosion";

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
loadSprite("bullet", "./sprites/bullet.png");
loadSprite("bullet-enemy", "./sprites/bullet-enemy.png");
loadSprite("asteroid", "./sprites/asteroid.png");

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
                to: 3,
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

const player = new Player(kb);

const itemGenerator = new ItemGenerator(kb);

const enemies: Array<Enemy | Missile> = [];

setInterval(() => {
    const numberRang: number = Math.floor(kb.rand(0, 10));
    
    const enemy = new Enemy(kb, player, itemGenerator);
    const missile = new Missile(kb, itemGenerator);

    enemies.push(enemy);
    enemies.push(missile);
    
    // const asteroid = new Asteroid(kb, player.playerPos, itemGenerator);
    // const asteroid2 = new Asteroid(kb, player.playerPos, itemGenerator);
}, 3000);


kb.onUpdate(() => {
    player.update();

    enemies.forEach((enemy, index) => {
        if (!enemy.isDeath()) {
            enemies.splice(index, 1);
            return;
        }
        
        enemy.update(player.playerPos);
    });
});