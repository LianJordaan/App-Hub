const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const rainbowMode = document.getElementById('rainbow-mode');
const rainbowType = document.getElementById('rainbow-type');
const rainbowSpeedInput = document.getElementById('rainbow-speed');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');

let hue = 0;
const defaultLineWidth = 10;

// Each pointer gets its own previous position.
// There is deliberately no isPrimary restriction or one-finger limit.
const activePointers = new Map();

const undoStack = [];
const redoStack = [];

// Serialize undo, redo, and imports so image loading cannot overwrite
// another history operation or a newly started stroke.
let canvasTask = Promise.resolve();
let canvasBusy = false;

canvas.width = Math.max(1, window.innerWidth);
canvas.height = Math.max(1, window.innerHeight - 50);

// Disable browser touch gestures only on the drawing surface.
canvas.style.touchAction = 'none';
canvas.style.userSelect = 'none';
canvas.style.webkitUserSelect = 'none';
canvas.style.webkitTouchCallout = 'none';

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * (canvas.width / (rect.width || 1)),
    y: (event.clientY - rect.top) * (canvas.height / (rect.height || 1))
  };
}

function applyBrushStyle() {
  ctx.strokeStyle = rainbowMode.checked
    ? `hsl(${hue}, 100%, 50%)`
    : colorPicker.value;

  const selectedWidth = brushSize.valueAsNumber;

  ctx.lineWidth = Number.isFinite(selectedWidth) && selectedWidth > 0
    ? selectedWidth
    : defaultLineWidth;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

function advanceDrawHue() {
  if (rainbowMode.checked && rainbowType.value === 'draw') {
    hue = (hue + 1) % 360;
  }
}

function draw(event) {
  const pointer = activePointers.get(event.pointerId);
  if (!pointer) return;

  const point = getCanvasPoint(event);
  if (point.x === pointer.x && point.y === pointer.y) return;

  applyBrushStyle();

  // Always start a new path for this pointer's segment.
  // Different fingers must never share a previous position or path.
  ctx.beginPath();
  ctx.moveTo(pointer.x, pointer.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  pointer.x = point.x;
  pointer.y = point.y;

  advanceDrawHue();
}

function startDrawing(event) {
  // Allow all fingers, not just the primary finger.
  // Ignore right/middle mouse buttons and pen side-button starts.
  if (event.button !== 0 || activePointers.has(event.pointerId)) return;
  if (event.cancelable) event.preventDefault();
  if (canvasBusy) return;

  const point = getCanvasPoint(event);
  activePointers.set(event.pointerId, point);

  // Capture each pointer independently, including secondary fingers.
  try {
    canvas.setPointerCapture(event.pointerId);
  } catch (error) {
    // Window listeners still handle movement and release without capture.
  }

  // Draw a dot immediately, so taps also leave a mark.
  applyBrushStyle();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  advanceDrawHue();
}

function moveDrawing(event) {
  if (!activePointers.has(event.pointerId)) return;

  // Recover from a missed mouse/pen release without ending other strokes.
  if (
    (event.pointerType === 'mouse' || event.pointerType === 'pen') &&
    (event.buttons & 1) === 0
  ) {
    endPointer(event.pointerId);
    return;
  }

  if (event.cancelable) event.preventDefault();
  draw(event);
}

function releasePointer(pointerId) {
  try {
    if (canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
  } catch (error) {
    // The browser may already have canceled or released this pointer.
  }
}

function endPointer(pointerId) {
  if (!activePointers.delete(pointerId)) return;

  // Remove state first: lostpointercapture must not end the stroke twice.
  releasePointer(pointerId);

  // Treat overlapping strokes as one undoable gesture.
  // Lifting one finger does not stop any remaining fingers.
  if (activePointers.size === 0) saveState();
}

function finishDrawing(event) {
  if (!activePointers.has(event.pointerId)) return;

  // Cancellation/capture-loss coordinates are not drawing positions.
  if (event.type === 'pointerup') {
    if (event.cancelable) event.preventDefault();
    draw(event);
  }

  endPointer(event.pointerId);
}

function finishAllDrawing() {
  if (activePointers.size === 0) return;

  const pointerIds = [...activePointers.keys()];
  activePointers.clear();

  pointerIds.forEach(releasePointer);
  saveState();
}

canvas.addEventListener('pointerdown', startDrawing, { passive: false });
window.addEventListener('pointermove', moveDrawing, { passive: false });
window.addEventListener('pointerup', finishDrawing, { passive: false });
window.addEventListener('pointercancel', finishDrawing);
canvas.addEventListener('lostpointercapture', finishDrawing);

window.addEventListener('blur', finishAllDrawing);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) finishAllDrawing();
});

