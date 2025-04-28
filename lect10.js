const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Define top currencies with full names
const topCurrencies = {
  USD: "United States Dollar",
  EUR: "Euro",
  GBP: "British Pound Sterling",
  INR: "Indian Rupee",
  JPY: "Japanese Yen"
};

// Populate dropdowns
for (let select of dropdowns) {

  // First add top currencies
  for (let currCode in topCurrencies) {
    let newOption = document.createElement("option");
    newOption.innerText = `${currCode} - ${topCurrencies[currCode]}`;
    newOption.value = currCode;
    select.append(newOption);
  }

  // Add a separator
  let separator = document.createElement("option");
  separator.innerText = "───────────────";
  separator.disabled = true;
  select.append(separator);

  // Then add all other currencies
  for (let currCode in countryList) {
    // Skip if already added in topCurrencies
    if (topCurrencies[currCode]) continue;

    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    select.append(newOption);
  }

  // Default selection
  if (select.name === "from") select.value = "USD";
  if (select.name === "to") select.value = "INR";

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag images
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (countryCode) {  // Protect against separator selection
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
}

// Fetch exchange rate and update message
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value}`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    let rate = data.rates[toCurr.value];
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Something went wrong. Please try again later.";
  }
}

// Button click to update rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Fetch actual rate immediately when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
