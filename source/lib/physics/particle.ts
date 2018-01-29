import Vec2 from '../geom/vec-2';

export default class Particle {
  public behaviors: Array<(p: Particle, t: number) => Vec2> = [];

  public constructor(public cpos = new Vec2(), public ppos = cpos) {}

  public get cvel(): Vec2 {
    return Vec2.sub(this.cpos, this.ppos);
  }

  public ipos(i: number): Vec2 {
    return Vec2.lerp(this.cpos, this.ppos, i);
  }

  public update(t: number): void {
    const { cpos, ppos, behaviors } = this;

    let { cvel } = this;
    behaviors.forEach(b => {
      cvel = b(this, 1);
    });

    ppos.x = cpos.x;
    ppos.y = cpos.y;

    cpos.x += cvel.x;
    cpos.y += cvel.y;

    // constraints: distance, bounds, etc...
  }
}
