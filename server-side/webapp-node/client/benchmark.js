const fetch = require('node-fetch');
const fs = require('fs');

async function measureApiResponseTimes() {
  const bboxes = JSON.parse(fs.readFileSync('../../../public/tests/test15per100.json', 'utf8'));

  const NUM_ITERATIONS = 100;
  const responseTimes = [];

  for (let i = 0; i < NUM_ITERATIONS; i++) {
    const { bbox, zoom } = bboxes[Math.floor(Math.random() * bboxes.length)];

    const ymin = Math.min(bbox[0][0], bbox[1][0]);
    const ymax = Math.max(bbox[0][0], bbox[1][0]);
    const xmin = Math.min(bbox[0][1], bbox[1][1]);
    const xmax = Math.max(bbox[0][1], bbox[1][1]);

    const url = `http://localhost:3000/wasm?xmin=${xmin}&ymin=${ymin}&xmax=${xmax}&ymax=${ymax}&zoom=${zoom}`;

    const t0 = Date.now();

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      const t1 = Date.now();
      const elapsed = t1 - t0;
      responseTimes.push(elapsed);
      console.log(`Iteration ${i + 1}: BBox ${JSON.stringify(bbox)} Zoom ${zoom} => ${elapsed} ms`);
    } catch (error) {
      console.error(`Iteration ${i + 1} Error en la petición:`, error);
    }
  }

  const total = responseTimes.reduce((a, b) => a + b, 0);
  const avg = responseTimes.length ? total / responseTimes.length : 0;
  console.log(`\n✅ Average time over ${responseTimes.length} iterations: ${avg.toFixed(2)} ms`);
}

measureApiResponseTimes();
