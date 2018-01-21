import Vec2 from '../geom/vec-2';

export default class Particle {
  public constructor(public currentPosition = new Vec2(), public previousPosition = new Vec2()) {}
}
