import { Game } from "./Game";
import { COIN } from "./ResourcesConst";
import { ThumbGenerator } from "./ThumbGenerator";

export class CoinGenerator extends PIXI.utils.EventEmitter {
    best: number = 0;
    current: number = 0;
    coins: PIXI.Sprite[] = [];
    speed = 0.005;
    scale = 0.1;

    constructor(private game: Game) {
        super();
    }

    removeFirst() {
        this.coins.splice(0, 1);
    }

    resetCurrent() {
        this.current = 0;
        this.emit('pick-coin', this.current);
    }

    pickCoin(index: number) {
        this.coins.splice(index, 1);
        this.current++;
        if (this.current > this.best) {
            this.best = this.current;
            this.emit('best-change', this.best);
        }
        this.emit('pick-coin', this.current);
    }

    createCoin(thumbs: PIXI.Graphics[], thumbGen: ThumbGenerator): PIXI.Sprite {
        let coinX = thumbs[0].x + (thumbGen.thumbSize / 2);
        let coinY = thumbs[0].height + (thumbs[1].y - thumbGen.thumbSize - thumbs[0].height) / 2;
        let coin = new PIXI.Sprite(PIXI.loader.resources[COIN].texture);
        coin.scale.set(this.scale);
        coin.anchor.set(0.5);
        coin.position.set(coinX, coinY);
        this.coins.push(coin);
        return coin;
    }

    loop(delta: number) {
        this.coins.forEach(coin => {
            coin.x -= delta * this.game.sceneSpeed;
                coin.scale.x -= delta * this.speed;
                if (coin.scale.x <= -this.scale) {
                    coin.scale.x = this.scale;
                }
        });
    }
}

// export class Coin extends PIXI.Sprite {
//     constructor(scale: number) {
//         super(PIXI.loader.resources[COIN].texture);
//         let coin = new PIXI.Sprite(PIXI.loader.resources[COIN].texture);
//         coin.scale.set(scale);
//         coin.anchor.set(0.5);
//     }

// }
