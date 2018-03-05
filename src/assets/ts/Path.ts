import Coordinate from "./Coordinate";

export default class Path {
  public distance: number = 0;
  public points: ICube[] = [];
  public pathPoints: IHex[] = [];

  public setPath(hex: IHex | null): void {
    if (hex === null) return;
    this.points.push(Coordinate.axialToCube(hex));
    this.distance = 0;
    if (this.points.length === 2) {
      this.getDistance();
      this.getPath();
    }
  }

  public removePoints(): void {
    this.points = [];
    this.pathPoints = [];
  }

  private getPath(): void {
    let start: ICube = this.points[0];
    let fin: ICube = this.points[1];
    let distance: number = this.distance + 1;
    for (let i: number = 0; i < distance; i++) {
      let hex: IHex = Coordinate.cubeToAxial(
        Coordinate.cubeRound(
          Coordinate.cubeLerp(start, fin, 1.0 / Math.max(1, this.distance) * i)));
      this.pathPoints.push(Coordinate.axialToHex(hex.col, hex.row));
    }
  }

  private getDistance(): void {
    this.distance = this.cubeDistance(this.points[0], this.points[1]);
  }

  private cubeDistance(a: ICube, b: ICube): number {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
  }
}