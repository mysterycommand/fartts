import { atan2, hypot, π } from '../math';
import Vec2, { add, clone, fromPolar, lerp, limit, normalize, scale, sub } from './vec2';

describe('Vec2', () => {
  it('defaults to the origin (zero) vector', () => {
    const v = new Vec2();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  it('has static zero and unit vectors', () => {
    expect(Vec2.zero).not.toBe(Vec2.zero);
    expect(Vec2.zero.x).toBe(0);
    expect(Vec2.zero.y).toBe(0);

    expect(Vec2.one).not.toBe(Vec2.one);
    expect(Vec2.one.x).toBe(1);
    expect(Vec2.one.y).toBe(1);
  });

  it('does static, non-mutating addition', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = add(a, b);
    const d = add(a, Vec2.zero);

    expect(a.x).toBe(1);
    expect(a.y).toBe(2);

    expect(b.x).toBe(3);
    expect(b.y).toBe(4);

    expect(c.x).toBe(4);
    expect(c.y).toBe(6);

    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(a).not.toBe(d);
  });

  it('does static, non-mutating subtraction', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = sub(a, b);
    const d = sub(a, Vec2.zero);

    expect(a.x).toBe(1);
    expect(a.y).toBe(2);

    expect(b.x).toBe(3);
    expect(b.y).toBe(4);

    expect(c.x).toBe(-2);
    expect(c.y).toBe(-2);

    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
    expect(a).not.toBe(d);
  });

  it('does static, non-mutating linear interpolation', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = lerp(a, b, 0.5);
    const d = lerp(a, Vec2.zero, 0.25);

    expect(c.x).toBe(2);
    expect(c.y).toBe(3);

    expect(d.x).toBe(0.25);
    expect(d.y).toBe(0.5);
  });

  it('does static, non-mutating scalar scaling', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = scale(a, 0.5);
    const d = scale(b, 2);

    expect(c.x).toBe(0.5);
    expect(c.y).toBe(1);

    expect(d.x).toBe(6);
    expect(d.y).toBe(8);
  });

  it('clones', () => {
    const a = new Vec2(1, 2);
    const b = clone(a);

    expect(a).not.toBe(b);
    expect(a.x).toBe(b.x);
    expect(a.y).toBe(b.y);
  });

  it('normalizes', () => {
    const a = normalize(new Vec2(1, 2));
    const b = normalize(Vec2.zero);

    expect(a.ρ).toBe(1);
    expect(b.ρ).toBe(0);
  });

  it('limits', () => {
    const a = new Vec2(10, 8);
    const b = limit(a, 5);
    const c = scale(normalize(a), 5);
    const d = limit(a, 50);

    expect(b.x).toBeCloseTo(c.x);
    expect(b.y).toBeCloseTo(c.y);

    expect(a).not.toBe(d);
    expect(a.x).toBe(d.x);
    expect(a.y).toBe(d.y);
  });

  it('creates vectors from polar coordinates', () => {
    const a = fromPolar();
    const b = fromPolar(atan2(4, 3), 5);
    const c = fromPolar(π / 2, 4);
    const d = fromPolar(π / 4, hypot(3, 3));

    expect(a.x).toBe(0);
    expect(a.y).toBe(0);

    expect(b.x).toBeCloseTo(3);
    expect(b.y).toBeCloseTo(4);

    expect(c.x).toBeCloseTo(0);
    expect(c.y).toBe(4);

    expect(d.x).toBeCloseTo(3);
    expect(d.y).toBe(3);
  });

  it('has an angle property (θ)', () => {
    const v = new Vec2(3, 3);
    expect(v.θ).toBe(π / 4);
  });

  it('has a length property (ρ)', () => {
    const v = new Vec2(3, 4);
    expect(v.ρ).toBe(5);
  });
});
