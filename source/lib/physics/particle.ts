import Vec2 from '../geom/vec-2';

export default class Particle {
  public behaviors: Array<(p: Particle, t: number) => Vec2> = [];

  public constructor(public currentPosition = new Vec2(), public previousPosition = new Vec2()) {}

  public get velocity(): Vec2 {
    return Vec2.sub(this.currentPosition, this.previousPosition);
  }

  public getInterpolatedPosition(i: number): Vec2 {
    return Vec2.lerp(this.currentPosition, this.previousPosition, i);
  }

  public update(t: number): void {
    const { currentPosition, previousPosition, behaviors } = this;

    let { velocity } = this;
    behaviors.forEach(b => {
      velocity = b(this, 1);
    });

    previousPosition.x = currentPosition.x;
    previousPosition.y = currentPosition.y;

    currentPosition.x += velocity.x;
    currentPosition.y += velocity.y;

    // constraints: distance, bounds, etc...
  }
}
