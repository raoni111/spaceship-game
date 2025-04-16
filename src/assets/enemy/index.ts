import { GameObj, HealthComp, KaboomCtx, Vec2 } from "kaboom";
import returnAngle, { returnRadio } from "../../utils/returnAngle";
import Explosion from "../explosion";
import Player from "../player";
import Bullet from "../bullet";
import itemGenerator from "../itemGenerator";

export default class Enemy {
    private readonly ctx;

    private readonly velocity = 100;

    private bulletIntervalId: NodeJS.Timeout;

    private readonly getCoinCount = 5;

    public type = 'Enemy';

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

        let enemyPos = this.createEnemySpawn();



        this.ctx = this.kb.add([
            "enemy",
            sprite("starship-enemy"),
            scale(.5),
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
            
            clearInterval(this.bulletIntervalId);
        })
    }

    private createEnemySpawn(): Vec2 {
        const pos =  this.kb.vec2(this.kb.rand(0, this.kb.width()), this.kb.rand(0, this.kb.height()));
    
        if (returnRadio(pos) < 150) {
            return this.createEnemySpawn();
        }

        return pos;
    }
    
    private onCollide() {
        this.ctx.onCollide("bullet", (obj) => {
            obj.destroy();
            
            this.ctx.hurt(10);
        });
        
        this.ctx.onCollide("player", (obj: GameObj<HealthComp>) => {
            const explosion = new Explosion(this.kb, this.ctx.pos);
            this.ctx.destroy();
            clearInterval(this.bulletIntervalId);

            if (obj.hp() === 0) {
                return;
            }

            obj.hurt(5);
        })

    }

    update(playerPos: Vec2) {
        this.move(playerPos);
    }

    move(playerPos: Vec2) {
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
            bullet.create(this.ctx.pos, this.player.playerPos, this.ctx.angle, true, 500);
        }, 1000);
    }

    isDeath() {
        return this.ctx.hp() === 0 ? false : true;
    }

    destroy() {
        const explosion = new Explosion(this.kb, this.ctx.pos);
        this.ctx.destroy();

        clearInterval(this.bulletIntervalId);
    }
}