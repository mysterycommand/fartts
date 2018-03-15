import './style.scss';

import Keyboard, { KeyCode } from './lib/input/keyboard';
import Mouse from './lib/input/mouse';
import { floor, min, random, round, toDegrees, π, ππ } from './lib/math';

const keyboard = new Keyboard(document);
const mouse = new Mouse(document);

const { cancelAnimationFrame: cAF, requestAnimationFrame: rAF } = window;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const buffer = document.createElement('canvas') as HTMLCanvasElement;
const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;

const stageScale = 1;
const stageWidth = canvas.clientWidth / stageScale;
const stageHeight = canvas.clientHeight / stageScale;
const stageCenterX = stageWidth / 2;
const stageCenterY = stageHeight / 2;

canvas.width = buffer.width = stageWidth;
canvas.height = buffer.height = stageHeight;
canvasContext.imageSmoothingEnabled = bufferContext.imageSmoothingEnabled = false;

const rows = [
  [
    KeyCode.Escape,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
    KeyCode.None,
  ],
  [
    KeyCode.Backquote,
    KeyCode.Digit1,
    KeyCode.Digit2,
    KeyCode.Digit3,
    KeyCode.Digit4,
    KeyCode.Digit5,
    KeyCode.Digit6,
    KeyCode.Digit7,
    KeyCode.Digit8,
    KeyCode.Digit9,
    KeyCode.Digit0,
    KeyCode.Minus,
    KeyCode.Equal,
    KeyCode.Backspace,
  ],
  [
    KeyCode.Tab,
    KeyCode.KeyQ,
    KeyCode.KeyW,
    KeyCode.KeyE,
    KeyCode.KeyR,
    KeyCode.KeyT,
    KeyCode.KeyY,
    KeyCode.KeyU,
    KeyCode.KeyI,
    KeyCode.KeyO,
    KeyCode.KeyP,
    KeyCode.BracketLeft,
    KeyCode.BracketRight,
    KeyCode.Backslash,
  ],
  [
    KeyCode.CapsLock,
    KeyCode.KeyA,
    KeyCode.KeyS,
    KeyCode.KeyD,
    KeyCode.KeyF,
    KeyCode.KeyG,
    KeyCode.KeyH,
    KeyCode.KeyJ,
    KeyCode.KeyK,
    KeyCode.KeyL,
    KeyCode.Semicolon,
    KeyCode.Quote,
    KeyCode.Enter,
  ],
  [
    KeyCode.ShiftLeft,
    KeyCode.KeyZ,
    KeyCode.KeyX,
    KeyCode.KeyC,
    KeyCode.KeyV,
    KeyCode.KeyB,
    KeyCode.KeyN,
    KeyCode.KeyM,
    KeyCode.Comma,
    KeyCode.Period,
    KeyCode.Slash,
    KeyCode.ShiftRight,
  ],
  [
    KeyCode.None,
    KeyCode.ControlLeft,
    KeyCode.AltLeft,
    KeyCode.MetaLeft,
    KeyCode.Space,
    KeyCode.MetaRight,
    KeyCode.AltRight,
    KeyCode.ArrowLeft,
    KeyCode.ArrowUp,
    KeyCode.ArrowRight,
    KeyCode.ArrowDown,
  ],
];

const mostColumns = rows.reduce((cols, { length }) => (length > cols ? length : cols), 0);

const keySize = stageWidth / mostColumns;

function draw(/* i: number */): void {
  bufferContext.fillStyle = '#666';
  bufferContext.fillRect(0, 0, stageWidth, stageHeight);

  bufferContext.strokeStyle = '#fff';

  let keyY = 5;
  rows.forEach((row, i) => {
    let keyX = 5;
    let keyHeight = i === 0 ? (keySize - 12) / 2 : keySize - 12;

    row.forEach((col, j) => {
      bufferContext.fillStyle = col === KeyCode.None ? '#aaa' : '#fff';

      let keyWidth;
      switch (col) {
        case KeyCode.None:
          keyWidth = keySize - 10;
          break;
        case KeyCode.Backspace:
        case KeyCode.Tab:
          keyWidth = keySize + 14;
          break;
        case KeyCode.CapsLock:
        case KeyCode.Enter:
          keyWidth = keySize + 30;
          break;
        case KeyCode.ShiftLeft:
        case KeyCode.ShiftRight:
          keyWidth = keySize + 60;
          break;
        case KeyCode.Space:
          keyWidth = keySize + 248;
          break;
        default:
          keyWidth = keySize - 12;
          break;
      }

      if (
        col === KeyCode.ArrowLeft ||
        col === KeyCode.ArrowUp ||
        col === KeyCode.ArrowRight ||
        col === KeyCode.ArrowDown
      ) {
        keyHeight = (keySize - 12) / 2;
        keyY = (keySize - 10) * rows.length - 8;

        if (col === KeyCode.ArrowUp) {
          keyY -= keyHeight;
        }

        if (col === KeyCode.ArrowDown) {
          keyX -= (keyWidth + 10) * 2;
        }
      }

      keyboard.keysDown[col] || col === KeyCode.None
        ? bufferContext.fillRect(keyX, keyY, keyWidth, keyHeight)
        : bufferContext.strokeRect(keyX, keyY, keyWidth, keyHeight);

      keyX += keyWidth + 10;
    });
    keyY += keyHeight + 10;
  });

  canvasContext.drawImage(buffer, 0, 0);
}

function tick(): void {
  rAF(tick);
  draw();
}

tick();
