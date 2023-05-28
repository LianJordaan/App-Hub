// Get the necessary elements from the DOM
const textArea = document.getElementById('textArea');
const generateButton = document.getElementById('generateButton');
const qrCodeContainer = document.getElementById('qrCodeContainer');
const downloadButton = document.getElementById('downloadButton');
const downloadButton2 = document.getElementById('downloadButton2');

// Event listener for the generate button
generateButton.addEventListener('click', generateQRCode);

// Event listener for the text area to update the QR code on input change
textArea.addEventListener('input', generateQRCode);

// Function to generate the QR code
function generateQRCode() {
  const text = textArea.value;
  if (text !== "") {
    updateURL(window.location.href.split('?')[0] + "?data=" + btoa(text));
  } else {
    updateURL(window.location.href.split('?')[0]);
  }

  if (text.trim() === '') {
    qrCodeContainer.innerHTML = ''; // Clear the QR code container if the text is empty
    downloadButton.style.display = 'none'; // Hide the download button
    downloadButton2.style.display = 'none'; // Hide the download button
    return;
  }

  const qrCodeImg = qrCodeContainer.querySelector('img');
  if (qrCodeImg) {
    qrCodeImg.remove();
  }
  const canvas = qrCodeContainer.querySelector('canvas');
  if (canvas) {
    canvas.remove();
  }

  // Generate the QR code URL using the specified API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=png&ecc=L&data=${encodeURIComponent(text)}`;

  // Create the image element for the QR code
  const img = document.createElement('img');
  img.src = qrCodeUrl;
  img.id = 'qrCode';
  qrCodeContainer.appendChild(img);

  // Show the download button
  downloadButton.style.display = 'block';
  downloadButton2.style.display = 'block';
}
downloadButton.addEventListener('click', async () => {
  const link = document.createElement('a');
  link.download = 'qrcode.png';

  const image = document.getElementById('qrCode');
  const response = await fetch(image.src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.click();

  // Clean up the object URL after the download
  URL.revokeObjectURL(url);
});

downloadButton2.addEventListener('click', async () => {
  const link = document.createElement('a');
  link.download = 'qrcode.svg';

  const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&ecc=L&data=${textArea.value}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.click();

  // Clean up the object URL after the download
  URL.revokeObjectURL(url);
});

function updateURL(url) {
  history.pushState({}, '', url);
}

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  let data = params.get('data');
  if (data) {
    textArea.value = atob(data);
  }
  generateQRCode();
});