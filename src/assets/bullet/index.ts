import { AnchorComp, AreaComp, HealthComp, BodyComp, ColorComp, EmptyComp, GameObj, KaboomCtx, OffScreenComp, PosComp, RotateComp, ScaleComp, SpriteComp, Vec2 } from "kaboom";

export default class Bullet {
    constructor(private readonly kb: KaboomCtx) {}

    create(playerPos: Vec2, mousePos: Vec2, angle: number, isEnemyBullet = false) {
        const {sprite, pos, scale, anchor, move, color, offscreen, rotate, area, body} = this.kb

        const isEnemy = isEnemyBullet ? 'enemy-bullet' : 'bullet';

        const bullet = this.kb.add([
            isEnemy,
            sprite(isEnemyBullet ? 'bullet-enemy' : 'bullet'),
            scale(0.8),
            pos(playerPos),
            move(mousePos.angle(playerPos), 1200),
            rotate(angle - 90),
            color(255, 255, 255),
            offscreen({ destroy: true}),
            anchor('center'),
            area({
                scale: 1,
            }),
            body({
                isStatic: true,
            }),
        ], );

        this.kb.play('shoot', {
            volume: 0.02,
        })

        this.collisions(bullet, isEnemy);
    }

    collisions(
        bullet:  GameObj<SpriteComp | ScaleComp | PosComp | EmptyComp | RotateComp | ColorComp | OffScreenComp | AnchorComp | AreaComp | BodyComp>,
        isEnemy: string,
    ) {
        console.log(isEnemy);
        if (isEnemy === 'enemy-bullet') {
            bullet.onCollide('player', (obj: GameObj<HealthComp>) => {
                bullet.destroy();
                
                if (obj.hp() === 0) {
                    return
                }
                obj.hurt(1);
            });
        }
    }
}