import Vec2, { scale, sub } from '../geom/vec2';
import Particle from '../physics/particle';
import { IConstraint } from './';

export default class DistanceConstraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public stiffness: number = 5,
    public restLength: number = sub(a.currPos, b.currPos).ρ,
  ) {}

  public update(t: number, dt: number): void {
    const stepCoef = 1 / dt;

    // @todo: why do I need stiffness and stepCoef here?
    // @see: advanced-character-physics.pdf (p. 6)
    const delta = sub(this.a.currPos, this.b.currPos);
    const deltaLength = delta.ρ + Number.EPSILON; // avoids division by 0
    const diff = (this.restLength - deltaLength) / deltaLength * this.stiffness * stepCoef;
    const adjustment = scale(delta, diff);

    this.a.currPos.x += adjustment.x;
    this.a.currPos.y += adjustment.y;

    this.b.currPos.x -= adjustment.x;
    this.b.currPos.y -= adjustment.y;
  }
}
