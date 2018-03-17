import Vec2, { fromPolar, scale } from '../geom/vec2';
import { π } from '../math';
import Particle from './particle';

describe('Particle', () => {
  it('defaults to the origin, with zero velocity', () => {
    const { currPos, prevPos, currVel } = new Particle();

    expect(currPos.x).toBe(0);
    expect(currPos.y).toBe(0);

    expect(prevPos.x).toBe(0);
    expect(prevPos.y).toBe(0);

    expect(currVel.x).toBe(0);
    expect(currVel.y).toBe(0);
  });

  it("defaults to having a previous position equal to it's provided current position", () => {
    const { currPos, prevPos, currVel } = new Particle(Vec2.one);

    expect(currPos.x).toBe(1);
    expect(currPos.y).toBe(1);

    expect(prevPos.x).toBe(1);
    expect(prevPos.y).toBe(1);

    expect(currVel.x).toBe(0);
    expect(currVel.y).toBe(0);
  });

  it("can interpolate it's position relative to it's previous one", () => {
    const p = new Particle(Vec2.zero, Vec2.one);
    const v = p.ipos(0.5);

    expect(v.x).toBe(0.5);
    expect(v.y).toBe(0.5);
  });

  it("updates based on it's previous position", () => {
    const p = new Particle(Vec2.zero, fromPolar(π, 1));

    expect(p.currPos.x).toBe(0);
    expect(p.currPos.y).toBe(0);

    p.update(0, 1);
    expect(p.currPos.x).toBe(1);
    expect(p.currPos.y).toBeCloseTo(0);

    p.update(0, 1);
    expect(p.currPos.x).toBe(2);
    expect(p.currPos.y).toBeCloseTo(0);
  });

  it.skip('updates with behaviors applied to it', () => {
    // type Behavior = (p: Particle, t: number) => Vec2;
    // type BehaviorCreator = (...args: any[]) => Behavior;
    // const createTestBehavior: BehaviorCreator = (d: number) => {
    //   return (p: Particle, t: number) => scale(p.currVel, d);
    // };
    // const testBehavior = jest.fn(createTestBehavior(1));

    const particle = new Particle(Vec2.zero, fromPolar(π, 1));
    // particle.behaviors.push(testBehavior);

    expect(particle.currPos.x).toBe(0);
    expect(particle.currPos.y).toBeCloseTo(0);
    // expect(testBehavior).not.toHaveBeenCalled();

    particle.update(0, 1);
    expect(particle.currPos.x).toBe(2);
    expect(particle.currPos.y).toBeCloseTo(0);
    // expect(testBehavior).toHaveBeenCalledTimes(1);

    particle.update(0, 1);
    expect(particle.currPos.x).toBe(5);
    expect(particle.currPos.y).toBeCloseTo(0);
    // expect(testBehavior).toHaveBeenCalledTimes(2);
  });
});
