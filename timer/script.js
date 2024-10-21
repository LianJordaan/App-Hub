let timerInterval;
let isPaused = true;
let remainingSeconds = 0;
let lastSaveTime; // The time when the page was last saved

// Load the timer state and time from cookies
function loadTimerFromCookies() {
  const savedSeconds = parseInt(getCookie('remainingSeconds'), 10);
  const timerState = getCookie('timerState');
  
  if (savedSeconds) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = currentTime - currentTime;
    
    // Subtract the time difference from remainingSeconds if the timer was running
    if (timerState === 'running') {
      remainingSeconds = Math.max(savedSeconds - timeDifference, 0);
      if (remainingSeconds > 0) {
        isPaused = false;
        startTimer(); // Resume the timer
      } else {
        remainingSeconds = 0;
      }
    } else {
      remainingSeconds = savedSeconds;
    }
  }
  
  updateDisplay(remainingSeconds);
}

// Save the timer state and time to cookies
function updateTimerToCookies() {
  setCookie('remainingSeconds', remainingSeconds, 1);
  setCookie('timerState', isPaused ? 'paused' : 'running', 1);
  // setCookie('lastSaveTime', Math.floor(Date.now() / 1000), 1);
}

// Set cookie helper
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Get cookie helper
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Converts total seconds into days, hours, minutes, and seconds and updates the display
function updateDisplay(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  document.getElementById('days').value = days;
  document.getElementById('hours').value = hours;
  document.getElementById('minutes').value = minutes;
  document.getElementById('seconds').value = secs;
  document.getElementById('timeDisplay').innerText = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Get values from the inputs and convert them to total seconds
function getTotalSecondsFromInput() {
  const days = parseInt(document.getElementById('days').value) || 0;
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;

  return (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;
}

// Start or pause the timer
function toggleTimer() {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
}

function startTimer() {
  isPaused = false;
  document.getElementById('playPauseBtn').innerText = 'Pause';

  timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay(remainingSeconds);
      updateTimerToCookies(); // Save the updated time every second
    } else {
      clearInterval(timerInterval);
      isPaused = true;
      document.getElementById('playPauseBtn').innerText = 'Play';
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
  clearInterval(timerInterval);
  document.getElementById('playPauseBtn').innerText = 'Play';
  updateTimerToCookies();  // Save the paused state and remaining time
}

// Reset the timer to the last input value
function resetTimer() {
  clearInterval(timerInterval);
  remainingSeconds = getTotalSecondsFromInput(); // Reset to the input value
  updateDisplay(remainingSeconds);
  isPaused = true;
  document.getElementById('playPauseBtn').innerText = 'Play';
  updateTimerToCookies(); // Save the reset time
}

// Add input event listeners to update the remaining time as the user types
function handleInputChange() {
  remainingSeconds = getTotalSecondsFromInput();
  updateDisplay(remainingSeconds);
  updateTimerToCookies(); // Save the new time to cookies when inputs change
}

// Add input event listeners for each time field
['days', 'hours', 'minutes', 'seconds'].forEach(id => {
  document.getElementById(id).addEventListener('input', handleInputChange);
});

// Save the timer when leaving the page
window.addEventListener('beforeunload', () => {
  updateTimerToCookies();  // Save the state before leaving the page
});

// Load the saved timer and state on page load
loadTimerFromCookies();

// Attach event listeners to the play/pause and reset buttons
document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
