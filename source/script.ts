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

// import houseSmash01Src from './sounds/explosions/house-smash-01.mp3';
// import houseSmash02Src from './sounds/explosions/house-smash-02.mp3';
// import houseSmash03Src from './sounds/explosions/house-smash-03.mp3';
// import houseSmash04Src from './sounds/explosions/house-smash-04.mp3';
// import houseSmash05Src from './sounds/explosions/house-smash-05.mp3';
// import moonstep01Src from './sounds/explosions/moonstep-01.mp3';
// import moonstep02Src from './sounds/explosions/moonstep-02.mp3';
// import moonstep03Src from './sounds/explosions/moonstep-03.mp3';
// import moonstruckSrc from './sounds/music/moonstruck.mp3';
// import step01Src from './sounds/sfx/step-01.mp3';
// import step02Src from './sounds/sfx/step-02.mp3';
// import step03Src from './sounds/sfx/step-03.mp3';
// import step04Src from './sounds/sfx/step-04.mp3';
// import step05Src from './sounds/sfx/step-05.mp3';
// import step06Src from './sounds/sfx/step-06.mp3';
// import step07Src from './sounds/sfx/step-07.mp3';
// import step08Src from './sounds/sfx/step-08.mp3';
// import step09Src from './sounds/sfx/step-09.mp3';
// import step10Src from './sounds/sfx/step-10.mp3';
// import step11Src from './sounds/sfx/step-11.mp3';
// import step12Src from './sounds/sfx/step-12.mp3';
// import step13Src from './sounds/sfx/step-13.mp3';
// import step14Src from './sounds/sfx/step-14.mp3';
// import step15Src from './sounds/sfx/step-15.mp3';

let debug = false;

const images: { [key: string]: HTMLImageElement } = {};
const sounds: { [key: string]: HTMLAudioElement } = {};

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

Promise.all([
  // Promise.all(
  //   Object.entries({
  //     moonstruck: './sounds/music/moonstruck.mp3',
  //     step01: './sounds/sfx/step-01.mp3',
  //     step02: './sounds/sfx/step-02.mp3',
  //     step03: './sounds/sfx/step-03.mp3',
  //     step04: './sounds/sfx/step-04.mp3',
  //     step05: './sounds/sfx/step-05.mp3',
  //     step06: './sounds/sfx/step-06.mp3',
  //     step07: './sounds/sfx/step-07.mp3',
  //     step08: './sounds/sfx/step-08.mp3',
  //     step09: './sounds/sfx/step-09.mp3',
  //     step10: './sounds/sfx/step-10.mp3',
  //     step11: './sounds/sfx/step-11.mp3',
  //     step12: './sounds/sfx/step-12.mp3',
  //     step13: './sounds/sfx/step-13.mp3',
  //     step14: './sounds/sfx/step-14.mp3',
  //     step15: './sounds/sfx/step-15.mp3',
  //   }).map(
  //     ([name, src]) =>
  //       new Promise(resolve => {
  //         sounds[name] = new Audio();
  //         sounds[name].addEventListener('load', resolve);
  //         sounds[name].src = url;
  //       }),
  //   ),
  // ),
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
  ),
]).then(play);
