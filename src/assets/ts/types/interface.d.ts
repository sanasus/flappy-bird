interface Window {
  // app: PIXI.Application;
  GUI: any;
  app: Game;
}
interface ICube {
  x: number;
  y: number;
  z: number;
}
interface IHex {
  col: number;
  row: number;
}
interface IAxial {
  x: number;
  y: number;
}
interface IArmatures {
  [propName: string]: string[];
}