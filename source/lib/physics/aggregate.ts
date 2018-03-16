import { IConstraint } from '../contraints';
import Vec2 from '../geom/vec2';
import Particle from './particle';

export default class Aggregate {
  constructor(public particles: Particle[] = [], public constraints: IConstraint[] = []) {}

  public update(t: number, dt: number): void {
    this.particles.forEach(p => p.update(t, dt));
    this.constraints.forEach(c => c.update(t, dt));
  }
}
