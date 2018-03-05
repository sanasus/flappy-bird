import {State} from "../pixi-game";
import Map from "../Map";
import BattleMap from '../BattleMap';
import Background from "../Background";
import SkillBar from "../UI/SkillBar";

export default class Battle extends State {

  public init(): void {
    Map.setMatrix(this.assets['map'].data.matrix);
    this.add(new Background(this.assets['bg'].texture));
    const mapContainer2d: PIXI.projection.Container2d = new BattleMap(this);
    this.add(mapContainer2d);
  }
  public preload(): void {
  }
  public create(): void {
    const skillBar: SkillBar = new SkillBar();
  }
  public update(): void {
    PIXI.keyboardManager.update();
  }
}