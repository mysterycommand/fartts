import Vec2 from '../geom/vec2';
import Particle from '../physics/particle';
import { IBehavior } from './';

export default class ConstantForceBehavior implements IBehavior {
  constructor(public constantForce: Vec2) {}

  public update(p: Particle, t: number, dt: number): Vec2 {
    return this.constantForce;
  }
}
