import './style.scss';

import Vec2 from './lib/geom/vec-2';
import { cos, sin, ππ } from './lib/math';
import Aggregate from './lib/physics/aggregate';
import Particle from './lib/physics/particle';

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
const r = 5;
const molecule = new Aggregate();

for (let i = 0; i < 12; ++i) {
  const theta = ππ / 12 * i;
  const x = cos(theta) * (r * 5);
  const y = sin(theta) * (r * 5);

  const curr = new Vec2(hw + x, hh + y);
  const prev = new Vec2(hw, hh);
  molecule.particles.push(new Particle(curr, prev));
}

function draw() {
  // clear
  bufferContext.clearRect(0, 0, w, h);

  // style
  bufferContext.lineWidth = 2;
  bufferContext.strokeStyle = 'skyblue';
  bufferContext.fillStyle = 'lightblue';

  // paths
  bufferContext.beginPath();

  molecule.particles.forEach(p => {
    const { x, y } = p.currentPosition;
    bufferContext.moveTo(x + r, y);
    bufferContext.arc(x, y, r, 0, ππ);
  });

  bufferContext.closePath();

  // buffer
  bufferContext.fill();
  bufferContext.stroke();

  // draw
  canvasContext.clearRect(0, 0, w, h);
  canvasContext.drawImage(buffer, 0, 0);
}

canvas.addEventListener('click', event => {
  molecule.update();
  draw();
});

draw();
