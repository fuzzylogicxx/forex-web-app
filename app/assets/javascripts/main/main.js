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

    const amountInput = document.querySelector('#amount');
    let baseValue = 100;

    let selectedCurrencies = [];

    let comparisonTableMap = [];

    const modal = document.querySelector('#modal');
    const modalOverlay = document.querySelector('#modal-overlay');
    const modalBody = document.querySelector('#modal-body');



    //
    // Functions
    //

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

    // Let’s not attempt to do any JS enhancement unless we’ve got all the necessary data. 
    // It’s OK, because if data fetching fails, we’ve still got a reasonable non-JS baseline.
    // Promise.all() is a good match here:
    // It is rejected overall if any of the elements are rejected. 
    // Also, Promise.all()’s returned value order matches the order of the Promises passed, regardless of completion order.

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
        //console.log(dailyRates);
    })
    .catch(error => { 
      console.error(error.message)
    });


    
    
    // When 'euro_amount' changed, update the 'Latest Exchange Rate' table
    // Build complete markup first (tbody), THEN inject into the DOM (rather than bit-by-bit, because the latter causes janky performance)

    // When two rows selected, create a 5-day-overview table for the two selected currencies
    // showing rate*euro_amount for each value
    // and launch it in a modal

    const updateLatestRatesTable = (baseValue) => {
        console.log('updateLatestRatesTable', baseValue);
    };

    
    const selectCurrencyForComparison = (currencyRow) => {
        const currency = currencyRow.getAttribute('data-currency');
        
        // if the currency is already selected, quit here.
        if (selectedCurrencies.indexOf(currency) !== -1) return;

        // add class to table row to appear selected
        currencyRow.classList.add('currency-selected');

        // update our array of selectedCurrencies
        selectedCurrencies.push(currency);

        if (selectedCurrencies.length === 2) {
            launchComparisonTool();
        }
    };

    
    const clearSelectedCurrencies = () => {
        let selectedRows = document.querySelectorAll('.currency-selected');
        selectedRows.forEach((selectedRow) => selectedRow.classList.remove('currency-selected'));
        
        selectedCurrencies = [];
    };

    
    const launchComparisonTool = () => {
        
        setTimeout(() => {
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
        }, 500);

        const tableHeader = `<h2>EUR: ${baseValue}</h2><h3>${selectedCurrencies[0]} and ${selectedCurrencies[1]}: last 5 days</h3>`;
        const tHeadMarkup = `<tr><td>Date</td><td>${selectedCurrencies[0]}</td><td>${selectedCurrencies[1]}</td></tr>`;
        const tBodyMarkup = dailyRates.map((row) => {
            return `<tr><td>${row.date}</td><td>${row.rates[selectedCurrencies[0]]}</td><td>${row.rates[selectedCurrencies[1]]}</td></tr>`;
        }).join('');
        const tableHTML = tableHeader + '<table><thead>' + tHeadMarkup + '</thead><tbody>' + tBodyMarkup + '</tbody></table>';
        modalBody.innerHTML = tableHTML;
    };


    /**
     * Handle form submit events
     */
    const submitHandler = (e) => {
        e.preventDefault();
        
        if (!amountInput) return;
        
        newBaseValue = amountInput.value;

        if (!newBaseValue || newBaseValue.length === 0) return;

        baseValue = newBaseValue;

        updateLatestRatesTable(newBaseValue);
    };

    /**
     * Handle click events (specifically selecting currency rows)
     */
    const clickHandler = (event) => {

        // Currency row clicks
        if (event.target.matches('td')) {
            const currencyRow = event.target.parentNode;
            selectCurrencyForComparison(currencyRow);
            return;
        }

        // 'Close modal' clicks
        if (event.target.matches('#close-button')) {
            clearSelectedCurrencies();
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
            return;
        }
        
    };

    // Listen for events
    
    document.addEventListener('submit', submitHandler, false);
    document.addEventListener('click', clickHandler, false);

})();