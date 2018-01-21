import { hypot } from '../math';

export default class Vec2 {
  public static ZERO = new Vec2();
  public static UNIT = new Vec2(1, 1);

  public static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  public static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  public constructor(public x = 0, public y = 0) {}

  public get length() {
    return hypot(this.x, this.y);
  }
}
