// Get the canvas element and its context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up some initial values
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let lineWidth = 10;

// Set the canvas size based on the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

canvas.willReadFrequently = true;

// Function that is called when the mouse moves on the canvas
function draw(event) {
  if (!event.buttons & 1) isDrawing = false;
  // If the mouse isn't currently being clicked, exit the function
  if (!isDrawing) return;

  // Set the stroke style (color) and line width based on user input
  if (document.getElementById('rainbow-mode').checked) {
    // If rainbow mode is on, use a hue value that increases over time
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  } else {
    // Otherwise, use the selected color from the color picker
    ctx.strokeStyle = document.getElementById('color-picker').value;
  }
  ctx.lineWidth = document.getElementById('brush-size').valueAsNumber;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Calculate the mouse position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Draw a line from the last mouse position to the current one
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();

  // Update the last mouse position
  [lastX, lastY] = [mouseX, mouseY];

  // If rainbow mode is on and the rainbow type is "draw", increase the hue value
  if (document.getElementById('rainbow-mode').checked) {
    if (document.getElementById('rainbow-type').value == "draw") {
      hue += 1;
      if (hue >= 360) hue = 0;
    }
  }
}

// Set up event listeners for mouse down, move, and up
canvas.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    isDrawing = true;
    [lastX, lastY] = [event.clientX, event.clientY];
    draw(event);
  }  
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', (event) => {
  saveState();
  if (event.button === 0) {
    isDrawing = false;
  }  
});

// Set up an interval that updates the UI based on rainbow mode and type
setInterval(() => {
  // Check if rainbow mode is enabled
  if (document.getElementById('rainbow-mode').checked) {
    // If rainbow mode is enabled, hide elements with the "rainbowmode-hide" class
    const elementsToHide = document.querySelectorAll('.rainbowmode-hide');
    elementsToHide.forEach(element => {
      element.hidden = true;
    });

    // If rainbow mode is enabled, show elements with the "rainbowmode-show" class
    const elementsToShow = document.querySelectorAll('.rainbowmode-show');
    elementsToShow.forEach(element => {
      element.hidden = false;
    });
  } else {
    // If rainbow mode is not enabled, show elements with the "rainbowmode-hide" class
    const elementsToHide = document.querySelectorAll('.rainbowmode-hide');
    elementsToHide.forEach(element => {
      element.hidden = false;
    });

    // If rainbow mode is not enabled, hide elements with the "rainbowmode-show" class
    const elementsToShow = document.querySelectorAll('.rainbowmode-show');
    elementsToShow.forEach(element => {
      element.hidden = true;
    });
  }

  // Check if rainbow type is set to "constant" and rainbow mode is enabled
  if (document.getElementById('rainbow-type').value == "constant" && document.getElementById('rainbow-mode').checked) {
    // If rainbow type is "constant" and rainbow mode is enabled, show elements with the "rainbowmode-constant-show" class
    const elementsToShow = document.querySelectorAll('.rainbowmode-constant-show');
    elementsToShow.forEach(element => {
      element.hidden = false;
    });
  } else {
    // If rainbow type is not "constant" or rainbow mode is not enabled, hide elements with the "rainbowmode-constant-show" class
    const elementsToShow = document.querySelectorAll('.rainbowmode-constant-show');
    elementsToShow.forEach(element => {
      element.hidden = true;
    });
  }
}, 100);

// Initialize variables
let intervalId;
let rainbowSpeed;

// Define function to start the interval
const startInterval = () => {
  intervalId = setInterval(() => {
    // Check if rainbow mode is enabled and rainbow type is set to "constant"
    if (document.getElementById('rainbow-mode').checked && document.getElementById('rainbow-type').value == "constant") {
      // If rainbow mode is enabled and rainbow type is "constant", increment the hue value
      hue += 1;
      if (hue >= 360) hue = 0;
    }
  }, rainbowSpeed);
};

// Define function to stop the interval
const stopInterval = () => {
  clearInterval(intervalId);
};

// Add event listener to the rainbow speed input element
document.getElementById('rainbow-speed').addEventListener('change', () => {
  // Stop the interval when the rainbow speed is changed
  stopInterval();
  // Calculate the new rainbow speed based on the value of the rainbow speed input element
  rainbowSpeed = 201 - document.getElementById('rainbow-speed').valueAsNumber;
  // Start the interval with the new rainbow speed
  startInterval();
});

// Set the initial value of the rainbow speed and start the interval
rainbowSpeed = 201 - document.getElementById('rainbow-speed').valueAsNumber;
startInterval();

