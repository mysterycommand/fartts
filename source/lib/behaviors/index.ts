import Vec2 from '../geom/vec2';
import Particle from '../physics/particle';

export type Behavior = (p: Particle, t: number, dt: number) => Vec2;
