function convertToBase64() {
  const imageInput = document.getElementById('imageInput');
  const outputContainer = document.getElementById('outputContainer');
  const outputText = document.getElementById('outputText');

  // Clear previous output
  outputText.value = '';

  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result;
      outputText.value = base64Image;
      outputContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    outputText.value = 'No image selected.';
    outputContainer.style.display = 'block';
  }
}

function copyImage() {
    const outputText = document.getElementById('outputText');
    const base64Image = outputText.value;
    
    // Create a temporary textarea element to copy the text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = base64Image;
    document.body.appendChild(tempTextarea);
    
    // Select the text
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 999999999); // For mobile devices
    
    // Copy the text
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(tempTextarea);
  }
  
  function copyCSS() {
    const outputText = document.getElementById('outputText');
    const base64Image = outputText.value;
    
    // Create a temporary textarea element to copy the text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = `url('${base64Image}')`;
    document.body.appendChild(tempTextarea);
    
    // Select the text
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 999999999); // For mobile devices
    
    // Copy the text
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(tempTextarea);
  }
  