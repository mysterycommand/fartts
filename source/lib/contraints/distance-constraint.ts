import Vec2, { sub } from '../geom/vec2';
import Particle from '../physics/particle';
import IConstraint from './';

export default class DistanceConstraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public stiffness: number = 1,
    public distance: number = sub(a.currPos, b.currPos).ρ,
  ) {}

  public relax(stepCoef: number): void {
    // just relax...
  }
}
