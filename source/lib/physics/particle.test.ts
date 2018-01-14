import Particle from './particle';

describe('Particle', () => {
  const p = new Particle();

  it('defaults to the origin', () => {
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
  });

  it('updates', () => {
    p.update();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0.2);
  });
});
