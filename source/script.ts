import './style.scss';

import { ππ } from './lib/math';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = canvas.cloneNode() as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const w = canvas.clientWidth / 5;
const h = canvas.clientHeight / 5;
const hw = w / 2;
const hh = h / 2;

canvas.width = buffer.width = w;
canvas.height = buffer.height = h;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

// clear
bufferContext.clearRect(0, 0, w, h);

// style
bufferContext.lineWidth = 2;
bufferContext.strokeStyle = 'skyblue';
bufferContext.fillStyle = 'lightblue';

// paths
bufferContext.arc(hw, hh, 10, 0, ππ);

// buffer
bufferContext.fill();
bufferContext.stroke();

// draw
canvasContext.drawImage(buffer, 0, 0);
