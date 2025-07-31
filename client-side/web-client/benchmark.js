const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

// Load bounding boxes
const bboxes = JSON.parse(fs.readFileSync('../../public/tests/test15per100.json', 'utf8'));
const NUM_ITERATIONS = 100;
const MAP_URL = 'http://127.0.0.1:8080/index.html'; // Make sure your server is running

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
        await driver.sleep(2000); // Wait for map to load

        const times = [];
        const sizes = [];

        for (let i = 0; i < NUM_ITERATIONS; i++) {
            const { bbox, zoom } = bboxes[Math.floor(Math.random() * bboxes.length)];

            // Set map view
            await driver.executeScript('window.setMapView(arguments[0], arguments[1]);', bbox, zoom);

            // Wait for map to update and filter
            await driver.sleep(500);

            // Get the filter time
            const filterTime = await driver.executeScript('return window.getLastFilterTime();');
            times.push(filterTime);

            console.log(`Iteration ${i + 1}: ${filterTime.toFixed(2)} ms`);
        }

        // Calculate average
        const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
        console.log(`\n✅ Average filter time over ${NUM_ITERATIONS} iterations: ${avg.toFixed(2)} ms`);
    } catch (err) {
        console.error('Benchmark failed:', err);
    } finally {
        await driver.quit();
    }
})();
