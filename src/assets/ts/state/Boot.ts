import {State} from "../pixi-game";
import * as dragonBones from "dragonbones-pixi";
export default class Boot extends State {
  public init(): void {
    const loading: PIXI.Text = new PIXI.Text('loading...', {
        fontSize: 50,
        fill: 0xff0f0f,
      });
    loading.position.set(this.stage.width / 2, this.stage.height / 2);
    loading.anchor.set(0.5);
    loading.name = 'loading';
    this.add(loading);
  }
  public preload(): void {
    if (this.loader.resources['mecha_1004d_ske.json']) return;
    this.loader.add('mecha_1004d_ske.json', '/static/mecha_1004d/mecha_1004d_ske.json');
    this.loader.add('mecha_1004d_tex.json', '/static/mecha_1004d/mecha_1004d_tex.json');
    this.loader.add('mecha_1004d_tex.png', '/static/mecha_1004d/mecha_1004d_tex.png');
    this.loader.add('bg', '/static/bg.png');
    this.loader.add('map', '/static/map.json');
    this.loader.onProgress.add((loader: any) => {
      let loading: PIXI.Text = <PIXI.Text>this.getChildByName('loading');
      loading.text = `loading ${parseInt(loader.progress, 10)}%`;
    });
  }
  public create(): void {
    const factory: any = dragonBones.dragonBones.PixiFactory.factory;
    factory.parseDragonBonesData(this.loader.resources['mecha_1004d_ske.json'].data);
    factory.parseTextureAtlasData(this.loader.resources['mecha_1004d_tex.json'].data, this.loader.resources['mecha_1004d_tex.png'].texture);
    this.state.start('Battle');
  }
  public update(): void {
  }
}