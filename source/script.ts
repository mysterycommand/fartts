import './style.scss';

import Vec2 from './lib/geom/vec2';
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

// TODO: factor this out into a gravity (or maybe just general acceleration) behavior
const gravity = new Vec2(0, 0.001);
const drag = 0.99;

const { add, lerp, scale } = Vec2;

type Behavior = (p: Particle, t: number) => Vec2;
type BehaviorCreator = (...args: any[]) => Behavior;

const createGravityBehavior: BehaviorCreator = (g: Vec2) => {
  return (p: Particle, t: number) => add(p.cvel, scale(g, t * t));
};

const createDragBehavior: BehaviorCreator = (d: number) => {
  return (p: Particle, t: number) => lerp(p.cvel, p.cpos, d * t);
};

const gravityBehavior: Behavior = createGravityBehavior(gravity);
const dragBehavior: Behavior = createDragBehavior(drag);

const particle = new Particle(new Vec2(1, centerY), new Vec2(-1, centerY));
particle.behaviors.push(gravityBehavior);
particle.behaviors.push(dragBehavior);

/**
 * update: updates the simulation
 * @param t {number} - the number of miliseconds to simulate
 */
function update(t: number): void {
  particle.update(t);
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

  const { x, y } = particle.ipos(i);

  bufferContext.beginPath();
  bufferContext.arc(x, y, 3, 0, ππ);
  bufferContext.closePath();

  bufferContext.strokeStyle = 'darkred';
  bufferContext.stroke();

  canvasContext.clearRect(0, 0, stageWidth, stageHeight);
  canvasContext.drawImage(buffer, 0, 0);
}

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

    frameId = rAF(tick);
  });
}

function stop(): void {
  playStopButton.innerText = playLabel;
  playStopButton.setAttribute('aria-label', 'play');

  cAF(frameId);
  frameId = -1;
}

function goto(f: number): void {
  for (let i = 0; i < f; ++i) {
    update(simulationStep);
  }

  draw(1);
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

playStopButton.addEventListener('click', toggle);
goto(1);
