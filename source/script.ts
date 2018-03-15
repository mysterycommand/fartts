import './style.scss';

import Keyboard, { KeyCode } from './lib/input/keyboard';
import Mouse from './lib/input/mouse';
import { floor, min, random, round, toDegrees, π, ππ } from './lib/math';

const keyboard = new Keyboard(document);
const mouse = new Mouse(document);

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const stageScale = 1;
const stageWidth = canvas.clientWidth / stageScale;
const stageHeight = canvas.clientHeight / stageScale;
const stageCenterX = stageWidth / 2;
const stageCenterY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

function draw(/* i: number */): void {
  bufferContext.fillStyle = '#666';
  bufferContext.fillRect(0, 0, stageWidth, stageHeight);

  // draw stuff in bufferContext

  canvasContext.drawImage(buffer, 0, 0);
}

function tick(): void {
  rAF(tick);
  draw();
}

tick();
