import Bullet from '../bullet';
import returnAngle from '../../utils/returnAngle';
import DisplayPlayerInformation from '../display-player-information'
import { AnchorComp, AreaComp, BodyComp, GameObj, HealthComp, KaboomCtx, PosComp, RotateComp, ScaleComp, SpriteComp, Vec2, ZComp } from "kaboom";

export default class Player {
    public readonly ctx:  GameObj<SpriteComp | ScaleComp | PosComp | AreaComp | BodyComp | HealthComp | ZComp | AnchorComp | RotateComp | {coin: number}>;

    private angle = 0;

    // movement
    private velocity;
    private speed = 200;
    private deceleration = 100;

    private fireCadence = 200 / 2;
    private fireAuto = true;

    public death = false;

    private magnetCollision;

    private displayPlayerInformation = new DisplayPlayerInformation()

    constructor(private readonly kb: KaboomCtx) {
        const {
            sprite,
            scale,
            body,
            rotate,
            health,
            area,
            pos,
            anchor,
            rect,
            z
        } = kb

        this.ctx = kb.add([
            sprite('starship'),
            pos(this.kb.center()),
            scale(0.5),
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
            health(100),
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
        if (this.death) {
            return;
        }

        const mousePos = this.kb.mousePos();

        this.toLook(mousePos);
    
        this.addDeceleration();

        this.magnetCollision.pos = this.ctx.pos;

        this.displayPlayerInformation.displayCoin(this.ctx.coin);
        this.displayPlayerInformation.displayHeart(this.ctx.hp())
    }

    private init() {
        this.playerMovement();
        this.fireBullet();
        this.colletCoin();

        this.ctx.onDeath(() => {
            this.ctx.destroy();
            this.magnetCollision.destroy();
            this.death = true;
        });
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
                if (this.death) {
                    return;
                }
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
            if (this.death) {
                return;
            }
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
        if (this.death) {
            return;
        }

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

            this.ctx.coin++;
        })
    }

    public get playerPos() {
        return this.ctx.pos;
    }
}