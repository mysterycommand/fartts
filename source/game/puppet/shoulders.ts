import PinBehavior from '../../lib/behaviors/pin-behavior';
import Vec2, { add, fromPolar } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { commonBehaviors, o, torsoRadius } from './config';

export const rShoulder = new Particle(add(o, fromPolar(π * 1.25, torsoRadius)), undefined, [
  ...commonBehaviors,
  new PinBehavior(() => add(o, fromPolar(π * 1.25, torsoRadius))),
]);

export const lShoulder = new Particle(add(o, fromPolar(π * 1.75, torsoRadius)), undefined, [
  ...commonBehaviors,
  new PinBehavior(() => add(o, fromPolar(π * 1.75, torsoRadius))),
]);
