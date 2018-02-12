import './style.scss';

import Vec2 from './lib/geom/vec2';
import { min, random, π, ππ } from './lib/math';
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

const stageWidth = canvas.clientWidth / 2;
const stageHeight = canvas.clientHeight / 2;
const centerX = stageWidth / 2;
const centerY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

/**
 * SIMULATION
 */

// TODO: factor this out into a gravity (or maybe just general acceleration) behavior
const g = new Vec2(0, 0.15);
const gravity = () => g;
const drag = (p: Particle) => scale(lerp(p.cvel, zero, 0.01), -1);

const numParticles = 10;
let particles: Particle[] = [];

function init() {
  const initX = stageWidth * 0.2 + random() * stageWidth * 0.6;
  const initY = stageHeight * 0.2 + random() * stageHeight * 0.6;

  for (let i = 0; i < numParticles; ++i) {
    const cpos = new Vec2(initX, initY);
    const ppos = add(cpos, fromPolar(random() * ππ, random() * 10));

    const particle = new Particle(cpos, ppos);
    particle.behaviors.push(gravity);
    particle.behaviors.push(drag);
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
    // console.log(t); // tslint:disable-line
    particle.update(t);
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

  const start = performance.now();
  particles.some(particle => {
    const { cvel: { θ, ρ } } = particle;
    const { x, y } = particle.ipos(i);

    bufferContext.save();

    bufferContext.beginPath();
    bufferContext.fillStyle = `hsl(${θ * 180 / π},100%,50%)`;

    bufferContext.translate(x, y);
    bufferContext.rotate(θ);

    const l = ρ * 2;
    const hl = l / 2;
    bufferContext.rect(-hl, -0.5, l, 1);
    bufferContext.fill();

    bufferContext.restore();

    return performance.now() - start > step / 2;
  });

  canvasContext.drawImage(buffer, 0, 0);
}

/**
 * GAME-LOOP
 */
const step = 1000 / 60;
let excess = 0;

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
  excess += deltaTime;

  excess = min(excess, 1000);
  while (excess >= step) {
    update(step);
    excess -= step;
  }

  draw(excess / step);
}

function play(): void {
  playStopButton.innerText = stopLabel;
  playStopButton.setAttribute('aria-label', 'stop');

  frameId = rAF((time: number) => {
    firstTime = time;
    previousTime = 0;
    excess = 0;

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
    update(step);
  }

  draw(1);
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

playStopButton.addEventListener('click', toggle);
goto(3);
