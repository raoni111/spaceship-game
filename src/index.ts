import kaboom from "kaboom";
import Player from './assets/player';
import './styles.scss';

const kb = kaboom({
    canvas: document.getElementById('my-canvas') as HTMLCanvasElement,
    background: '#000000'
});

const {
    loadSprite,
    loadSound,
} = kb;

loadSprite("starship", "./sprites/spaceship.png");
loadSprite("bullet", './sprites/bullet.png');

loadSound("shoot", "./audio/laser-effect.wav");

const player = new Player(kb);

kb.onUpdate(() => {
    player.update();
})