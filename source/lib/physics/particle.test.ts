import Vec2 from '../geom/vec-2';
import { π } from '../math';
import Particle from './particle';

describe('Particle', () => {
  it('defaults to the origin, with zero velocity', () => {
    const { currentPosition, previousPosition, velocity } = new Particle();

    expect(currentPosition.x).toBe(0);
    expect(currentPosition.y).toBe(0);

    expect(previousPosition.x).toBe(0);
    expect(previousPosition.y).toBe(0);

    expect(velocity.x).toBe(0);
    expect(velocity.y).toBe(0);
  });

  it("can interpolate it's position relative to it's previous one", () => {
    const p = new Particle(Vec2.ZERO, Vec2.UNIT);
    const v = p.getInterpolatedPosition(0.5);

    expect(v.x).toBe(0.5);
    expect(v.y).toBe(0.5);
  });

  it("updates based on it's previous position", () => {
    const p = new Particle(Vec2.ZERO, Vec2.fromPolar(π, 1));

    expect(p.currentPosition.x).toBe(0);
    expect(p.currentPosition.y).toBe(0);

    p.update();
    expect(p.currentPosition.x).toBe(1);
    expect(p.currentPosition.y).toBeCloseTo(0);

    p.update();
    expect(p.currentPosition.x).toBe(2);
    expect(p.currentPosition.y).toBeCloseTo(0);
  });
});
