import Coin from "../coin"
import { KaboomCtx, Vec2 } from "kaboom";

export default class itemGenerator {
    constructor(private readonly kb: KaboomCtx) {}

    genCoin(count: number, genPos: Vec2) {
        for (let i = 0; i < count; i++) {
            const coin = new Coin(this.kb, genPos);
        }
    }
}