// Get the canvas element and its context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Set up some initial values
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let lineWidth = 10;

// Set the canvas size based on the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

// Function that is called when the mouse moves on the canvas
function draw(event) {
  // If the mouse isn't currently being clicked, exit the function
  if (!isDrawing) return;

  // Set the stroke style (color) and line width based on user input
  if (document.getElementById('rainbow-mode').checked) {
    // If rainbow mode is on, use a hue value that increases over time
    context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  } else {
    // Otherwise, use the selected color from the color picker
    context.strokeStyle = document.getElementById('color-picker').value;
  }
  context.lineWidth = document.getElementById('brush-size').valueAsNumber;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  // Calculate the mouse position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Draw a line from the last mouse position to the current one
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(mouseX, mouseY);
  context.stroke();

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
  isDrawing = true;
  [lastX, lastY] = [event.clientX, event.clientY];
  draw(event);
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
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
