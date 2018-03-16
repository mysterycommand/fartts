import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { Behavior } from './';

export default function createDrag(drag: number): Behavior {
  return (p: Particle, t: number, dt: number): Vec2 => sub(Vec2.zero, scale(p.currVel, drag));
}
