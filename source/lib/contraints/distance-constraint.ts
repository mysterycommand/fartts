import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { IConstraint } from './';

export default class DistanceConstraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public stiffness: number = 0.5,
    public distance: number = sub(a.currPos, b.currPos).ρ,
  ) {}

  public update(t: number, dt: number): void {
    const stepCoef = 1 / dt;

    const normal = sub(this.a.currPos, this.b.currPos);
    const m = normal.ρ * normal.ρ;
    const s = scale(normal, (this.distance * this.distance - m) / m * this.stiffness * stepCoef);

    this.a.currPos.x += s.x;
    this.a.currPos.y += s.y;

    this.b.currPos.x += s.x;
    this.b.currPos.y += s.y;
  }
}
