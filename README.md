# Project Overview
This repository contains a Proof of Concept (PoC) for GIS functionalities, exploring different architectures for handling spatial data layers. The project focuses on WebAssembly (WASM) for client-side processing, alongside traditional server-side approaches using Java and Node.js. It includes various client and server implementations to demonstrate how spatial data can be loaded, filtered, and displayed, either by processing on the server and serving filtered layers, or by loading raw data onto the client and performing filtering there.

## Table of Contents
- Client-side
  - [wasm-client](#wasm-client)
  - [webapp-java (Client-side)](#webapp-java-client-side)
- Server-side
  - [webapp-java (Server-side)](#webapp-java-server-side)
  - [webapp-node](#webapp-node)
- [WASM Compilation](#wasm-compilation)
- [Testing](#testing)
- [Authors](#-authors)

## 🚀 Getting Started
### 1. Clone the Repository

```sh
git clone https://github.com/lbdudc/gis-cds-wasm.git
```

## 🌐 Client-side

### wasm-client
This project demonstrates a client-side architecture for handling spatial data layers using WebAssembly (WASM). All spatial data and query logic are loaded and executed directly in the browser, leveraging native C/C++ code compiled to WASM for high performance. This approach eliminates the need for server-side spatial processing, enabling fully offline or static deployments and rapid client-side interaction with GIS features.

See [client-side/wasm-client/README.md](client-side/wasm-client/README.md) for more details.

### webapp-java (Client-side)
A client-side web application demonstrating map rendering and geospatial operations using Leaflet.js. This project is part of the GIS PoC (Proof of Concept) for the WASM-CDS initiative.

See [client-side/webapp-java/README.md](client-side/webapp-java/README.md) for more details.

---

## ⚙️ Server-side

### webapp-node
This project is a full-stack web application featuring a Vue.js frontend and a Node.js backend. Instead of using PostgreSQL, it leverages data compiled to WebAssembly (`.wasm`) for serving and processing geometry data. The application includes a map viewer to display spatial geometries, which are loaded directly from WASM-compiled data files.

See [server-side/webapp-node/README.md](server-side/webapp-java/README.md) for more details.

### webapp-java (Server-side)
This project is a full-stack web application featuring a Vue.js frontend and a Spring Boot backend, with PostgreSQL for geometry data storage. It includes a map viewer to display spatial geometries loaded via an external importer script.

See [server-side/webapp-java/README.md](server-side/webapp-java/README.md) for more details.

## 🧩 WASM Compilation

The WebAssembly module compilation depends on the target environment. The following commands should be executed from the `/wasm-levels-compiled` directory. Below are the recommended commands for compiling the module depending on whether it is used in a browser (e.g., with Webpack) or in a Node.js project.

For browser use with Webpack:

```sh
emcc --bind -std=c++17 lib/*.c* -o window_query.js window_query.cpp \
  -s MODULARIZE=1 -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS="['_windowquery', '_strlength']" \
  --preload-file files -s MAXIMUM_MEMORY=734003200 \
  -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
  -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT='web' \
  --no-entry -s USE_ES6_IMPORT_META=0 -s WASM=1
```

For Node.js usage:

```sh
emcc --bind -std=c++17 lib/*.c* -o window_query.js window_query.cpp \
-s MODULARIZE=1 \ 
-s EXPORTED_FUNCTIONS="['_windowquery', '_strlength']" \
--preload-file files -s MAXIMUM_MEMORY=734003200 \
-s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
-s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT='node' --no-entry \
-s USE_ES6_IMPORT_META=0 -s WASM=1
```

⚠️ Note: These commands were tested with emcc version 3.1.5. In newer versions, some flags may be deprecated or behave differently.

### Generated Files

These compilation commands generate a `.wasm`, a `.data` and a `window_query.js` file. The .wasm file contains the compiled C/C++ code, while window_query.js acts as the "glue code" between the WASM module and your JavaScript application, providing necessary native C functionalities in a JS equivalent. 

The placement of these files varies depending on whether the project is for a browser (e.g., Vue with Webpack) or a Node.js environment.

## 🧪 Testing

This project includes automated tests to ensure the functionality and performance of various components. You can run these tests to verify the integrity of the different implementations. 

While the server is running, you can execute benchmarks and automated tests using:

```sh
npm run test
```

Specific test configurations and details can be found within the respective client and server directories.

## 👥 Authors

- [Victor Lamas](mailto:victor.lamas@udc.es)