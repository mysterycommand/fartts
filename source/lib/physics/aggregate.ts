import Behavior from './behavior';
import Constraint from './constraint';
import Particle from './particle';

const drag = 0.99;

export default class Aggregate {
  public particles: Particle[];

  public behaviors: Behavior[];
  public constraints: Constraint[];

  public update() {
    // behaviors
    this.behaviors.forEach(b => {
      this.particles.forEach(p => {
        // b.apply(p);
      });
    });

    // particles
    this.particles.forEach(p => {
      p.scaleVelocity(drag);
      p.update();
    });

    // constraints
    this.constraints.forEach(c => {
      this.particles.forEach(p => {
        // c.apply(p);
      });
    });
  }
}
