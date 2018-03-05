import PlayerUnit from '../PlayerUnit';
export default class ResourceBar extends PIXI.Container {
  public opt: any = {w: 150, h: 20, radius: 5, offsetV: 75, offsetH: 15};
  public player: PlayerUnit;
  public hpBar: PIXI.Graphics = new PIXI.Graphics();
  public hpText: PIXI.Text = this.textInfo();
  constructor(player: PlayerUnit) {
    super();
    this.player = player;
    // this.zIndex = 2;
    this.position.set(this.opt.offsetH, window.app.screen.height - (this.opt.offsetV + this.opt.h));
    this.drawBar();
    this.hpText.text = this.player.stats.HP + ' / ' + this.player.stats.maxHP;
    this.addChild(this.hpBar);
    this.addChild(this.hpText);
    window.app.stage.addChild(this);
    this.player.on('changeHP', this.hpChange.bind(this));
  }

  public hpChange(): void {
    this.hpText.text = this.player.stats.HP + ' / ' + this.player.stats.maxHP;
    this.drawBar();
  }

  private getProcent(): number {
    if (this.player.stats.HP <= 0) return 0;
    if (this.player.stats.HP >= this.player.stats.maxHP) return 100;
    let oneProc: number = this.player.stats.maxHP / 100;
    return this.player.stats.HP / oneProc;
  }

  private drawBar(): void {
    let currentHP: number = this.opt.w / 100 * this.getProcent();
    this.hpBar.clear();
    this.hpBar.lineStyle(1, 0x000000, 1);
    this.hpBar.beginFill(0xffffff, 1);
    this.hpBar.drawRoundedRect(0, 0, this.opt.w, this.opt.h, this.opt.radius);
    this.hpBar.endFill();
    this.hpBar.beginFill(0xff0000, 1);
    this.hpBar.lineStyle(0, 0x000000, 1);
    this.hpBar.drawRoundedRect(0, 0, currentHP, this.opt.h, this.opt.radius);
    this.hpBar.endFill();
  }

  private textInfo(): PIXI.Text {
    let opt: PIXI.TextStyle = new PIXI.TextStyle({
      fontSize: 14,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    let hp: PIXI.Text = new PIXI.Text('', opt);
    hp.position.x = 5;
    return hp;
  }
}