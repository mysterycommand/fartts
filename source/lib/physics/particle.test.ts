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

  it("updates based on it's previous position", () => {
    const p = new Particle(Vec2.ZERO, Vec2.fromPolar(π, 1));
    p.update();

    expect(p.currentPosition.x).toBe(1);
    expect(p.currentPosition.y).toBeCloseTo(0);
  });
});
