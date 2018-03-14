enum KeyboardEventType {
  KeyDown = 'keydown',
  KeyPress = 'keypress',
  KeyUp = 'keyup',
}

export default class Keyboard {
  public static isKeyboardEvent(event: Event): event is KeyboardEvent {
    return event instanceof KeyboardEvent;
  }

  constructor(private context: EventTarget) {
    Object.values(KeyboardEventType).forEach(type => {
      context.addEventListener(type, this.onKey);
    })
  }

  private onKey = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!Keyboard.isKeyboardEvent(event)) {
      return;
    }
  }
}
