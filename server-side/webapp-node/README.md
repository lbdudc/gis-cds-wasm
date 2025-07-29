# 🌍 WebApp with Node.js Project

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [WASM Compilation](#wasm-compilation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## 📄 Project Overview

This project is a full-stack web application featuring a Vue.js frontend and a Node.js backend. Instead of using PostgreSQL, it leverages data compiled to WebAssembly (`.wasm`) for serving and processing geometry data. The application includes a map viewer to display spatial geometries, which are loaded directly from WASM-compiled data files.

## 🗂 Project Structure

```
/server-side/webapp-node
├── /client         → Vue.js frontend  
    └── benchmark.js         # Optional script used to run performance benchmarks on spatial queries
├── /server         → Node.js backend (Express, etc.)  
    ├── loadWasm.js          # Script to load and initialize the compiled WASM module in the browser 
    ├── window_query.data    # Spatial data file preloaded into the WASM memory
    ├── window_query.wasm    # Compiled WebAssembly binary
    └── window_query.js      # Generated JS glue code for WASM
├── /deploy
└── README.md          # This file
```

## 🛠 Technologies Used

- Vue 3 + Vue CLI
- Node.js + Express
- WebAssembly (`.wasm`) for geometry data

## ✨ Features

- Interactive map viewer to visualize geometry data
- REST API backend with Node.js and Express
- WASM-based geometry data loading and processing
- Vue-based responsive frontend

## 🚀 Getting Started

### Client Setup (Vue.js)

**Requirements:**

- Node.js (>=14.x)
- npm

**Steps:**

```sh
cd client
npm install
npm run serve
```

The frontend will be available at [http://localhost:8080](http://localhost:8080) by default.

### Backend Setup (Node.js)

**Requirements:**

- Node.js (>=14.x)
- npm

**Steps:**

```sh
cd server
npm install
npm start
```

The backend API will be accessible at [http://localhost:3000](http://localhost:3000) (or your configured port).

## 🧩 WASM Compilation

Geometry data is provided as `.wasm` files, which are loaded and processed by both the backend and frontend as needed. No database setup is required.

To recompile the WASM module for browser use (with Node.js):

```sh
emcc --bind -std=c++17 lib/*.c* -o window_query.js window_query.cpp \
-s MODULARIZE=1 \ 
-s EXPORTED_FUNCTIONS="['_windowquery', '_strlength']" \
--preload-file files -s MAXIMUM_MEMORY=734003200 \
-s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
-s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT='node' --no-entry \
-s USE_ES6_IMPORT_META=0 -s WASM=1
```

Run this command from the `/wasm-levels-compiled` directory.
The three generated files (`window_query.wasm`, `window_query.data`, and `window_query.js`) will be placed in `/server`.

After cloning the repository, you must recompile the WASM module and replace the old files (.wasm, .data, and window_query.js) with the newly generated ones.

## 🧪 Testing

To measure the response times of the WASM-based API endpoint, first ensure that the server is running on http://localhost:3000, then run:

```sh
cd client
npm run test
```

This command executes the `benchmark.js` script, which reads a list of bounding boxes and sends repeated requests to the API to measure response times. It outputs individual and average timings to the console.

## 🤝 Contributing

Contributions are welcome! Please open issues or merge requests via GitLab.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

See [../../README.md](../../README.md#authors) for the full list of contributors.
