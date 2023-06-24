var upscaleTimerCount = 1;
var lastClickedElement = null;

function getAvailableTimerId() {
  var i = 1;
  while (document.getElementById("timer" + i)) {
    i++;
  }
  return i;
}

function getAvailableUpscaleTimerId() {
  var i = 1;
  while (document.getElementById("upscaleTimer" + i)) {
    i++;
  }
  return i;
}

function generateImage() {
  var timerLabel = "Timer " + getAvailableTimerId() + ":";
  var promptInput = document.getElementById("promptInput").value;
  var modelSelect = document.getElementById("modelSelect").value;

  var placeholder = document.querySelector(".placeholder");
  var timerContainer = document.getElementById("timer");

  placeholder.textContent = "Estimated time: about 1 min";

  var timerElement = document.createElement("div");
  timerElement.className = "timer";

  var timerId = getAvailableTimerId();
  timerElement.id = "timer" + timerId;
  timerElement.textContent = "Timer " + timerId + ": 0s";

  timerContainer.appendChild(timerElement);

  var startTime = Date.now();
  var timerInterval;

  var requestBody = {
    prompt: promptInput,
    version: "35s5hfwn9n78gb06",
    token: null,
    model: modelSelect,
    negative_prompt: ""
  };

  fetch("https://webprox.glitch.me/?url=https://api.craiyon.com/v3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      clearInterval(timerInterval); // Stop the timer interval

      var generatedImagesDiv = document.getElementById("generatedImages");

      data.images.forEach(function (imageURL) {
        var img = document.createElement("img");
        img.src =
          "https://webprox.glitch.me/?url=https://img.craiyon.com/" + imageURL;
          img.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            displayGeneratedContextMenu(event, img);
          });
        generatedImagesDiv.appendChild(img);
      });
      timerContainer.removeChild(timerElement);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  // Start the timer interval to keep counting up
  timerInterval = setInterval(function () {
    sortTimers();
    var elapsedTime = Math.round((Date.now() - startTime) / 1000);
    document.getElementById("timer" + timerId).textContent = timerLabel + " " + elapsedTime + "s";
  }, 1000);

  var generatedImagesDiv = document.getElementById("generatedImages");
  generatedImagesDiv.addEventListener("click", function (event) {
    var target = event.target;
    if (target.tagName === "IMG") {
      var imageURL = target.src;
      var modifiedURL = imageURL
        .replace("https://webprox.glitch.me/?url=https://", "")
      document.getElementById("imageURLInput").value = modifiedURL;
    }
  });
}

function upscaleImage() {
  var timerLabel = "Timer " + getAvailableUpscaleTimerId() + ":";
  var timerId = "upscaleTimer" + getAvailableUpscaleTimerId();
  var imageURLInput = document.getElementById("imageURLInput").value;
  var promptInput = document.getElementById("promptInput").value;
  var modelSelect = document.getElementById("modelSelect").value;

  var placeholder = document.querySelector("#imageUpscaler .placeholder");
  var timerContainer = document.getElementById("upscaleTimer");

  placeholder.textContent = "Estimated time: about 1 min";

  var timerElement = document.createElement("div");
  timerElement.className = "timer";
  timerElement.id = timerId;
  timerElement.textContent = timerLabel + " 0s";

  timerContainer.appendChild(timerElement);

  var startTime = Date.now();
  var timerInterval;

  var requestBody = {
    image_id: imageURLInput,
    prompt: promptInput,
    version: "35s5hfwn9n78gb06",
    token: null,
    model: modelSelect,
    negative_prompt: ""
  };

  fetch("https://webprox.glitch.me/?url=https://api.craiyon.com/upscale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      clearInterval(timerInterval); // Stop the timer interval

      var upscaledImageDiv = document.getElementById("upscaledImage");

      data.images.forEach(function (imageURL) {
        var img = document.createElement("img");
        img.src =
          "https://webprox.glitch.me/?url=https://pics.craiyon.com/" + imageURL;
          img.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            displayUpscaledContextMenu(event, img);
          });
        upscaledImageDiv.appendChild(img);
      });

      var elapsedTime = Math.round((Date.now() - startTime) / 1000);
      document.getElementById(timerId).textContent = timerLabel + " " + elapsedTime + "s";
      timerContainer.removeChild(timerElement);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  // Start the timer interval to keep counting up
  timerInterval = setInterval(function () {
    sortUpscaleTimers();
    var elapsedTime = Math.round((Date.now() - startTime) / 1000);
    document.getElementById(timerId).textContent = timerLabel + " " + elapsedTime + "s";
  }, 1000);
}