//ctx.fillStyle = '#f00';
//ctx.fillRect(100, 100, 200, 200);
//ctx.fillStyle = '#0f0';
//ctx.beginPath();
//ctx.arc(150, 150, 50, 0, 2 * Math.PI);
//ctx.fill();
//ctx.fillStyle = '#00f';
//ctx.beginPath();
//ctx.arc(250, 250, 50, 0, 2 * Math.PI);
//ctx.fill();
//
//
//function fillBucket() {
//  // Get the color of the starting point
//  const startX = 150;
//  const startY = 150;
//  const startColor = ctx.getImageData(startX, startY, 1, 1).data;
//
//  // Create a stack to keep track of pixels to fill
//  const stack = [{x: startX, y: startY}];
//
//  // Create an array to keep track of active intervals
//  let intervals = [];
//
//  // Define the number of intervals to start
//  const numIntervals = 100;
//
//  // Define the function to be executed by each interval
//  function fillPixels() {
//    // Loop through the stack until it's empty or we've filled the desired number of pixels
//    for (let i = 0; i < numIntervals; i++) {
//      if (stack.length === 0) {
//        // Stop the interval if there are no more pixels to fill
//        clearInterval(intervalId);
//        // Remove the interval from the active intervals array
//        intervals.splice(intervals.indexOf(intervalId), 1);
//        break;
//      }
//
//      // Pop the next pixel from the stack
//      const pixel = stack.pop();
//
//      // Get the color of the pixel
//      const color = ctx.getImageData(pixel.x, pixel.y, 1, 1).data;
//
//      // Check if the pixel needs to be filled
//      if (color[0] === startColor[0] && color[1] === startColor[1] && color[2] === startColor[2]) {
//        // Fill the pixel with the new color
//        ctx.fillStyle = '#fff';
//        ctx.fillRect(pixel.x, pixel.y, 1, 1);
//
//        // Add neighboring pixels to the stack
//        if (pixel.x > 0) stack.push({x: pixel.x - 1, y: pixel.y});
//        if (pixel.x < canvas.width - 1) stack.push({x: pixel.x + 1, y: pixel.y});
//        if (pixel.y > 0) stack.push({x: pixel.x, y: pixel.y - 1});
//        if (pixel.y < canvas.height - 1) stack.push({x: pixel.x, y: pixel.y + 1});
//      }
//    }
//  }
//
//  // Start the desired number of intervals
//  const numPixelsToFill = canvas.width * canvas.height;
//  const numIntervalsToStart = Math.min(numIntervals, numPixelsToFill);
//  for (let i = 0; i < numIntervalsToStart; i++) {
//    const intervalId = setInterval(fillPixels, 0);
//    intervals.push(intervalId);
//  }
//}


// get a reference to the download button
const downloadBtn = document.getElementById("download-btn");

// add a click event listener to the button
downloadBtn.addEventListener("click", function() {
  // get a reference to the canvas element
  const canvas = document.getElementById("canvas");

  // create a temporary link element
  const link = document.createElement("a");

  // set the link's href attribute to the data URL of the canvas image
  link.href = canvas.toDataURL();

  // set the link's download attribute to the filename you want to save the image as
  link.download = "download.png";

  // add the link to the DOM
  document.body.appendChild(link);

  // click the link to trigger the download
  link.click();

  // remove the link from the DOM
  document.body.removeChild(link);
});


const importBtn = document.querySelector('#import-btn');
const imgLoader = document.querySelector('#imgLoader');

importBtn.addEventListener('click', () => {
  imgLoader.click();
});

imgLoader.addEventListener('change', () => {
  const file = imgLoader.files[0];

  imgLoader.value = '';

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      saveState();
    }
    img.src = reader.result;
  });

  reader.readAsDataURL(file);
});


let undoStack = [];
let redoStack = [];

// Function to save the current canvas state
function saveState() {
  undoStack.push(canvas.toDataURL());
}

// Function to undo the last action
function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    const img = new Image();
    img.src = undoStack[undoStack.length - 1];
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }
}

// Function to redo the last undone action
function redo() {
  if (redoStack.length > 0) {
    const img = new Image();
    img.src = redoStack.pop();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      undoStack.push(canvas.toDataURL());
    }
  }
}

// Save initial state
saveState();

// Attach undo and redo functions to buttons
const undoBtn = document.querySelector('#undo-btn');
const redoBtn = document.querySelector('#redo-btn');

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'z') {
    undo();
  } else if (e.ctrlKey && e.key === 'y') {
    redo();
  }
});