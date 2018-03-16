import Vec2, { angleBetween, rotate, scale, sub } from '../geom/vec2';
import { atan2, π, ππ } from '../math';
import Particle from '../physics/particle';
import { IConstraint } from './';

export default class AngularConstraint implements IConstraint {
  public constructor(
    public a: Particle,
    public b: Particle,
    public c: Particle,
    public stiffness: number = 5,
    public restAngle: number = angleBetween(b.currPos, a.currPos, c.currPos),
  ) {}

  public update(t: number, dt: number): void {
    const stepCoef = 1 / dt;

    const angle = angleBetween(this.b.currPos, this.a.currPos, this.c.currPos);

    let diff = angle - this.restAngle;
    if (diff <= -π) {
      diff += ππ;
    } else if (diff >= π) {
      diff -= ππ;
    }
    diff *= stepCoef * this.stiffness;

    const ab = rotate(this.a.currPos, this.b.currPos, diff);
    const cb = rotate(this.c.currPos, this.b.currPos, -diff);
    const ba = rotate(this.b.currPos, this.a.currPos, diff);
    const bc = rotate(this.b.currPos, this.c.currPos, -diff);

    this.a.currPos.x = ab.x;
    this.a.currPos.y = ab.y;

    this.c.currPos.x = cb.x;
    this.c.currPos.y = cb.y;

    this.b.currPos.x = ba.x;
    this.b.currPos.y = ba.y;

    this.b.currPos.x = bc.x;
    this.b.currPos.y = bc.y;
  }
}