function clearGeneratedImages() {
  var generatedImagesDiv = document.getElementById("generatedImages");
  generatedImagesDiv.innerHTML = "";
}

function clearUpscaledImage() {
  var upscaledImageDiv = document.getElementById("upscaledImage");
  upscaledImageDiv.innerHTML = "";
}

function sortTimers() {
  var timerContainer = document.getElementById("timer");

  // Get all timer elements
  var timerElements = Array.from(timerContainer.getElementsByClassName("timer"));

  // Sort timer elements based on their timer values
  timerElements.sort(function (a, b) {
    var timeA = parseInt(a.textContent.match(/\d+/)[0]);
    var timeB = parseInt(b.textContent.match(/\d+/)[0]);
    return timeA - timeB;
  });

  // Remove existing timer elements from the container
  while (timerContainer.firstChild) {
    timerContainer.removeChild(timerContainer.firstChild);
  }

  // Append sorted timer elements back to the container
  timerElements.forEach(function (timerElement) {
    timerContainer.appendChild(timerElement);
  });
}

function sortUpscaleTimers() {
  var timerContainer = document.getElementById("upscaleTimer");

  // Get all timer elements
  var timerElements = Array.from(timerContainer.getElementsByClassName("timer"));

  // Sort timer elements based on their timer values
  timerElements.sort(function (a, b) {
    var timeA = parseInt(a.textContent.match(/\d+/)[0]);
    var timeB = parseInt(b.textContent.match(/\d+/)[0]);
    return timeA - timeB;
  });

  // Remove existing timer elements from the container
  while (timerContainer.firstChild) {
    timerContainer.removeChild(timerContainer.firstChild);
  }

  // Append sorted timer elements back to the container
  timerElements.forEach(function (timerElement) {
    timerContainer.appendChild(timerElement);
  });
}

// Variable to store the current clicked image URL
var currentClickedImageURL = "";

// Function to download multiple images as a zip file
function downloadImagesAsZip(urls) {
  var zip = new JSZip();
  var count = 1;

  // Iterate through the image URLs and add them to the zip file
  urls.forEach(function (url) {
    var fileName = "image" + count + ".jpg";
    zip.file(fileName, urlToPromise(url), { binary: true });
    count++;
  });

  // Generate the zip file and initiate the download
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "images.zip");
  });
}

