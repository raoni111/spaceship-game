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
            move,
            z,
        } = this.kb;
        
        this.ctx = this.kb.add([
            'coin',
            sprite('coin'),
            pos(spawnPos),
            scale(1),
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
        this.moveCoinAndDestroy();

        this.ctx.onCollideUpdate("player-magnet-collision", (obj: GameObj<PosComp | {coin: number}>) => {
            this.ctx.moveTo(obj.pos, 400)

            obj.coin++;
        });

        this.ctx.onDestroy(() => {
            this.kb.play("push-coin", {
                volume: 0.05,
            })
        });

    }

    private moveCoinAndDestroy() {
        const genPosition = this.kb.vec2(
            this.kb.rand(this.spawnPos.x - 100, this.spawnPos.x + 100),
            this.kb.rand(this.spawnPos.y - 100, this.spawnPos.y + 100),
        );

        const stopOnUpdate = this.ctx.onUpdate(() => {

            this.ctx.moveTo(genPosition, 400);
        });
        
        this.kb.wait(0.2, () => {
            stopOnUpdate.cancel();
        });

        this.kb.wait(10, () => {
            this.ctx.clearEvents();
            this.ctx.destroy();
        });
    }
}