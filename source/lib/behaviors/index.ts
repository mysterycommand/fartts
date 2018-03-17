import Vec2 from '../geom/vec2';
import Particle from '../physics/particle';

export interface IBehavior {
  update(p: Particle, t: number, dt: number): Vec2;
}
