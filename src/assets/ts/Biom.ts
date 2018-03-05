import Map from "./Map";
import Hexagon from "./Hexagon";
import "pixi-projection";
import TextureGenerator from "./TextureGenerator";
import Coordinate from "./Coordinate";

export  default class Biom extends PIXI.projection.Sprite2d {
  public hex: Hexagon;
  public isBlock: boolean;
  public cost: number;
  constructor(hex: Hexagon, img: number) {
    super(TextureGenerator.texture[img]);
    this.hex = hex;
    this.isBlock = img === 1;
    this.cost = (img === 2) ? 3 : 1;
    this.position.set(hex.center.x, hex.center.y);
    this.interactive = true;
    this.hitArea = TextureGenerator.polygon;
    this.anchor.set(0.5);
  }
}