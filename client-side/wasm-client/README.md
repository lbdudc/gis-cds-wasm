# WASM Client-Side Project: Spatial Layer Handling in the Browser

## Table of Contents

- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [WASM Compilation](#-wasm-compilation)
- [Testing](#-testing)
- [Known Issues](#-known-issues)


## 📄 Project Overview

This is the **client-side/wasm-client** variant of the WASM spatial layer project. It loads spatial data and WASM modules directly in the browser, allowing users to interact with GIS layers without any backend. The project is ideal for static hosting and showcases the performance of running C/C++ spatial algorithms in modern browsers.


## 🗂 Project Structure

```
client-side/wasm-client/
  ├── index.html           # Main HTML entry point for the application
  ├── loadWasm.js          # Script to load and initialize the compiled WASM module in the browser
  ├── benchmark.js         # Optional script used to run performance benchmarks on spatial queries
  ├── window_query.data    # Spatial data file preloaded into the WASM memory
  ├── window_query.wasm    # Compiled WebAssembly binary
  ├── window_query.js      # Generated JS glue code for WASM
  └── README.md            # This file
```


## ✨ Features

- Loads and queries spatial data layers entirely in the browser
- No backend required—fully static or offline-capable
- High-performance spatial queries via WASM-compiled C/C++
- Example integration with Vue.js frontend

## 🚀 Getting Started

### 1. Install Dependencies

```sh
npm install
```

### 2. Run the Development Server

```sh
npm run serve
```

The application will be available at [http://localhost:1234](http://localhost:1234) by default.

## 🧩 WASM Compilation

To recompile the WASM module for browser use (with Webpack):

```sh
emcc --bind -std=c++17 lib/*.c* -o window_query.js window_query.cpp \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS="['_windowquery', '_strlength']" \
  --preload-file files -s MAXIMUM_MEMORY=734003200 \
  -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
  -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT='web' \
  --no-entry -s USE_ES6_IMPORT_META=0 -s WASM=1
```

Run this command from the `/wasm-levels-compiled` directory.
The three generated files (`.wasm`, `.data`, and `window_query.js`) will be placed in the root directory of the project (`/wasm-client`).

After cloning the repository, you must recompile the WASM module and replace the old files (.wasm, .data, and window_query.js) with the newly generated ones.


## 🧪 Testing

To measure UI filter times using browser automation, first ensure that the server is running at http://localhost:8080, then run:

```sh
npm run test
```

This command executes the `benchmark.js` script, which may use Selenium and Chromedriver for browser-based testing.

## ⚠️ Known Issues

- Large spatial datasets may impact browser memory usage
- WASM module must be compiled with the correct flags for browser compatibility
