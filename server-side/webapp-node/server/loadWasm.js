const Module = require("./window_query.js");
const { readFile } = require('fs').promises;

function loadWASM() {
  return new Promise((resolve, reject) => {
    readFile('./window_query.wasm')
      .then((buffer) => {
        Module({
          wasmBinary: buffer,
          locateFile: (path) => {
            if (path.endsWith('.wasm')) {
              return './window_query.wasm';
            }
            if (path.endsWith('.data')) {
              return './window_query.data';
            }
            return path;
          },
        }).then((mod) => resolve(mod));
      })
      .catch((error) => reject(error));
  });
}

module.exports = { loadWASM };