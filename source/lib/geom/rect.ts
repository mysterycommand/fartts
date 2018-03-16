import Vec2, { add, sub } from './vec2';

export default class Rect {
  constructor(
    public topLeft: Vec2 = new Vec2(),
    public bottomRight: Vec2 = add(topLeft, new Vec2(10, 10)),
  ) {}

  public get y() {
    return this.topLeft.y;
  }

  public get x() {
    return this.topLeft.x;
  }

  public get width() {
    return sub(this.bottomRight, this.topLeft).x;
  }

  public get height() {
    return sub(this.bottomRight, this.topLeft).y;
  }

  public get top() {
    return this.topLeft.y;
  }

  public get left() {
    return this.topLeft.x;
  }

  public get right() {
    return this.bottomRight.x;
  }

  public get bottom() {
    return this.bottomRight.y;
  }
}
