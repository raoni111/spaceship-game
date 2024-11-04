import returnAngle, { returnRadio } from '../../utils/returnAngle';
import { GameObj, HealthComp, KaboomCtx, Vec2 } from "kaboom";
import Explosion from '../explosion';
import itemGenerator from '../itemGenerator';

export default class Missile {
    private readonly ctx;

    private readonly velocity = 200;

    constructor(private readonly kb: KaboomCtx, private readonly itemGenerate: itemGenerator) {
        const missilePos = this.createEnemySpawn();
        
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

        this.collisions();

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

    private createEnemySpawn(): Vec2 {
        const pos =  this.kb.vec2(this.kb.rand(0, this.kb.width()), this.kb.rand(0, this.kb.height()));
        

        if (returnRadio(pos) < 200) {
            return this.createEnemySpawn();
        }

        console.log(returnAngle(pos))

        return pos;
    }

    update(playerPos: Vec2) {
        this.move(playerPos);
    }

    move(playerPos: Vec2) {
        this.ctx.moveTo(playerPos, this.velocity);
        this.ctx.angle = returnAngle(playerPos.sub(this.ctx.pos)) - 90;
    }

    isDeath() {
        return this.ctx.hp() === 0 ? false : true;
    }

    collisions() {
        this.ctx.onCollide('player', (obj: GameObj<HealthComp>) => {
            this.ctx.destroy();
            const explosion = new Explosion(this.kb, this.ctx.pos);

            if (obj.hp() === 0) {
                return;
            }

            obj.hurt(5);
        })
    }

    destroy() {
        const explosion = new Explosion(this.kb, this.ctx.pos);
        this.ctx.destroy();
    }
}