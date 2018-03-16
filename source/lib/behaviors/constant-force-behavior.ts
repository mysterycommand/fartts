import Vec2 from '../geom/vec2';
import Particle from '../physics/particle';
import { Behavior } from './';

export default function constantForceBehaviorFactory(constantForce: Vec2): Behavior {
  return (p: Particle, t: number, dt: number): Vec2 => constantForce;
}
