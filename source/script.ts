import './style.scss';

import Vec2 from './lib/geom/vec-2';
import { cos, random, sin, ππ } from './lib/math';
import Aggregate from './lib/physics/aggregate';
import Behavior from './lib/physics/behavior';
import Particle from './lib/physics/particle';

const { requestAnimationFrame: rAF } = window;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const w = canvas.clientWidth / 5;
const h = canvas.clientHeight / 5;
const hw = w / 2;
const hh = h / 2;

canvas.width = buffer.width = w;
canvas.height = buffer.height = h;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

// simulation
const firework = new Aggregate();
const gravity = new Behavior(new Vec2(0, 0.25));

firework.behaviors.push(gravity);

const maxSparks = 200;
for (let i = 0; i < maxSparks; ++i) {
  const theta = ππ / maxSparks * i;
  const r = random() * 15 + 10;
  const x = cos(theta) * r;
  const y = sin(theta) * r;

  const curr = new Vec2(hw + x, hh + y);
  const prev = new Vec2(hw, hh);
  firework.particles.push(new Particle(curr, prev));
}

function draw() {
  // clear
  bufferContext.clearRect(0, 0, w, h);

  // style
  bufferContext.fillStyle = 'lightblue';

  // paths
  bufferContext.beginPath();

  gravity.force.scale(1.05);
  firework.particles.forEach(p => {
    const { x, y } = p.currentPosition;
    bufferContext.moveTo(x, y);
    bufferContext.rect(x - 1, y - 1, 2, 2);
  });

  bufferContext.closePath();

  // buffer
  bufferContext.fill();

  // draw
  canvasContext.clearRect(0, 0, w, h);
  canvasContext.drawImage(buffer, 0, 0);
}

function tick() {
  rAF(tick);
  firework.update();
  draw();
}
tick();
