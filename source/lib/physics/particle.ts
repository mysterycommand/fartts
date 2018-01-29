import Vec2 from '../geom/vec2';
const { add, sub, lerp, zero } = Vec2;

export default class Particle {
  public behaviors: Array<(p: Particle, t: number) => Vec2> = [];

  public constructor(public cpos = new Vec2(), public ppos = cpos) {}

  public get cvel(): Vec2 {
    return sub(this.cpos, this.ppos);
  }

  public ipos(i: number): Vec2 {
    return lerp(this.cpos, this.ppos, i);
  }

  public update(t: number): void {
    const { nvel, cpos, ppos } = this;

    ppos.x = cpos.x;
    ppos.y = cpos.y;

    cpos.x += nvel.x;
    cpos.y += nvel.y;

    // constraints: distance, bounds, etc...
  }

  private get nvel(): Vec2 {
    const { behaviors, cvel } = this;
    return behaviors.reduce((v, b) => add(v, b(this, 1)), cvel);
  }
}
