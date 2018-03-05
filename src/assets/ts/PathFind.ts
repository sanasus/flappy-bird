import Coordinate from "./Coordinate";
import Map from "./Map";
import Hexagon from "./Hexagon";
import Unit from "./Unit";
import {OutlineFilter} from "pixi-filters";

interface ICameFrom {
  [propName: string]: IHex | null;
}

interface ICostSoFar {
  [propName: string]: number;
}

interface IPriorHex {
  prior: number;
  hex: IHex;
}

export default class PathFind {
  public static pathPoints: IHex[] = [];

  private static priorQueue: IPriorHex[] = [];
  private static start: IHex = {col: 0, row: 0};
  private static finish: IHex = {col: 0, row: 0};
  private static cameFrom: ICameFrom = {};
  private static costSoFar: ICostSoFar = {};

  public static playerPath(start: Hexagon, finish: Hexagon): void {
    let outlineFilterBlue: any = new OutlineFilter(2, 0x99ff99);
    PathFind.pathPoints.forEach((el: IHex) => {
      Map.matrix[el.row][el.col].biom.filters = [];
    });
    PathFind.getPath(start, finish);
    PathFind.pathPoints.forEach((el: IHex) => {
      Map.matrix[el.row][el.col].biom.filters = [outlineFilterBlue];
    });
  }

  public static getPath(start: Hexagon, finish: Hexagon): void {
    PathFind.start = start.coordinateOffset;
    PathFind.finish = finish.coordinateOffset;
    if (Map.hexIsBlock(start.coordinate) || PathFind.isBlock(finish.coordinate)) return;
    PathFind.getAllPath();
    PathFind.getFindPath();
  }

  private static getAllPath(): void {
    PathFind.priorQueue = [];
    PathFind.addPriorFrontier(PathFind.start, 0);
    PathFind.cameFrom = {};
    PathFind.costSoFar = {};
    PathFind.cameFrom[JSON.stringify(PathFind.start)] = null;
    PathFind.costSoFar[JSON.stringify(PathFind.start)] = 0;
    let current: IPriorHex;
    let date: any = new Date().getMilliseconds();
    while (PathFind.priorQueue.length !== 0) {
      current = PathFind.getPriorFrontier();
      if (current.hex.col === PathFind.finish.col && current.hex.row === PathFind.finish.row) break;

      Coordinate.axialOffsetNeighbors(current.hex).forEach((next: IHex) => {
        let nextHex: IHex = Coordinate.axialHexToHex(next);
        if (!Map.hexInMap(nextHex) || PathFind.isBlock(nextHex)) return;
        let nextOffset: IPriorHex = {
          prior: Map.matrix[nextHex.row][nextHex.col].biom.cost,
          hex: next,
        };
        let newCost: number = PathFind.costSoFar[JSON.stringify(current.hex)] +  nextOffset.prior;
        if (PathFind.nextNotInCostSoFar(nextOffset.hex) || newCost < PathFind.costSoFar[JSON.stringify(nextOffset.hex)]) {
          PathFind.costSoFar[JSON.stringify(nextOffset.hex)] = newCost;
          let prior: number = newCost + Coordinate.offsetHexDistance(PathFind.finish, nextOffset.hex);
          PathFind.addPriorFrontier(nextOffset.hex, prior);
          PathFind.cameFrom[JSON.stringify(nextOffset.hex)] = current.hex;
        }
      });
    }
    console.log(date - new Date().getMilliseconds(), 'ms');
  }

  private static getFindPath(): void {
    PathFind.pathPoints = [];
    let current: IHex | null = PathFind.finish;
    while (current !== null) {
      if (current === undefined) break;
      PathFind.pathPoints.push(Coordinate.axialToHex(current.col, current.row));
      current = PathFind.cameFrom[JSON.stringify(current)];
    }
    PathFind.pathPoints.reverse();
    // console.log(PathFind.pathPoints);
  }

  private static getPriorFrontier(): IPriorHex {
    PathFind.priorQueue = PathFind.priorQueue.sort((current: IPriorHex, next: IPriorHex) => {
      return (current.prior > next.prior) ? 1 : ((next.prior > current.prior) ? -1 : 0);
    });
    let hex: IPriorHex = PathFind.priorQueue[0];
    PathFind.priorQueue.shift();
    return hex;
  }

  private static addPriorFrontier(h: IHex, p: number): any {
    PathFind.priorQueue.push({prior: p, hex: h});
  }

  private static nextNotInCostSoFar(next: IHex): boolean {
    for (let key in PathFind.costSoFar) {
      if (key === JSON.stringify(next)) return false;
    }
    return true;
  }

  private static isBlock(hex: IHex): boolean {
    return Map.hexIsBlock(hex) || Map.hexIsUnit(hex);
  }
}