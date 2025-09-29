import { loadWASM } from "./loadWasm.js";

let wasmModule = null;

function importWasmStr(heap, ptr, len) {
  const bytes = heap.subarray(ptr, ptr + len);
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

(async () => {
  wasmModule = await loadWASM();
  postMessage({ type: "ready" });
})();

onmessage = function (e) {
  if (!wasmModule) {
    postMessage({ type: "error", error: "WASM not loaded yet" });
    return;
  }

  const { west, south, east, north, zoom } = e.data;

  const t0 = performance.now();
  const geojsonStr = wasmModule._windowquery(west, south, east, north, zoom);
  const t1 = performance.now();

  const len = wasmModule._strlength(geojsonStr);
  const jsonStr = importWasmStr(wasmModule.HEAPU8, geojsonStr, len);

  wasmModule._free(geojsonStr);

  const geojson = JSON.parse(jsonStr);

  postMessage({
    type: "result",
    geojson,
    filterTime: +(t1 - t0).toFixed(6)
  });
};
