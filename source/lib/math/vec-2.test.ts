import { sqrt } from './';
import Vec2 from './vec-2';

describe('Vec2', () => {
  const a = new Vec2();
  const b = new Vec2(1, 2);
  const c = new Vec2(3, 4);
  let d: Vec2;

  it('defaults to the origin', () => {
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });

  it('has length', () => {
    expect(c.length).toBe(5);
  });

  it('adds', () => {
    d = b.plus(c);
    expect(d.x).toBe(4);
    expect(d.y).toBe(6);
  });

  it('subtracts', () => {
    d = c.minus(b);
    expect(d.x).toBe(2);
    expect(d.y).toBe(2);
  });

  it('multiplies', () => {
    d = b.times(c);
    expect(d.x).toBe(3);
    expect(d.y).toBe(8);
  });

  it('divides', () => {
    d = b.dividedBy(c);
    expect(d.x).toBe(1 / 3);
    expect(d.y).toBe(0.5);
  });

  it('calculates distance', () => {
    expect(b.distanceTo(c)).toBe(sqrt(8));
    expect(a.distanceTo(c)).toBe(5);
  });

  it('compares', () => {
    expect(b.isEqualTo(c)).toBe(false);
    expect(c.isEqualTo(new Vec2(3, 4))).toBe(true);
  });
});
