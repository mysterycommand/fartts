import AngularConstraint from '../../lib/constraints/angular-constraint';
import BoundsConstraint from '../../lib/constraints/bounds-constraint';
import DistanceConstraint from '../../lib/constraints/distance-constraint';
import DistanceConstraintByTilt from '../../lib/constraints/distance-constraint-by-tilt';
import OscillatingAngularConstraint from '../../lib/constraints/oscillating-angular-constraint';

import { lAnkle, rAnkle } from './ankles';
import { bounds } from './config';
import { lElbow, rElbow } from './elbows';
import { lHip, rHip } from './hips';
import { lKnee, rKnee } from './knees';
import { lShoulder, rShoulder } from './shoulders';
import { lWrist, rWrist } from './wrists';

export const puppetParticles = [
  rShoulder,
  lShoulder,
  lHip,
  rHip,
  rWrist,
  rElbow,
  rAnkle,
  rKnee,
  lWrist,
  lElbow,
  lAnkle,
  lKnee,
];

export const puppetConstraints = [
  new DistanceConstraint(rShoulder, lHip),
  new DistanceConstraint(lShoulder, rHip),

  new DistanceConstraint(rShoulder, lShoulder),
  new DistanceConstraint(lHip, rHip),

  new DistanceConstraint(lShoulder, lHip),
  new DistanceConstraint(rHip, rShoulder),

  new DistanceConstraint(rShoulder, rElbow),
  new DistanceConstraint(rElbow, rWrist),
  new DistanceConstraint(lShoulder, lElbow),
  new DistanceConstraint(lElbow, lWrist),

  new DistanceConstraint(rHip, rKnee),
  new DistanceConstraint(rKnee, rAnkle),
  new DistanceConstraint(lHip, lKnee),
  new DistanceConstraint(lKnee, lAnkle),

  new AngularConstraint(rWrist, rElbow, rShoulder, 0.1),
  new AngularConstraint(lWrist, lElbow, lShoulder, 0.1),

  new AngularConstraint(rElbow, rShoulder, rHip, 0.1),
  new AngularConstraint(lElbow, lShoulder, lHip, 0.1),

  new AngularConstraint(rAnkle, rKnee, rHip, 0.01),
  new AngularConstraint(rKnee, rHip, rShoulder, 0.01),

  new AngularConstraint(lAnkle, lKnee, lHip, 0.01),
  new AngularConstraint(lKnee, lHip, lShoulder, 0.01),

  new BoundsConstraint(puppetParticles, bounds),
];
