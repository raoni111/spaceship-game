import Bullet from '../bullet';
import returnAngle from '../../utils/returnAngle';
import { KaboomCtx, Vec2 } from "kaboom";

export default class Player {
    private readonly ctx;

    private angle = 0;

    private velocity;
    private speed = 200;
    private deceleration = 100;

    constructor(private readonly kb: KaboomCtx) {
        const {
            sprite,
            scale,
            body,
            rotate,
            area,
            pos,
            anchor,
            
        } = kb

        this.ctx = kb.add([
            sprite('starship'),
            pos(this.kb.center()),
            scale(0.1),
            area({
                scale: 1,
            }),
            body({
                isStatic: true,
            }),
            'player',
            rotate(0),
            anchor('center')
        ]);

        this.velocity = this.kb.vec2(0, 0);

        this.init();
    }

    update() {
        const mousePos = this.kb.mousePos();

        this.toLook(mousePos);
    
        this.addDeceleration();
    }

    private init() {
        this.playerMovement();
        this.fireBullet();
    }

    private toLook(mousePos: Vec2) {
        const mousePosByPlayer = mousePos.sub(this.ctx.pos);

        this.angle = returnAngle(mousePosByPlayer);

        this.ctx.rotateTo(this.angle);
    }

    private fireBullet() {
        this.kb.onMousePress((m) => {
            const mousePos = this.kb.mousePos();

            const bullet = new Bullet(this.kb);

            bullet.create(this.ctx.pos, mousePos, this.angle);
        });
    }

    private playerMovement() {
        this.kb.onKeyDown((key) => {
            switch (key) {
                case 'd':
                    this.velocity.x = this.speed;
                    break;
                case 'a':
                    this.velocity.x = -this.speed;
                    break;
                case 'w':
                    this.velocity.y = -this.speed;
                    break;
                case 's':
                    this.velocity.y = this.speed;
                    break;
                default:
                    break;
            }
        });
    }

    private addDeceleration() {
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(0, this.velocity.x - this.deceleration * this.kb.dt());
        } else if (this.velocity.x < 0) {
            this.velocity.x = Math.min(0, this.velocity.x + this.deceleration * this.kb.dt());
        }

        if (this.velocity.y > 0) {
            this.velocity.y = Math.max(0, this.velocity.y - this.deceleration * this.kb.dt());
        } else if (this.velocity.y < 0) {
            this.velocity.y = Math.min(0, this.velocity.y + this.deceleration * this.kb.dt());
        }

        this.ctx.move(this.velocity);
    }
}