import Rect from '../geom/rect';
import Vec2, { sub } from '../geom/vec2';
import { max, min } from '../math';
import Particle from '../physics/particle';
import { IConstraint } from './';

export default class BoundsConstraint implements IConstraint {
  public constructor(public particles: Particle[] = [], public bounds: Rect = new Rect()) {}

  public update(t: number, dt: number): void {
    const { bounds, particles } = this;
    particles.forEach(p => {
      const { currPos, prevPos } = p;
      const isWithinHorizontalBounds = bounds.left < currPos.x && currPos.x < bounds.right;
      const isWithinVerticalBounds = bounds.top < currPos.y && currPos.y < bounds.bottom;

      if (!isWithinHorizontalBounds) {
        currPos.x = prevPos.x = min(max(bounds.left, currPos.x), bounds.right);
      }

      if (!isWithinVerticalBounds) {
        currPos.y = prevPos.y = min(max(bounds.top, currPos.y), bounds.bottom);
      }
    });
  }
}
