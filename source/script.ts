import './style.scss';

import ConstantForceBehavior from './lib/behaviors/constant-force-behavior';
import DragBehavior from './lib/behaviors/drag-behavior';
import GroundBehavior from './lib/behaviors/ground-behavior';
import PinBehavior from './lib/behaviors/pin-behavior';

import AngularConstraint from './lib/constraints/angular-constraint';
import BoundsConstraint from './lib/constraints/bounds-constraint';
import DistanceConstraint from './lib/constraints/distance-constraint';
import DistanceConstraintByTilt from './lib/constraints/distance-constraint-by-tilt';

import Mouse from './lib/input/mouse';

import Rect from './lib/geom/rect';
import Vec2, { add, angleBetween, fromPolar, scale, sub } from './lib/geom/vec2';

import { abs, floor, max, min, random, round, toDegrees, π, ππ } from './lib/math';

import Aggregate from './lib/physics/aggregate';
import Particle from './lib/physics/particle';

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const stageScale = 1;
const stageWidth = canvas.clientWidth / stageScale;
const stageHeight = canvas.clientHeight / stageScale;
const stageCenterX = stageWidth / 2;
const stageCenterY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

/**
 * SIMULATION
 */

const mouse = new Mouse(document);
const bounds = new Rect(new Vec2(10, 10), new Vec2(stageWidth - 10, stageHeight - 10));

const gravity = new Vec2(0, 0.5);
const friction = 0.1;
const drag = 0.01;

const origin = new Vec2(stageCenterX, stageCenterY);
const torsoRadius = 50;
const armLength = 65;
const legLength = 50;

const commonBehaviors = [
  new ConstantForceBehavior(gravity),
  new GroundBehavior(bounds.bottom, friction),
  new DragBehavior(drag),
];
const pinBehavior = new PinBehavior(() => origin);

const rShoulder = new Particle(
  add(origin, fromPolar(π * 1.25, torsoRadius)),
  undefined,
  commonBehaviors,
);
const lShoulder = new Particle(
  add(origin, fromPolar(π * 1.75, torsoRadius)),
  undefined,
  commonBehaviors,
);
const lHip = new Particle(
  add(origin, fromPolar(π * 0.25, torsoRadius)),
  undefined,
  commonBehaviors,
);
const rHip = new Particle(
  add(origin, fromPolar(π * 0.75, torsoRadius)),
  undefined,
  commonBehaviors,
);
const rElbow = new Particle(
  add(rShoulder.currPos, fromPolar(π * 0.65, armLength)),
  undefined,
  commonBehaviors,
);
const rWrist = new Particle(
  add(rElbow.currPos, fromPolar(π * 0.65, armLength)),
  undefined,
  commonBehaviors,
);
const rKnee = new Particle(
  add(rHip.currPos, fromPolar(π * 0.55, legLength)),
  undefined,
  commonBehaviors,
);
const rAnkle = new Particle(
  add(rKnee.currPos, fromPolar(π * 0.55, legLength)),
  undefined,
  commonBehaviors,
);
const lElbow = new Particle(
  add(lShoulder.currPos, fromPolar(π * 0.35, armLength)),
  undefined,
  commonBehaviors,
);
const lWrist = new Particle(
  add(lElbow.currPos, fromPolar(π * 0.35, armLength)),
  undefined,
  commonBehaviors,
);
const lKnee = new Particle(
  add(lHip.currPos, fromPolar(π * 0.45, legLength)),
  undefined,
  commonBehaviors,
);
const lAnkle = new Particle(
  add(lKnee.currPos, fromPolar(π * 0.45, legLength)),
  undefined,
  commonBehaviors,
);
const torso = new Particle(origin, undefined, [...commonBehaviors, pinBehavior]);

const puppetParticles = [
  rShoulder,
  lShoulder,
  lHip,
  rHip,
  rWrist,
  rElbow,
  rAnkle,
  rKnee,
  lWrist,
  lElbow,
  lAnkle,
  lKnee,
  torso,
];

const maxDist = sub(lShoulder.currPos, lHip.currPos).ρ;
const minDist = scale(sub(lShoulder.currPos, lHip.currPos), 0.65).ρ;

const puppetConstraints = [
  new DistanceConstraint(torso, rShoulder),
  new DistanceConstraint(torso, lShoulder),
  new DistanceConstraint(torso, lHip),
  new DistanceConstraint(torso, rHip),

  new DistanceConstraint(rShoulder, lHip),
  new DistanceConstraint(lShoulder, rHip),

  new DistanceConstraintByTilt(rShoulder, lShoulder, 5, () => {
    return (
      minDist +
      (maxDist - minDist) * (1 - min(max(0, abs(sub(mouse.currPos, origin).x) / stageCenterX), 1))
    );
  }),
  new DistanceConstraintByTilt(lHip, rHip, 5, () => {
    return (
      minDist +
      (maxDist - minDist) * (1 - min(max(0, abs(sub(mouse.currPos, origin).x) / stageCenterX), 1))
    );
  }),

  new DistanceConstraintByTilt(lShoulder, lHip, 5, () => {
    return (
      minDist +
      (maxDist - minDist) * (1 - min(max(0, sub(mouse.currPos, origin).x / stageCenterX), 1))
    );
  }),
  new DistanceConstraintByTilt(rHip, rShoulder, 5, () => {
    return (
      minDist + (maxDist - minDist) * min(max(0, sub(mouse.currPos, origin).x / stageCenterX), 1)
    );
  }),

  new DistanceConstraint(rShoulder, rElbow),
  new DistanceConstraint(rElbow, rWrist),
  new DistanceConstraint(lShoulder, lElbow),
  new DistanceConstraint(lElbow, lWrist),

  new DistanceConstraint(rHip, rKnee),
  new DistanceConstraint(rKnee, rAnkle),
  new DistanceConstraint(lHip, lKnee),
  new DistanceConstraint(lKnee, lAnkle),

  new AngularConstraint(rWrist, rElbow, rShoulder, 0.1),
  new AngularConstraint(lWrist, lElbow, lShoulder, 0.1),
  new AngularConstraint(rElbow, rShoulder, rHip, 0.1),
  new AngularConstraint(lElbow, lShoulder, lHip, 0.1),

  new AngularConstraint(rAnkle, rKnee, rHip),
  new AngularConstraint(lAnkle, lKnee, lHip),
  new AngularConstraint(rKnee, rHip, rShoulder),
  new AngularConstraint(lKnee, lHip, lShoulder),

  new BoundsConstraint(puppetParticles, bounds),
];

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

    bufferContext.strokeStyle = '#222';
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
