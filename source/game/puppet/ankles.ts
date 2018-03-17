import PinBehavior from '../../lib/behaviors/pin-behavior';
import Vec2, { add, fromPolar, sub } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { getCosFn, getSinFn } from '../../lib/wave';
import { ankleMoveRadiusX, ankleMoveRadiusY, calfLength, commonBehaviors, p } from './config';
import { lKnee, rKnee } from './knees';

const lKneeOrigin = add(lKnee.currPos, fromPolar(π * 0.45, calfLength));
const lAnkleXFn = getSinFn(p);
const lAnkleYFn = getCosFn(p);

const rKneeOrigin = add(rKnee.currPos, fromPolar(π * 0.55, calfLength));
const rAnkleXFn = getSinFn(p, -1, 1, p / 2);
const rAnkleYFn = getCosFn(p, -1, 1, p / 2);

export const lAnkle = new Particle(lKneeOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(lKneeOrigin, new Vec2(0, ankleMoveRadiusY / 2)),
      new Vec2(lAnkleXFn(t) * ankleMoveRadiusX, lAnkleYFn(t) * ankleMoveRadiusY),
    );
  }),
]);

export const rAnkle = new Particle(rKneeOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(rKneeOrigin, new Vec2(0, ankleMoveRadiusY / 2)),
      new Vec2(rAnkleXFn(t) * ankleMoveRadiusX, rAnkleYFn(t) * ankleMoveRadiusY),
    );
  }),
]);
