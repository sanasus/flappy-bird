export default class Coordinate {
  public static hex(q: number, r: number): IHex {
    return {col: q, row: r};
  }

  public static cube(x: number, y: number, z: number): ICube {
    return {x: x, y: y, z: z};
  }

  public static cubeToAxial(cube: ICube): IHex {
    let q: number = cube.x;
    let r: number = cube.z;
    return this.hex(q, r);
  }

  public static axialToCube(hex: IHex): ICube {
    let x: number = hex.col;
    let z: number = hex.row;
    let y: number = -x - z;
    return this.cube(x, y, z);
  }

  public static axialToHex(col: number, row: number): IHex {
    return {
      col: col + Math.floor(row / 2),
      row: row,
    };
  }

  public static axialHexToHex(hex: IHex): IHex {
    return {
      col: hex.col + Math.floor(hex.row / 2),
      row: hex.row,
    };
  }

  public static cubeToOdd(cube: ICube): IHex {
    let col: number = cube.x + (cube.z - (cube.z & 1)) / 2;
    let row: number = cube.z;
    return this.hex(col, row);
  }

  public static oddToCube(hex: IHex): ICube {
    let x: number = hex.col - (hex.row - (hex.row & 1)) / 2;
    let z: number = hex.row;
    let y: number = -x - z;
    return this.cube(x, y, z);
  }

  public static axialOffset(colId: number, rowId: number): IHex {
    return this.cubeToAxial(this.oddToCube(this.hex(colId, rowId)));
  }

  public static cubeLerp(a: ICube, b: ICube, t: number): ICube {
    return this.cube(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t);
  }

  public static cubeRound(h: ICube): ICube {
    let rx: number = Math.round(h.x);
    let ry: number = Math.round(h.y);
    let rz: number = Math.round(h.z);
    let x_diff: number = Math.abs(rx - h.x);
    let y_diff: number = Math.abs(ry - h.y);
    let z_diff: number = Math.abs(rz - h.z);
    if (x_diff > y_diff && x_diff > z_diff) rx = -ry - rz;
    else if (y_diff > z_diff) ry = -rx - rz;
    else rz = -rx - ry;
    return this.cube(rx, ry, rz);
  }

  public static cubeNeighbors(): ICube[] {
    return [
      this.cube(+2, -1, -1), this.cube(+1, +1, -2), this.cube(-1, +2, -1),
      this.cube(-2, +1, +1), this.cube(-1, -1, +2), this.cube(+1, -2, +1),
    ];
  }

  //offset
  public static axialOffsetNeighbors(hex: IHex): IHex[] {
    return [
      this.hex(hex.col + 1, hex.row), this.hex(hex.col + 1, hex.row - 1), this.hex(hex.col, hex.row - 1),
      this.hex(hex.col - 1, hex.row), this.hex(hex.col - 1, hex.row + 1), this.hex(hex.col, hex.row + 1),
    ];
  }

  public static hexNeighbors(hex: IHex): IHex[] {
    return [
      this.axialHexToHex(this.hex(hex.col + 1, hex.row)),
      this.axialHexToHex(this.hex(hex.col + 1, hex.row - 1)),
      this.axialHexToHex(this.hex(hex.col, hex.row - 1)),
      this.axialHexToHex(this.hex(hex.col - 1, hex.row)),
      this.axialHexToHex(this.hex(hex.col - 1, hex.row + 1)),
      this.axialHexToHex(this.hex(hex.col, hex.row + 1)),
    ];
  }

  public static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static offsetHexDistance(a: IHex, b: IHex): number {
    return this.cubeDistance(this.axialToCube(a), this.axialToCube(b));
  }

  public static cubeDistance(a: ICube, b: ICube): number {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
  }

  public static hexIsEqual(hex1: IHex, hex2: IHex): boolean {
    return hex1.col === hex2.col && hex1.row === hex2.row;
  }

}