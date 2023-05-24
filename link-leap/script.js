window.onload = function() {
  const linkInputContainer = document.getElementById('link-input-container');
  const outputContainer = document.getElementById('output-container');
  const outputLink = document.getElementById('output-link');
  const copyButton = document.getElementById('copy-button');

  const encodeButton = document.getElementById('encode-button');

  encodeButton.style.display = 'inline';
  encodeButton.addEventListener('click', function() {
    const linkInput = document.getElementById('link-input').value;

    // Encode the link
    const encodedLink = btoa(linkInput);

    // Create the final link with encoded parameters
    const currentPage = window.location.href;
    const finalLink = `${currentPage}?s=${encodedLink}`;

    // Display the encoded link
    outputLink.value = finalLink;
    outputContainer.style.display = 'block';

    // Show the copy button
    copyButton.style.display = 'block';

    copyToClipboard(finalLink);
  });

  copyButton.addEventListener('click', function() {
    const linkToCopy = outputLink.value;

    // Copy the link to the clipboard
    copyToClipboard(linkToCopy);
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

  // Check if there are any URL parameters
  const params = new URLSearchParams(window.location.search);
  if (!params.has('s')) {
    linkInputContainer.style.display = 'block';
  }
};
