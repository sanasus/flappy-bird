import setting from "./setting";

export default class TextureGenerator {
  public static polygon: PIXI.Polygon = new PIXI.Polygon(TextureGenerator.points());
  public static texture: PIXI.Texture[] = TextureGenerator.textureList();

  public static generate(fill: number = 0x000000, alpha: number = 0): PIXI.Texture {
    let hex: PIXI.Graphics = new PIXI.Graphics();
    hex.lineStyle(1, 0x000000, 0.5);
    hex.beginFill(fill, alpha);
    hex.drawPolygon(TextureGenerator.polygon);
    hex.endFill();
    return hex.generateCanvasTexture();
  }

  public static textureList(): PIXI.Texture[] {
    return [
      TextureGenerator.generate(),
      TextureGenerator.generate(0x000000, 1),
      TextureGenerator.generate(0x000000, 0.6),
      TextureGenerator.generate(0x123456, 0.2),
    ];
  }

  private static points(): number[] {
    let points: number[] = [];
    for (let i: number = 0; i <= 6; i++) {
      let corner: any = this.corner(i);
      points.push(Math.round(corner.x), Math.round(corner.y));
    }
    return points;
  }

  private static corner(i: number): IAxial {
    let angle_deg: number = 60 * i + 30;
    let angle_rad: number = Math.PI / 180 * angle_deg;
    return {x: setting.hex.size * Math.cos(angle_rad), y: setting.hex.size * Math.sin(angle_rad)};
  }
}