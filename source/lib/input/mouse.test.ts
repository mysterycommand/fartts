import Vec2 from '../geom/vec2';
import Mouse, { MouseEventType, WheelEventType } from './mouse';

describe('Mouse', () => {
  it('validates a MouseEvent', () => {
    expect(Mouse.isMouseEvent(new Event('glerb'))).toBe(false);
    expect(Mouse.isMouseEvent(new MouseEvent('click'))).toBe(true);
  });

  it('validates a WheelEvent', () => {
    expect(Mouse.isWheelEvent(new Event('flooz'))).toBe(false);
    expect(Mouse.isWheelEvent(new WheelEvent('wheel'))).toBe(true);
  });

  it('calculates current velocity from current and previous position', () => {
    const mouse = new Mouse(document);
    mouse.currPos = new Vec2(10, 10);
    mouse.prevPos = new Vec2(8, 5);

    const { currVel } = mouse;
    expect(currVel.x).toBe(2);
    expect(currVel.y).toBe(5);
  });

  it('adds event listeners for all the types', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const mouse = new Mouse(document);

    expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
  });

  /**
   * @todo(mysterycommand): figure out how to test these as event listeners, and reprivatize them
   * @see: https://github.com/facebook/jest/issues/5800
   */
  it('does not update state based on non-mouse events', () => {
    const mouse = new Mouse(document);
    mouse.onMouse(new Event('does nothing'));

    expect(mouse.currPos.x).toBe(0);
    expect(mouse.currPos.y).toBe(0);
    expect(mouse.prevPos.x).toBe(0);
    expect(mouse.prevPos.y).toBe(0);
    expect(mouse.currVel.x).toBe(0);
    expect(mouse.currVel.y).toBe(0);
    expect(mouse.altKey).toBe(false);
    expect(mouse.ctrlKey).toBe(false);
    expect(mouse.metaKey).toBe(false);
    expect(mouse.shiftKey).toBe(false);
    expect(mouse.isDown).toBe(false);
  });

  it('does update state based on mouse events', () => {
    const mouse = new Mouse(document);
    mouse.onMouse(new MouseEvent(MouseEventType.MouseEnter, { clientX: 1, clientY: 2 }));
    mouse.onMouse(new MouseEvent(MouseEventType.MouseMove, { clientX: 2, clientY: 4 }));

    expect(mouse.currPos.x).toBe(2);
    expect(mouse.currPos.y).toBe(4);
    expect(mouse.prevPos.x).toBe(1);
    expect(mouse.prevPos.y).toBe(2);
    expect(mouse.currVel.x).toBe(1);
    expect(mouse.currVel.y).toBe(2);
    expect(mouse.altKey).toBe(false);
    expect(mouse.ctrlKey).toBe(false);
    expect(mouse.metaKey).toBe(false);
    expect(mouse.shiftKey).toBe(false);
    expect(mouse.isDown).toBe(false);

    mouse.onMouse(
      new MouseEvent(MouseEventType.MouseDown, {
        clientX: 2,
        clientY: 4,
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
      }),
    );

    expect(mouse.currPos.x).toBe(2);
    expect(mouse.currPos.y).toBe(4);
    expect(mouse.prevPos.x).toBe(2);
    expect(mouse.prevPos.y).toBe(4);
    expect(mouse.currVel.x).toBe(0);
    expect(mouse.currVel.y).toBe(0);
    expect(mouse.altKey).toBe(true);
    expect(mouse.ctrlKey).toBe(true);
    expect(mouse.metaKey).toBe(true);
    expect(mouse.shiftKey).toBe(true);
    expect(mouse.isDown).toBe(true);

    mouse.onMouse(
      new MouseEvent(MouseEventType.MouseUp, {
        clientX: 3,
        clientY: 5,
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
      }),
    );

    expect(mouse.currPos.x).toBe(3);
    expect(mouse.currPos.y).toBe(5);
    expect(mouse.prevPos.x).toBe(2);
    expect(mouse.prevPos.y).toBe(4);
    expect(mouse.currVel.x).toBe(1);
    expect(mouse.currVel.y).toBe(1);
    expect(mouse.altKey).toBe(true);
    expect(mouse.ctrlKey).toBe(true);
    expect(mouse.metaKey).toBe(true);
    expect(mouse.shiftKey).toBe(true);
    expect(mouse.isDown).toBe(false);
  });

  /**
   * @todo(mysterycommand): figure out how to test these as event listeners, and reprivatize them
   * @see: https://github.com/facebook/jest/issues/5800
   */
  it('does not update state based on non-mouse events', () => {
    const mouse = new Mouse(document);
    mouse.onWheel(new Event('does nothing'));

    expect(mouse.wheel.x).toBe(0);
    expect(mouse.wheel.y).toBe(0);
  });

  it('does update state based on mouse events', () => {
    const mouse = new Mouse(document);
    mouse.onWheel(
      new WheelEvent(WheelEventType.Wheel, {
        deltaX: 3,
        deltaY: 5,
      }),
    );

    expect(mouse.wheel.x).toBe(3);
    expect(mouse.wheel.y).toBe(5);
  });
});
