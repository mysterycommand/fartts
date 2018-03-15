import seedRandom from 'seedrandom';

export const random = seedRandom('fart.ts');
export const { atan2, cos, floor, hypot, max, min, PI: π, round, sin, sqrt } = Math;
export const ππ = π * 2;

export function randomBool(): boolean {
  return round(random()) === 1;
}

/**
 * ## toDegrees
 * takes an angle in radians and returns that angle in degrees
 *
 * @param {number} radians - an angle, in radians
 * @return {number} - that same angle, in degrees
 */
export function toDegrees(radians: number): number {
  return radians * 180 / π;
}

/**
 * ## toRadians
 * takes an angle in degrees and returns that angle in radians
 *
 * @param {number} degrees - an angle, in degrees
 * @return {number} - that same angle, in radians
 */
export function toRadians(degrees: number): number {
  return degrees * π / 180;
}
