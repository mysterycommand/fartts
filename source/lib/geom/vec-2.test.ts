import { atan2, hypot, π } from '../math';
import Vec2 from './vec-2';

describe('Vec2', () => {
  it('defaults to the origin (ZERO) vector', () => {
    const v = new Vec2();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  it('has static ZERO and UNIT vectors', () => {
    const zero = Vec2.ZERO;
    expect(zero.x).toBe(0);
    expect(zero.y).toBe(0);

    const unit = Vec2.UNIT;
    expect(unit.x).toBe(1);
    expect(unit.y).toBe(1);
  });

  it('does static, non-mutating addition', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = Vec2.add(a, b);
    const d = Vec2.add(a, Vec2.ZERO);

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
    const c = Vec2.sub(a, b);
    const d = Vec2.sub(a, Vec2.ZERO);

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
    const c = Vec2.lerp(a, b, 0.5);
    const d = Vec2.lerp(a, Vec2.ZERO, 0.25);

    expect(c.x).toBe(2);
    expect(c.y).toBe(3);

    expect(d.x).toBe(0.25);
    expect(d.y).toBe(0.5);
  });

  it('does static, non-mutating scalar scaling', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);
    const c = Vec2.scale(a, 0.5);
    const d = Vec2.scale(b, 2);

    expect(c.x).toBe(0.5);
    expect(c.y).toBe(1);

    expect(d.x).toBe(6);
    expect(d.y).toBe(8);
  });

  it('creates vectors from polar coordinates', () => {
    const a = Vec2.fromPolar();
    const b = Vec2.fromPolar(atan2(4, 3), 5);
    const c = Vec2.fromPolar(π / 2, 4);
    const d = Vec2.fromPolar(π / 4, hypot(3, 3));

    expect(a.x).toBe(0);
    expect(a.y).toBe(0);

    expect(b.x).toBeCloseTo(3);
    expect(b.y).toBeCloseTo(4);

    expect(c.x).toBeCloseTo(0);
    expect(c.y).toBe(4);

    expect(d.x).toBeCloseTo(3);
    expect(d.y).toBe(3);
  });

  it('has an angle property', () => {
    const v = new Vec2(3, 3);
    expect(v.θ).toBe(π / 4);
  });

  it('has a length property', () => {
    const v = new Vec2(3, 4);
    expect(v.ρ).toBe(5);
  });
});
