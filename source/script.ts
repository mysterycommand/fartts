import './style.scss';

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

const playStopButton = document.getElementById('play-stop') as HTMLButtonElement;
const playLabel = '▶';
const stopLabel = '■';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const w = canvas.clientWidth / 5;
const h = canvas.clientHeight / 5;
const hw = w / 2;
const hh = h / 2;

canvas.width = buffer.width = w;
canvas.height = buffer.height = h;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

/**
 * SIMULATION
 */
const step = 1000 / 60;
let drift = 0;

/**
 * update: updates the simulation
 * @param dt {number} - the number of miliseconds to simulate
 */
function update(dt: number): void {
  console.log('update'); // tslint:disable-line
}

/**
 * RENDERING
 */

/**
 * draw: renders a frame to the canvas
 * @param ip {number} - the 'interpolation percentage', that is the amount of time that has yet to be simulated this frame
 */
function draw(ip: number): void {
  console.log('draw'); // tslint:disable-line
}

/**
 * GAME-LOOP
 */
let frameId = -1;

// resets everytime you click 'play'
let firstTs = 0;
let previousTs = 0;

// calculated each frame, relative to first/previous frame (respectively)
let normalTs = 0;
let deltaTs = 0;

function tick(ts: number): void {
  frameId = rAF(tick);

  normalTs = ts - firstTs;
  deltaTs = normalTs - previousTs;
  previousTs = normalTs;
  drift += deltaTs;

  // do stuff with time/delta here
  while (drift >= step) {
    // update(step);
    // drift -= step;
  }
  // draw(drift / step);
  console.log(`${normalTs.toFixed(2)} : ${deltaTs.toFixed(2)}`); // tslint:disable-line
}

function play(): void {
  playStopButton.innerText = stopLabel;
  playStopButton.setAttribute('aria-label', 'stop');

  frameId = rAF((ts: number) => {
    firstTs = ts;
    previousTs = 0;
    drift = 0;

    // draw(1);
    frameId = rAF(tick);
  });
}

function stop(): void {
  playStopButton.innerText = playLabel;
  playStopButton.setAttribute('aria-label', 'play');

  cAF(frameId);
  frameId = -1;
  console.log('\n'); // tslint:disable-line
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

playStopButton.addEventListener('click', toggle);
