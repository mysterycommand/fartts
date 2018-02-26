import { toDegrees, toRadians, π, ππ } from './math';

test('toDegrees', () => {
  expect(toDegrees(0)).toBe(0);
  expect(toDegrees(π / 4)).toBe(45);
  expect(toDegrees(π / 2)).toBe(90);
  expect(toDegrees(ππ)).toBe(360);
});

test('toRadians', () => {
  expect(toRadians(0)).toBe(0);
  expect(toRadians(45)).toBe(π / 4);
  expect(toRadians(90)).toBe(π / 2);
  expect(toRadians(360)).toBe(ππ);
});
