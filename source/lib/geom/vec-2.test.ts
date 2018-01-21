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

  it('has a length property', () => {
    const v = new Vec2(3, 4);
    expect(v.length).toBe(5);
  });
});
