import kaboom from "kaboom";
import Player from "./assets/player";
import Asteroid from "./assets/asteroind";
import Enemy from './assets/enemy';
import ItemGenerator from './assets/itemGenerator';
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

loadSprite("starship", "./sprites/spaceship-2.png");
loadSprite("starship-enemy", "./sprites/spaceship.png");
loadSprite("bullet", "./sprites/bullet.png");
loadSprite("asteroid", "./sprites/asteroid.png");

loadSpriteAtlas("./sprites/coins.png", {
    "coin": {
        x: 0,
        y: 0,
        height: 171,
        width: 1200,
        sliceX: 6,
        anims: {
            idle: {
                from: 0,
                to: 5,
                loop: true,
            },
        }
    }
});

loadSpriteAtlas("./sprites/explosion.png", {
    "explosion": {
        x: 0,
        y: 0, 
        width: 768,
        height: 128,
        sliceX: 6,
        anims: {
            explode: {
                from: 0,
                to: 5,
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

const enemies: Enemy[] = [];

setInterval(() => {
    const numberRang: number = Math.floor(kb.rand(0, 10));
    
    const enemy = new Enemy(kb, player, itemGenerator);

    enemies.push(enemy);
    
    const asteroid = new Asteroid(kb, player.playerPos, itemGenerator);
    const asteroid2 = new Asteroid(kb, player.playerPos, itemGenerator);
}, 3000)

kb.onUpdate(() => {
    player.update();

    enemies.forEach((enemy, index) => {
        if (!enemy.isDeath()) {
            enemies.splice(index, 1);
            return;
        }
        
        enemy.moveUpdate(player.playerPos);
    });
});