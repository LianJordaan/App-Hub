const searchInput = document.getElementById('search-input');
const appBoxes = document.getElementsByClassName('app-box');

searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  performSearch(searchTerm);
  const currentPage = window.location.href.split('?')[0];
  if (searchTerm !== "") {
    updateURL(currentPage + "?q=" + searchTerm);
  } else {
    updateURL(currentPage);
  }
});

window.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');

  if (searchTerm) {
    performSearch(searchTerm);
  }

  updateTime(); // Initial call to display time immediately
  setInterval(updateTime, 1000); // Update time every second
});

function performSearch(searchTerm) {
  const searchInput = document.getElementById('search-input');
  searchInput.value = searchTerm;
  Array.from(appBoxes).forEach(function(appBox) {
    const title = appBox.querySelector('h2').textContent.toLowerCase();
    const description = appBox.querySelector('p').textContent.toLowerCase();
  
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      appBox.style.display = ''; // Show the app box
    } else {
      appBox.style.display = 'none'; // Hide the app box
    }
  });
}

function updateURL(url) {
  history.pushState({}, '', url);
}

// New code to update the time
function updateTime() {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Johannesburg'
  };
  const timeString = now.toLocaleTimeString('en-GB', options);
  document.getElementById('current-time').innerHTML = `My current time: <strong>${timeString}</strong>`;
}