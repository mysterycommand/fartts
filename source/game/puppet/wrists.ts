import PinBehavior from '../../lib/behaviors/pin-behavior';
import Vec2, { add, fromPolar, sub } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { getCosFn, getSinFn } from '../../lib/wave';
import { armLength, commonBehaviors } from './config';
import { lElbow, rElbow } from './elbows';

const p = 2000;
const wristMoveRadiusX = 20;
const wristMoveRadiusY = 30;

const lElbowOrigin = add(lElbow.currPos, fromPolar(π * 0.35, armLength));
const lXFn = getSinFn(p, -1, 1, p / 5);
const lYFn = getCosFn(p, -1, 1, p / 5);

const rElbowOrigin = add(rElbow.currPos, fromPolar(π * 0.65, armLength));
const rXFn = getSinFn(p, -1, 1, p / 2 + p / 5);
const rYFn = getCosFn(p, -1, 1, p / 2 + p / 5);

export const rWrist = new Particle(rElbowOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(rElbowOrigin, new Vec2(0, wristMoveRadiusY / 2)),
      new Vec2(lXFn(t) * wristMoveRadiusX, lYFn(t) * wristMoveRadiusY),
    );
  }),
]);

export const lWrist = new Particle(lElbowOrigin, undefined, [
  ...commonBehaviors,
  new PinBehavior((t: number) => {
    return add(
      sub(lElbowOrigin, new Vec2(0, wristMoveRadiusY / 2)),
      new Vec2(rXFn(t) * wristMoveRadiusX, rYFn(t) * wristMoveRadiusY),
    );
  }),
]);
