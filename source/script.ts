import './style.scss';

import DistanceConstraint from './lib/constraints/distance-constraint';
import { add, scale, sub } from './lib/geom/vec2';
import Mouse from './lib/input/mouse';
import { floor, min, random, saw, π, ππ } from './lib/math';
import Aggregate from './lib/physics/aggregate';
import { getStepFn } from './lib/wave';

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
import { lAnkle, rAnkle } from './game/puppet/ankles';
import { bounds, o } from './game/puppet/config';
import { lElbow, rElbow } from './game/puppet/elbows';
import { lHip, rHip } from './game/puppet/hips';
import { lKnee, rKnee } from './game/puppet/knees';
import { lShoulder, rShoulder } from './game/puppet/shoulders';
import { lWrist, rWrist } from './game/puppet/wrists';

import facesSrc from './images/moon-faces-small.png';
import phasesSrc from './images/moon-phases-small.png';

let debug = false;

const images: { [key: string]: HTMLImageElement } = {};
const phaseOffsetFn = getStepFn(saw, 5000, 0, 9);
let horizontalOffset = 0;
let verticalOffset = 0;

function updateVerticalOffset() {
  verticalOffset = floor(random() * 5);
  setTimeout(updateVerticalOffset, 500 + floor(random() * 500));
}
updateVerticalOffset();

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

const thickness = 20;

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

  [
    {
      from: rElbow,
      to: rWrist,
    },
    {
      from: lElbow,
      to: lWrist,
    },
    {
      from: rHip,
      to: rKnee,
    },
    {
      from: lHip,
      to: lKnee,
    },
    {
      from: rKnee,
      to: rAnkle,
    },
    {
      from: lKnee,
      to: lAnkle,
    },
    {
      from: rShoulder,
      to: rElbow,
    },
    {
      from: lShoulder,
      to: lElbow,
    },
  ].forEach(({ from, to }) => {
    const diff = sub(from.currPos, to.currPos);

    bufferContext.save();
    bufferContext.translate(from.currPos.x, from.currPos.y);
    bufferContext.rotate(diff.θ + π / 2);

    bufferContext.fillStyle = '#d8d8d8';

    bufferContext.beginPath();
    bufferContext.rect(-thickness / 2, 0, thickness, diff.ρ);
    bufferContext.closePath();
    bufferContext.fill();

    bufferContext.beginPath();
    bufferContext.arc(0, 0, thickness / 2, 0, ππ);
    bufferContext.closePath();
    bufferContext.fill();

    bufferContext.beginPath();
    bufferContext.arc(0, diff.ρ, thickness / 2, 0, ππ);
    bufferContext.closePath();
    bufferContext.fill();

    bufferContext.restore();
  });

  const head = add(rHip.currPos, scale(sub(lShoulder.currPos, rHip.currPos), 0.5));

  bufferContext.save();
  bufferContext.translate(head.x - 54, head.y - 54);
  bufferContext.drawImage(images.phases, horizontalOffset * 145, 0, 108, 108, 0, 0, 108, 108);

  bufferContext.drawImage(
    images.faces,
    horizontalOffset * 145,
    verticalOffset * 140,
    108,
    108,
    0,
    0,
    108,
    108,
  );
  bufferContext.restore();

  if (debug) {
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
  }

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

  horizontalOffset = phaseOffsetFn(time);
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

document.addEventListener('keyup', event => {
  debug = !debug;
});

Promise.all(
  Object.entries({
    faces: facesSrc,
    phases: phasesSrc,
  }).map(
    ([name, src]) =>
      new Promise(resolve => {
        images[name] = new Image();
        images[name].addEventListener('load', resolve);
        images[name].src = src;
      }),
  ),
).then(play);
