function convertUsername() {
  const inputText = document.getElementById('inputText').value;
  const outputContainer = document.getElementById('outputContainer');
  const outputText = document.getElementById('outputText');

  // Clear previous output
  outputText.value = '';

  // Check if input is a UUID
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(inputText);

  if (isUUID) {
    // Perform API request to convert UUID to username
    const url = `https://webprox.glitch.me/?url=https://playerdb.co/api/player/minecraft/${inputText}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('UUID not found');
        }
        return response.json();
      })
      .then(data => {
        const playerData = data.data.player;
        const username = playerData.username;
        const fullUUID = inputText;
        const trimmedUUID = playerData.raw_id;
        outputText.value = `Username: ${username}\nFull UUID: ${fullUUID}\nTrimmed UUID: ${trimmedUUID}`;
        outputContainer.style.display = 'block';
      })
      .catch(error => {
        outputText.value = 'Error: ' + error.message;
        outputContainer.style.display = 'block';
      });
  } else {
    // Perform API request to convert username to UUID
    const url = `https://webprox.glitch.me/?url=https://playerdb.co/api/player/minecraft/${inputText}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Username not found');
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
}
