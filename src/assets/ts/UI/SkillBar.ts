export default class SkillBar extends PIXI.Container {
  public opt: any = {size: 45, radius: 15, count: 2, offset: 15};
  public slots: any = [];
  constructor() {
    super();
    this.name = 'skillBar';
    // this.zIndex = 2;
    this.position.set(this.opt.offset, window.app.screen.height - (this.opt.offset + this.opt.size));
    this.drawButtons();
    window.app.stage.addChild(this);
  }

  public pickSkill(id: number): boolean {
    let slot: any = this.slots[id - 1];
    slot.active = !slot.active;
    this.slots.forEach((button: any, i: number) => {
      button.active = ((id - 1) === i) ? slot.active : false;
      this.slotColor(button.el, i, button.active);
    });
    return slot.active;
  }

  private drawButtons(): void {
    for (let i: number = 0; i < this.opt.count; i++) {
      let graphics: PIXI.Graphics = new PIXI.Graphics();
      this.slotColor(graphics, i);
      graphics.interactive = true;
      this.addChild(graphics);
      this.slots.push({el: graphics, active: false});
    }
  }

  private slotColor(slot: PIXI.Graphics, i: number, press?: boolean): void {
    let alpha: number = 0.4;
    if (press) alpha = 0.8;
    slot.alpha = alpha;
    slot.clear();
    slot.lineStyle(1, 0x000000, 1);
    slot.beginFill(0xffffff, 1);
    slot.drawRoundedRect(i * (this.opt.offset + this.opt.size), 0, this.opt.size, this.opt.size, this.opt.radius);
    slot.endFill();
  }
}