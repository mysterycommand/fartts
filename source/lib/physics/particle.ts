import Vec2 from '../geom/vec-2';

// TODO: factor this out into a gravity (or maybe just general acceleration) behavior
const gravity = new Vec2(0, 0.0001);

export default class Particle {
  public constructor(public currentPosition = new Vec2(), public previousPosition = new Vec2()) {}

  public get velocity(): Vec2 {
    return Vec2.sub(this.currentPosition, this.previousPosition);
  }

  public getInterpolatedPosition(i: number): Vec2 {
    return Vec2.lerp(this.currentPosition, this.previousPosition, i);
  }

  public update(t: number): void {
    const { currentPosition, previousPosition } = this;

    // behaviors: drag, friction (ground), gravity, etc...
    let { velocity } = this;

    // TODO: factor these out into "behaviors"
    velocity = Vec2.lerp(velocity, Vec2.ZERO, 0.99); // drag
    velocity = Vec2.add(velocity, Vec2.scale(gravity, t * t)); // gravity

    previousPosition.x = currentPosition.x;
    previousPosition.y = currentPosition.y;

    currentPosition.x += velocity.x;
    currentPosition.y += velocity.y;

    // constraints: distance, bounds, etc...
  }
}
