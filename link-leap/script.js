window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const encodedURL = params.get('s');

  if (encodedURL) {
    try {
      const decodedURL = atob(encodedURL);
      window.location.href = decodedURL;
    } catch (error) {
      displayErrorMessage('Failed to redirect to the specified URL.');
    }
  }
  const outputContainer = document.getElementById('output-container');
  const outputLink = document.getElementById('output-link');

  const encodeButton = document.getElementById('encode-button');

  encodeButton.style.display = 'inline';
  encodeButton.addEventListener('click', function() {
    const linkInput = document.getElementById('link-input').value;

    // Encode the link
    const encodedLink = btoa(linkInput);

    // Create the final link with encoded parameters
    let currentPage = window.location.href;
    currentPage = window.location.href.split('?')[0];
    const finalLink = `${currentPage}?s=${encodedLink}`;

    // Display the encoded link
    outputLink.value = finalLink;
    outputContainer.style.display = 'block';

    copyToClipboard(finalLink);
    displayErrorMessage("");
  });

  // Function to copy the text to the clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function displayErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    document.getElementById('link-input-container').style.display = 'flex';
    errorMessage.style.display = 'flex';
    if (message === '') {
        errorMessage.style.display = 'none';  
    }
  }
};
