import Coin from '../coin';
import { KaboomCtx, Vec2 } from "kaboom";

export default class Asteroid {
    private readonly ctx;
    private readonly life;

    constructor(private readonly kb: KaboomCtx, playerPos: Vec2) {
        const {
            sprite,
            pos,
            scale,
            area,
            body,
            text,
            health,
            color,
            z,
            anchor,
            vec2,
            move,
            offscreen
        } = this.kb;

        const createPos = this.kb.vec2(this.kb.rand(0, this.kb.width()), this.kb.rand(0, this.kb.height()))
    
        this.ctx = this.kb.add([
            'asteroid',
            sprite("asteroid"),
            scale(0.1 ),
            pos(createPos),
            area({
                scale: 1,
            }),
            body({
                isStatic: true,
            }),
            health(50),
            z(1),
            anchor("center"),
            move(playerPos.angle(createPos), 300),
            offscreen({ destroy: true })
        ]);

        this.ctx.scale = vec2(0.01 * 50 / 2);
    
        this.life = this.ctx.add([
            text(`${this.ctx.hp()}`, {
                size: 150,
                width: 190, 
                font: "sans-serif",
            }),
            pos(0, 0),
            color(255, 255, 255),
            z(2),
            anchor("center")
        ]);

        this.init();
    }

    init() {
        this.collides()

        this.ctx.onDeath(() => {
            this.ctx.destroy();
            this.life.destroy();

            this.kb.play("asteroid-explode", {
                volume: 0.2,
            });

            const coin = new Coin(this.kb, this.ctx.pos);
        })
    }
    
    
    collides() {
        this.ctx.onCollide("bullet", (obj) => {
            obj.destroy();

            this.ctx.hurt(10)

            if (this.ctx.hp() > 10) {
                this.ctx.scale = this.kb.vec2(0.01 * this.ctx.hp() / 2);
            }

            this.kb.play("bullet-impact-into-asteroid", {
                volume: 0.2,
            })

            this.life.text = `${this.ctx.hp()}`;
        });
    }
}