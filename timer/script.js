// Variables
let timerInterval;
let isPaused = true;
let savedTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};
let remainingTime; // Time left when paused

// Load saved timer values from cookies (including timer state)
function loadTimerFromCookies() {
  const savedTimeData = JSON.parse(getCookie('timerData'));
  const timerState = getCookie('timerState');

  if (savedTimeData) {
    // Load the last saved timer state
    setTimer(savedTimeData);
    savedTime = savedTimeData;
    remainingTime = savedTimeData; // Keep track of the last saved time
  }
  
  if (timerState === 'running') {
    // If the timer was running before the page was left, we need to resume it
    isPaused = false;
    startTimer(); // Automatically start the timer
  }
}

// Update cookies every second or when necessary
function updateTimerToCookies() {
  setCookie('timerData', JSON.stringify(remainingTime), 1); // Save the timer state for 1 day
  setCookie('timerState', isPaused ? 'paused' : 'running', 1); // Save the running/paused state
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

// Set timer in the interface
function setTimer({ days, hours, minutes, seconds }) {
  document.getElementById('days').value = days;
  document.getElementById('hours').value = hours;
  document.getElementById('minutes').value = minutes;
  document.getElementById('seconds').value = seconds;
  updateTimeDisplay(days, hours, minutes, seconds);
}

// Normalize the timer values (handle 90 minutes as 1 hour 30 minutes, etc.)
function normalizeTime(time) {
  if (time.seconds >= 60) {
    time.minutes += Math.floor(time.seconds / 60);
    time.seconds = time.seconds % 60;
  }
  if (time.minutes >= 60) {
    time.hours += Math.floor(time.minutes / 60);
    time.minutes = time.minutes % 60;
  }
  if (time.hours >= 24) {
    time.days += Math.floor(time.hours / 24);
    time.hours = time.hours % 24;
  }
  return time;
}

// Get values from inputs and normalize them
function getTimer() {
  let time = {
    days: parseInt(document.getElementById('days').value) || 0,
    hours: parseInt(document.getElementById('hours').value) || 0,
    minutes: parseInt(document.getElementById('minutes').value) || 0,
    seconds: parseInt(document.getElementById('seconds').value) || 0
  };
  return normalizeTime(time);
}

// Update the display time
function updateTimeDisplay(days, hours, minutes, seconds) {
  document.getElementById('timeDisplay').innerText = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
  if (!remainingTime) {
    remainingTime = getTimer(); // Initialize with current values if starting for the first time
  }

  isPaused = false;
  document.getElementById('playPauseBtn').innerText = 'Pause';

  timerInterval = setInterval(() => {
    if (remainingTime.seconds === 0 && remainingTime.minutes === 0 && remainingTime.hours === 0 && remainingTime.days === 0) {
      clearInterval(timerInterval);
      updateTimeDisplay(0, 0, 0, 0);
      isPaused = true;
      document.getElementById('playPauseBtn').innerText = 'Play';
      return;
    }

    // Decrement the remaining time
    if (remainingTime.seconds > 0) {
      remainingTime.seconds--;
    } else {
      remainingTime.seconds = 59;
      if (remainingTime.minutes > 0) {
        remainingTime.minutes--;
      } else {
        remainingTime.minutes = 59;
        if (remainingTime.hours > 0) {
          remainingTime.hours--;
        } else {
          remainingTime.hours = 23;
          if (remainingTime.days > 0) {
            remainingTime.days--;
          }
        }
      }
    }

    updateTimeDisplay(remainingTime.days, remainingTime.hours, remainingTime.minutes, remainingTime.seconds);
    updateTimerToCookies();  // Save the timer and its state each second
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
  clearInterval(timerInterval);
  document.getElementById('playPauseBtn').innerText = 'Play';
  updateTimerToCookies();  // Save the paused state
}

// Reset the timer to the last saved time
function resetTimer() {
  clearInterval(timerInterval);
  remainingTime = getTimer(); // Set to the current input time
  setTimer(remainingTime);  // Reset to saved time
  isPaused = true;
  document.getElementById('playPauseBtn').innerText = 'Play';
}

// Attach event listeners to inputs to update the timer display as the user types
function handleInputChange() {
  const time = getTimer();
  setTimer(time);  // Automatically normalize the input
}

// Add input event listeners
['days', 'hours', 'minutes', 'seconds'].forEach(id => {
  document.getElementById(id).addEventListener('input', handleInputChange);
});

// Save the current timer when leaving the page
window.addEventListener('beforeunload', () => {
  savedTime = getTimer();
  remainingTime = savedTime; // Keep the remaining time on page leave
  updateTimerToCookies();  // Save time and state before leaving the page
});

// Load saved time and state on page load
loadTimerFromCookies();

// Attach event listeners to the play/pause and reset buttons
document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
