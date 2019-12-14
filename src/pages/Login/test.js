const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const test = require('ava');
const fs = require('fs');
const same = require('looks-same');
const util = require('util');
const path = require('path');

let options = new firefox.Options();
options.addArguments("-headless");

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(options).build();

async function screen_test(t, driver, name) {
    let login_screen = await driver.takeScreenshot();
    await util.promisify(fs.writeFile)(path.join(__dirname, name+'_new.png'), login_screen, 'base64');
    let result = await util.promisify(same)(path.join(__dirname, name+'.png'), path.join(__dirname, name+'_new.png'), {
        strict: false,
        tolerance: 2.5,
        antialiasingTolerance: 0,
        ignoreAntialiasing: true,
        ignoreCaret: true
    });

    if(result.equal) {
        await util.promisify(fs.unlink)(path.join(__dirname, name+'_new.png'));
    } else {
        const diff = looksSame.createDiff({
            reference: path.join(__dirname, name+'.png'),
            current: path.join(__dirname, name+'_new.png'),
            diff: path.join(__dirname, name+'_diff.png'),
            highlightColor: '#ff00ff', // color to highlight the differences
            strict: false, // strict comparsion
            tolerance: 2.5,
            antialiasingTolerance: 0,
            ignoreAntialiasing: true, // ignore antialising by default
            ignoreCaret: true // ignore caret by default
        });
    }

    t.true(result.equal);
}


test('root login works', async t => {
    await driver.get('http://localhost:8081/login');
    screen_test(t, driver, 'login_screen');


    await driver.findElement(webdriver.By.id('username')).sendKeys('root');
    await driver.sleep(100);
    await driver.findElement(webdriver.By.id('password')).sendKeys('OneServ_2017');
    await driver.sleep(100);

    await driver.findElement(webdriver.By.id('login_btn')).click();
    await driver.sleep(2000);
    
    let url = await driver.getCurrentUrl();
    t.is(url, 'http://localhost:8081/dashboard');
    await screen_test(t, driver, 'dashboard_screen');

    await driver.quit();

});