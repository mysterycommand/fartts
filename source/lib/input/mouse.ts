import Vec2, { clone, sub } from '../geom/vec2';

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
  public static isWheelEvent(event: Event): event is WheelEvent {
    return event instanceof WheelEvent;
  }

  public static isMouseEvent(event: Event): event is MouseEvent {
    return event instanceof MouseEvent || event instanceof WheelEvent;
  }

  public get cvel(): Vec2 {
    return sub(this.currPos, this.prevPos);
  }

  public currPos: Vec2 = new Vec2();
  public prevPos: Vec2 = new Vec2();

  public isDown: boolean = false;

  public altKey: boolean = false;
  public ctrlKey: boolean = false;
  public metaKey: boolean = false;
  public shiftKey: boolean = false;

  public wheel: Vec2 = new Vec2();

  constructor(private context: EventTarget) {
    Object.values(MouseEventType).forEach(type => {
      context.addEventListener(type, this.onMouse);
    });
  }

  private onMouse = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (Mouse.isMouseEvent(event)) {
      if (event.type === MouseEventType.MouseEnter) {
        this.currPos = new Vec2(event.pageX, event.pageY);
      }

      if (event.type === MouseEventType.MouseDown) {
        this.isDown = true;
      }

      if (event.type === MouseEventType.MouseUp) {
        this.isDown = false;
      }

      this.prevPos = clone(this.currPos);
      this.currPos = new Vec2(event.pageX, event.pageY);

      this.altKey = event.altKey;
      this.ctrlKey = event.ctrlKey;
      this.metaKey = event.metaKey;
      this.shiftKey = event.shiftKey;
    }

    if (Mouse.isWheelEvent(event)) {
      this.wheel = new Vec2(event.deltaX, event.deltaY);
    }
  };
}
