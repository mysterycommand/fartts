import Mouse from './mouse';

describe('Mouse', () => {
  it('should exist', () => {
    expect(Mouse).toBeDefined();
  });

  it('validates a MouseEvent', () => {
    expect(Mouse.isMouseEvent(new Event('glerb'))).toBe(false);
    expect(Mouse.isMouseEvent(new MouseEvent('click'))).toBe(true);
  });

  it('validates a WheelEvent', () => {
    expect(Mouse.isWheelEvent(new Event('flooz'))).toBe(false);
    expect(Mouse.isWheelEvent(new WheelEvent('wheel'))).toBe(true);
  });
});
