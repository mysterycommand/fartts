import Vec2 from '../geom/vec-2';
import Particle from './particle';

export default class Behavior {
  public constructor(public force: Vec2) {}

  public apply(p: Particle) {
    p.forces.add(this.force);
  }
}