canvas.addEventListener('contextmenu', (event) => event.preventDefault());

// Rainbow-mode controls.
function setElementsHidden(selector, hidden) {
  document.querySelectorAll(selector).forEach(element => {
    element.hidden = hidden;
  });
}

function updateRainbowUI() {
  const enabled = rainbowMode.checked;

  setElementsHidden('.rainbowmode-hide', enabled);
  setElementsHidden('.rainbowmode-show', !enabled);
  setElementsHidden(
    '.rainbowmode-constant-show',
    !(enabled && rainbowType.value === 'constant')
  );
}

updateRainbowUI();
setInterval(updateRainbowUI, 100);

let intervalId;

function startInterval() {
  clearInterval(intervalId);

  const value = rainbowSpeedInput.valueAsNumber;
  const delay = Number.isFinite(value) ? Math.max(1, 201 - value) : 100;

  intervalId = setInterval(() => {
    if (rainbowMode.checked && rainbowType.value === 'constant') {
      hue = (hue + 1) % 360;
    }
  }, delay);
}

rainbowSpeedInput.addEventListener('change', startInterval);
startInterval();

// Canvas history and image loading.
function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack.length = 0;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('The image could not be loaded.'));
    img.src = source;
  });
}

function queueCanvasChange(action) {
  // Finish any current multi-finger gesture before changing the canvas.
  finishAllDrawing();
  canvasBusy = true;

  const task = canvasTask.then(action).catch(error => {
    console.error('Canvas operation failed:', error);
  });

  canvasTask = task;

  task.then(() => {
    // A later operation may already be waiting in the queue.
    if (canvasTask === task) canvasBusy = false;
  });

  return task;
}

function undo() {
  return queueCanvasChange(async () => {
    if (undoStack.length <= 1) return;

    const previousState = undoStack[undoStack.length - 2];
    const img = await loadImage(previousState);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    redoStack.push(undoStack.pop());
  });
}

function redo() {
  return queueCanvasChange(async () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const img = await loadImage(nextState);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    undoStack.push(redoStack.pop());
  });
}

saveState();

document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('redo-btn').addEventListener('click', redo);

// Download the canvas as a PNG.
document.getElementById('download-btn').addEventListener('click', () => {
  queueCanvasChange(() => {
    const link = document.createElement('a');

    link.href = canvas.toDataURL();
    link.download = 'download.png';

    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});

// Import an image.
const importBtn = document.getElementById('import-btn');
const imgLoader = document.getElementById('imgLoader');

importBtn.addEventListener('click', () => {
  finishAllDrawing();
  imgLoader.click();
});

imgLoader.addEventListener('change', () => {
  const file = imgLoader.files[0];
  imgLoader.value = '';
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener('load', async () => {
    try {
      const img = await loadImage(reader.result);

      await queueCanvasChange(() => {
        ctx.drawImage(img, 0, 0);
        saveState();
      });
    } catch (error) {
      console.error('Unable to import the selected image:', error);
    }
  });

  reader.addEventListener('error', () => {
    console.error('Unable to read the selected file:', reader.error);
  });

  reader.readAsDataURL(file);
});

// Keyboard shortcuts, without overriding typing in toolbar fields.
document.addEventListener('keydown', (event) => {
  const target = event.target;

  if (
    target instanceof Element &&
    (target.closest('input, textarea, select') || target.isContentEditable)
  ) {
    return;
  }

  if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

  const key = event.key.toLowerCase();

  if (key === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  } else if (key === 'y') {
    event.preventDefault();
    redo();
  }
});