// Helper function to convert image URL to a promise
function urlToPromise(url) {
  return new Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function displayGeneratedContextMenu(event, img) {
  var generatedContextMenu = document.getElementById("generatedContextMenu");
  generatedContextMenu.style.left = event.clientX + "px";
  generatedContextMenu.style.top = event.clientY + "px";
  generatedContextMenu.style.display = "block";

  var upscaledContextMenu = document.getElementById("upscaledContextMenu");
  upscaledContextMenu.style.display = "none";

  lastClickedElement = img;
}

  // Attach event listeners for menu items
  var saveGeneratedImageItem = document.getElementById("saveGeneratedImage");
  var openGeneratedImageItem = document.getElementById("openGeneratedImage");
  var saveAllGeneratedImagesItem = document.getElementById("saveAllGeneratedImages");
  var upscaleGeneratedImageItem = document.getElementById("upscaleGeneratedImage");
  var upscaleAllGeneratedImagesItem = document.getElementById("upscaleAllGeneratedImages");
  var removeGeneratedImageItem = document.getElementById("removeGeneratedImage");
  var removeAllGeneratedImagesItem = document.getElementById("removeAllGeneratedImages");

  saveGeneratedImageItem.addEventListener("click", function () {
    saveImage(lastClickedElement.src);
    generatedContextMenu.style.display = "none";
  });

  openGeneratedImageItem.addEventListener("click", function () {
    openImage(lastClickedElement.src);
    generatedContextMenu.style.display = "none";
  });

  saveAllGeneratedImagesItem.addEventListener("click", function () {
    saveAllGeneratedImages();
    generatedContextMenu.style.display = "none";
  });

  upscaleGeneratedImageItem.addEventListener("click", function () {
    upscaleGeneratedImage(lastClickedElement.src);
    generatedContextMenu.style.display = "none";
  });

  upscaleAllGeneratedImagesItem.addEventListener("click", function () {
    upscaleAllGeneratedImages();
    generatedContextMenu.style.display = "none";
  });

  removeGeneratedImageItem.addEventListener("click", function (evnt) {
    removeGeneratedImage(lastClickedElement);
    generatedContextMenu.style.display = "none";
  });

  removeAllGeneratedImagesItem.addEventListener("click", function () {
    removeAllGeneratedImages();
    generatedContextMenu.style.display = "none";
  });

// Remove context menu when clicking outside of it
document.addEventListener("click", function (event) {
  if (!generatedContextMenu.contains(event.target)) {
    generatedContextMenu.style.display = "none";
  }
});

function displayUpscaledContextMenu(event, img) {
  var upscaledContextMenu = document.getElementById("upscaledContextMenu");
  upscaledContextMenu.style.left = event.clientX + "px";
  upscaledContextMenu.style.top = event.clientY + "px";
  upscaledContextMenu.style.display = "block";

  var generatedContextMenu = document.getElementById("generatedContextMenu");
  generatedContextMenu.style.display = "none";

  lastClickedElement = img;
}

  // Attach event listeners for menu items
  var saveUpscaledImageItem = document.getElementById("saveUpscaledImage");
  var openUpscaledImageItem = document.getElementById("openUpscaledImage");
  var saveAllUpscaledImagesItem = document.getElementById("saveAllUpscaledImages");
  var removeUpscaledImageItem = document.getElementById("removeUpscaledImage");
  var removeAllUpscaledImagesItem = document.getElementById("removeAllUpscaledImages");

  saveUpscaledImageItem.addEventListener("click", function () {
    saveImage(lastClickedElement.src);
    upscaledContextMenu.style.display = "none";
  });

  openUpscaledImageItem.addEventListener("click", function () {
    openImage(lastClickedElement.src);
    upscaledContextMenu.style.display = "none";
  });

  saveAllUpscaledImagesItem.addEventListener("click", function () {
    saveAllUpscaledImages();
    upscaledContextMenu.style.display = "none";
  });

  removeUpscaledImageItem.addEventListener("click", function () {
    removeUpscaledImage(lastClickedElement);
    upscaledContextMenu.style.display = "none";
  });

  removeAllUpscaledImagesItem.addEventListener("click", function () {
    removeAllUpscaledImages();
    upscaledContextMenu.style.display = "none";
  });

// Remove context menu when clicking outside of it
document.addEventListener("click", function (event) {
  if (!upscaledContextMenu.contains(event.target)) {
    upscaledContextMenu.style.display = "none";
  }
});

// Helper function to save an image
function saveImage(imageURL) {
  fetch(imageURL)
    .then(function (response) {
      return response.blob();
    })
    .then(function (blob) {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "image.jpg";
      link.click();
    })
    .catch(function (error) {
      console.log("Error downloading image:", error);
    });
}

// Helper function to open an image
function openImage(imageURL) {
  window.open(imageURL.replace("https://webprox.glitch.me/?url=", ""), "_blank");
}

// Helper function to save all generated images
function saveAllGeneratedImages() {
  var generatedImages = document.getElementById("generatedImages").getElementsByTagName("img");
  var imageURLs = [];

  // Collect the image URLs
  for (var i = 0; i < generatedImages.length; i++) {
    var imageURL = generatedImages[i].src;
    imageURLs.push(imageURL);
  }

  // Download the images as a zip
  downloadImagesAsZip(imageURLs);
}

// Helper function to save an image
function upscaleGeneratedImage(imageURL) {
  var timerLabel = "Timer " + getAvailableUpscaleTimerId() + ":";
  var timerId = "upscaleTimer" + getAvailableUpscaleTimerId();
  imageURL = imageURL.replace("https://webprox.glitch.me/?url=https://", "");
  var promptInput = document.getElementById("promptInput").value;
  var modelSelect = document.getElementById("modelSelect").value;

  var placeholder = document.querySelector("#imageUpscaler .placeholder");
  var timerContainer = document.getElementById("upscaleTimer");

  placeholder.textContent = "Estimated time: about 1 min";

  var timerElement = document.createElement("div");
  timerElement.className = "timer";
  timerElement.id = timerId;
  timerElement.textContent = timerLabel + " 0s";

  timerContainer.appendChild(timerElement);

  var startTime = Date.now();
  var timerInterval;

  var requestBody = {
    image_id: imageURL,
    prompt: promptInput,
    version: "35s5hfwn9n78gb06",
    token: null,
    model: modelSelect,
    negative_prompt: ""
  };

  fetch("https://webprox.glitch.me/?url=https://api.craiyon.com/upscale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      clearInterval(timerInterval); // Stop the timer interval

      var upscaledImageDiv = document.getElementById("upscaledImage");

      data.images.forEach(function (imageURL) {
        var img = document.createElement("img");
        img.src =
          "https://webprox.glitch.me/?url=https://pics.craiyon.com/" + imageURL;
          img.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            displayUpscaledContextMenu(event, img);
          });
        upscaledImageDiv.appendChild(img);
      });

      var elapsedTime = Math.round((Date.now() - startTime) / 1000);
      document.getElementById(timerId).textContent = timerLabel + " " + elapsedTime + "s";
      timerContainer.removeChild(timerElement);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  // Start the timer interval to keep counting up
  timerInterval = setInterval(function () {
    sortUpscaleTimers();
    var elapsedTime = Math.round((Date.now() - startTime) / 1000);
    document.getElementById(timerId).textContent = timerLabel + " " + elapsedTime + "s";
  }, 1000);
}

function upscaleAllGeneratedImages() {
  var generatedImages = document.getElementById("generatedImages").querySelectorAll("img");

  generatedImages.forEach(function (img) {
    var imageURL = img.src.replace("https://webprox.glitch.me/?url=https://", "");
    upscaleGeneratedImage(imageURL);
  });
}

// Helper function to save all generated images
function saveAllUpscaledImages() {
  var upscaledImage = document.getElementById("upscaledImage").getElementsByTagName("img");
  var imageURLs = [];

  // Collect the image URLs
  for (var i = 0; i < upscaledImage.length; i++) {
    var imageURL = upscaledImage[i].src;
    imageURLs.push(imageURL);
  }

  // Download the images as a zip
  downloadImagesAsZip(imageURLs);
}

function removeGeneratedImage(img) {
  document.getElementById("generatedImages").removeChild(img);
}

function removeAllGeneratedImages() {
  document.getElementById("generatedImages").innerHTML = '';
}

function removeUpscaledImage(img) {
  document.getElementById("upscaledImage").removeChild(img);
}

function removeAllUpscaledImages() {
  document.getElementById("upscaledImage").innerHTML = '';
}