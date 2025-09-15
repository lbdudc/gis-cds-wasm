const express = require('express');
const { loadWASM } = require('./loadWasm');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:1234'
}));

const port = 3000;
const poolSize = 5; // poolSize: how many WASM instances to keep in memory
let wasmPool = [];

async function initPool() {
  for (let i = 0; i < poolSize; i++) {
    wasmPool.push(await loadWASM());
  }
}

function getInstance() {
  if (wasmPool.length === 0) return null;
  return wasmPool.pop();
}

function releaseInstance(instance) {
  wasmPool.push(instance);
}

app.get('/wasm', async (req, res) => {
  const instance = getInstance();
  if (!instance) {
    return res.status(503).json({ error: "No WASM instances available" });
  }

  try {
    const { xmin, ymin, xmax, ymax, zoom } = req.query;
    const result = instance._windowquery(parseFloat(xmin), parseFloat(ymin), parseFloat(xmax), parseFloat(ymax), parseInt(zoom));
    const wasmStrLen = instance._strlength(result);
    const jsonStr = new TextDecoder().decode(instance.HEAPU8.subarray(result, result + wasmStrLen));
    const responseJson = JSON.parse(jsonStr);

    instance._free(result); // Free the memory allocated in WASM

    res.json(responseJson);
  } catch (err) {
    console.error("Error en /wasm:", err);
    res.status(500).json({ error: "Internal WASM error" });
  } finally {
    releaseInstance(instance);
  }
});

app.listen(port, async () => {
  await initPool();
});