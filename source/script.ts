import './style.scss';

import Vec2, { add, fromPolar, lerp, limit, normalize, scale, sub } from './lib/geom/vec2';
import { min, random, π, ππ } from './lib/math';
import Particle from './lib/physics/particle';

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

// const playStopButton = document.getElementById('play-stop') as HTMLButtonElement;
// const playLabel = '▶';
// const stopLabel = '■';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const stageScale = 2;
const stageWidth = canvas.clientWidth / stageScale;
const stageHeight = canvas.clientHeight / stageScale;
const centerX = stageWidth / 2;
const centerY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

/**
 * SIMULATION
 */

// TODO: factor this out into a constant force behavior
// const g = new Vec2(0, 0.15);
// const gravity = () => g;

// TODO: factor this out into a drag behavior
// const d = 0.01;
// const drag = (p: Particle) => scale(lerp(p.cvel, Vec2.zero, d), -1);

const speed = 3 / stageScale;
const force = 0.025 / stageScale;

function getSeparate(ps: Particle[], dist: number = 40 / stageScale): (p: Particle) => Vec2 {
  return (p: Particle): Vec2 => {
    let j = 0;

    let w = ps.reduce((v, q) => {
      const d = sub(p.cpos, q.cpos);

      if (d.ρ > 0 && d.ρ < dist) {
        ++j;
        return add(v, scale(scale(d, 1 / d.ρ), 1 / d.ρ));
      }

      return v;
    }, Vec2.zero);

    if (j > 0) {
      w = scale(w, 1 / j);
    }

    if (w.ρ > 0) {
      return scale(limit(sub(scale(normalize(w), speed), p.cvel), force), 1.5);
    }

    return w;
  };
}

function getAlign(ps: Particle[], dist: number = 100 / stageScale): (p: Particle) => Vec2 {
  return (p: Particle): Vec2 => {
    let j = 0;

    let w = ps.reduce((v, q) => {
      const d = sub(p.cpos, q.cpos);

      if (d.ρ > 0 && d.ρ < dist) {
        ++j;
        return add(v, q.cvel);
      }

      return v;
    }, Vec2.zero);

    if (j > 0) {
      w = scale(w, 1 / j);
      return limit(sub(scale(normalize(w), speed), p.cvel), force);
    }

    return Vec2.zero;
  };
}

function getCohere(ps: Particle[], dist: number = 100 / stageScale): (p: Particle) => Vec2 {
  return (p: Particle): Vec2 => {
    let j = 0;

    let w = ps.reduce((v, q) => {
      const d = sub(p.cpos, q.cpos);

      if (d.ρ > 0 && d.ρ < dist) {
        ++j;
        return add(v, q.cpos);
      }

      return v;
    }, Vec2.zero);

    if (j > 0) {
      w = scale(w, 1 / j);
      return limit(sub(scale(normalize(sub(w, p.cpos)), speed), p.cvel), force);
    }

    return Vec2.zero;
  };
}

const numParticles = 50;
const particles: Particle[] = [];

const separate = getSeparate(particles);
const align = getAlign(particles);
const cohere = getCohere(particles);

const origin = new Vec2(centerX, centerY);

function init() {
  // const initX = stageWidth * 0.2 + random() * stageWidth * 0.6;
  // const initY = stageHeight * 0.2 + random() * stageHeight * 0.6;

  for (let i = 0; i < numParticles; ++i) {
    const cpos = add(origin, fromPolar(i / numParticles * ππ, random() * 20));
    const ppos = add(cpos, fromPolar(random() * ππ, 1));

    const particle = new Particle(cpos, ppos);
    particles.push(particle);

    // particle.behaviors.push(gravity);
    // particle.behaviors.push(drag);

    particle.behaviors.push(separate);
    particle.behaviors.push(align);
    particle.behaviors.push(cohere);
  }
}

/**
 * update: updates the simulation
 * @param t {number} - the number of miliseconds that have ellapsed since start
 * @param dt {number} - the number of miliseconds to simulate
 */
function update(t: number, dt: number): void {
  if (particles.length === 0) {
    init();
  }

  particles.forEach(particle => {
    // console.log(t); // tslint:disable-line
    particle.update(t, dt);

    const { cpos: { x, y }, cvel } = particle;
    let move = Vec2.zero;

    if (y < 0) {
      move = new Vec2(0, stageHeight);
      particle.ppos = add(particle.ppos, move);
      particle.cpos = add(particle.cpos, move);
    }

    if (x < 0) {
      move = new Vec2(stageWidth, 0);
      particle.ppos = add(particle.ppos, move);
      particle.cpos = add(particle.cpos, move);
    }

    if (x > stageWidth) {
      move = new Vec2(stageWidth, 0);
      particle.ppos = sub(particle.ppos, move);
      particle.cpos = sub(particle.cpos, move);
    }

    if (y > stageHeight) {
      move = new Vec2(0, stageHeight);
      particle.ppos = sub(particle.ppos, move);
      particle.cpos = sub(particle.cpos, move);
    }
  });

  // particles = particles.filter(({ cpos: { y } }) => y < stageHeight);
  // particles = particles.filter(({ cpos: { x, y } }) => {
  //   const top = 0 < y;
  //   const right = x < stageWidth;
  //   const bottom = y < stageHeight;
  //   const left = 0 < x;
  //   return top && right && bottom && left;
  // });
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

    const s = 20 / stageScale;
    const l = ρ * s * 2;
    const hl = l / 2;
    const w = s / 2;
    const hw = w / 2;
    bufferContext.rect(-hl, -hw, l, w);
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
    update(normalTime, step);
    excess -= step;
  }

  draw(excess / step);
}

function play(): void {
  // playStopButton.innerText = stopLabel;
  // playStopButton.setAttribute('aria-label', 'stop');

  frameId = rAF((time: number) => {
    firstTime = time;
    previousTime = 0;
    excess = 0;

    frameId = rAF(tick);
  });
}

function stop(): void {
  // playStopButton.innerText = playLabel;
  // playStopButton.setAttribute('aria-label', 'play');

  cAF(frameId);
  frameId = -1;
}

function goto(f: number): void {
  normalTime = 0;

  for (let i = 0; i < f; ++i) {
    normalTime += step;
    update(normalTime, step);
  }

  draw(1);
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

// playStopButton.addEventListener('click', toggle);
// goto(3);
play();
