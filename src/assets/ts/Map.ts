import Hexagon from './Hexagon';

export default class Map {
  public static width: number = 0;
  public static height: number = 0;
  public static matrix: Hexagon[][] = [[]];

  public static setMatrix(matrix: number[][]): void {
    this.width = matrix[0].length;
    this.height = matrix.length;
    this.createMap(matrix);
  }

  public static getPathHex(path: IHex[]): Hexagon[] {
    let arr: Hexagon[] = [];
    path.forEach((hex: IHex) => {
      if (!this.hexInMap) hex.col = this.width - 1;
      arr.push(this.matrix[hex.row][hex.col]);
    });
    return arr;
  }

  public static hexInMap(hex: IHex): boolean {
    return !(Map.matrix[hex.row] === undefined || Map.matrix[hex.row][hex.col] === undefined);
  }

  public static hexIsBlock(hex: IHex): boolean {
    return Map.matrix[hex.row][hex.col].biom.isBlock;
  }

  public static hexIsUnit(hex: IHex): boolean {
    return Map.matrix[hex.row][hex.col].unit !== null;
  }

  public static hexToID(hex: IHex): number {
    return hex.row * this.width + hex.col;
  }

  public static createMap(oldmatrix: number[][]): void {
    let matrix: Hexagon[][] = [];
    oldmatrix.forEach((row: number[], rowID: number) => {
      matrix.push([]);
      row.forEach((col: number, colID: number) => {
        let hex: Hexagon = new Hexagon(colID, rowID, col);
        matrix[rowID].push(hex);
      });
    });
    // for (let row: number = 0; row < this.height; row++) {
    //   matrix.push([]);
    //   for (let col: number = 0; col < this.width; col++) {
    //     let hex: Hexagon = new Hexagon(col, row);
    //     matrix[row].push(hex);
    //   }
    // }
    this.matrix = matrix;
  }
}
