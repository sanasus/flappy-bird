import { BIRD, EXPLOSION, GIRL, BTN_NORMAL, BTN_SELECT, COIN, EARTH, SKY, THUMB_TOP, THUMB_TILE } from "./ResourcesConst";
import { LoaderView } from "./LoaderView";
import { Bird } from "./Bird";
import { hitTestRectangle } from "./hitTestRectangle";
import { Explosion } from "./Explosion";
import { ThumbGenerator } from "./ThumbGenerator";
import { Menu } from "./Menu";
import { CoinGenerator } from "./CoinGenerator";
import { addDisplayGroups, topGroup } from "./layer";

export class Game extends PIXI.Application {
    loaderText: PIXI.Text;
    bird: Bird | null = null;
    explosion: Explosion | null = null;
    earth: PIXI.extras.TilingSprite | null = null;
    sky: PIXI.extras.TilingSprite | null = null;
    thumbGenerator = new ThumbGenerator(this);
    coinGenerator = new CoinGenerator(this);
    sceneSpeed = 3;
    thumbDistance = 400;
    isEnd = true;
    menu: Menu | null = null;

    constructor(w: number, h: number, options?: PIXI.ApplicationOptions) {
        super(w, h, options);
        addDisplayGroups(this);
        if (this.screen.width > 1000) {
            this.thumbDistance = this.screen.width / 3;
            this.sceneSpeed = this.screen.width / 300;
        }
        this.stage.interactive = true;
        this.stage.hitArea = new PIXI.Rectangle(0, 0, this.screen.width, this.screen.height);
        this.loaderText = this.stage.addChild(new LoaderView());
        this.loaderText.position.set(this.screen.width / 2, this.screen.height / 2);
        this.loadRes();
        this.ticker.add((delta: number) => this.gameLoop(delta));
    }

    loadRes() {
        PIXI.loader.add(BIRD, BIRD);
        PIXI.loader.add(EXPLOSION, EXPLOSION);
        PIXI.loader.add(GIRL, GIRL);
        PIXI.loader.add(BTN_NORMAL, BTN_NORMAL);
        PIXI.loader.add(BTN_SELECT, BTN_SELECT);
        PIXI.loader.add(COIN, COIN);
        PIXI.loader.add(EARTH, EARTH);
        PIXI.loader.add(SKY, SKY);
        PIXI.loader.add(THUMB_TOP, THUMB_TOP);
        PIXI.loader.add(THUMB_TILE, THUMB_TILE);
        PIXI.loader.load((loader: PIXI.loaders.Loader) => {
            this.stage.removeChild(this.loaderText);
            this.startApp(loader.resources)
        });
    }

    gameLoop(delta: number) {
        if (!this.isEnd) {
            this.earth!.tilePosition.x -= delta * this.sceneSpeed;
            this.sky!.tilePosition.x -= delta * (this.sceneSpeed - 1);
            if (this.bird) {
                let hitArray = [this.earth!.getBounds(), new PIXI.Rectangle(0, 0, this.screen.width, 1)].concat(this.thumbGenerator.getBounds());
                let isHit = hitTestRectangle(this.bird.getBounds(), hitArray);
                this.bird.fly(delta, isHit);
                this.coinGenerator.coins.forEach((el, i) => {
                    let isHit = hitTestRectangle(this.bird!.getBounds(), [el.getBounds()]);
                    if (isHit) {
                        this.coinGenerator.pickCoin(i);
                        this.stage.removeChild(el);
                    }
                });
                if (this.explosion) this.explosion.expLoop(isHit, this.bird);
            }
            this.coinGenerator.loop(delta);
            let sizeArray = this.thumbGenerator.topThumb.length;
            if (sizeArray > 0) {
                for (let i = 0; i < sizeArray; i++) {
                    this.thumbGenerator.topThumb[i].x -= delta * this.sceneSpeed;
                    this.thumbGenerator.bottomThumb[i].x -= delta * this.sceneSpeed;
                    if (this.thumbGenerator.topThumb[sizeArray - 1].x <= this.screen.width - this.thumbDistance) {
                        this.addBarrier(sizeArray);
                    }
                }
                if (this.thumbGenerator.topThumb[0] && this.thumbGenerator.topThumb[0].x + this.screen.width <= 0) {
                    this.stage.removeChild(this.thumbGenerator.topThumb[0]);
                    this.stage.removeChild(this.thumbGenerator.bottomThumb[0]);
                    this.thumbGenerator.removeFirst();
                }
                if (this.coinGenerator.coins[0] && this.coinGenerator.coins[0].x + this.screen.width <= 0) {
                    this.stage.removeChild(this.coinGenerator.coins[0]);
                    this.coinGenerator.removeFirst();
                }
            }
        }
    }

    startApp(loader: PIXI.loaders.ResourceDictionary) {
        this.menu = this.stage.addChild(new Menu(this));
        this.menu.position.set((this.screen.width - this.menu.width) / 2, (this.screen.height - this.menu.height) / 2);
        let currentScore = this.stage.addChild(new PIXI.Text('Score: 0', {fill: 0xffffff}));
        currentScore.x = 10;
        currentScore.parentGroup = topGroup;
        this.coinGenerator.on('pick-coin', (val: number) => {
            currentScore.text = `Score: ${val}`;
        });
        this.coinGenerator.on('best-change', (val: number) => {
            this.menu!.bestScoreText.text = `${this.menu!.bestScoreName} ${val}`;
        });
        this.menu.buttons[0].click = () => this.startGame();
        this.earth = new PIXI.extras.TilingSprite(
            PIXI.loader.resources[EARTH].texture,
            this.screen.width,
            50
        );
        this.earth.position.set(0, this.screen.height - 50);
        this.sky = new PIXI.extras.TilingSprite(
            PIXI.loader.resources[SKY].texture,
            this.screen.width,
            this.screen.height - 50
        );
        this.sky.position.set(0, 0);
    }

    startGame() {
        this.menu!.hideMenu();
        this.coinGenerator.resetCurrent();

        this.stage.addChild(this.earth!);
        this.stage.addChild(this.sky!);

        this.bird = this.stage.addChild(new Bird(this));
        this.bird.startAnimation();

        this.addBarrier(0);

        this.explosion = this.stage.addChild(new Explosion(this));
        this.explosion.on('explosion-end', () => this.endApp());
        this.isEnd = false;
    }

    endApp() {
        this.isEnd = true;
        this.thumbGenerator.removeAll();
        this.stage.removeChildren(3);
        this.menu!.showMenu();
    }

    addBarrier(index: number) {
        let thumbs = this.thumbGenerator.createThumb();
        let coin = this.coinGenerator.createCoin(thumbs, this.thumbGenerator);
        this.stage.addChild(this.thumbGenerator.topThumb[index]);
        this.stage.addChild(this.thumbGenerator.bottomThumb[index]);
        this.stage.addChild(coin);
    }

}