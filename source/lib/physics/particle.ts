import Vec2 from '../geom/vec-2';

export default class Particle {
  public constructor(public currentPosition = new Vec2(), public previousPosition = new Vec2()) {}

  public get velocity(): Vec2 {
    return Vec2.sub(this.currentPosition, this.previousPosition);
  }

  public update(): void {
    const { currentPosition: c, previousPosition: p, velocity: v } = this;

    // behaviors: drag, friction (ground), gravity, etc...

    p.x = c.x;
    p.y = c.y;

    c.x += v.x;
    c.y += v.y;

    // constraints: distance, bounds, etc...
  }
}
