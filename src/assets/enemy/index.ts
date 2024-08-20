import { AreaComp, GameObj, KaboomCtx, PosComp, Vec2 } from "kaboom";
import returnAngle from "../../utils/returnAngle";
import Explosion from "../explosion";

export default class Enemy {
    private readonly ctx;

    private readonly velocity = 100;

    constructor(private readonly kb: KaboomCtx) {
        const {
            sprite,
            scale,
            pos,
            area,
            body,
            anchor,
            rotate,
            z,
        } = this.kb;

        const enemyPos = this.kb.vec2(200, 200)

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
            z(2),
        ]);

        this.onCollide();
    }

    onCollide() {
        this.ctx.onCollide("bullet", (obj) => {
            obj.destroy();

            const explosion = new Explosion(this.kb, this.ctx.pos);

            this.ctx.destroy();
        });
    }

    moveUpdate(playerPos: Vec2) {
        this.ctx.moveTo(playerPos, this.velocity);
        this.ctx.angle = returnAngle(playerPos.sub(this.ctx.pos));
    }
}