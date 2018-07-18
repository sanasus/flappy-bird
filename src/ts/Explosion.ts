import { Game } from "./Game";
import { EXPLOSION } from "./ResourcesConst";

export class Explosion extends PIXI.extras.AnimatedSprite {
    app: Game;
    isReverse: boolean;
    shared: any;

    constructor(app: Game) {
        let textures = [];
        for (let i = 0; i < 16; i++) {
            let texture = PIXI.Texture.fromImage(PIXI.loader.resources[EXPLOSION].data.animations.frame[i]);
            textures.push(texture);
        };
        super(textures);
        this.app = app;
        this.isReverse = false;
        this.shared = (delta: number): void => this.expLoop();
        this.anchor.set(0.5);
        this.animationSpeed = 0.4;
        // let coefSIze = (app.view.width / 15) / this.width;
        app.ticker.add(() => this.expLoop())
    }

    expLoop() {
        if (this.currentFrame == 15 && this.isReverse) {
            this.app.ticker.remove(this.shared);
            this.stop();
            this.emit('explosion-end');
            return;
        }
        this.scale.set(this.currentFrame / 5);
        if (this.currentFrame == 15) {
            this.textures = this.textures.reverse();
            this.isReverse = !this.isReverse;
        }
    }
}
