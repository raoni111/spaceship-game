import returnAngle from '../../utils/returnAngle';
import { KaboomCtx, Vec2 } from "kaboom";
import Explosion from '../explosion';
import itemGenerator from '../itemGenerator';

export default class Missile {
    private readonly ctx;

    private readonly velocity = 200;

    constructor(private readonly kb: KaboomCtx, private readonly itemGenerate: itemGenerator) {
        const missilePos = this.kb.vec2(this.kb.rand(0, this.kb.width()), this.kb.rand(0, this.kb.height()));
        
        const {
            sprite,
            scale,
            pos,
            area,
            body,
            anchor,
            rotate,
            health,
            z,
        } = this.kb;
        this.ctx = this.kb.add([
            "missile-enemy",
            sprite("missile"),
            pos(missilePos),
            scale(0.7),
            area(),
            body({
                isStatic: true,
            }),
            anchor("center"),
            rotate(0),
            health(10),
            z(2),
        ]);

        this.init();
    }

    init() {
        this.ctx.onCollide("bullet", (obj) => {
            obj.destroy();

            this.ctx.hurt(10);
        });

        this.ctx.onDeath(() => {
            const explosion = new Explosion(this.kb, this.ctx.pos);

            this.itemGenerate.genCoin(1, this.ctx.pos);
            this.ctx.destroy();
        })
    }

    update(playerPos: Vec2) {
        this.move(playerPos);
    }

    move(playerPos: Vec2) {
        console.log(playerPos);

        this.ctx.moveTo(playerPos, this.velocity);
        this.ctx.angle = returnAngle(playerPos.sub(this.ctx.pos)) - 90;
    }

    isDeath() {
        return this.ctx.hp() === 0 ? false : true;
    }
}