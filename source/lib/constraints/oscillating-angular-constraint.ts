import Vec2, { angleBetween, rotate, scale, sub } from '../geom/vec2';
import { atan2, lerp, π, ππ } from '../math';
import Particle from '../physics/particle';
import { IConstraint } from './';
import AngularConstraint from './angular-constraint';

export default class OscillatingAngularConstraint extends AngularConstraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public c: Particle,
    public stiffness: number = 5,
    public getRestAngle: (t: number) => number,
    public getStrength: () => number,
  ) {
    super(a, b, c, stiffness, getRestAngle(0));
  }

  public update(t: number, dt: number): void {
    const angle = angleBetween(this.b.currPos, this.a.currPos, this.c.currPos);
    this.restAngle = lerp(this.getRestAngle(t), angle, this.getStrength());
    super.update(t, dt);
  }
}
