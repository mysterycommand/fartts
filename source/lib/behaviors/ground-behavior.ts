import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { IBehavior } from './';

export default class GroundBehavior implements IBehavior {
  constructor(public ground: number, public friction: number) {}

  public update(p: Particle, t: number, dt: number): Vec2 {
    return p.currPos.y >= this.ground ? sub(Vec2.zero, scale(p.currVel, this.friction)) : Vec2.zero;
  }
}
