import { hypot } from './';

export default class Vec2 {
  public constructor(readonly x = 0, readonly y = 0) {}

  public get length(): number {
    const { x, y } = this;
    return hypot(x, y);
  }

  public plus(v: Vec2): Vec2 {
    const { x, y } = this;
    return new Vec2(x + v.x, y + v.y);
  }

  public minus(v: Vec2): Vec2 {
    const { x, y } = this;
    return new Vec2(x - v.x, y - v.y);
  }

  public times(v: Vec2): Vec2 {
    const { x, y } = this;
    return new Vec2(x * v.x, y * v.y);
  }

  public dividedBy(v: Vec2): Vec2 {
    const { x, y } = this;
    return new Vec2(x / v.x, y / v.y);
  }

  public scaledBy(s: number): Vec2 {
    const { x, y } = this;
    return new Vec2(x * s, y * s);
  }

  public distanceTo(v: Vec2): number {
    return v.minus(this).length;
  }

  public isEqualTo(v: Vec2): boolean {
    const { x, y } = this;
    return x === v.x && y === v.y;
  }
}
