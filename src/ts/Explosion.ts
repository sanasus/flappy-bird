import { Game } from "./Game";
import { EXPLOSION } from "./ResourcesConst";
import { Bird } from "./Bird";

export class Explosion extends PIXI.extras.AnimatedSprite {
    app: Game;
    isReverse: boolean;

    constructor(app: Game) {
        let textures = [];
        for (let i = 0; i < 16; i++) {
            let texture = PIXI.Texture.fromImage(PIXI.loader.resources[EXPLOSION].data.animations.frame[i]);
            textures.push(texture);
        };
        super(textures.reverse());
        this.app = app;
        this.isReverse = false;
        this.anchor.set(0.5);
        this.animationSpeed = 0.4;
        // let coefSIze = (app.screen.width / 15) / this.width;
    }

    expLoop(isHit: boolean, bird: Bird) {
        if (isHit) {
            this.position.set(bird.x - (bird.width / 2), bird.y + (bird.height / 2));
            this.play();
        }
        if (this.currentFrame == 15) {
            this.stop();
            this.emit('explosion-end');
            return;
        }
        this.scale.set(this.currentFrame / 5);
    }
}
