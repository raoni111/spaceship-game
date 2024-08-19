import { GameObj, KaboomCtx, PosComp, Vec2 } from "kaboom";

export default class Coin {
    private readonly ctx;

    constructor(private readonly kb: KaboomCtx, private readonly spawnPos: Vec2) {
        const {
            sprite,
            pos,
            scale,
            body,
            area,
            z,
        } = this.kb;
        
        this.ctx = this.kb.add([
            'coin',
            sprite('coin'),
            pos(spawnPos),
            scale(0.15),
            body({
                isStatic: true,
            }),
            area({
                scale: 1
            }),
            z(2),
        ]);

        this.ctx.play('idle');

        this.init();
    }

    init() {
        this.ctx.onCollideUpdate("player-magnet-collision", (obj: GameObj<PosComp>, col) => {
            this.ctx.moveTo(obj.pos, 300)
        });

        this.ctx.onDestroy(() => {
            this.kb.play("push-coin", {
                volume: 0.05,
            })
        })
    }
}