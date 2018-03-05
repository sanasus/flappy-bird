import 'normalize.css';
import './assets/scss/app.scss';
import * as PIXI from 'pixi.js';
import "./assets/ts/keyboard";
import Boot from "./assets/ts/state/Boot";
import Battle from "./assets/ts/state/Battle";
import {Game} from "./assets/ts/pixi-game";
import datGui from "dat.gui";
import "pixi-layers";

class App extends Game {
  constructor() {
    super(window.innerWidth, window.innerHeight, {
      backgroundColor: 0xf0f0f0,
      antialias: true,
    });
    PIXI.ticker.shared.speed = 1;

    this.state.add("Battle", Battle);
    this.state.add("Boot", Boot);
    this.state.start('Boot');

    window.onresize = (): void => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.state.active.state.removeChildren();
      this.state.active.state.rerender();
    };
  }
}

window.app = new App();
document.body.appendChild(window.app.view);

window.GUI = new datGui.GUI();
window.GUI.fGame = window.GUI.addFolder('game');
window.GUI.fGame.add(PIXI.ticker.shared, 'speed');
// let type: string = "WebGL";
// if (!PIXI.utils.isWebGLSupported()) {
//   type = "canvas";
// }
// PIXI.utils.sayHello(type);
//
// let stage: any = new PIXI.display.Stage();
// stage.group.enableSort = true;
// window.app.stage = stage;
//
//   function addStage(): void {
//     let mapContainer2d: any = new BattleStage2D();
//     bg.zIndex = 1;
//     mapContainer2d.zIndex = 2;
//
//     stage.addChild(bg);
//     stage.addChild(mapContainer2d);
//     if (window.GUI.fmapContainer2d !== undefined) window.GUI.removeFolder(window.GUI.fmapContainer2d);
//     window.GUI.fmapContainer2d = window.GUI.addFolder('mapContainer2d');
//     window.GUI.fmapContainer2d.add(Map, 'width').onChange(addStage);
//     window.GUI.fmapContainer2d.add(Map, 'height').onChange(addStage);
//     window.GUI.fmapContainer2d.add(mapContainer2d, 'x');
//     window.GUI.fmapContainer2d.add(mapContainer2d, 'y');
//     window.GUI.fmapContainer2d.add(AxisY, 'AxisY-x').onChange((val: number) => {
//       AxisY["AxisY-x"] = val;
//       mapContainer2d.proj.setAxisY({x: AxisY["AxisY-x"], y: AxisY["AxisY-y"]}, -0.2);
//     });
//     window.GUI.fmapContainer2d.add(AxisY, 'AxisY-y').onChange((val: number) => {
//       AxisY["AxisY-y"] = val;
//       mapContainer2d.proj.setAxisY({x: AxisY["AxisY-x"], y: AxisY["AxisY-y"]}, -0.2);
//     });
//     window.GUI.fmapContainer2d.add(AxisY, 'affine').onChange((val: number) => {
//       AxisY["affine"] = val;
//       mapContainer2d.proj.setAxisY({x: AxisY["AxisY-x"], y: AxisY["AxisY-y"]}, AxisY["affine"]);
//     });
