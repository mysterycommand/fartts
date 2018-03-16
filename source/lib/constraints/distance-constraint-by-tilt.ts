import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { IConstraint } from './';
import DistanceConsraint from './distance-constraint';

export default class DistanceConstraintByTilt extends DistanceConsraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public stiffness: number = 5,
    public getRestLength: () => number,
  ) {
    super(a, b, stiffness, getRestLength());
  }

  public update(t: number, dt: number): void {
    this.restLength = this.getRestLength();
    super.update(t, dt);
  }
}
