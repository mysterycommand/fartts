import Vec2, { add, fromPolar } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { commonBehaviors, o, torsoRadius } from './config';

export const lHip = new Particle(
  add(o, fromPolar(π * 0.25, torsoRadius)),
  undefined,
  commonBehaviors,
);

export const rHip = new Particle(
  add(o, fromPolar(π * 0.75, torsoRadius)),
  undefined,
  commonBehaviors,
);
