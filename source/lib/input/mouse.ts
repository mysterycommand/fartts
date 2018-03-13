enum MouseEventType {
  MouseEnter = 'mouseenter',
  MouseLeave = 'mouseleave',
  MouseMove = 'mousemove',
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  Click = 'click',
  DblClick = 'dblclick',
  Wheel = 'wheel',
}

export default class Mouse {
  public static isMouseEvent(event: Event): event is MouseEvent {
    return event instanceof MouseEvent;
  }

  constructor(private context: EventTarget) {
    Object.values(MouseEventType).forEach(type => {
      context.addEventListener(type, this.onMouse);
    });
  }

  private onMouse = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!Mouse.isMouseEvent(event)) {
      return;
    }

    console.log(event.type);
  };
}
