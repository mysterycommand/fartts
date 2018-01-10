import './style.scss';

import Vec2 from './lib/math/vec-2';

const main = document.getElementById('main');

// tslint:disable no-console
console.log(new Vec2(1, 2).plus(new Vec2(2, 2)).distanceTo(new Vec2()));
// tslint:enable no-console

export default () => true;
