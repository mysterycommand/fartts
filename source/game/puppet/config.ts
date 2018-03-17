import ConstantForceBehavior from '../../lib/behaviors/constant-force-behavior';
import DragBehavior from '../../lib/behaviors/drag-behavior';
import GroundBehavior from '../../lib/behaviors/ground-behavior';

import { stageCenterX, stageCenterY, stageHeight, stageWidth } from '../../lib/canvas';

import Rect from '../../lib/geom/rect';
import Vec2, { add, angleBetween, fromPolar, scale, sub } from '../../lib/geom/vec2';

export const bounds = new Rect(new Vec2(10, 10), new Vec2(stageWidth - 10, stageHeight - 10));

export const gravity = new Vec2(0, 0.2);
export const friction = 0.1;
export const drag = 0.01;

export const origin = new Vec2(stageCenterX, stageCenterY);
export const o = new Vec2(origin.x, origin.y + 180);

export const torsoRadius = 54;
export const upperArmLength = 49;
export const forearmLength = 77;
export const thighLength = 84;
export const calfLength = 85;

export const commonBehaviors = [
  new ConstantForceBehavior(gravity),
  new GroundBehavior(bounds.bottom, friction),
  new DragBehavior(drag),
];

export const p = 2500;
export const wristMoveRadiusX = 20 * 1.5;
export const wristMoveRadiusY = 30 * 1.5;
export const ankleMoveRadiusX = 50 * 1.5;
export const ankleMoveRadiusY = 40 * 1.5;
