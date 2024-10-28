import { KaboomCtx } from 'kaboom';
import Enemy from '../enemy';
import Missile from '../missile';
import itemGenerator from '../itemGenerator';
import Player from '../player';
import Asteroid from '../asteroind';

class SpawnEnemyManager {
    private intervalId: NodeJS.Timeout;
    public readonly enemies: Array<Enemy | Missile> = []

    constructor(private readonly kb: KaboomCtx, private readonly player: Player, private readonly itemGenerator: itemGenerator) {}

    play() {
        let round = 1

        this.intervalId = setInterval(() => {
            // tipos de inimigos
            // - Enemy
            // - Missile
            // - Asteroid

            console.log(round);

            const enemiesPossibility = [
                'enemy', 'enemy', 'missile'

            ]

            let enemyCount = this.kb.rand(1, Math.floor(2 * (round / 10)));

            if (enemyCount > 10) {
                enemyCount = 10;
            }

            for (let i = 0; i <= enemyCount; i++) {
                const enemySelected = enemiesPossibility[Math.floor(this.kb.rand(0, enemiesPossibility.length))];
               console.log(enemySelected)


                switch (enemySelected) {
                    case 'enemy':
                        const enemy = new Enemy(this.kb, this.player, this.itemGenerator);
                        this.enemies.push(enemy);

                        break;
                    case 'missile':
                        const missile = new Missile(this.kb, this.itemGenerator);
                        this.enemies.push(missile);

                        break;
                    default:
                        break;
                }
            }

            round++;
        }, this.kb.rand(3000, 10000));
    }

    update() {
        this.enemies.forEach((enemy, index) => {
            if (!enemy.isDeath()) {
                this.enemies.splice(index, 1);
                return;
            }

            enemy.update(this.player.playerPos);
        });
    }

    stop() {
        clearInterval(this.intervalId);

        this.enemies.forEach((enemy, index) => {
            setTimeout(() => {
                enemy.destroy();
            }, 100 * (index + 1));
        });
    }
}

export default SpawnEnemyManager;
