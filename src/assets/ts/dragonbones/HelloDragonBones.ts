/**
 * How to use
 * 1. Load data.
 *
 * 2. Parse data.
 *    factory.parseDragonBonesData();
 *    factory.parseTextureAtlasData();
 *
 * 3. Build armature.
 *    armatureDisplay = factory.buildArmatureDisplay("armatureName");
 *
 * 4. Play animation.
 *    armatureDisplay.animation.play("animationName");
 *
 * 5. Add armature to stage.
 *    addChild(armatureDisplay);
 */
import * as dragonBones from 'dragonbones-pixi';
import BaseDemo from './BaseDemo';

export default class HelloDragonBones extends BaseDemo {
  private resName: string[] = ['mecha_1002_101d_show_ske', 'mecha_1002_101d_show_tex', 'mecha_1002_101d_show_img'];
  public constructor() {
    super();

    this._resources.push(
      [this.resName[0], require("./mecha_1002_101d_show/mecha_1002_101d_show_ske.json")],
      // "./mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin"),
      [this.resName[1], require("./mecha_1002_101d_show/mecha_1002_101d_show_tex.json")],
      [this.resName[2], require("./mecha_1002_101d_show/mecha_1002_101d_show_tex.png")],
    );
    this._loadResources();
  }

  protected _onStart(): void {
    const factory: any = dragonBones.dragonBones.PixiFactory.factory;
    factory.parseDragonBonesData(this._pixiResources[this.resName[0]].data);
    // factory.parseDragonBonesData(this._pixiResources[
    //   "./mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin")].data);
    factory.parseTextureAtlasData(this._pixiResources[this.resName[1]].data,
      this._pixiResources[this.resName[2]].texture);

    const armatureDisplay: any = factory.buildArmatureDisplay("mecha_1002_101d", "mecha_1002_101d_show");
    armatureDisplay.animation.play("idle");
    console.log(this._pixiResources);
    let scale: number = 0.2;
    armatureDisplay.x = 657 / 2 * scale;
    armatureDisplay.y = 467 * scale;
    armatureDisplay.scale.set(scale);
    console.log(armatureDisplay);
    this.addChild(armatureDisplay);
  }
}