import './style.scss';

import Vec2 from './lib/geom/vec2';
import { random, π, ππ } from './lib/math';
import Particle from './lib/physics/particle';

const { add, fromPolar, lerp, scale, zero } = Vec2;
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
const gravity = new Vec2(0, 0.1);
const drag = 0.01;

type Behavior = (p: Particle, t: number) => Vec2;
type BehaviorCreator = (...args: any[]) => Behavior;

const createGravityBehavior: BehaviorCreator = (g: Vec2) => {
  return (p: Particle, t: number) => scale(g, t * t);
};

const createDragBehavior: BehaviorCreator = (d: number) => {
  return (p: Particle, t: number) => lerp(p.cvel, zero, d * t);
};

const gravityBehavior: Behavior = createGravityBehavior(gravity);
const dragBehavior: Behavior = createDragBehavior(drag);

let particles: Particle[] = [];
function init() {
  const particleX = stageWidth * 0.2 + random() * stageWidth * 0.6;
  const particleY = stageHeight * 0.2 + random() * stageHeight * 0.6;
  for (let i = 0; i < 500; ++i) {
    const cpos = new Vec2(particleX, particleY);
    const ppos = add(cpos, fromPolar(random() * ππ, random() * 5));

    const particle = new Particle(cpos, ppos);
    particle.behaviors.push(gravityBehavior);
    particle.behaviors.push(dragBehavior);
    particles.push(particle);
  }
}

/**
 * update: updates the simulation
 * @param t {number} - the number of miliseconds to simulate
 */
function update(t: number): void {
  if (particles.length === 0) {
    init();
  }

  particles.forEach(particle => {
    // console.log(particle.vel); // tslint:disable-line
    particle.update(1);
  });

  particles = particles.filter(({ cpos: { y } }) => y < stageHeight);
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
  canvasContext.clearRect(0, 0, stageWidth, stageHeight);

  particles.forEach(particle => {
    const { x, y } = particle.ipos(i);

    bufferContext.beginPath();
    bufferContext.arc(x, y, 3, 0, ππ);
    bufferContext.closePath();

    bufferContext.strokeStyle = `hsl(${particle.cvel.θ * 180 / π},100%,50%)`;
    bufferContext.stroke();
  });

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
goto(0);
