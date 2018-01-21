import './style.scss';

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
