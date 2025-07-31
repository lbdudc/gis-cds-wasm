import Module from "./window_query.js";

export async function loadWASM() {
  return new Promise((resolve, reject) => {
    fetch("/window_query.wasm")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        Module({
          wasmBinary: buffer,
          locateFile: (path) => {
            if (path.endsWith(".wasm")) {
              return "/window_query.wasm";
            }
            if (path.endsWith(".data")) {
              return "/window_query.data";
            }
            return path;
          },
        }).then((mod) => {
          resolve(mod);
        });
      })
      .catch((error) => reject(error));
  });
}
