// CONFIGURATION: Replace placeholders with your acquired API Keys
const REST_COUNTRIES_API_KEY = "YOUR_REST_COUNTRIES_API_KEY";
const EXCHANGE_RATE_API_KEY = "YOUR_EXCHANGE_RATE_API_KEY";

// Application State Store
let currencyDataMap = {}; 

// DOM Element Selectors
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultMessage = document.getElementById('result-message');
const errorMessage = document.getElementById('error-message');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeCurrencyDropdowns();
  
  // Set up event listeners
  convertBtn.addEventListener('click', handleConversion);
  fromSelect.addEventListener('change', () => updateFlagDisplay('from'));
  toSelect.addEventListener('change', () => updateFlagDisplay('to'));
});

/**
 * Fetches country/currency data and initializes selector menus
 */
async function initializeCurrencyDropdowns() {
  try {
    // Using standard fields filter to minimize download payload size
    const response = await fetch(`https://restcountries.com{REST_COUNTRIES_API_KEY}`);
    
    if (!response.ok) throw new Error("Failed to capture country asset listings.");
    
    const countries = await response.json();
    
    // Parse response into structured structural Map
    countries.forEach(country => {
      if (country.currencies) {
        Object.keys(country.currencies).forEach(code => {
          if (!currencyDataMap[code]) {
            currencyDataMap[code] = {
              code: code,
              name: country.currencies[code].name || code,
              flag: country.flag || "🏳️"
            };
          }
        });
      }
    });

    // Sort options alphabetically by currency ticker code
    const sortedCurrencies = Object.values(currencyDataMap).sort((a, b) => a.code.localeCompare(b.code));

    // Inject structures into Document Fragments
    populateMenuOptions(fromSelect, sortedCurrencies, 'USD');
    populateMenuOptions(toSelect, sortedCurrencies, 'INR');

    // Fire initial flag updates
    updateFlagDisplay('from');
    updateFlagDisplay('to');

  } catch (error) {
    showError("An error occurred while loading currency options. Please try again later.");
    console.error("Dropdown Initialization Failure:", error);
  }
}

/**
 * Builds selection options element nodes safely
 */
function populateMenuOptions(selectElement, currencyList, defaultSelection) {
  selectElement.innerHTML = ''; // Wipe presets
  
  currencyList.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency.code;
    option.textContent = `${currency.code} - ${currency.name}`;
    if (currency.code === defaultSelection) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

/**
 * Dynamically swaps the decorative flag symbol matching current choice lists
 */
function updateFlagDisplay(direction) {
  if (direction === 'from') {
    const selectedCode = fromSelect.value;
    fromFlag.textContent = currencyDataMap[selectedCode]?.flag || "🏳️";
  } else if (direction === 'to') {
    const selectedCode = toSelect.value;
    toFlag.textContent = currencyDataMap[selectedCode]?.flag || "🏳️";
  }
}

/**
 * Performs target API extraction and evaluation actions
 */
async function handleConversion() {
  // Clear layout visibility rules
  clearDisplays();

  const amountValue = parseFloat(amountInput.value);
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  // Enforce validation constraints
  if (isNaN(amountValue) || amountValue <= 0) {
    showError("Please enter a valid amount greater than 0.");
    return;
  }
  if (!fromCurrency || !toCurrency) {
    showError("Please select both target currency boxes before proceeding.");
    return;
  }

  try {
    convertBtn.textContent = "Processing...";
    convertBtn.disabled = true;

    const response = await fetch(`https://exchangerate-api.com{EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`);
    
    if (!response.ok) throw new Error("Conversion platform rejected operational exchange parameters.");
    
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rate;
      const totalConverted = (amountValue * rate).toFixed(2);
      
      // Formatting utilizing standard localized formatting parameters
      const localizedAmount = amountValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      const localizedResult = parseFloat(totalConverted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      showResult(`${localizedAmount} ${fromCurrency} = ${localizedResult} ${toCurrency}`);
    } else {
      throw new Error(data['error-type'] || "Inbound rate parsing failure.");
    }

  } catch (error) {
    showError("An error occurred, please try again later");
    console.error("Conversion Calculation Loop Breakdown:", error);
  } finally {
    convertBtn.textContent = "Convert";
    convertBtn.disabled = false;
  }
}

function showResult(message) {
  resultMessage.textContent = message;
  resultMessage.classList.remove('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function clearDisplays() {
  resultMessage.classList.add('hidden');
  resultMessage.textContent = '';
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
}
