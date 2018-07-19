import { Game } from "./Game";
import { THUMB_TOP, THUMB_TILE } from "./ResourcesConst";

export class ThumbGenerator {
    topThumb: PIXI.Graphics[] = [];
    bottomThumb: PIXI.Graphics[] = [];
    readonly thumbSize: number;
    private thumbColor = 0xff0000;
    private maxCoef = 0.5;
    private intervalCoef = 0.45;
    private static TOP = 0;
    private static BOTTOM = 1;

    constructor(private game: Game) {
        this.thumbSize = game.screen.height / 12;
    }

    removeFirst() {
        this.topThumb.splice(0, 1);
        this.bottomThumb.splice(0, 1);
    }

    removeAll() {
        this.topThumb = [];
        this.bottomThumb = [];
    }

    createThumb(): PIXI.Graphics[] {
        let coef = Math.random();
        let heightTop = coef > this.maxCoef ? this.game.screen.height * this.maxCoef : this.game.screen.height * coef;
        let heightBottom = this.game.screen.height - (heightTop + this.game.screen.height * this.intervalCoef);
        let top = this.drawThumb(heightTop, ThumbGenerator.TOP);
        let bot = this.drawThumb(heightBottom, ThumbGenerator.BOTTOM);
        this.topThumb.push(top);
        this.bottomThumb.push(bot);
        return [top, bot];
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
        // thumb.drawRect(-this.thumbSize / 2, position == ThumbGenerator.TOP ? size : 0, this.thumbSize * 2, this.thumbSize);
        thumb.endFill();
        thumb.x = this.game.screen.width + this.thumbSize;
        thumb.y = position == ThumbGenerator.TOP ? 0 : this.game.screen.height - thumb.height - 50;
        this.setTileTexture(thumb, position);
        this.setTopTexture(thumb, position);
        return thumb;
    }

    private setTileTexture(thumb: PIXI.Graphics, position: number) {
        let bottom = new PIXI.extras.TilingSprite(
            PIXI.loader.resources[THUMB_TILE].texture,
            this.thumbSize,
            thumb.height
        );
        bottom.position.set(this.thumbSize / 2, thumb.height / 2);
        bottom.anchor.set(0.5);
        thumb.addChild(bottom);
    }

    private setTopTexture(thumb: PIXI.Graphics, position: number) {
        let top = new PIXI.Sprite(PIXI.loader.resources[THUMB_TOP].texture);
        top.width = this.thumbSize + 10;
        top.height = this.thumbSize;
        if (position == ThumbGenerator.TOP) top.scale.y = -top.scale.y;
        top.position.set((this.thumbSize - 5) / 2, position == ThumbGenerator.TOP ? thumb.height + this.thumbSize : -this.thumbSize);
        top.anchor.set(0.5, 0);
        thumb.addChild(top);
    }
}
