function convertUsername() {
  const inputText = document.getElementById('inputText').value;
  const outputContainer = document.getElementById('outputContainer');
  const outputText = document.getElementById('outputText');
  
  // Clear previous output
  outputText.value = '';
  
  // Perform API request to convert UUID to username
  const url = `https://webprox.glitch.me/?url=https://playerdb.co/api/player/minecraft/${inputText}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('No user found with provided UUID/username!');
      }
      return response.json();
    })
    .then(data => {
      const playerData = data.data.player;
      const username = playerData.username;
      const fullUUID = playerData.id;
      const trimmedUUID = playerData.raw_id;
      outputText.value = `Username: ${username}\nFull UUID: ${fullUUID}\nTrimmed UUID: ${trimmedUUID}`;
      outputContainer.style.display = 'block';
    })
    .catch(error => {
      outputText.value = 'Error: ' + error.message;
      outputContainer.style.display = 'block';
    });
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (query) {
    document.getElementById('inputText').value = query;
    convertUsername();
  }
}

function updateURL(url) {
  history.pushState({}, '', url);
}

const inputText = document.getElementById('inputText');

inputText.addEventListener('input', function(event) {
  const inputValue = event.target.value;
  if (inputValue !== "") {
    updateURL(window.location.href.split('?')[0] + "?q=" + inputValue);
  } else {
    updateURL(window.location.href.split('?')[0]);
  }
});

let timerId = null;

inputText.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(function() {
      convertUsername();
      timerId = null;
    }, 500);
  }
});