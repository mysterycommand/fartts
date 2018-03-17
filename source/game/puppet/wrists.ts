import Vec2, { add, fromPolar } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { armLength, commonBehaviors } from './config';
import { lElbow, rElbow } from './elbows';

export const rWrist = new Particle(
  add(rElbow.currPos, fromPolar(π * 0.65, armLength)),
  undefined,
  commonBehaviors,
);

export const lWrist = new Particle(
  add(lElbow.currPos, fromPolar(π * 0.35, armLength)),
  undefined,
  commonBehaviors,
);
