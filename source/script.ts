import './style.scss';

import Vec2 from './lib/geom/vec-2';
import { ππ } from './lib/math';
import Particle from './lib/physics/particle';

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

const playStopButton = document.getElementById('play-stop') as HTMLButtonElement;
const playLabel = '▶';
const stopLabel = '■';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const stageWidth = canvas.clientWidth / 5;
const stageHeight = canvas.clientHeight / 5;
const centerX = stageWidth / 2;
const centerY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

/**
 * SIMULATION
 */
const simulationStep = 1000 / 60;
let simulationExcess = 0;

const p = new Particle(new Vec2(1, centerY), new Vec2(0, centerY));

/**
 * update: updates the simulation
 * @param t {number} - the number of miliseconds to simulate
 */
function update(t: number): void {
  p.update();
}

/**
 * RENDERING
 */

/**
 * draw: renders a frame to the canvas
 * @param i {number} - the 'interpolation percentage' is the amount of time that
 * has yet to be simulated this frame as a percentage of the simulation step
 */
function draw(i: number): void {
  bufferContext.clearRect(0, 0, stageWidth, stageHeight);

  const { x, y } = p.getInterpolatedPosition(i);

  bufferContext.beginPath();
  bufferContext.arc(x, y, 3, 0, ππ);
  bufferContext.closePath();

  bufferContext.strokeStyle = 'darkred';
  bufferContext.stroke();

  canvasContext.clearRect(0, 0, stageWidth, stageHeight);
  canvasContext.drawImage(buffer, 0, 0);
}

draw(1);

/**
 * GAME-LOOP
 */
let frameId = -1;

// resets everytime you click 'play'
let firstTime = 0;
let previousTime = 0;

// calculated each frame, relative to first/previous frame (respectively)
let normalTime = 0;
let deltaTime = 0;

function tick(time: number): void {
  frameId = rAF(tick);

  normalTime = time - firstTime;
  deltaTime = normalTime - previousTime;

  previousTime = normalTime;
  simulationExcess += deltaTime;

  while (simulationExcess >= simulationStep) {
    update(simulationStep);
    simulationExcess -= simulationStep;
  }

  draw(simulationExcess / simulationStep);
}

function play(): void {
  playStopButton.innerText = stopLabel;
  playStopButton.setAttribute('aria-label', 'stop');

  frameId = rAF((time: number) => {
    firstTime = time;
    previousTime = 0;
    simulationExcess = 0;

    draw(1);
    frameId = rAF(tick);
  });
}

function stop(): void {
  playStopButton.innerText = playLabel;
  playStopButton.setAttribute('aria-label', 'play');

  cAF(frameId);
  frameId = -1;
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

playStopButton.addEventListener('click', toggle);
