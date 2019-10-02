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

    const amountFormElement = document.getElementById('amount');

    //
    // Functions
    //

    async function getRatesForDay(day) {
        const url = `${fixerUrl}/${day}?access_key=${fixerAccessKey}&base=${baseCurrency}&symbols=${otherCurrencies.join(',')}`;
        //const url = 'https://jsonplaceholder.typicode.com/posts';

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
    
    Promise.all([
        getRatesForDay(precedingDays[0]), 
        getRatesForDay(precedingDays[1]), 
        getRatesForDay(precedingDays[2]), 
        getRatesForDay(precedingDays[3])
    ])
    .then(jsonForDays => {       
        precedingDays.forEach((day, index) => {
            dailyRates.push({
                'date': '' + day + '', 
                'rates': jsonForDays[index].rates
            });
        });

        // Add (in first position) today’s rates, which we didn’t need to fetch() because the JSON was already available (var ratesToday).
        dailyRates.unshift({'date': '' + today + '', 'rates': ratesToday});
        console.log(dailyRates);



    })
    .catch(error => { 
      console.error(error.message)
    });


    // async function getAllData(){
    //     try{
    //       await method1();
    //       await method2();
    //     }
    //     catch(error){
    //       console.log(error);
    //     }
    //   }

    // getAllData()
    // .then(function(jsonData) {    
    // ]).then(values => { 
    // //         console.log(values); // [3, 1337, "foo"] 
    //     });


//     var p1 = Promise.resolve(3);
//     var p2 = 1337;
//     var p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("foo");
//     }, 100);
//     }); 

//     Promise.all([p1, p2, p3]).then(values => { 
//         console.log(values); // [3, 1337, "foo"] 
//     });

// Promise.all([p1, p2, p3, p4, p5])
// .then(values => { 
//   console.log(values);
// })
// .catch(error => { 
//   console.error(error.message)
// });
    



    

    //console.log( dayjs().subtract(1, 'day').format('DD-MM-YYYY') );

    
    
    
    // When 'euro_amount' changed, update the 'Latest Exchange Rate' table
    // Build complete markup first (tbody), THEN inject into the DOM (rather than bit-by-bit, because the latter causes janky performance)

    // When two rows selected, create a 5-day-overview table for the two selected currencies
    // showing rate*euro_amount for each value
    // and launch it in a modal



    /**
     * Handle form submit events
     */
    const submitHandler = (event) => {
        event.preventDefault();
        console.log('form submitted');
    };

    // Listen for events
    document.addEventListener('submit', submitHandler, false);

})();