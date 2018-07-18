import { BIRD, EXPLOSION, GIRL } from "./ResourcesConst";
import { LoaderView } from "./LoaderView";
import { Bird } from "./Bird";
import { hitTestRectangle } from "./hitTestRectangle";
import { Explosion } from "./Explosion";
import { ThumbGenerator } from "./ThumbGenerator";

export class Game extends PIXI.Application {
    loaderText: PIXI.Text;
    bird: Bird | null = null;
    explosion: Explosion | null = null;
    earth: PIXI.Graphics = new PIXI.Graphics();
    thumbGenerator = new ThumbGenerator(this);
    thumbSpeed = 1;
    thumbDistanceCoef = 0.8;
    isEnd = false;

    constructor(options?: PIXI.ApplicationOptions) {
        super(options);
        this.stage.interactive = true;
        this.stage.hitArea = new PIXI.Rectangle(0, 0, this.view.width, this.view.height);
        this.loaderText = this.stage.addChild(new LoaderView());
        this.loaderText.position.set(this.view.width / 2, this.view.height / 2);
        this.loadRes();
        this.ticker.add((delta: number) => this.gameLoop(delta));
    }

    loadRes() {
        PIXI.loader.add(BIRD, BIRD);
        PIXI.loader.add(EXPLOSION, EXPLOSION);
        PIXI.loader.add(GIRL, GIRL);
        PIXI.loader.load((loader: PIXI.loaders.Loader) => this.startApp(loader.resources));
    }

    gameLoop(delta: number) {
        if (!this.isEnd) {
            if (this.bird) {
                let hitArray = [this.earth.getBounds(), new PIXI.Rectangle(0, 0, this.view.width, 1)].concat(this.thumbGenerator.getBounds());
                let isHit = hitTestRectangle(this.bird.getBounds(), hitArray);
                this.bird.fly(delta, isHit);
                if (isHit && this.explosion) {
                    this.explosion.position.set(this.bird.x - (this.bird.width / 2), this.bird.y + (this.bird.height / 2));
                    this.explosion.play();
                }
            }
            let sizeArray = this.thumbGenerator.topThumb.length;
            if (sizeArray > 0) {
                for (let i = 0; i < sizeArray; i++) {
                    this.thumbGenerator.topThumb[i].x -= delta * this.thumbSpeed;
                    this.thumbGenerator.bottomThumb[i].x -= delta * this.thumbSpeed;
                    if (this.thumbGenerator.topThumb[sizeArray - 1].x <= this.view.width * this.thumbDistanceCoef) {
                        this.thumbGenerator.createThumb();
                        let topThumb = this.stage.addChild(this.thumbGenerator.topThumb[sizeArray]);
                        let bottomThumb = this.stage.addChild(this.thumbGenerator.bottomThumb[sizeArray]);
                    }
                }
                if (this.thumbGenerator.topThumb[0].x + 50 <= 0) {
                    this.stage.removeChild(this.thumbGenerator.topThumb[0]);
                    this.stage.removeChild(this.thumbGenerator.bottomThumb[0]);
                    this.thumbGenerator.removeFirst();
                }
            }

        }
    }

    startApp(loader: PIXI.loaders.ResourceDictionary) {
        this.stage.removeChild(this.loaderText);
        this.earth.beginFill(0xff0000);
        this.earth.drawRect(0, this.view.height - 50, this.view.width, 50);
        this.earth.endFill();
        this.stage.addChild(this.earth);
        this.bird = this.stage.addChild(new Bird(this));
        this.bird.startAnimation();
        this.explosion = this.stage.addChild(new Explosion(this));
        this.explosion.on('explosion-end', () => {
            if (this.explosion && this.bird) {
                this.stage.removeChild(this.explosion);
                this.stage.removeChild(this.bird);
            }
            this.isEnd = true;
        });
        this.thumbGenerator.createThumb();
        let topThumb = this.stage.addChild(this.thumbGenerator.topThumb[0]);
        let bottomThumb = this.stage.addChild(this.thumbGenerator.bottomThumb[0]);
    }

}