# Phase Timeline Challenge


## Running the project
Project is cloned from this [repo](https://github.com/phase-software/timeline-challenge) and use npm to manage dependencies.

Setup and run the project:

1. Make sure Node and npm are installed. Recommended versions are `Node >= v18.20.4` and `npm >= 10.7.0`

2. Install dependencies `npm install`

3. Run the project using `npm run start`


## Testing
This project use [Playwright](https://playwright.dev/docs/intro) to test behaviors on real browsers.

Setup Playwright:

- Install Playwright-controlled browsers using `npx playwright install`.

Running tests:

1. Before running tests, make sure the project is run locally using `npm start`.

2. Run all tests using `npx-playwright-test` or `npm run playwright:test`. <br>
Supported arguments can be found in the [docs](https://playwright.dev/docs/running-tests#running-tests). We can run in headed mode, on specific browsers, specific tests, etc.

3. To run specific test use `npx playwright test <name>.spec.ts`

4. The report will be served in HTML at **http://localhost:9323**

5. To open last run tests report `npx playwright show-report` or `npm run playwright:last-report`


### Note about Test ID
There looks to be some [changes](https://github.com/phase-software/timeline-challenge/commit/20424fa2994124d0d86e209c95a21a6a1106a91c) in `data-testid` since this repository is first cloned. 
<br/>
I am assuming `data-testid` as per this [commit]((https://github.com/phase-software/timeline-challenge/commit/20424fa2994124d0d86e209c95a21a6a1106a91c)) will be used for assessment.