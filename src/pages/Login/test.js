const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const test = require('ava');

let options = new firefox.Options();
options.addArguments("-headless");

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(options).build();


test('root login works', async t => {
    await driver.get('http://localhost:8081/login');

    await driver.findElement(webdriver.By.id('username')).sendKeys('root');
    await driver.sleep(100);
    await driver.findElement(webdriver.By.id('password')).sendKeys('OneServ_2017');
    await driver.sleep(100);

    await driver.findElement(webdriver.By.id('login_btn')).click();
    await driver.sleep(2000);
    
    let url = await driver.getCurrentUrl();
    t.is(url, 'http://localhost:8081/dashboard');

    await driver.quit();

});