import Vec2, { add, fromPolar } from '../../lib/geom/vec2';
import { π } from '../../lib/math';
import Particle from '../../lib/physics/particle';
import { commonBehaviors, upperArmLength } from './config';
import { lShoulder, rShoulder } from './shoulders';

export const rElbow = new Particle(
  add(rShoulder.currPos, fromPolar(π * 0.65, upperArmLength)),
  undefined,
  commonBehaviors,
);

export const lElbow = new Particle(
  add(lShoulder.currPos, fromPolar(π * 0.35, upperArmLength)),
  undefined,
  commonBehaviors,
);
