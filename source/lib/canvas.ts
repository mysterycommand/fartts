export const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

export const buffer = document.createElement('canvas') as HTMLCanvasElement;
export const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

export const stageScale = 1;
export const stageWidth = canvas.clientWidth / stageScale;
export const stageHeight = canvas.clientHeight / stageScale;
export const stageCenterX = stageWidth / 2;
export const stageCenterY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;
