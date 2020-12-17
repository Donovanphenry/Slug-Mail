const puppeteer = require('puppeteer');

// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless'
    ]
  });
  done();
});

// Close the browser after each test
afterEach(async (done) => {
  await browser.close(); 
  done();
});

test('Instruction Content', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const instruction = await page.$("#instruction");
  const msg = await (await instruction.getProperty('textContent')).jsonValue();
  expect(msg).toBe('Click button to connect to the Backend dummy endpoint');
});
