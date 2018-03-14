enum KeyboardEventType {
  KeyDown = 'keydown',

  // @todo: need a way to re-dispatch/emit this one?
  // what I really want is `tap` and `dbltap` or something like that
  // KeyPress = 'keypress',

  KeyUp = 'keyup',
}

export enum KeyCode {
  Escape = 'Escape',
  Backquote = 'Backquote',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
  Digit6 = 'Digit6',
  Digit7 = 'Digit7',
  Digit8 = 'Digit8',
  Digit9 = 'Digit9',
  Digit0 = 'Digit0',
  Minus = 'Minus',
  Equal = 'Equal',
  Backspace = 'Backspace',
  Tab = 'Tab',
  KeyQ = 'KeyQ',
  KeyW = 'KeyW',
  KeyE = 'KeyE',
  KeyR = 'KeyR',
  KeyT = 'KeyT',
  KeyY = 'KeyY',
  KeyU = 'KeyU',
  KeyI = 'KeyI',
  KeyO = 'KeyO',
  KeyP = 'KeyP',
  BracketLeft = 'BracketLeft',
  BracketRight = 'BracketRight',
  Backslash = 'Backslash',
  CapsLock = 'CapsLock',
  KeyA = 'KeyA',
  KeyS = 'KeyS',
  KeyD = 'KeyD',
  KeyF = 'KeyF',
  KeyG = 'KeyG',
  KeyH = 'KeyH',
  KeyJ = 'KeyJ',
  KeyK = 'KeyK',
  KeyL = 'KeyL',
  Semicolon = 'Semicolon',
  Quote = 'Quote',
  Enter = 'Enter',
  ShiftLeft = 'ShiftLeft',
  KeyZ = 'KeyZ',
  KeyX = 'KeyX',
  KeyC = 'KeyC',
  KeyV = 'KeyV',
  KeyB = 'KeyB',
  KeyN = 'KeyN',
  KeyM = 'KeyM',
  Comma = 'Comma',
  Period = 'Period',
  Slash = 'Slash',
  ShiftRight = 'ShiftRight',
  ControlLeft = 'ControlLeft',
  AltLeft = 'AltLeft',
  MetaLeft = 'MetaLeft',
  Space = 'Space',
  MetaRight = 'MetaRight',
  AltRight = 'AltRight',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  None = 'None',
}

export default class Keyboard {
  public static isKeyboardEvent(event: Event): event is KeyboardEvent {
    return event instanceof KeyboardEvent;
  }

  public static isKeyCode(code: string): code is KeyCode {
    return code in KeyCode;
  }

  public keysDown: { [keyCode in KeyCode]: boolean } = Object.values(KeyCode).reduce(
    (keysDown, keyCode) => {
      keysDown[keyCode] = false;
      return keysDown;
    },
    {},
  );

  constructor(private context: EventTarget) {
    Object.values(KeyboardEventType).forEach(type => {
      context.addEventListener(type, this.onKey);
    });
  }

  private onKey = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!(Keyboard.isKeyboardEvent(event) && Keyboard.isKeyCode(event.code))) {
      return;
    }

    this.keysDown[event.code] = event.type === KeyboardEventType.KeyDown;
  };
}
