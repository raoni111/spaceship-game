import { AreaComp, GameObj, KaboomCtx, PosComp, Vec2 } from "kaboom";
import returnAngle from "../../utils/returnAngle";
import Explosion from "../explosion";
import Player from "../player";
import Bullet from "../bullet";
import itemGenerator from "../itemGenerator";

export default class Enemy {
    private readonly ctx;

    private readonly velocity = 100;

    private bulletIntervalId: NodeJS.Timeout;

    private readonly getCoinCount = 5;

    constructor(private readonly kb: KaboomCtx, private readonly player: Player, private readonly itemGenerator: itemGenerator) {
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

        const enemyPos = this.kb.vec2(this.kb.rand(0, this.kb.width()), this.kb.rand(0, this.kb.height()));

        this.ctx = this.kb.add([
            "enemy",
            sprite("starship-enemy"),
            scale(0.1),
            pos(enemyPos),
            area(),
            body({
                isStatic: true,
            }),
            rotate(0),
            anchor("center"),
            health(30),
            z(2),
        ]);

        this.init();
    }

    private init() {
        this.onCollide();
        this.fireBullet();

        this.ctx.onDeath(() => {
            const explosion = new Explosion(this.kb, this.ctx.pos);

            this.itemGenerator.genCoin(this.getCoinCount, this.ctx.pos);

            this.ctx.destroy();
        })
    }

    private onCollide() {
        this.ctx.onCollide("bullet", (obj) => {
            obj.destroy();

            this.ctx.hurt(10);
        });

    }

    moveUpdate(playerPos: Vec2) {
        this.ctx.moveTo(playerPos, this.velocity);
        this.ctx.angle = returnAngle(playerPos.sub(this.ctx.pos));
    }

    private fireBullet() {
        
        // create bullet
        this.bulletIntervalId = setInterval(() => {
            if (this.ctx.hp() === 0) {
                clearInterval(this.bulletIntervalId);
                return;
            }
    
            const bullet = new Bullet(this.kb);
            bullet.create(this.ctx.pos, this.player.playerPos, this.ctx.angle, true);
        }, 1000);
    }

    isDeath() {
        return this.ctx.hp() === 0 ? false : true;
    }
}