import Unit from './Unit';
import SkillBar from "./UI/SkillBar";
import ResourceBar from "./UI/ResourceBar";
import * as dragonBones from "dragonbones-pixi";
export default class PlayerUnit extends Unit {
  // public skillBar: SkillBar = new SkillBar();
  public resourceBar: ResourceBar = new ResourceBar(this);
  constructor(armatureName: string) {
    super(armatureName);
    // this.setSkill();

    console.log(this.unit.animation.animationNames);
    console.log(dragonBones.dragonBones.PixiFactory.factory.getAllDragonBonesData());
  }

  // private setSkill(): void {
  //   PIXI.keyboardManager.on('pressed', (key: any) => {
  //     if (PIXI.keyboardManager.isPressed(PIXI.keyboard.Key._1)){
  //       if (this.skillBar.pickSkill(1)) this.attackName = 'skill_01';
  //       else this.attackName = 'attack_01';
  //     }
  //     if (PIXI.keyboardManager.isPressed(PIXI.keyboard.Key._2)){
  //       if (this.skillBar.pickSkill(2)) this.attackName = 'skill_03';
  //       else this.attackName = 'attack_01';
  //     }
  //   });
  // }
}