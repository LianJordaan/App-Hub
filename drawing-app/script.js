// Get the canvas element and its context.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Set up some initial values.
let isDrawing = false;
let activePointerId = null;
let lastX = 0;
let lastY = 0;
let hue = 0;
let lineWidth = 10;

// Keep the original canvas sizing.
canvas.width = Math.max(1, window.innerWidth);
canvas.height = Math.max(1, window.innerHeight - 50);

// Apply these to the canvas only, not the page or toolbar.
// This lets a finger draw instead of scrolling/zooming the page on the canvas.
// No mobile-device detection: touch and mouse can be used on the same laptop.
canvas.style.touchAction = 'none';
canvas.style.userSelect = 'none';
canvas.style.webkitUserSelect = 'none';
canvas.style.webkitTouchCallout = 'none';

// Convert viewport coordinates to canvas pixels, including CSS size scaling.
function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * (canvas.width / (rect.width || 1)),
    y: (event.clientY - rect.top) * (canvas.height / (rect.height || 1))
  };
}

function applyBrushStyle() {
  if (document.getElementById('rainbow-mode').checked) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  } else {
    ctx.strokeStyle = document.getElementById('color-picker').value;
  }

  const selectedWidth = document.getElementById('brush-size').valueAsNumber;

  ctx.lineWidth = Number.isFinite(selectedWidth) && selectedWidth > 0
    ? selectedWidth
    : lineWidth;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

function advanceDrawHue() {
  if (
    document.getElementById('rainbow-mode').checked &&
    document.getElementById('rainbow-type').value === 'draw'
  ) {
    hue = (hue + 1) % 360;
  }
}

// Draw only for the pointer that started this stroke.
// A second finger, mouse, or pen cannot hijack the active stroke.
function draw(event) {
  if (!isDrawing || event.pointerId !== activePointerId) return;

  const point = getCanvasPoint(event);

  if (point.x === lastX && point.y === lastY) return;

  applyBrushStyle();

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  [lastX, lastY] = [point.x, point.y];

  advanceDrawHue();
}

function startDrawing(event) {
  // Accept a single primary touch, left mouse button, or pen tip.
  // Ignore right/middle clicks, pen side buttons, and additional fingers.
  if (isDrawing || !event.isPrimary || event.button !== 0) return;

  if (event.cancelable) event.preventDefault();

  const point = getCanvasPoint(event);

  activePointerId = event.pointerId;
  isDrawing = true;

  [lastX, lastY] = [point.x, point.y];

  // Keep receiving movement/release events after leaving the canvas.
  // Window listeners below also cover an unavailable or lost capture.
  try {
    canvas.setPointerCapture(event.pointerId);
  } catch (error) {
    // A pointer can be canceled before capture is acquired.
    // Window pointerup/pointercancel and blur handlers still clean up.
  }

  // A tap/click without movement should draw a dot too.
  applyBrushStyle();

  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  advanceDrawHue();
}

function moveDrawing(event) {
  if (!isDrawing || event.pointerId !== activePointerId) return;

  // Prevent a stuck stroke after a missed mouse/pen release.
  // Do not require a mouse button for a finger stroke.
  if (
    (event.pointerType === 'mouse' || event.pointerType === 'pen') &&
    (event.buttons & 1) === 0
  ) {
    finishDrawing();
    return;
  }

  if (event.cancelable) event.preventDefault();

  draw(event);
}

