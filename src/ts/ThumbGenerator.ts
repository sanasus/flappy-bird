import { Game } from "./Game";

export class ThumbGenerator {
    topThumb: PIXI.Graphics[] = [];
    bottomThumb: PIXI.Graphics[] = [];
    private thumbSize: number = 50;
    private thumbColor = 0xff0000;
    private maxCoef = 0.6;
    private intervalCoef = 0.4;
    private static TOP = 0;
    private static BOTTOM = 1;

    constructor(private game: Game) {

    }

    removeFirst() {
        this.topThumb.splice(0, 1);
        this.bottomThumb.splice(0, 1);
    }

    createThumb() {
        let coef = Math.random();
        let heightTop = coef > this.maxCoef ? this.game.view.height * this.maxCoef : this.game.view.height * coef;
        let heightBottom = this.game.view.height - (heightTop + this.game.view.height * this.intervalCoef);
        this.topThumb.push(this.drawThumb(heightTop, ThumbGenerator.TOP));
        this.bottomThumb.push(this.drawThumb(heightBottom, ThumbGenerator.BOTTOM));
    }

    getBounds() {
        let bounds = [];
        let sizeArr = this.topThumb.length;
        for (let i = 0; i < sizeArr; i++) {
            bounds.push(this.topThumb[i].getBounds());
            bounds.push(this.bottomThumb[i].getBounds());
        }
        return bounds;
    }

    private drawThumb(size: number, position: number): PIXI.Graphics {
        let thumb = new PIXI.Graphics();
        thumb.beginFill(this.thumbColor);
        thumb.drawRect(0, 0, this.thumbSize, size);
        thumb.drawCircle(this.thumbSize / 2, position == ThumbGenerator.TOP ? size : 0, this.thumbSize);
        thumb.endFill();
        // thumb.pivot.y = position == ThumbGenerator.TOP ? 0 : thumb.height;
        thumb.x = this.game.view.width + this.thumbSize;
        thumb.y = position == ThumbGenerator.TOP ? 0 : this.game.view.height - thumb.height;
        return thumb;
    }
}
