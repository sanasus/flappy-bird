import 'normalize.css';
import './assets/scss/app.scss';
import "pixi.js";
import { Game } from './ts/Game';

const game = new Game({ width: window.innerWidth, height: window.innerHeight, antialias: true, backgroundColor: 0x4adbe2});
let root = document.getElementById('app') as HTMLElement;
root.appendChild(game.view);