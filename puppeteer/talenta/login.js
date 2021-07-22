const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

module.exports = {
  login: async (account) => {
      
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.emulate(iPhone); 

    await setLocation(page);

    await page.goto(process.env.URL_TALENTA_LOGIN);

    await inputLogin(page, account);

    await page.screenshot({ path: 'login.png' });
    console.log('DONE');
    await browser.close();

  },
};

var setLocation = async (page) => {

    await page.evaluateOnNewDocument(function() {
      navigator.geolocation.getCurrentPosition = function (cb) {
        setTimeout(() => {
          cb({
            'coords': {
              accuracy: 100,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: process.env.LAT,
              longitude: process.env.LONG,
              speed: null
            }
          })
        }, 1000)
      }
    });
    
    await page.goto(process.env.URL_LOCATION);

    await page.waitForSelector('#map');
    
    await page.tap('#map');
    await page.waitFor(2000);

    await page.screenshot({ path: 'location.png', fullPage: true });

    console.log('LOCATION');
     
}

var inputLogin = async (page, account) => {
    
    await page.waitForSelector('#user_email');
    await page.$eval('#user_email', (el, value) => el.value = value, account.username);
    await page.$eval('#user_password', (el, value) => el.value = value, account.password);
    await page.click('#new-signin-button');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

}
