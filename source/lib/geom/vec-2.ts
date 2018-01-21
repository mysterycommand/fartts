import { atan2, cos, hypot, sin } from '../math';

export default class Vec2 {
  public static ZERO = new Vec2();
  public static UNIT = new Vec2(1, 1);

  public static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  public static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  public static fromPolar(angle = 0, radius = 0): Vec2 {
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    return new Vec2(x, y);
  }

  public constructor(public x = 0, public y = 0) {}

  public get length() {
    return hypot(this.x, this.y);
  }

  public get angle() {
    return atan2(this.y, this.x);
  }
}
