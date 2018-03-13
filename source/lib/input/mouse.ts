export default class Mouse {
  public static isMouseEvent(event: Event): event is MouseEvent {
    return event instanceof MouseEvent;
  }

  constructor(private context: EventTarget) {
    context.addEventListener('mouseenter', this.onMouse);
    context.addEventListener('mouseleave', this.onMouse);
    context.addEventListener('mousemove', this.onMouse);
    context.addEventListener('mousedown', this.onMouse);
    context.addEventListener('mouseup', this.onMouse);

    context.addEventListener('click', this.onMouse);
    context.addEventListener('dblclick', this.onMouse);
  }

  private onMouse = (event: Event) => {
    if (!Mouse.isMouseEvent(event)) {
      return;
    }

    console.log(event.type);
  };
}
