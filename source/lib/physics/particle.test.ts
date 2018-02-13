import Vec2, { fromPolar, scale } from '../geom/vec2';
import { π } from '../math';
import Particle from './particle';

describe('Particle', () => {
  it('defaults to the origin, with zero velocity', () => {
    const { cpos, ppos, cvel } = new Particle();

    expect(cpos.x).toBe(0);
    expect(cpos.y).toBe(0);

    expect(ppos.x).toBe(0);
    expect(ppos.y).toBe(0);

    expect(cvel.x).toBe(0);
    expect(cvel.y).toBe(0);
  });

  it("defaults to having a previous position equal to it's provided current position", () => {
    const { cpos, ppos, cvel } = new Particle(Vec2.one);

    expect(cpos.x).toBe(1);
    expect(cpos.y).toBe(1);

    expect(ppos.x).toBe(1);
    expect(ppos.y).toBe(1);

    expect(cvel.x).toBe(0);
    expect(cvel.y).toBe(0);
  });

  it("can interpolate it's position relative to it's previous one", () => {
    const p = new Particle(Vec2.zero, Vec2.one);
    const v = p.ipos(0.5);

    expect(v.x).toBe(0.5);
    expect(v.y).toBe(0.5);
  });

  it("updates based on it's previous position", () => {
    const p = new Particle(Vec2.zero, fromPolar(π, 1));

    expect(p.cpos.x).toBe(0);
    expect(p.cpos.y).toBe(0);

    p.update(1);
    expect(p.cpos.x).toBe(1);
    expect(p.cpos.y).toBeCloseTo(0);

    p.update(1);
    expect(p.cpos.x).toBe(2);
    expect(p.cpos.y).toBeCloseTo(0);
  });

  it('updates with behaviors applied to it', () => {
    type Behavior = (p: Particle, t: number) => Vec2;
    type BehaviorCreator = (...args: any[]) => Behavior;

    const createTestBehavior: BehaviorCreator = (d: number) => {
      return (p: Particle, t: number) => scale(p.cvel, d);
    };

    const testBehavior = jest.fn(createTestBehavior(1));
    const particle = new Particle(Vec2.zero, fromPolar(π, 1));
    particle.behaviors.push(testBehavior);

    expect(particle.cpos.x).toBe(0);
    expect(particle.cpos.y).toBeCloseTo(0);
    expect(testBehavior).not.toHaveBeenCalled();

    particle.update(1);
    expect(particle.cpos.x).toBe(2);
    expect(particle.cpos.y).toBeCloseTo(0);
    expect(testBehavior).toHaveBeenCalledTimes(1);

    particle.update(1);
    expect(particle.cpos.x).toBe(6);
    expect(particle.cpos.y).toBeCloseTo(0);
    expect(testBehavior).toHaveBeenCalledTimes(2);
  });
});
