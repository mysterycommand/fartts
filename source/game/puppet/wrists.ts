import PinBehavior from '../../lib/behaviors/pin-behavior';
import Vec2, { add, fromPolar, sub } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { getCosFn, getSinFn } from '../../lib/wave';
import { commonBehaviors, forearmLength, p, wristMoveRadiusX, wristMoveRadiusY } from './config';
import { lElbow, rElbow } from './elbows';

const lElbowOrigin = add(lElbow.currPos, fromPolar(π * 0.35, forearmLength));
const lWristXFn = getSinFn(p, -1, 1, p / 5);
const lWristYFn = getCosFn(p, -1, 1, p / 5);

const rElbowOrigin = add(rElbow.currPos, fromPolar(π * 0.65, forearmLength));
const rWristXFn = getSinFn(p, -1, 1, p / 2 + p / 5);
const rWristYFn = getCosFn(p, -1, 1, p / 2 + p / 5);

export const rWrist = new Particle(rElbowOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(rElbowOrigin, new Vec2(0, wristMoveRadiusY / 2)),
      new Vec2(lWristXFn(t) * wristMoveRadiusX, lWristYFn(t) * wristMoveRadiusY),
    );
  }),
]);

export const lWrist = new Particle(lElbowOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(lElbowOrigin, new Vec2(0, wristMoveRadiusY / 2)),
      new Vec2(rWristXFn(t) * wristMoveRadiusX, rWristYFn(t) * wristMoveRadiusY),
    );
  }),
]);
