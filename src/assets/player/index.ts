import Bullet from '../bullet';
import returnAngle from '../../utils/returnAngle';
import { KaboomCtx, Vec2 } from "kaboom";

export default class Player {
    private readonly ctx;

    private angle = 0;

    // movement
    private velocity;
    private speed = 200;
    private deceleration = 100;

    private fireCadence = 200 / 2;
    private fireAuto = true;

    private magnetCollision;

    constructor(private readonly kb: KaboomCtx) {
        const {
            sprite,
            scale,
            body,
            rotate,
            area,
            pos,
            anchor,
            rect,
            z
        } = kb

        this.ctx = kb.add([
            sprite('starship'),
            pos(this.kb.center()),
            scale(0.4),
            area({
                scale: 1,
            }),
            body({
                isStatic: true,
            }),
            'player',
            rotate(0),
            anchor('center'),
            z(2), 
            {
                coin: 0,
            }
        ]);
        
        this.magnetCollision = kb.add([
            "player-magnet-collision",
            pos(this.ctx.pos),
            rect(600, 600, {
                fill: false,
            }),  
            scale(),
            body({
                isStatic: true,
            }),
            area(),
            anchor('center'),
            z(1)
        ])

        this.velocity = this.kb.vec2(0, 0);

        this.init();
    }

    update() {
        const mousePos = this.kb.mousePos();

        this.toLook(mousePos);
    
        this.addDeceleration();

        this.magnetCollision.pos = this.ctx.pos;
    }

    private init() {
        this.playerMovement();
        this.fireBullet();
        this.colletCoin();
    }

    private toLook(mousePos: Vec2) {
        const mousePosByPlayer = mousePos.sub(this.ctx.pos);

        this.angle = returnAngle(mousePosByPlayer);

        this.ctx.rotateTo(this.angle);
    }

    private fireBullet() {
        let isFire = false;

        // auto fire
        if (this.fireAuto) {

            this.kb.onMouseDown((m) => {
                if (isFire) {
                    return;
                }
    
                // create bullet
                const mousePos = this.kb.mousePos();
                const bullet = new Bullet(this.kb);
                bullet.create(this.ctx.pos, mousePos, this.angle);
                
                isFire = true;
                
                setTimeout(() => {
                    isFire = false;
                }, this.fireCadence);
            });
            return;
        }

        // manual fire
        this.kb.onMousePress((m) => {
            if (isFire) {
                return;
            }

            // create bullet
            const mousePos = this.kb.mousePos();
            const bullet = new Bullet(this.kb);
            bullet.create(this.ctx.pos, mousePos, this.angle);
            
            isFire = true;
            
            setTimeout(() => {
                isFire = false;
            }, this.fireCadence);
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

    private colletCoin() {
        this.ctx.onCollide("coin", (obj) => {
            obj.destroy();
        })
    }

    public get playerPos() {
        return this.ctx.pos;
    }
}