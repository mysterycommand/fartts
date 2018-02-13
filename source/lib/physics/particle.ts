import Vec2, { add, clone, lerp, limit, sub } from '../geom/vec2';

export default class Particle {
  public behaviors: Array<(p: Particle, t: number) => Vec2> = [];

  public constructor(public cpos = Vec2.zero, public ppos = clone(cpos)) {}

  public get cvel(): Vec2 {
    return sub(this.cpos, this.ppos);
  }

  public ipos(i: number): Vec2 {
    return lerp(this.cpos, this.ppos, i);
  }

  public update(t: number): void {
    const { cpos } = this;
    const nvel = limit(this.nvel(t), 3);

    this.ppos = clone(cpos);
    this.cpos = add(cpos, nvel);

    // constraints: distance, bounds, etc...
  }

  private nvel(t: number): Vec2 {
    const { behaviors, cvel } = this;
    return behaviors.reduce((v, b) => add(v, b(this, t)), cvel);
  }
}
