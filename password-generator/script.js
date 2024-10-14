// Function to generate a random password based on selected options
function generatePassword() {
  updateURLparams()
  const length = document.getElementById('lengthSlider').value;
  const includeSymbols = document.getElementById('symbolsCheckbox').checked;
  const includeNumbers = document.getElementById('numbersCheckbox').checked;
  const includeUppercase = document.getElementById('uppercaseCheckbox').checked;
  const includeLowercase = document.getElementById('lowercaseCheckbox').checked;

  const symbols = "!@#$%^&*";
  const numbers = "0123456789";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

  let availableChars = "";
  let password = "";

  if (includeSymbols) {
    availableChars += symbols;
  }
  if (includeNumbers) {
    availableChars += numbers;
  }
  if (includeUppercase) {
    availableChars += uppercaseLetters;
  }
  if (includeLowercase) {
    availableChars += lowercaseLetters;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars.charAt(randomIndex);
  }

  document.getElementById('passwordOutput').value = password;
}

// Function to handle the copy password button click event
function copyPassword() {
  const passwordOutput = document.getElementById('passwordOutput');
  passwordOutput.select();
  document.execCommand('copy');
  alert('Password copied to clipboard!');
}

// Add event listener to generate button
const generateButton = document.getElementById('generateButton');
generateButton.addEventListener('click', generatePassword);

// Add event listener to copy password button
const copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', copyPassword);

const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');

lengthSlider.addEventListener('input', function() {
  lengthInput.value = lengthSlider.value;
  generatePassword()
});

lengthInput.addEventListener('input', function() {
  lengthSlider.value = lengthInput.value;
  generatePassword()
});

const symbolCheckbox = document.getElementById('symbolsCheckbox');
const numberCheckbox = document.getElementById('numbersCheckbox');
const uppercaseCheckbox = document.getElementById('uppercaseCheckbox');
const lowercaseCheckbox = document.getElementById('lowercaseCheckbox');

// Event listener for checkboxes
symbolCheckbox.addEventListener('input', updateCheckboxes);
numberCheckbox.addEventListener('input', updateCheckboxes);
uppercaseCheckbox.addEventListener('input', updateCheckboxes);
lowercaseCheckbox.addEventListener('input', updateCheckboxes);

// Function to update checkboxes
function updateCheckboxes() {
  const checkboxes = [symbolCheckbox, numberCheckbox, uppercaseCheckbox, lowercaseCheckbox];
  const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;

  // Ensure at least one checkbox is selected
  if (checkedCount === 0) {
    // Enable the first checkbox if none are selected
    checkboxes[0].checked = true;
  }
  generatePassword()
}


// Initial call to ensure at least one checkbox is selected

function updateURL(url) {
  history.replaceState({}, '', url);
}

function updateURLparams() {
  let baseUrl =  window.location.href.split('?')[0];
  let params = {};
  if (lengthSlider.valueAsNumber != 12) {
    params.length = lengthSlider.valueAsNumber
  }
  if (symbolCheckbox.checked == false) {
    params.s = false
  }
  if (numberCheckbox.checked == false) {
    params.n = false
  }
  if (uppercaseCheckbox.checked == false) {
    params.u = false
  }
  if (lowercaseCheckbox.checked == false) {
    params.l = false
  }

  // Construct the query string
  let paramsString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  // Append the query string to the base URL
  url = `${baseUrl}`;
  if (paramsString !== ""){
    url += `?${paramsString}`
  }
  updateURL(url);
}

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  let length = params.get('length');
  if (length) {
    if (parseInt(length) > parseInt(lengthSlider.max)) {
      length = lengthSlider.max;
    } else if (parseInt(length) < parseInt(lengthSlider.min)) {
      length = lengthSlider.min;
    }
    lengthSlider.value = length;
    lengthInput.value = length;
  }
  const symbols = params.get('s');
  if (symbols == "false") {
    symbolCheckbox.checked = false;
  }
  const numbers = params.get('n');
  if (numbers == "false") {
    numberCheckbox.checked = false;
  }
  const uppercase = params.get('u');
  if (uppercase == "false") {
    uppercaseCheckbox.checked = false;
  }
  const lowercase = params.get('l');
  if (lowercase == "false") {
    lowercaseCheckbox.checked = false;
  }
  generatePassword();
  updateCheckboxes();
});

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetOptions);

function resetOptions() {
  symbolCheckbox.checked = true;
  numberCheckbox.checked = true;
  uppercaseCheckbox.checked = true;
  lowercaseCheckbox.checked = true;
  lengthSlider.value = lengthInput.value = 12;
  generatePassword();
}