function finishDrawing(event) {
  if (!isDrawing) return;
  if (event && event.pointerId !== activePointerId) return;

  // Include the final release position, but not cancellation/capture-loss
  // coordinates, which need not describe an actual movement.
  if (event && event.type === 'pointerup') {
    if (event.cancelable) event.preventDefault();

    draw(event);
  }

  const pointerId = activePointerId;

  isDrawing = false;
  activePointerId = null;

  // Reset state before releasing capture so lostpointercapture cannot save
  // the same stroke a second time.
  if (canvas.hasPointerCapture(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }

  // Save exactly once per stroke, including interrupted strokes.
  saveState();
}

// Pointer Events handle mouse, touch, and pen without separate device modes.
// Do not keep the old mousedown/mousemove/mouseup drawing listeners.
canvas.addEventListener('pointerdown', startDrawing, { passive: false });
window.addEventListener('pointermove', moveDrawing, { passive: false });
window.addEventListener('pointerup', finishDrawing, { passive: false });
window.addEventListener('pointercancel', finishDrawing);
canvas.addEventListener('lostpointercapture', finishDrawing);

window.addEventListener('blur', () => finishDrawing());

document.addEventListener('visibilitychange', () => {
  if (document.hidden) finishDrawing();
});

// Avoid a long-press context menu interrupting touch/pen drawing.
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

// Update the UI based on rainbow mode and type.
setInterval(() => {
  if (document.getElementById('rainbow-mode').checked) {
    const elementsToHide = document.querySelectorAll('.rainbowmode-hide');

    elementsToHide.forEach(element => {
      element.hidden = true;
    });

    const elementsToShow = document.querySelectorAll('.rainbowmode-show');

    elementsToShow.forEach(element => {
      element.hidden = false;
    });
  } else {
    const elementsToHide = document.querySelectorAll('.rainbowmode-hide');

    elementsToHide.forEach(element => {
      element.hidden = false;
    });

    const elementsToShow = document.querySelectorAll('.rainbowmode-show');

    elementsToShow.forEach(element => {
      element.hidden = true;
    });
  }

  if (
    document.getElementById('rainbow-type').value === 'constant' &&
    document.getElementById('rainbow-mode').checked
  ) {
    const elementsToShow = document.querySelectorAll(
      '.rainbowmode-constant-show'
    );

    elementsToShow.forEach(element => {
      element.hidden = false;
    });
  } else {
    const elementsToShow = document.querySelectorAll(
      '.rainbowmode-constant-show'
    );

    elementsToShow.forEach(element => {
      element.hidden = true;
    });
  }
}, 100);

// Rainbow animation timer.
let intervalId;
let rainbowSpeed;

const startInterval = () => {
  intervalId = setInterval(() => {
    if (
      document.getElementById('rainbow-mode').checked &&
      document.getElementById('rainbow-type').value === 'constant'
    ) {
      hue += 1;

      if (hue >= 360) hue = 0;
    }
  }, rainbowSpeed);
};

const stopInterval = () => {
  clearInterval(intervalId);
};

document.getElementById('rainbow-speed').addEventListener('change', () => {
  stopInterval();

  rainbowSpeed =
    201 - document.getElementById('rainbow-speed').valueAsNumber;

  startInterval();
});

rainbowSpeed = 201 - document.getElementById('rainbow-speed').valueAsNumber;
startInterval();

// Download the canvas as a PNG.
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', function() {
  const link = document.createElement('a');

  link.href = canvas.toDataURL();
  link.download = 'download.png';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Import an image.
const importBtn = document.querySelector('#import-btn');
const imgLoader = document.querySelector('#imgLoader');

importBtn.addEventListener('click', () => {
  imgLoader.click();
});

imgLoader.addEventListener('change', () => {
  const file = imgLoader.files[0];

  imgLoader.value = '';

  // The file picker may have been canceled.
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const img = new Image();

    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      saveState();
    };

    img.src = reader.result;
  });

  reader.readAsDataURL(file);
});

// Undo/redo history.
let undoStack = [];
let redoStack = [];

function saveState() {
  undoStack.push(canvas.toDataURL());

  // A new stroke/import starts a new history branch.
  redoStack.length = 0;
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());

    const img = new Image();

    img.src = undoStack[undoStack.length - 1];

    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

function redo() {
  if (redoStack.length > 0) {
    const img = new Image();

    img.src = redoStack.pop();

    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      undoStack.push(canvas.toDataURL());
    };
  }
}

// Save the initial blank canvas.
saveState();

// Attach undo and redo functions to buttons.
const undoBtn = document.querySelector('#undo-btn');
const redoBtn = document.querySelector('#redo-btn');

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// Keyboard shortcuts.
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'z') {
    undo();
  } else if (e.ctrlKey && e.key === 'y') {
    redo();
  }
});
