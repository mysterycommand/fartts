import Vec2, { clone, sub } from '../geom/vec2';

export enum MouseEventType {
  MouseEnter = 'mouseenter',
  MouseLeave = 'mouseleave',
  MouseMove = 'mousemove',
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',

  // @todo: need a way to re-dispatch/emit these
  // Click = 'click',
  // DblClick = 'dblclick',
}

export enum WheelEventType {
  Wheel = 'wheel',
}

export default class Mouse {
  public static isMouseEvent(event: Event): event is MouseEvent {
    return event instanceof MouseEvent;
  }

  public static isWheelEvent(event: Event): event is WheelEvent {
    return event instanceof WheelEvent;
  }

  public get currVel(): Vec2 {
    return sub(this.currPos, this.prevPos);
  }

  public prevPos: Vec2 = new Vec2();
  public currPos: Vec2 = new Vec2();

  public isDown: boolean = false;

  public altKey: boolean = false;
  public ctrlKey: boolean = false;
  public metaKey: boolean = false;
  public shiftKey: boolean = false;

  public wheel: Vec2 = new Vec2();

  constructor(private eventTarget: EventTarget) {
    Object.values(MouseEventType).forEach(type => {
      eventTarget.addEventListener(type, this.onMouse);
    });

    Object.values(WheelEventType).forEach(type => {
      eventTarget.addEventListener(type, this.onWheel);
    });
  }

  public onMouse = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!Mouse.isMouseEvent(event)) {
      return;
    }

    if (event.type === MouseEventType.MouseEnter) {
      this.currPos = new Vec2(event.clientX, event.clientY);
    }

    if (event.type === MouseEventType.MouseDown) {
      this.isDown = true;
    }

    if (event.type === MouseEventType.MouseUp) {
      this.isDown = false;
    }

    this.prevPos = clone(this.currPos);
    this.currPos = new Vec2(event.clientX, event.clientY);

    this.altKey = event.altKey;
    this.ctrlKey = event.ctrlKey;
    this.metaKey = event.metaKey;
    this.shiftKey = event.shiftKey;
  };

  public onWheel = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!Mouse.isWheelEvent(event)) {
      return;
    }

    this.wheel = new Vec2(event.deltaX, event.deltaY);
  };
}
