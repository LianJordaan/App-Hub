const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
let randomNumbers = document.getElementById('result');

const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
const decimalInput = document.getElementById('decimal');
const numInput = document.getElementById('num');

function checkInputs() {
  if (minInput.valueAsNumber < minInput.min) {
    minInput.valueAsNumber = minInput.min;
  }
  if (minInput.valueAsNumber > minInput.max) {
    minInput.valueAsNumber = minInput.max;
  }
  if (maxInput.valueAsNumber < maxInput.min) {
    maxInput.valueAsNumber = maxInput.min;
  }
  if (maxInput.valueAsNumber > maxInput.max) {
    maxInput.valueAsNumber = maxInput.max;
  }
  if (decimalInput.valueAsNumber < decimalInput.min) {
    decimalInput.valueAsNumber = decimalInput.min;
  }
  if (decimalInput.valueAsNumber > decimalInput.max) {
    decimalInput.valueAsNumber = decimalInput.max;
  }
  if (numInput.valueAsNumber < numInput.min) {
    numInput.valueAsNumber = numInput.min;
  }
  if (numInput.valueAsNumber > numInput.max) {
    numInput.valueAsNumber = numInput.max;
  }
}

function getRandomNumber(min, max, decimal) {
  let decimals = [];
  for(let i = 0; i < decimal; i++) {
      decimals.push(Math.floor(Math.random() * 10).toString());
  }
  if (decimalInput.valueAsNumber != 0) {
    decimals = `.${decimals.join("")}`;
  }
  return (Math.floor(Math.random() * max-min+1) + min).toString() + decimals;
}

function generateNumbers() {
  checkInputs();
  const min = parseInt(document.getElementById("min").value);
  const max = parseInt(document.getElementById("max").value);
  const decimal = parseInt(document.getElementById("decimal").value);
  const num = parseInt(document.getElementById("num").value);

  randomNumbers = [];

  for (let i = 0; i < num; i++) {
    randomNumbers.push(getRandomNumber(min, max, decimal));
  }

  const randomNumbersList = document.getElementById("result");

  randomNumbersList.innerHTML = "";

  randomNumbers.forEach((number) => {
    const listItem = document.createElement("li");
    listItem.textContent = number;
    randomNumbersList.appendChild(listItem);
  });
}

function downloadNumbers() {
  const content = randomNumbers.join("\n");
  const filename = "random_numbers.txt";
  const blob = new Blob([content], { type: "text/plain" });

  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.onclick = () => {
    setTimeout(() => {
      window.URL.revokeObjectURL(blob);
      downloadLink.removeAttribute("href");
    }, 500);
  };

  downloadLink.click();
}


generateBtn.addEventListener('click', generateNumbers);
downloadBtn.addEventListener('click', downloadNumbers);
