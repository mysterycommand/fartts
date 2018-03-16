import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { IBehavior } from './';

export default class DragBehavior implements IBehavior {
  constructor(public drag: number) {}

  public update(p: Particle, t: number, dt: number): Vec2 {
    return sub(Vec2.zero, scale(p.currVel, this.drag));
  }
}
