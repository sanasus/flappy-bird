declare module "pixi-game" {
  export class Game extends PIXI.Application {
    public state: IState;
    [propName: string]: any;
  }
  export class State extends PIXI.Container {
    public game: Game;
    public stage: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    public state: IState;
    public loader: PIXI.Loader;
    public assets: PIXI.loaders.resourse;
    public add(name: string | PIXI.DisplayObject): void;
    public init(): void;
    public preload(): void;
    public create(): void;
    public update(): void;
    public rerener(): void;
    // [propName: string]: any;
  }
}

interface IState {
  active: any;
  add(name: string, state: State): void;
  start(name: string): void;
}
