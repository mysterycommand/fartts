import Vec2 from '../geom/vec-2';
import Behavior from './behavior';
import Constraint from './constraint';

export default class Particle {
  public behaviors: Behavior[] = [];
  public constraints: Constraint[] = [];

  public forces = new Vec2();
  public mass = 1;

  public constructor(public currentPosition = new Vec2(), public previousPosition = new Vec2()) {}

  public get velocity() {
    const { x: cx, y: cy } = this.currentPosition;
    const { x: px, y: py } = this.previousPosition;
    return new Vec2(cx - px, cy - py);
  }

  public scaleVelocity(s: number) {
    this.previousPosition.lerp(this.currentPosition, s);
  }

  public update() {
    // behaviors
    this.behaviors.forEach(b => {
      // b.apply(this);
    });

    // velocity
    const v = this.velocity;
    this.previousPosition.set(this.currentPosition);
    this.currentPosition.add(v);

    // forces
    this.forces.scale(this.mass);
    this.currentPosition.add(this.forces);
    this.forces.zero();

    // constraints
    this.constraints.forEach(c => {
      // c.apply(p);
    });
  }
}
