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

// simulation

// rendering

// game-loop
let frameId = -1;

function tick(time: number): void {
  frameId = rAF(tick);
  console.log(time); // tslint:disable-line
}

function play(): void {
  playStopButton.innerText = stopLabel;
  playStopButton.setAttribute('aria-label', 'stop');
  frameId = rAF(tick);
}

function stop(): void {
  playStopButton.innerText = playLabel;
  playStopButton.setAttribute('aria-label', 'play');
  cAF(frameId);
  frameId = -1;
}

function toggle(): void {
  frameId === -1 ? play() : stop();
}

playStopButton.addEventListener('click', toggle);
