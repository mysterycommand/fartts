import Particle from '../physics/particle';

export type TBehavior = (p: Particle, t: number, dt: number) => void;
