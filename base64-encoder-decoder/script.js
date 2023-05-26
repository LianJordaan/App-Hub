window.onload = function() {
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const encodeOption = document.querySelector('input[value="encode"]');
  const decodeOption = document.querySelector('input[value="decode"]');

  inputText.addEventListener('input', processText);
  encodeOption.addEventListener('change', processText);
  decodeOption.addEventListener('change', processText);

  function processText() {
    const inputValue = inputText.value.trim();
    const isEncodeSelected = encodeOption.checked;

    const currentPage = window.location.href.split('?')[0];

    if (isEncodeSelected) {
      const encodedText = btoa(inputValue);
      outputText.value = encodedText;
      if (inputValue !== "") {
        updateURL(currentPage + "?en=" + btoa(inputValue))
      } else {
        updateURL(currentPage)
      }
    } else {
      if (inputValue !== "") {  
        updateURL(currentPage + "?de=" + btoa(inputValue))
      } else {
        updateURL(currentPage)
      }
      try {
        const decodedText = atob(inputValue);
        outputText.value = decodedText;
      } catch (error) {
        outputText.value = 'Invalid Base64 input';
      }
    }
  }
  const params = new URLSearchParams(window.location.search);
  const encodedText = params.get('en');
  const decodedText = params.get('de');

  if (encodedText) {
    inputText.value = atob(encodedText);
    encodeOption.checked = true;
    decodeOption.checked = false;
    processText();
  } else if (decodedText) {
    inputText.value = atob(decodedText);
    encodeOption.checked = false;
    decodeOption.checked = true;
    processText();
  }
};


function updateURL(url) {
  history.pushState({}, '', url);
}