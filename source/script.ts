import './style.scss';

import Mouse/* , { MouseEventType, WheelEventType } */ from './lib/input/mouse';

const mouse = new Mouse(document);

// Object.values({
//   ...MouseEventType,
//   ...WheelEventType,
// }).forEach(type => mouse.addEventListener(type, event => {
//   console.log(event); // tslint:disable-line no-console
// }))
