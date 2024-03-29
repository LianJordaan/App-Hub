const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const progress = document.getElementById('upload-progress');
const statusMessage = document.getElementById('status-message');
const downloadLink = document.getElementById('download-link');

uploadBtn.addEventListener('click', uploadFile);

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function uploadFile(event) {
  event.preventDefault();
  const file = fileInput.files[0];
  const maxSizeInBytes = 1 * 1000 * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    alert('File size exceeds the limit. Please select a smaller file.');
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://webprox.glitch.me/?url=http://51.222.166.68:8176/upload');
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  xhr.setRequestHeader('Content-Disposition', 'attachment; filename="' + file.name + '"');
  
  fileInput.style.display = 'none';

  xhr.upload.addEventListener('progress', updateProgress);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      copyToClipboard(xhr.responseText);
      showResponse('File uploaded successfully', xhr.responseText);
      showUploadMoreButton();
    }
  };

  xhr.onerror = function() {
    showResponse('Failed to upload file', null);
    showTryAgainButton();
    resetProgressBar();
  };

  xhr.send(file);
  uploadBtn.disabled = true;
  uploadBtn.style.visibility = 'hidden';
  uploadBtn.style.position = 'fixed';
}

  
function updateProgress(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    progress.value = percentComplete;
  }
}

function showResponse(message, downloadUrl) {
  statusMessage.innerHTML = message;

  if (downloadUrl) {
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.textContent = 'Download File';
    downloadLink.classList.add('download-link');
    statusMessage.appendChild(downloadLink);
  }
}
  
function showUploadMoreButton() {
  const uploadMoreButton = document.createElement('button');
  uploadMoreButton.textContent = 'Upload More?';
  uploadMoreButton.classList.add('upload-more-button');
  uploadMoreButton.onclick = function() {
    location.reload();
  };
  statusMessage.appendChild(uploadMoreButton);
  fileInput.style.display = 'none';
}

function showTryAgainButton() {
  const tryAgainButton = document.createElement('button');
  tryAgainButton.textContent = 'Try Again';
  tryAgainButton.classList.add('try-again-button');
  tryAgainButton.onclick = function() {
    location.reload();
  };
  statusMessage.appendChild(tryAgainButton);
  fileInput.style.display = 'none';
}

function resetProgressBar() {
  progress.value = 0;
}