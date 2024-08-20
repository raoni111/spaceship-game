import { KaboomCtx, Vec2 } from "kaboom"

export default class Explosion {
    private readonly ctx;

    constructor(private readonly kb: KaboomCtx, explodePos: Vec2) {
        const {
            sprite,
            scale,
            pos,
            anchor,
        } = this.kb;

        this.ctx = this.kb.add([
            sprite("explosion"),
            scale(1.5),
            pos(explodePos),
            anchor("center"),
        ]);
        
        this.kb.play("asteroid-explode", {
            volume: 0.2,
        });

        this.ctx.play("explode");


        this.ctx.onAnimEnd(() => {
            this.ctx.destroy();

        })
    }
}