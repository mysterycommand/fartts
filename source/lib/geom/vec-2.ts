import { hypot } from '../math';

export default class Vec2 {
  public static ZERO = new Vec2();

  public constructor(public x = 0, public y = 0) {}

  public get length() {
    return hypot(this.x, this.y);
  }

  public set(v: Vec2) {
    this.x = v.x;
    this.y = v.y;
  }

  public add(v: Vec2) {
    this.x += v.x;
    this.y += v.y;
  }

  public subtract(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
  }

  public multiply(v: Vec2) {
    this.x *= v.x;
    this.y *= v.y;
  }

  public divide(v: Vec2) {
    this.x /= v.x;
    this.y /= v.y;
  }

  public lerp(v: Vec2, s: number) {
    this.x += (v.x - this.x) * s;
    this.y += (v.y - this.y) * s;
  }

  public scale(s: number) {
    this.x *= s;
    this.y *= s;
  }

  public zero() {
    this.set(Vec2.ZERO);
  }

  public equals(v: Vec2) {
    return this.x === v.x && this.y === v.y;
  }
}
