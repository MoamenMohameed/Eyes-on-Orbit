# 🛰️ Eyes-on-Orbit
### Real-Time Satellite Tracking System

![Satellite Tracking](https://img.shields.io/badge/status-active-brightgreen) ![CesiumJS](https://img.shields.io/badge/CesiumJS-3D-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

---

## 📌 Project Overview

**Eyes-on-Orbit** is a real-time system that tracks satellites orbiting Earth using live orbital data.  
The system fetches raw **TLE (Two-Line Element)** data, calculates satellite positions continuously, and displays both their motion and their coverage area on Earth in real time.

> This project focuses on **accurate orbital mechanics**, not just visualization.

---

## ⚙️ How the System Works

### 1. Satellite Data Source
- TLE data is fetched from [CelesTrak](https://www.celestrak.com/).  
- Each satellite is defined by two orbital lines describing its orbit and motion.

### 2. Orbital Propagation
- Uses the **SGP4 algorithm** via **Satellite.js**.  
- At every time step:
  - Propagates satellite orbit using its TLE.
  - Calculates position and velocity in **Earth-Centered Inertial (ECI)** coordinates.

> This is the same algorithm used in real satellite tracking applications.

### 3. Coordinate Transformations
- Converts satellite positions:
  - **ECI → Earth-fixed (ECEF)**
  - **Cartesian → Geodetic (lat, lon, alt)**

Ensures satellites are accurately displayed above the Earth’s surface.

### 4. Real-Time Updates
- Positions update continuously using **time-based callbacks**.  
- No precomputed paths — everything is calculated live for accuracy.

### 5. Coverage Area Calculation
- Each satellite's **ground footprint** is calculated based on altitude.  
- Uses **spherical geometry** with Earth's radius (6371 km).  
- Footprint is a **spherical cap**, showing the observable area.

### 6. Interaction & Analysis
- Click on a satellite to:
  - Track the satellite with the camera
  - Display **altitude, coverage area, and name**
  - Dynamically update the footprint as it moves

### 7. Performance Optimization
- Supports **thousands of satellites simultaneously**.  
- Optimized calculations ensure smooth real-time rendering.  
- Only essential computations are executed per frame.

---

## 🔧 Technologies Used

- **CesiumJS** – 3D Earth visualization  
- **Satellite.js** – SGP4 orbital propagation  
- **JavaScript (ES6+)** – core logic and computations  

---

## 💡 What This Project Demonstrates

- **Orbital Mechanics** knowledge  
- Implementation of **physics-based algorithms**  
- Real-time **geospatial computation**  
- Handling of **large dynamic datasets**  
- Translating **scientific models into working software**

---

## 🚀 Why This Matters

- Uses **real-time satellite data**  
- Applies **accurate physics calculations**  
- Provides meaningful, **interactive results**  

> Not just a demo: a functional orbital tracking system built for real-world applications.

---

## 📄 Final Note

This README explains clearly:

- What the system does  
- How it works internally  
- What technical skills were applied  

This project reflects my approach:  
**Understand the science → implement the math → build the system.**

---

## 🔗 References

- [CelesTrak TLE Data](https://www.celestrak.com/NORAD/elements/)  
- [Satellite.js Documentation](https://github.com/shashwatak/satellite-js)  
- [CesiumJS Documentation](https://cesium.com/docs/)
