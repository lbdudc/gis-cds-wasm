const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const MAP_URL = 'http://127.0.0.1:8080/index.html';
const TEST_FILES = [
    'test1per100.json',
    'test2per100.json',
    'test5per100.json',
    'test10per100.json',
    'test15per100.json',
    'test20per100.json',
    'test25per100.json',
    'test35per100.json'
];
(async function benchmarkMap() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments(
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-application-cache',
            '--disk-cache-size=0',
            '--media-cache-size=0',
            '--incognito'
        ))
        .build();

    try {
        await driver.get(MAP_URL);
        await driver.sleep(2000);

        await driver.executeScript('window.lastFilterTime = 0;');

        for (const fileName of TEST_FILES) {
            const bboxes = JSON.parse(fs.readFileSync(`../../public/tests/${fileName}`, 'utf8'));
            const times = [];
            const numQueries = bboxes.length;
            console.log(`\nStarting benchmark for ${fileName}...`);

            for (let j = 0; j < numQueries; j++) {
                const { bbox, zoom } = bboxes[j];

                let lastTime = await driver.executeScript('return window.lastFilterTime;');
                
                await driver.executeScript('window.setMapView(arguments[0], arguments[1]);', bbox, zoom);

                const startTime = Date.now();
                const TIMEOUT = 60000; 
                let newTime;
                
                do {
                    await driver.sleep(100);
                    newTime = await driver.executeScript('return window.lastFilterTime;');
                } while (newTime === lastTime && (Date.now() - startTime) < TIMEOUT);

                let filterTime;
                if ((Date.now() - startTime) >= TIMEOUT) {
                    console.error(`\n❌ Query ${j + 1} for ${fileName} exceeded the timeout. Logging 0 ms.`);
                    filterTime = 0;
                } else {
                    filterTime = newTime;
                }

                times.push(filterTime);
                console.log(`Query ${j + 1}/${numQueries}: ${filterTime.toFixed(2)} ms`);
            }
            console.log(`\nAll ${numQueries} queries processed.`);

            const avgMs = times.reduce((sum, t) => sum + t, 0) / times.length;
            const avgUs = avgMs * 1000;
            console.log(`\n✅ Average filter time for ${fileName}: ${avgUs.toFixed(2)} µs`);
        }

    } catch (err) {
        console.error('Benchmark failed:', err);
    } finally {
        await driver.quit();
    }
})();
