const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let lineWidth = 10;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - (window.innerHeight * 0.1);

function draw(event) {
  if (!isDrawing) return;

  if (document.getElementById('rainbow-mode').checked) {
    context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  } else {
    context.strokeStyle = document.getElementById('color-picker').value;
  }  
  context.lineWidth = document.getElementById('brush-size').valueAsNumber;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(mouseX, mouseY);
  context.stroke();
  
  [lastX, lastY] = [mouseX, mouseY];
  if (document.getElementById('rainbow-mode').checked) {
    if (document.getElementById('rainbow-type').value == "draw") {
        hue += 1;
        if (hue >= 360) hue = 0;
    }    
  }
}


canvas.addEventListener('mousedown', (event) => {
  isDrawing = true;
  [lastX, lastY] = [event.clientX, event.clientY];
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});

// Brush size options
const brushSizes = document.querySelectorAll('.brush-size button');

brushSizes.forEach((button) => {
  button.addEventListener('click', () => {
    lineWidth = parseInt(button.dataset.size);
  });
});


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
    if (document.getElementById('rainbow-type').value == "constant" && document.getElementById('rainbow-mode').checked){
        const elementsToShow = document.querySelectorAll('.rainbowmode-constant-show');
        elementsToShow.forEach(element => {
          element.hidden = false;
        });
    } else {
        const elementsToShow = document.querySelectorAll('.rainbowmode-constant-show');
        elementsToShow.forEach(element => {
          element.hidden = true;
        });
    }
}, 100);


let intervalId;
let rainbowSpeed;


const startInterval = () => intervalId = setInterval(() => { 
    if (document.getElementById('rainbow-mode').checked) {
        if (document.getElementById('rainbow-type').value == "constant") {
            hue += 1;
            if (hue >= 360) hue = 0;
        }    
    } 
}, rainbowSpeed);

const stopInterval = () => clearInterval(intervalId);

document.getElementById('rainbow-speed').addEventListener('change', () => {
    stopInterval();
    rainbowSpeed = 201 - document.getElementById('rainbow-speed').valueAsNumber
  startInterval();
});

rainbowSpeed = 201 - document.getElementById('rainbow-speed').valueAsNumber
startInterval();

