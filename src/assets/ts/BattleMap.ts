import Map from "./Map";
import Hexagon from "./Hexagon";
import Unit from './Unit';
import PathFind from "./PathFind";
import "pixi-projection";
import PlayerUnit from "./PlayerUnit";
import PointLike = PIXI.PointLike;
import {OutlineFilter} from 'pixi-filters';

export default class BattleMap extends PIXI.projection.Container2d {
  public player: PlayerUnit = new PlayerUnit('mecha_1004d');
  public enemies: Unit[] = [new Unit('mecha_1004d'),
    new Unit('mecha_1004d'),
    new Unit('mecha_1004d'),
    new Unit('mecha_1004d')];
  public biomContainer: PIXI.projection.Container2d = new PIXI.projection.Container2d();
  public killToWin: number = this.enemies.length;

  constructor(parent: any) {
    super();
    this.parent = parent;
    this.name = 'BattleMap';
    let date: any = new Date().getMilliseconds();
    this.stageInit();
    console.log(date - new Date().getMilliseconds(), 'ms');
    // this.addDevInfo();
    this.position.set(this.parent.width / 2 - this.width / 2,
      this.parent.height / 2 - this.height / 2);
    let AxisY: any = {"AxisY-x": -100, "AxisY-y": 800, "affine": -0.2};
    this.proj.setAxisY(<PointLike>{x: AxisY["AxisY-x"], y: AxisY["AxisY-y"]}, AxisY["affine"]);
  }

  private stageInit(): void {

    Map.matrix.forEach((row: Hexagon[]) => {
      row.forEach((hex: Hexagon) => {
        if (!hex.biom.isBlock) {
          this.enemies.forEach((unit: Unit) => {
            if ((unit.hex === null) && (hex.coordinate.col === Map.width - 1) && !Map.hexIsUnit(hex.coordinate)) {
              unit.setHex(hex);
            }
          });
        }
        this.addChildAt(hex.biom, Map.hexToID(hex.coordinate));

        hex.biom.on('click', (): void => {
          if (this.player.hex === null) this.player.addToMap(this, hex);
          if (!this.player.isMove) {
            this.player.setMovePath(Map.getPathHex(PathFind.pathPoints));
          }
        });

        hex.biom.on('mouseover', (): void => {
          if (this.player.hex !== null && !this.player.isMove) {
            PathFind.playerPath(this.player.hex, hex);
          }
        });
      });
    });
    this.addChild(this.biomContainer);
    this.enemies.forEach((unit: Unit) => {
      unit.addToMap(this);
      unit.hitContainer.on('click', (): void => {
        this.player.attack(unit);
      });
      unit.on('death', () => {
        this.killToWin--;
        if (this.killToWin === 0) this.player.unit.animation.play('victory');
      });
    });
  }

  private addDevInfo(): void {
    Map.matrix.forEach((row: Hexagon[]) => {
      row.forEach((hex: Hexagon) => {
        this.devInfo(hex);
      });
    });
  }

  private devInfo(hex: Hexagon): void {
    let options: PIXI.TextStyle = new PIXI.TextStyle({
      fontSize: 16,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    let optionsOffset: PIXI.TextStyle = new PIXI.TextStyle({
      fontSize: 12,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    let coordinate: PIXI.projection.Text2d = new PIXI.projection.Text2d(
      hex.coordinate.col + ',' + hex.coordinate.row, options);
    let coordinateOffset: PIXI.projection.Text2d = new PIXI.projection.Text2d(
      hex.coordinateOffset.col + ',' + hex.coordinateOffset.row, optionsOffset);
    coordinateOffset.x = hex.center.x + 5;
    coordinateOffset.y = hex.center.y;
    coordinate.x = hex.center.x - 5;
    coordinate.y = hex.center.y;
    coordinate.anchor.set(1, 0);
    coordinateOffset.anchor.set(0);
    this.addChild(coordinate, coordinateOffset);
  }
}