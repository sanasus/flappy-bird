import { Game } from "./Game";
import { BTN_NORMAL, BTN_SELECT } from "./ResourcesConst";

interface MenuItem {
    name: string;
    btn: PIXI.Sprite | null;
    click: () => void;
}

export class Menu extends PIXI.Container {
    buttons: MenuItem[] = [{
        name: 'start',
        btn: null,
        click: () => { }
    }];
    bestScoreName = 'BestScore: ';
    bestScoreText: PIXI.Text;
    padding = 10;
    textureNormal = PIXI.loader.resources[BTN_NORMAL].texture;
    textureSelect = PIXI.loader.resources[BTN_SELECT].texture;
    menuWidth = this.textureNormal.width;
    menuHeight = (this.textureNormal.height + this.padding) * this.buttons.length - this.padding;

    constructor(private game: Game) {
        super();
        let bg = this.addChild(this.drawBg(this.menuHeight + this.padding * 2));
        bg.position.set(-this.padding, -this.padding);
        this.createMenu();
        this.bestScoreText = this.createBestScoreDisplay();
    }

    showMenu() {
        this.visible = true;
    }

    hideMenu() {
        this.visible = false;
    }

    private createBestScoreDisplay(): PIXI.Text {
        let text = new PIXI.Text(this.bestScoreName + '0');
        text.anchor.set(0.5);
        let bg = this.addChild(this.drawBg(text.height + this.padding * 2));
        text.position.set(bg.width / 2, bg.height / 2);
        bg.addChild(text);
        bg.position.set(-this.padding, -this.padding * 2 - bg.height);
        this.addChild(bg);
        return text;
    }

    private drawBg(height: number): PIXI.Graphics {
        let bg = new PIXI.Graphics();
        bg.beginFill(0xad2659);
        bg.lineStyle(5, 0xad2659, 0.5);
        bg.drawRect(0, 0, this.menuWidth + this.padding * 2, height);
        bg.endFill();
        return bg;
    }

    createMenu() {
        this.buttons.forEach((el, i) => {
            el.btn = this.addChild(this.drawButton(el.name));
            el.btn.y = i * el.btn.height + this.padding * i;
            el.btn.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
                el.btn!.texture = this.textureSelect;
                el.click();
            });
            el.btn.on('pointerup', () => el.btn!.texture = this.textureNormal);
            this.game.stage.on('pointerup', () => el.btn!.texture = this.textureNormal);
        });
    }

    private drawButton(name: string): PIXI.Sprite {
        let btn = new PIXI.Sprite(PIXI.loader.resources[BTN_NORMAL].texture);
        let text = btn.addChild(new PIXI.Text(name.toUpperCase()));
        text.anchor.set(0.5);
        text.position.set(btn.width / 2, btn.height / 2);
        btn.interactive = true;
        return btn;
    }

}
