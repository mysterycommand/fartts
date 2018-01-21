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
});
