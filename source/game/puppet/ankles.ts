import PinBehavior from '../../lib/behaviors/pin-behavior';
import Vec2, { add, fromPolar, sub } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { getCosFn, getSinFn } from '../../lib/wave';
import { commonBehaviors, legLength } from './config';
import { lKnee, rKnee } from './knees';

const p = 2000;
const ankleMoveRadiusX = 50;
const ankleMoveRadiusY = 40;

const lKneeOrigin = add(lKnee.currPos, fromPolar(π * 0.45, legLength));
const lXFn = getSinFn(p);
const lYFn = getCosFn(p);

const rKneeOrigin = add(rKnee.currPos, fromPolar(π * 0.55, legLength));
const rXFn = getSinFn(p, -1, 1, p / 2);
const rYFn = getCosFn(p, -1, 1, p / 2);

export const lAnkle = new Particle(lKneeOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(lKneeOrigin, new Vec2(0, ankleMoveRadiusY / 2)),
      new Vec2(lXFn(t) * ankleMoveRadiusX, lYFn(t) * ankleMoveRadiusY),
    );
  }),
]);

export const rAnkle = new Particle(rKneeOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(rKneeOrigin, new Vec2(0, ankleMoveRadiusY / 2)),
      new Vec2(rXFn(t) * ankleMoveRadiusX, rYFn(t) * ankleMoveRadiusY),
    );
  }),
]);
