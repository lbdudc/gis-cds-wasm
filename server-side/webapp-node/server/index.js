const express = require('express');
const { loadWASM } = require('./loadWasm');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:1234'
}));

const port = 3000;
let wasmModule = null;

function importWasmStr(wasmMem, strPtr, strLen) {
  let view = new DataView(wasmMem.buffer, strPtr, strLen);
  let dec = new TextDecoder();
  return dec.decode(view);
}


app.get('/wasm', (req, res) => {
  const { xmin, ymin, xmax, ymax, zoom } = req.query;
  const result = wasmModule._windowquery(parseFloat(xmin), parseFloat(ymin), parseFloat(xmax), parseFloat(ymax), parseInt(zoom));
  const wasmStrLen = wasmModule._strlength(result);
  const responseJson = JSON.parse(importWasmStr(wasmModule.HEAPU8, result, wasmStrLen));
  res.json(responseJson);
});

app.listen(port, async () => {
  wasmModule = await loadWASM();
});