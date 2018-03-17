import Vec2, { add, fromPolar } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { armLength, commonBehaviors } from './config';
import { lShoulder, rShoulder } from './shoulders';

export const rElbow = new Particle(
  add(rShoulder.currPos, fromPolar(π * 0.65, armLength)),
  undefined,
  commonBehaviors,
);

export const lElbow = new Particle(
  add(lShoulder.currPos, fromPolar(π * 0.35, armLength)),
  undefined,
  commonBehaviors,
);
