import { hypot } from '../math';

export default class Vec2 {
  public constructor(public x = 0, public y = 0) {}

  public get length() {
    return hypot(this.x, this.y);
  }
}
