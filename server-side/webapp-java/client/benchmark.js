const fetch = require('node-fetch');
const fs = require('fs');

async function measureApiResponseTimes() {
  const bboxes = JSON.parse(fs.readFileSync('../../../public/tests/test15per100.json', 'utf8'));
  const NUM_ITERATIONS = 100;

  const randomSamples = [];
  for (let i = 0; i < NUM_ITERATIONS; i++) {
    const randomIndex = Math.floor(Math.random() * bboxes.length);
    randomSamples.push(bboxes[randomIndex]);
  }

  const responseTimes   = [];

  for (let i = 0; i < randomSamples.length; i++) {
    const { bbox, zoom } = randomSamples[i];

    const ymin = Math.min(bbox[0][0], bbox[1][0]);
    const ymax = Math.max(bbox[0][0], bbox[1][0]);
    const xmin = Math.min(bbox[0][1], bbox[1][1]);
    const xmax = Math.max(bbox[0][1], bbox[1][1]);

    const url = `http://localhost:8080/api/entities/rasters/geom/geometry?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}&level=${zoom}`;

    const t0 = Date.now();

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      await res.json();
      const t1 = Date.now();
      const elapsed = t1 - t0;
      responseTimes.push(elapsed);
      console.log(`Iteration ${i + 1}: BBox ${JSON.stringify(bbox)} Zoom ${zoom} => ${elapsed} ms`);
    } catch (err) {
      console.error(`Iteration ${i + 1} Error:`, err);
    }
  }

  const total = responseTimes.reduce((a, b) => a + b, 0);
  const avg = responseTimes.length ? total / responseTimes.length : 0;
  console.log(`\n✅ Average time over ${responseTimes.length} iterations: ${avg.toFixed(2)} ms`);
}

measureApiResponseTimes();
