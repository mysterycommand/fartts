import Vec2, { sub } from '../geom/vec2';
import Particle from '../physics/particle';

export default class DistanceConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public distance: number = sub(a.currPos, b.currPos).ρ,
    public stiffness: number = 1,
  ) {}
}
