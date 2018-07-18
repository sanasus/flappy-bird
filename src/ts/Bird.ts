import { BIRD, GIRL } from "./ResourcesConst";
import { Game } from "./Game";

export class Bird extends PIXI.extras.AnimatedSprite {
    app: Game;
    static DIRECTION_TOP = -10;
    static DIRECTION_BOTTOM = 5;
    static ROTATION_NORMAL = 0;
    static ROTATION_TOP = -0.5;
    static ROTATION_BOTTOM = 0.5;
    textureStay: PIXI.Texture[];
    textureFly: PIXI.Texture[];
    textureFail: PIXI.Texture[];
    direction: number;

    constructor(app: Game) {
        let textureStay = [];
        let textureFly = [];
        let textureFail = [];
        for (let i = 0; i < 5; i++) {
            let texture = PIXI.Texture.fromImage(PIXI.loader.resources[GIRL].data.animations.slt[i]);
            textureFly.push(texture);
        };
        for (let i = 2; i < 5; i++) {
            let texture = PIXI.Texture.fromImage(PIXI.loader.resources[GIRL].data.animations.slt_[i]);
            textureStay.push(texture);
        };
        for (let i = 0; i < 6; i++) {
            let texture = PIXI.Texture.fromImage(PIXI.loader.resources[GIRL].data.animations.slt__[i]);
            textureFail.push(texture);
        };
        super(textureFly);
        this.textureStay = textureStay;
        this.textureFly = textureFly;
        this.textureFail = textureFail;
        this.app = app;
        this.direction = Bird.DIRECTION_BOTTOM;
        this.x = app.view.width / 2;
        this.y = app.view.height / 2;
        // this.anchor.set(0.5);
        this.animationSpeed = 0.08;
        // this.animationSpeed = 0.6;
        this.scale.x = -Math.abs(this.scale.x);
        // let coefSIze = (app.view.width / 15) / this.width;
        // this.scale.set(coefSIze);
    }

    getRealX() {
        return this.x + (this.width * this.anchor.x);
    }

    getRealY() {
        return this.y + (this.width * this.anchor.y);
    }

    startAnimation() {
        this.play();
        this.events();
    }

    fly(delta: number, isHit: boolean) {
        if (isHit) {
            return
        };
        // if (this.direction < Bird.DIRECTION_BOTTOM)  {
        //     if (this.rotation != Bird.ROTATION_TOP) this.rotation = Bird.ROTATION_TOP;
        // } else {
        //     if (this.rotation != Bird.ROTATION_NORMAL) this.rotation = Bird.ROTATION_NORMAL;
        // }
        if (this.direction < Bird.DIRECTION_BOTTOM) this.direction += delta;
        this.y += this.direction * delta;
    }

    events() {
        this.app.stage.on('click', (e: PIXI.interaction.InteractionEvent) => {
            this.direction = Bird.DIRECTION_TOP;
        })
    }
}
