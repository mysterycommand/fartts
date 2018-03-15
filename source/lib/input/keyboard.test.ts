import Vec2 from '../geom/vec2';
import Keyboard, { KeyboardEventType, KeyCode } from './keyboard';

describe('Keyboard', () => {
  it('validates a KeyboadEvent', () => {
    expect(Keyboard.isKeyboardEvent(new Event('flooz'))).toBe(false);
    expect(Keyboard.isKeyboardEvent(new KeyboardEvent(KeyboardEventType.KeyDown))).toBe(true);
  });

  it('validates a KeyCode', () => {
    expect(Keyboard.isKeyCode('help')).toBe(false);
    Object.values(KeyCode).forEach(keyCode => {
      expect(Keyboard.isKeyCode(keyCode)).toBe(true);
    });
  });

  it('adds event listeners for all the types', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const keyboard = new Keyboard(document);

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });

  /**
   * @todo(mysterycommand): figure out how to test these as event listeners, and reprivatize them
   * @see: https://github.com/facebook/jest/issues/5800
   */
  it('does not update state based on non-keyboard events', () => {
    const keyboard = new Keyboard(document);
    keyboard.onKey(new Event('does nothing'));

    Object.values(KeyCode).forEach(keyCode => {
      keyboard.onKey(new KeyboardEvent(KeyboardEventType.KeyUp, { code: keyCode }));

      if (!Keyboard.isKeyCode(keyCode)) {
        return;
      }

      expect(keyboard.keysDown[keyCode]).toBe(false);
    });
  });

  it('updates state based on keyboard events', () => {
    const keyboard = new Keyboard(document);

    Object.values(KeyCode).forEach(keyCode => {
      keyboard.onKey(new KeyboardEvent(KeyboardEventType.KeyDown, { code: keyCode }));

      if (!Keyboard.isKeyCode(keyCode)) {
        return;
      }

      expect(keyboard.keysDown[keyCode]).toBe(true);
    });

    Object.values(KeyCode).forEach(keyCode => {
      keyboard.onKey(new KeyboardEvent(KeyboardEventType.KeyUp, { code: keyCode }));

      if (!Keyboard.isKeyCode(keyCode)) {
        return;
      }

      expect(keyboard.keysDown[keyCode]).toBe(false);
    });
  });
});
