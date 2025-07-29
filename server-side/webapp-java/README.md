# 🌍 WebApp With Java Project

## Table of Contents

- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Testing](#-testing)

## 📄 Project Overview

This project is a full-stack web application featuring a Vue.js frontend and a Spring Boot backend, with PostgreSQL for geometry data storage. It includes a map viewer to display spatial geometries loaded via an external importer script.

## 🗂 Project Structure

```
/server-side/webapp-java
├── /client         → Vue.js frontend
      ├── /benchmark.js      # Optional script used to run performance benchmarks on spatial queries
├── /server         → Spring Boot backend
├── /deploy
└── README.md          # This file
```

## 🛠 Technologies Used

- Vue 3 + Vue CLI
- Spring Boot (Java 17)
- PostgreSQL + PostGIS
- Python for data import

## ✨ Features

- Interactive map viewer to visualize geometries
- REST API backend using Spring Boot
- Geometry import tool for PostgreSQL/PostGIS
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

The frontend will be running at [http://localhost:8080](http://localhost:8080) by default.

### Backend Setup (Spring Boot)

**Requirements:**  

- Java 17+  
- Gradle (included via wrapper)

**Steps:**

```sh
cd server
./gradlew bootRun
```

The backend API will be available at [http://localhost:8081](http://localhost:8081) (or your configured port).

### Load Geometries into PostgreSQL

**Requirements:**  

- Python 3  
- `psycopg2` (install with `pip install psycopg2`)  
- A running PostgreSQL instance with spatial extensions (PostGIS)

**Steps:**

1. Edit the `importador.py` file located at `/deploy` to match your PostgreSQL connection details.
2. Run:

```sh
python importador.py
```

This script will populate the database with the necessary geometry data used by the map viewer.

## 🧪 Testing

To run performance benchmarks on the API, make sure the backend server is running locally (on http://localhost:8080), then execute:

```sh
cd client
npm run test
```

This command executes the `benchmark.js` script, which reads a list of bounding boxes and sends repeated requests to the API to measure response times. It outputs individual and average timings to the console.
