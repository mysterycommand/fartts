import { acos, atan2, cos, hypot, sin, π } from '../math';

export default class Vec2 {
  public static get one() {
    return new Vec2(1, 1);
  }

  public static get zero() {
    return new Vec2();
  }

  public static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  public static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  public static scale(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x * s, v.y * s);
  }

  public static lerp(a: Vec2, b: Vec2, i: number): Vec2 {
    const x = b.x + (a.x - b.x) * i;
    const y = b.y + (a.y - b.y) * i;

    return new Vec2(x, y);
  }

  public static clone(v: Vec2): Vec2 {
    return new Vec2(v.x, v.y);
  }

  public static normalize(v: Vec2) {
    const i = v.ρ === 0 ? 1 : v.ρ;
    return Vec2.scale(v, 1 / i);
  }

  public static limit(v: Vec2, l: number): Vec2 {
    // console.log(v.θ * 180 / π + 180); // tslint:disable-line
    return v.ρ > l ? Vec2.scale(Vec2.normalize(v), l) : Vec2.clone(v);
  }

  public static angleBetween(vertex: Vec2, a: Vec2, b: Vec2): number {
    // const numerator = a.ρ2 + b.ρ2 - vertex.ρ2;
    // const denomenator = 2 * a.ρ * b.ρ;
    // return acos(numerator / denomenator);

    const l = sub(vertex, a);
    const r = sub(vertex, b);
    return atan2(l.x * r.y - l.y * r.x, l.x * r.x + l.y * r.y);
  }

  public static rotate(v: Vec2, o: Vec2, θ: number): Vec2 {
    const d = sub(v, o);
    return new Vec2(d.x * cos(θ) - d.y * sin(θ) + o.x, d.x * sin(θ) + d.y * cos(θ) + o.y);
  }

  public static fromPolar(θ = 0, ρ = 0): Vec2 {
    return new Vec2(cos(θ) * ρ, sin(θ) * ρ);
  }

  public constructor(public x = 0, public y = 0) {}

  public get ρ2() {
    return this.x * this.x + this.y * this.y;
  }

  public get ρ() {
    return hypot(this.x, this.y);
  }

  // public set ρ(l: number) {
  //   this.x = cos(this.θ) * l;
  //   this.y = sin(this.θ) * l;
  // }

  public get θ() {
    return atan2(this.y, this.x);
  }

  // public set θ(a: number) {
  //   this.x = cos(a) * this.ρ;
  //   this.y = sin(a) * this.ρ;
  // }
}

export const {
  add,
  angleBetween,
  clone,
  fromPolar,
  lerp,
  limit,
  normalize,
  rotate,
  scale,
  sub,
} = Vec2;
