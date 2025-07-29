# Leaflet Client-Side Project: Interactive Mapping with GeoJSON

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)


## 📄 Project Overview

A client-side web application demonstrating map rendering and geospatial operations using Leaflet.js. This project is part of the GIS PoC (Proof of Concept) for the WASM-CDS initiative.


## 🗂 Project Structure

```
client-side/webapp-java/
  ├── index.html         # Main HTML entry point for the application
  ├── benchmark.js       # Optional script used to run performance benchmarks on spatial queries
  └── README.md          # This file
```

## ✨ Features

- Interactive map rendering with Leaflet.js
- Geospatial bounding box generation
- Benchmarking and testing utilities
- Simple static server for local development

## 🚀 Getting Started

These instructions will help you set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Install dependencies:

    ```sh
    npm install
    ```

### Required Files

The project includes a `geojsons` folder in `/public`. This folder is initially empty and requires you to manually add `.geojson` files for map rendering at different levels of detail.


### Start the development server

Serve the application locally at [http://localhost:8080](http://localhost:8080):

```sh
npm run serve
```

## 🧪 Testing

To measure UI filter times using browser automation, first ensure that the server is running at http://localhost:8080, then run:

```sh
npm run test
```

This command executes the `benchmark.js` script, which may use Selenium and Chromedriver for browser-based testing.

## 🤝 Contributing

Contributions are welcome! Please open issues or merge requests via GitLab.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

See [../../README.md](../../README.md#authors) for the full list of contributors.
