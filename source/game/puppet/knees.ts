import Vec2, { add, fromPolar, sub } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { commonBehaviors, legLength } from './config';
import { lHip, rHip } from './hips';

export const rKnee = new Particle(
  add(rHip.currPos, fromPolar(π * 0.55, legLength)),
  undefined,
  commonBehaviors,
);

export const lKnee = new Particle(
  add(lHip.currPos, fromPolar(π * 0.45, legLength)),
  undefined,
  commonBehaviors,
);
