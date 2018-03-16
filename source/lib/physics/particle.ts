import Vec2, { add, clone, lerp, limit, sub } from '../geom/vec2';

type Behavior = (p: Particle, t: number, dt: number) => Vec2;

export default class Particle {
  public constructor(
    public currPos = Vec2.zero,
    public prevPos = clone(currPos),
    public behaviors: Behavior[] = [],
  ) {}

  public get currVel(): Vec2 {
    return sub(this.currPos, this.prevPos);
  }

  public ipos(i: number): Vec2 {
    return lerp(this.currPos, this.prevPos, i);
  }

  public update(t: number, dt: number): void {
    const { currPos } = this;
    const nextVel = limit(this.nextVel(t, dt), 3);

    this.prevPos = clone(currPos);
    this.currPos = add(currPos, nextVel);
  }

  private nextVel(t: number, dt: number): Vec2 {
    const { behaviors, currVel } = this;
    return behaviors.reduce((v, b) => add(v, b(this, t, dt)), currVel);
  }
}
