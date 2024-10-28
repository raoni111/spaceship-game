import { KaboomCtx } from "kaboom";
import ItemGenerator from "../itemGenerator";
import SpawnEnemyManager from "../spawn-enemy-manager";
import Player from "../player";

class GameCostumer {
    protected itemGenerator: ItemGenerator;
    protected spawnEnemyManager: SpawnEnemyManager;

    constructor(
        private readonly kb: KaboomCtx,
        private readonly player: Player
    ) {
        this.itemGenerator = new ItemGenerator(kb);

        this.spawnEnemyManager = new SpawnEnemyManager(
            kb,
            player,
            this.itemGenerator
        );

        this.update();

        this.spawnEnemyManager.play();
    }

    update() {
        this.kb.onUpdate(() => {
            this.player.update();
            this.spawnEnemyManager.update();
        });

        this.player.ctx.onDeath(() => {
            this.spawnEnemyManager.stop()
        })
    }
}

export default GameCostumer;
