import Vec2 from '../math/vec-2';

const gravity = new Vec2(0, 0.2);

export default class Particle {
  private previousPosition: Vec2;
  private currentPosition: Vec2;

  constructor(initialPosition: Vec2 = new Vec2()) {
    this.previousPosition = initialPosition;
    this.currentPosition = initialPosition;
  }

  public get x() {
    return this.currentPosition.x;
  }

  public get y() {
    return this.currentPosition.y;
  }

  public update() {
    const velocity = this.currentPosition.minus(this.previousPosition); // scale by drag

    // handle (ground) friction

    this.previousPosition = this.currentPosition;
    this.currentPosition = this.currentPosition.plus(gravity).plus(velocity);
  }
}
