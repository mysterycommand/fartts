import Vec2, { add, clone, lerp, sub } from '../geom/vec2';

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
    const { cpos, ppos } = this;
    const nvel = this.nvel(t);

    ppos.x = cpos.x;
    ppos.y = cpos.y;

    cpos.x += nvel.x;
    cpos.y += nvel.y;

    // constraints: distance, bounds, etc...
  }

  private nvel(t: number): Vec2 {
    const { behaviors, cvel } = this;
    return behaviors.reduce((v, b) => add(v, b(this, t)), cvel);
  }
}
