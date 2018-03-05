import * as dragonBones from "dragonbones-pixi";

export default abstract class MainLoader {

  public static loadResources(loadResources: string[]): void {
    const binaryOptions: any = {
      loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
      xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
    };

    for (const resource of loadResources) {
      if (resource.hasOwnProperty("dbbin")) {
        PIXI.loader.add(resource, resource, binaryOptions as any);
      }
      else {
        PIXI.loader.add(resource, resource);
      }
    }

    PIXI.loader.once(
      "complete",
      (loader: PIXI.loaders.Loader,
       resources: dragonBones.dragonBones.Map<PIXI.loaders.Resource>) => {
        const factory: any = dragonBones.dragonBones.PixiFactory.factory;
        // console.log(resources);
        let dataAndTexture: any = {};
        for (let res in resources) {
          if (resources[res].data.armature) {
            factory.parseDragonBonesData(resources[res].data);
          } else {
            let name: any = res.split('.');
            if (dataAndTexture[name[0]] !== undefined) {
              dataAndTexture[name[0]].push(name[1]);
            } else {
              dataAndTexture[name[0]] = [name[1]];
            }
          }
        }
        for (let key in dataAndTexture) {
          if (dataAndTexture[key].length === 2) {
            let data: string = key + '.' + dataAndTexture[key][0];
            let texture: string = key + '.' + dataAndTexture[key][1];
            factory.parseTextureAtlasData(resources[data].data, resources[texture].texture);
          }
        }
        // this._startRenderTick(); // Make sure render after dragonBones update.
      });
  }
}