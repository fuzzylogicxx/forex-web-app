# FreeAgent Front End Challenge: FX Rates
An interactive web interface for comparing Foreign Exchange rates.

> Update 21/11/19: I have downgraded from the paid Heroku tier (which I needed to avoid sleep delays) and the paid fixer.io tier (which I needed for HTTPS access to APIs). Therefore the Heroku-hosted version of this app will likely no longer work (although could be reinstated without much trouble if the need arises).

> Update: I thank Stu and James for their valuable thoughts and feedback. I leave this challege as-is for integrity, but given the additional insights I now have into FreeAgent’s stack and methodology, an alternate version might involve ITCSS with BEM syntax for CSS; class-based JavaScript components (maybe with Stimulus); a _webpacker_ Rails assets pipeline; and perhaps even an Atomic Design influenced pattern library. In my own time I’m exploring that alternate version at https://github.com/fuzzylogicxx/stimitcss. (End Update.)

The app meets meets all of the challenge requirements which were as follows:
- Provide a form to accept the user’s chosen base EUR value 
- Using the fixer.io​ API, get today’s latest exchange rates
- Show converted values in USD, EUR, JPY, GBP, AUD, CAD, CHF, CNY, SEK, and NZD
- Changing the base currency (EUR) amount re-calculates the exchange amounts for the listed currencies
- Currency rows are selectable. On selection of two rows, the app renders a table with the exchange rates of the selected currencies over the last 5 days period
- Use JavaScript or Ruby or both
- Use minimal CSS with no reliance on frameworks

## See it in action

See the app at [https://hughes-forex.herokuapp.com/](https://hughes-forex.herokuapp.com/)

## Goals and Approach
In addition to meeting the requirements, I also wanted to demonstrate my general approach.

My goals for the app were that it should be:
- accessible; 
- resilient, by providing a reliable baseline experience; 
- progressively enhanced, by layering on additional features for supporting contexts; and 
- fast.

In order to meet the "resilience" goal, I chose not to opt for a JavaScript-only solution since JavaScript is relatively brittle.

I instead began with a basic server-side layer responsible for fetching and displaying today’s latest exchange rates, and updating the base EUR amount via a form. This provided the resilient, fault-tolerant baseline.

This server-side layer also provided an opportunity for me to work with Ruby on Rails. I’d said in my interview with Doug that I hadn’t used Ruby but had years of experience with other server-side languages and MVC frameworks. I hope that my including this Rails part demonstrates me being willing and able to pick up any new technologies quickly. (And since it is less relevant to the role I’m applying for, I hope you’ll apply less scrutiny here than to the front-end part!)

I then added the JavaScript enhancement layer. If the script can successfully `fetch` exchange rates for the previous 4 days, then it intercepts and improves upon the baseline experience, avoiding the need for page reloads, providing greater interactivity and delivering the 5-day comparison tool. 

With regard to JavaScript: rather than defaulting to a framework-based solution, my approach is to consider each task on its merits. For this job I felt that a lightweight vanilla/native JavaScript solution, making use of ES2015+ modern APIs, was both sufficient and better performing by being less bloated. 

Notes: 
- the primary JavaScript file is `app/assets/javascripts/main/main.js`
- the Sass files are in `app/assets/stylesheets/`

## Running the app locally

### Prerequisites

Install [Node.js](https://nodejs.org/en/).

The app uses Ruby v2.6.3 and Rails 5.2.3.

### Getting started

Fork this repository then `git clone` to start working locally.

`cd` into your project folder then `npm install` to install all package dependencies.

To compile static assets, run `gulp` or `gulp watch`.

To open the application in a browser, run ` rails server`.

## App Features
- Resilient: starts with useful baseline content in the case of JavaScript being disabled or failing.
- Handles errors. Addresses the possibility of API calls failing.
- Uses the Fetch API and async/await to retrieve JSON from the fixer.io API server.
- Uses modern JavaScript APIs such as Object.entries and polyfills support in older browsers.
- Utilises [Day.JS](https://github.com/iamkun/dayjs) for easier JavaScript date formatting.
- Disables Rails Asset Pipeline in favour of a custom Gulp-based build system to compile, concatenate and minify JavaScript and Sass, and optimise SVG.
- Mobile-first, responsive approach.
- Uses CSS custom properties for colours, type sizing and other variables.
- Combines Flexbox and CSS Grid for layout.


## Improvements with more time
- Add cacheing / storage solution so as to limit API usage. 
- Add tests for asynchronous API calls.
- In Rails app, add custom (non-create-based) validation for /rates form submission.
