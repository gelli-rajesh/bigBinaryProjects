
const REST_COUNTRIES_API_KEY = "rc_live_2580d8943ae3415fb4ece813ac43587d";
const EXCHANGE_RATE_API_KEY = "23be3c0c3b33dd42223f74d6";





const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultMessage = document.getElementById('result-message');
const errorMessage = document.getElementById('error-message');


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
async function fetchCurrencies(){
try {
        const response = await fetch(
                            "https://api.restcountries.com/currencies/v1/symbols",
            {
                headers: {
                    Authorization: `Bearer ${REST_COUNTRIES_API_KEY}`
                }
            }
        );

          if (!response.ok) {
          
            throw new Error(`Currency API failed: ${response.status}`);
        }
        
        const data = await response.json();
        const currencies = data.data?.objects;

        if (!Array.isArray(currencies)) {
            console.error("Unexpected API response:", data);
            throw new Error("Invalid currency data received.");
        }

        addOptions(currencies);
    } catch (error) {
        console.error(error);
        showError("some error in fetching currencies.");
    }

}

function addOptions(currencies) {
    const currencies_having_all_fileds = currencies.filter((x) => x.code && x.name);

    currencies_having_all_fileds.forEach(currency => {
        const text = `${currency.symbol} ${currency.name}`;

        const fromOption = document.createElement("option");
        fromOption.value = currency.code;
        fromOption.textContent = text;

        const toOption = document.createElement("option");
        toOption.value = currency.code;
        toOption.textContent = text;

        fromSelect.appendChild(fromOption);
        toSelect.appendChild(toOption);
    });

}
 async function conversion(){

clearDisplays();

   
    const amount = Number(amountInput.value.trim());
    const from = fromSelect.value;
    console.log(from);
    const to = toSelect.value;
    if (amountInput.value.trim() === "" || isNaN(amount) || amount <= 0) {
    alert("Enter a valid positive amount");
    return;
     }

    if (!from || !to) {
    alert("Select both currencies");
    return;
    }

    if (from === to) {
    alert("Select different currencies");
    return;
    }

    try {
        const fromRateApi =`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${from}`;

        const response = await fetch(fromRateApi);
        if (!response.ok) {
          
            throw new Error(`Rates API failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.result !== "success" || !data.conversion_rates) {
            throw new Error(data["error-type"] || `Rates API failed: ${response.status}`);
        }

        const rate = data.conversion_rates[to];

        if (typeof rate !== "number") {
            throw new Error("Exchange rate not available for this currency.");
        }

        const exchangeValue = amount * rate;

        const statement=`${amount} ${from} = ${exchangeValue} ${to}`;
        showResult(statement);
    } catch (error) {
        console.error(error);
       
    } 
}

convertBtn.addEventListener('click',conversion);
fetchCurrencies();





