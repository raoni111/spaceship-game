import { KaboomCtx, Vec2 } from "kaboom";

export default class Bullet {
    constructor(private readonly kb: KaboomCtx) {}

    create(playerPos: Vec2, mousePos: Vec2, angle: number, isEnemyBullet = false) {
        const {sprite, pos, scale, anchor, move, color, offscreen, rotate, area, body} = this.kb

        const bullet = this.kb.add([
            isEnemyBullet ? "enemy-bullet" : 'bullet',
            sprite('bullet'),
            scale(0.05),
            pos(playerPos),
            move(mousePos.angle(playerPos), 1200),
            rotate(angle - 90),
            color(255, 255, 255),
            offscreen({ destroy: true}),
            anchor('center'),
            area({
                scale: 0.1,
            }),
            body({
                isStatic: true,
            }),
        ], );

        this.kb.play('shoot', {
            volume: 0.02,
        })
    }
}