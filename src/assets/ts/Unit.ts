import * as dragonBones from "dragonbones-pixi";
import Map from "./Map";
import Hexagon from "./Hexagon";
import Biom from "./Biom";
import TextureGenerator from "./TextureGenerator";
import Coordinate from "./Coordinate";
import PathFind from "./PathFind";

export default class Unit extends PIXI.utils.EventEmitter {
  private _armatureDisplay: dragonBones.dragonBones.PixiArmatureDisplay;
  public hex: Hexagon | null = null;
  public moveSpeed: number = 3;
  private movePath: Hexagon[] = [];
  private shared: any;
  public isMove: boolean = false;
  public container: PIXI.projection.Sprite2d = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
  public hitContainer: PIXI.projection.Sprite2d = new PIXI.projection.Sprite2d(TextureGenerator.texture[0]);
  public attackName: string = 'attack_01';
  public stats: any = {HP: 500, maxHP: 500, atk: 250};

  constructor(armatureName: string) {
    super();
    let unit: any = dragonBones.dragonBones.PixiFactory.factory.buildArmatureDisplay(armatureName);
    if (unit === null) {
      throw new Error('ERROR buildArmatureDisplay');
    } else {
      this._armatureDisplay = unit;
    }
    this.container.tint = 0xff0000;
    this.container.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.container.anchor.set(0.5, 0.5);
    this.container.addChild(this.unit);
    this.container.addChild(this.hitContainer);
    this.hitContainer.alpha = 0;
    this.hitContainer.hitArea = TextureGenerator.polygon;
    this.hitContainer.interactive = true;
    this.unit.on(dragonBones.dragonBones.EventObject.COMPLETE, this.animationComplete.bind(this));
    this.unit.on(dragonBones.dragonBones.EventObject.LOOP_COMPLETE, this.loopComplete.bind(this));
    this.unit.on(dragonBones.dragonBones.EventObject.FRAME_EVENT, this.frameComplete.bind(this));
    this.unit.animation.play('idle');
    this.unit.scale.set(0.25);
    this.gui();
  }

  get unit(): dragonBones.dragonBones.PixiArmatureDisplay {
    return this._armatureDisplay;
  }

  public addToMap(container: PIXI.projection.Container2d, hex?: Hexagon): void {
    if (this.container.parent !== null) return;
    if (hex) {
      if (Map.hexIsBlock(hex.coordinate) || Map.hexIsUnit(hex.coordinate)) return;
      this.setHex(hex);
    }
    container.addChild(this.container);
  }

  public setHex(hex: Hexagon): void {
    this.hex = hex;
    this.container.x = hex.center.x;
    this.container.y = hex.center.y;
    hex.unit = this;
  }

  public attack(enemy: Unit): void {
    if (enemy.hex === null) return;
    if (enemy.stats.HP === 0 || !this.unit.animation.getState("idle")) return;
    Coordinate.hexNeighbors(enemy.hex.coordinateOffset).forEach((el: IHex) => {
      if (this.hex !== null && Coordinate.hexIsEqual(el, this.hex.coordinate)) {
        this.flipToEnemy(enemy.container);
        this.unit.animation.play(this.attackName);
        this.unit.once(dragonBones.dragonBones.EventObject.COMPLETE, (event: dragonBones.dragonBones.EventObject) => {
          enemy.hit(this);
          this.stats.HP -= 10;
          this.emit('changeHP');
        });
      }
    });
  }

  public hit(enemy: Unit): void {
    this.flipToEnemy(enemy.container);
    this.unit.animation.fadeIn('hit', 0.2);
    this.stats.HP -= enemy.stats.atk;
    this.emit('changeHP');
    if (this.stats.HP <= 0) {
      this.stats.HP = 0;
      this.unit.animation.fadeIn('death', 0.2);
    }
  }

  public setMovePath(path: Hexagon[]): this {
    this.movePath = path;
    this.isMove = true;
    this.unit.animation.fadeIn('walk', 0.5);
    this.emit('move-start');
    this.shared = (delta: number): void => this.move(delta);
    PIXI.ticker.shared.add(this.shared);
    return this;
  }

  private move(delta: number): void {
    if (this.movePath.length > 1) {
      this.unit.animation.timeScale = this.moveSpeed;
      let fin: IAxial = this.movePath[1].center;
      if (this.step(fin)) {
        this.movePath[0].biom.filters = [];
        PathFind.pathPoints = [];
        this.movePath[0].unit = null;
        this.setHex(this.movePath[1]);
        this.movePath.splice(0, 1);
      }
    } else {
      PIXI.ticker.shared.remove(this.shared);
      this.isMove = false;
      this.emit('move-end');
      if (this.unit.animation.getState("walk")) {
        this.unit.animation.timeScale = 1;
        this.unit.animation.fadeIn('idle', 0.2);
      }
    }
  }

  private step(fin: IAxial): boolean {
    if (fin.y !== this.container.y) {
      this.stepDirection(fin, 'x', this.moveSpeed / 1.8);
      this.stepDirection(fin, 'y', this.moveSpeed);
    } else {
      this.stepDirection(fin, 'x', this.moveSpeed);
    }
    return fin.x === this.container.x && fin.y === this.container.y;
  }

  private stepDirection(fin: IAxial, direction: 'x' | 'y', speed: number): void {
    if (fin[direction] > this.container[direction]) {
      if (direction === 'x') this.flip();
      this.container[direction] += speed * PIXI.ticker.shared.speed;
      if (fin[direction] < this.container[direction]) this.container[direction] = fin[direction];
    }
    if (fin[direction] < this.container[direction]) {
      if (direction === 'x') this.flip('left');
      this.container[direction] -= speed * PIXI.ticker.shared.speed;
      if (fin[direction] > this.container[direction]) this.container[direction] = fin[direction];
    }
  }

  private flip(leftOrRight: string = 'right'): number {
    if (leftOrRight === 'left') return this.unit.scale.x = -Math.abs(this.unit.scale.x);
    else return this.unit.scale.x = Math.abs(this.unit.scale.x);
  }

  private flipToEnemy(enemy: IAxial): void {
    if (this.container.x < enemy.x)  this.flip();
    else this.flip('left');
  }

  private animationComplete(event: dragonBones.dragonBones.EventObject): void {
    // console.log('animationComplete');
    if (event.animationState.name === "death") {
      this.unit.animation.stop();
      if (this.hex !== null) this.hex.unit = null;
      this.hex = null;
      this.hitContainer.interactive = false;
      this.emit('death');
      return;
    }
    this.unit.animation.fadeIn("idle", 0.2);
  }

  private loopComplete(event: dragonBones.dragonBones.EventObject): void {
    // console.log('loopComplete');
  }

  private frameComplete(event: dragonBones.dragonBones.EventObject): void {
    // console.log('frameComplete');
  }

  private gui(): void {
    // if (window.GUI.fPlayer !== undefined) window.GUI.removeFolder(window.GUI.fPlayer);
    // window.GUI.fPlayer = window.GUI.addFolder('player');
    // window.GUI.fPlayer.add(this.unit.scale, 'x');
    // window.GUI.fPlayer.add(this.unit.scale, 'y');
    // window.GUI.fPlayer.add(this.unit, 'rotation');
  }
}