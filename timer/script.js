// Variables
let timerInterval;
let isPaused = true;
let savedTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

// Load saved timer values from cookies (including timer state)
function loadTimerFromCookies() {
  const savedTimeData = JSON.parse(getCookie('timerData'));
  if (savedTimeData) {
    setTimer(savedTimeData);
    savedTime = savedTimeData;
    const timerState = getCookie('timerState');
    if (timerState === 'running') {
      isPaused = false;
      startTimer();
    }
  }
}

// Update cookies every second or when necessary
function updateTimerToCookies() {
  setCookie('timerData', JSON.stringify(savedTime), 1); // Save the timer state for 1 day
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
    days: parseInt(document.getElementById('days').value),
    hours: parseInt(document.getElementById('hours').value),
    minutes: parseInt(document.getElementById('minutes').value),
    seconds: parseInt(document.getElementById('seconds').value)
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
  let time = getTimer();
  isPaused = false;
  document.getElementById('playPauseBtn').innerText = 'Pause';
  
  timerInterval = setInterval(() => {
    // Decrease time
    if (time.seconds === 0) {
      if (time.minutes === 0) {
        if (time.hours === 0) {
          if (time.days === 0) {
            clearInterval(timerInterval);
            isPaused = true;
            document.getElementById('playPauseBtn').innerText = 'Play';
            return;
          } else {
            time.days--;
            time.hours = 23;
            time.minutes = 59;
            time.seconds = 59;
          }
        } else {
          time.hours--;
          time.minutes = 59;
          time.seconds = 59;
        }
      } else {
        time.minutes--;
        time.seconds = 59;
      }
    } else {
      time.seconds--;
    }
    
    updateTimeDisplay(time.days, time.hours, time.minutes, time.seconds);
    savedTime = { days: time.days, hours: time.hours, minutes: time.minutes, seconds: time.seconds };
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
  setTimer(savedTime);  // Reset to saved time
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
  updateTimerToCookies();  // Save time and state before leaving the page
});

// Load saved time and state on page load
loadTimerFromCookies();

// Attach event listeners to the play/pause and reset buttons
document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
