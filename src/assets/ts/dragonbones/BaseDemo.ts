import * as dragonBones from 'dragonbones-pixi';

export default abstract class BaseDemo extends PIXI.Container {
  protected readonly _resources: string[][] = [];
  protected _pixiResources: dragonBones.dragonBones.Map<PIXI.loaders.Resource> = {};

  public constructor() {
    super();
  }

  protected abstract _onStart(): void;

  protected _renderHandler(deltaTime: number): void {
    window.app.render();
  }

  protected _startRenderTick(): void {
    PIXI.ticker.shared.add(this._renderHandler, this);
  }

  protected _loadResources(): void {
    const binaryOptions: any = {
      loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
      xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
    };

    for (const resource of this._resources) {
      if (resource.hasOwnProperty("dbbin")) {
        PIXI.loader.add(resource[0], resource[1], binaryOptions as any);
      }
      else {
        PIXI.loader.add(resource[0], resource[1]);
      }
    }

    PIXI.loader.once(
      "complete",
      (loader: PIXI.loaders.Loader,
       resources: dragonBones.dragonBones.Map<PIXI.loaders.Resource>) => {

      this._pixiResources = resources;
      this._onStart();
      // this._startRenderTick(); // Make sure render after dragonBones update.
    });
    PIXI.loader.load();
  }
}