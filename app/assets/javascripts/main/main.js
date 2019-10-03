;(function () {

    //
    // Variables
    //

    const fixerUrl = 'http://data.fixer.io/api/';
    const fixerAccessKey = '429ca83b5757bee8cbf4b997f620f3ab';
    const baseCurrency = 'EUR';
    const otherCurrencies = ['USD' ,'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
    
    const today = dayjs().format('YYYY-MM-DD');
    const precedingDays = [1,2,3,4].map((num) => dayjs().subtract(num, 'day').format('YYYY-MM-DD'));
    const dailyRates = [];

    let baseValue = 100;
    let selectedCurrencies = [];

    const amountInput = document.querySelector('#amount');
    const latestRatesContainer = document.querySelector('#latest-rates-table-container');
    const latestRatesTable = document.querySelector('#latest-rates-table');
    const modal = document.querySelector('#modal');
    const modalOverlay = document.querySelector('#modal-overlay');
    const modalBody = document.querySelector('#modal-body');


    //
    // Functions
    //

    // Format a calculated rate to two decimal places
    const formatRate = (value) => value.toFixed(2);

    
    // Asynchronously fetch from fixer.io’s Historical Rates Endpoint
    async function getRatesForDay(day) {
        const url = `${fixerUrl}/${day}?access_key=${fixerAccessKey}&base=${baseCurrency}&symbols=${otherCurrencies.join(',')}`;

        let response = await fetch(url);

        // Check response is 'HTTP 200 OK'.
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }


    // Accept a new Euro base value and re-render the Latest Rates table
    const updateLatestRatesTable = (newBaseValue) => {
        if (!newBaseValue || (newBaseValue.length === 0) || (newBaseValue === baseValue)) return;
        if (!latestRatesTable) return;

        baseValue = newBaseValue;

        const tHeadMarkup = `<tr><th>Currency</th><th>Amount</th></tr>`;
        const tBodyMarkup = Object.entries(dailyRates[0].rates).map(([currencyName, rate]) => {
            return `<tr data-currency="${currencyName}"><td>${currencyName}</td><td>${formatRate(rate * baseValue)}</td></tr>`;
        }).join('');
        const newTableHTML = '<table id="latest-rates-table"><thead>' + tHeadMarkup + '</thead><tbody>' + tBodyMarkup + '</tbody></table>';
        latestRatesTable.remove();
        latestRatesContainer.innerHTML = newTableHTML;
    };

    
    // Mark a currency as selected for comparison
    // and if its the second of a pair, launch the comparison tool.
    const selectCurrencyForComparison = (currencyRow) => {
        const currency = currencyRow.getAttribute('data-currency');
        
        // if the currency is already selected, quit here.
        if (selectedCurrencies.indexOf(currency) !== -1) return;

        currencyRow.classList.add('currency-selected');

        selectedCurrencies.push(currency);

        if (selectedCurrencies.length === 2) {
            launchComparisonTool();
        }
    };

    // Clear Selected Currencies
    const clearSelectedCurrencies = () => {
        let selectedRows = document.querySelectorAll('.currency-selected');
        selectedRows.forEach((selectedRow) => selectedRow.classList.remove('currency-selected'));
        
        selectedCurrencies = [];
    };

    
    // Launch a 2-currency, 5-day Rate Comparison Tool.
    const launchComparisonTool = () => {
        setTimeout(() => {
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
        }, 500);

        const preTableHeader = `<h2>EUR: ${baseValue}</h2><h3>${selectedCurrencies[0]} and ${selectedCurrencies[1]}: last 5 days</h3>`;
        const tHeadMarkup = `<tr><th>Date</th><th>${selectedCurrencies[0]}</th><th>${selectedCurrencies[1]}</th></tr>`;
        const tBodyMarkup = dailyRates.map((row) => {
            return `<tr><td>${row.date}</td><td>${formatRate(row.rates[selectedCurrencies[0]])}</td><td>${formatRate(row.rates[selectedCurrencies[1]])}</td></tr>`;
        }).join('');
        const tableHTML = preTableHeader + '<table><thead>' + tHeadMarkup + '</thead><tbody>' + tBodyMarkup + '</tbody></table>';
        modalBody.innerHTML = tableHTML;
    };

 
    // Handle form submit events
    const submitHandler = (e) => {
        e.preventDefault();
        if (!amountInput) return;
        updateLatestRatesTable(amountInput.value);
    };


    // Handle click events
    const clickHandler = (e) => {

        // Currency row clicks
        if (e.target.matches('td')) {
            const currencyRow = e.target.parentNode;
            selectCurrencyForComparison(currencyRow);
            return;
        }

        // 'Close modal' clicks
        if (e.target.matches('#close-button')) {
            clearSelectedCurrencies();
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
            return;
        }
    };

    
    // Set up: 
    // Only apply our JS-based enhancements if we successfully fetch data for ALL days. 
    // We can adopt this progressive enhancement based approach because we already have a decent, non-JS-reliant baseline.
    // Promise.all() is a good fit for our needs. It rejects overall if any individual promise is rejected. 
    const setup = () => {
        // Don’t start enhancing if the server-rendered data part failed.
        if (!latestRatesTable) return;

        var stubPromise = new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve('foo');
            }, 100);
          });
        
        Promise.all([
            //stubPromise
            getRatesForDay(precedingDays[0])
            // getRatesForDay(precedingDays[0]), 
            // getRatesForDay(precedingDays[1]), 
            // getRatesForDay(precedingDays[2]), 
            // getRatesForDay(precedingDays[3])
        ])
        .then(jsonForDays => {       
            precedingDays.forEach((day, index) => {
                dailyRates.push({
                    'date': '' + day + '', 
                    'rates': ratesToday // stub during development | replace with 'rates': jsonForDays[index].rates
                });
            });
    
            // Add (to start of array) today’s rates, which were already provided server-side.
            dailyRates.unshift({'date': `${today}`, 'rates': ratesToday});
    
            // Finally, listen for events
            document.addEventListener('submit', submitHandler, false);
            document.addEventListener('click', clickHandler, false);
        })
        .catch(error => { 
          console.error(error.message)
        });
    };

    
    // Get started.
    setup();

})();
