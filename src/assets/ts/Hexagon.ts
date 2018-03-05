import Coordinate from "./Coordinate";
import setting from "./setting";
import Unit from "./Unit";
import Biom from "./Biom";

export default class Hexagon {
  public center: IAxial = {x: 0, y: 0};
  public biom: Biom;
  public unit: Unit | null = null;
  public colID: number;
  public rowID: number;
  private static readonly size: number = setting.hex.size;
  private static readonly hexH: number = Hexagon.size * 2;
  private static readonly hexW: number = Math.sqrt(3) / 2 * Hexagon.hexH;
  private static readonly hOffset: number = Hexagon.hexW + Hexagon.size / 10;
  private static readonly vOffset: number = Hexagon.hexH * (3 / 4) + Hexagon.size / 10;
  private hexOffset: IHex;

  constructor(colID: number, rowID: number, biom: number) {
    this.colID = colID;
    this.rowID = rowID;
    this.hexOffset = Coordinate.axialOffset(this.colID, this.rowID);
    this.center = {
      x: Hexagon.hOffset * (this.colID + 1) - ((this.rowID % 2 === 0) ? Hexagon.hOffset : Hexagon.hOffset / 2) + Hexagon.size,
      y: Hexagon.vOffset * (this.rowID + 1) - Hexagon.vOffset + Hexagon.size,
    };
    this.biom = new Biom(this, biom);
  }

  get coordinate(): IHex {
    return {col: this.colID, row: this.rowID};
  }
  get coordinateOffset(): IHex {
    return this.hexOffset;
  }
}
