function cropImage() {
  const imageInput = document.getElementById('imageInput');
  const x1Input = document.getElementById('x1');
  const y1Input = document.getElementById('y1');
  const x2Input = document.getElementById('x2');
  const y2Input = document.getElementById('y2');
  const croppedImage = document.getElementById('croppedImage');
  const downloadLink = document.getElementById('downloadLink');
  
  const file = imageInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const image = new Image();
    image.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const x1 = parseInt(x1Input.value);
      const y1 = parseInt(y1Input.value);
      const x2 = parseInt(x2Input.value);
      const y2 = parseInt(y2Input.value);
      
      const width = x2 - x1;
      const height = y2 - y1;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(image, x1, y1, width, height, 0, 0, width, height);
      
      const croppedDataURL = canvas.toDataURL(file.type);
      croppedImage.src = croppedDataURL;
      downloadLink.href = croppedDataURL;
      downloadLink.setAttribute('download', 'cropped_image.png');
    };
    image.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  const imgPreview = document.getElementById('imagePreview');

  reader.onload = function (e) {
    imgPreview.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Add event listener to the file input element
const imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', handleFileSelect);

function createCoordinatesElement() {
  const imageContainer = document.querySelector('.image-container');

  const coordsElement = document.createElement('div');
  coordsElement.classList.add('coords-overlay');

  imageContainer.appendChild(coordsElement);

  return coordsElement;
}

function updateCoordinates(event) {
  const imageContainer = document.querySelector('.image-container');
  const imagePreview = document.getElementById('imagePreview');

  const coordsElement = imageContainer.querySelector('.coords-overlay');

  const bodyElement = document.body;
  const bodyRect = bodyElement.getBoundingClientRect();
  
  let cursorX = event.pageX - bodyRect.left;
  let cursorY = event.pageY - bodyRect.top;
  
  cursorX -= imagePreview.x;
  cursorY -= imagePreview.y;

  let scaleX = imagePreview.naturalWidth / imagePreview.clientWidth
  let scaleY = imagePreview.naturalHeight / imagePreview.clientHeight

  cursorX = Math.floor(cursorX * scaleX)
  cursorY = Math.floor(cursorY * scaleY)

  const coords = `X: ${cursorX}, Y: ${cursorY}`;
  coordsElement.textContent = coords;
}


function removeCoordinatesElement() {
  const imageContainer = document.querySelector('.image-container');
  const coordsElement = imageContainer.querySelector('.coords-overlay');
  imageContainer.removeChild(coordsElement);
}

// Add event listeners to show and hide coordinates on image hover
const imagePreview = document.getElementById('imagePreview');
imagePreview.addEventListener('mouseenter', createCoordinatesElement);
imagePreview.addEventListener('mousemove', updateCoordinates);
imagePreview.addEventListener('mouseleave', removeCoordinatesElement);

setInterval(function() {
  const imagePreview = document.getElementById('imagePreview');
  const imageOverlay = document.querySelector('.image-overlay');
  const x1Input = document.getElementById('x1');
  const y1Input = document.getElementById('y1');
  const x2Input = document.getElementById('x2');
  const y2Input = document.getElementById('y2');

  let scaleX = imagePreview.naturalWidth / imagePreview.clientWidth;
  let scaleY = imagePreview.naturalHeight / imagePreview.clientHeight;
  let y1 = (imagePreview.y + (parseInt(y1Input.value) / scaleY));
  let x1 = (imagePreview.x + (parseInt(x1Input.value) / scaleX));
  let y2 = (imagePreview.y + (parseInt(y2Input.value) / scaleY)) - y1;
  let x2 = (imagePreview.x + (parseInt(x2Input.value) / scaleX)) - x1;
  
  imageOverlay.style.top = y1 + "px";
  imageOverlay.style.left = x1 + "px";
  imageOverlay.style.height = y2 + "px";
  imageOverlay.style.width = x2 + "px";
}, 1);

