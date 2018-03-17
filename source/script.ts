import './style.scss';

import DistanceConstraint from './lib/constraints/distance-constraint';
import { sub } from './lib/geom/vec2';
import Mouse from './lib/input/mouse';
import { min, ππ } from './lib/math';
import Aggregate from './lib/physics/aggregate';

import {
  buffer,
  bufferContext,
  cAF,
  canvas,
  canvasContext,
  rAF,
  stageCenterX,
  stageCenterY,
  stageHeight,
  stageScale,
  stageWidth,
} from './lib/canvas';

import { puppetConstraints, puppetParticles } from './game/puppet';
import { bounds } from './game/puppet/config';

/**
 * SIMULATION
 */

const mouse = new Mouse(document);
const puppet = new Aggregate(puppetParticles, puppetConstraints);

/**
 * update: updates the simulation
 * @param t {number} - the number of miliseconds that have ellapsed since start
 * @param dt {number} - the number of miliseconds to simulate
 */
function update(t: number, dt: number): void {
  // do stuff with particles/bodies here
  puppet.update(t, dt);
}

/**
 * RENDERER
 */

/**
 * draw: renders a frame to the canvas
 * @param i {number} - the 'interpolation percentage' is the amount of time that
 * has yet to be simulated this frame as a percentage of the simulation step
 */
function draw(i: number): void {
  bufferContext.fillStyle = '#888';
  bufferContext.fillRect(0, 0, stageWidth, stageHeight);

  bufferContext.strokeStyle = '#eff';
  bufferContext.beginPath();
  bufferContext.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  bufferContext.closePath();
  bufferContext.stroke();

  puppet.constraints
    .filter((c): c is DistanceConstraint => {
      return c instanceof DistanceConstraint;
    })
    .forEach(({ a, b }) => {
      bufferContext.save();

      bufferContext.strokeStyle = '#777';
      bufferContext.beginPath();
      bufferContext.moveTo(a.currPos.x, a.currPos.y);
      bufferContext.lineTo(b.currPos.x, b.currPos.y);
      bufferContext.closePath();
      bufferContext.stroke();

      bufferContext.restore();
    });

  puppet.particles.forEach(p => {
    bufferContext.save();

    bufferContext.strokeStyle = sub(mouse.currPos, p.currPos).ρ < 20 ? '#f66' : '#222';
    bufferContext.beginPath();
    bufferContext.arc(p.currPos.x, p.currPos.y, 5, 0, ππ);
    bufferContext.closePath();
    bufferContext.stroke();

    bufferContext.restore();
  });

  canvasContext.drawImage(buffer, 0, 0);
}

/**
 * GAME
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
  frameId = rAF((time: number) => {
    firstTime = time;
    previousTime = 0;
    excess = 0;

    frameId = rAF(tick);
  });
}

function stop(): void {
  cAF(frameId);
  frameId = -1;
}

play();

document.addEventListener('keydown', play);
