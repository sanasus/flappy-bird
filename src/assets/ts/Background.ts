export default class Background extends PIXI.Sprite {
  constructor(texture?: PIXI.Texture) {
    super(texture);
    this.name = 'background';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}