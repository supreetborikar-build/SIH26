# AeroTwin 3D 🚁

### Single-Pass Drone Video to Accurate 3D Model Generation System

> **Smart India Hackathon 2026 — SIH26158**
> **Track:** Software
> **Theme:** Robotics & Drones
> **Sponsor:** National Technical Research Organisation (NTRO)

---

## 🚀 Overview

**AeroTwin 3D** is an AI-assisted aerial mapping and 3D intelligence platform designed to transform a **single continuous drone flight** into a georeferenced, metrically useful 3D representation of the captured environment.

The system is designed around the central challenge of **single-pass aerial reconstruction**: obtaining useful 3D information when multiple planned drone passes, extensive ground-control points, or repeated capture opportunities may not be available.

The intended pipeline is:

```text
Drone Video + Flight Metadata
              │
              ▼
      Intelligent Frame Selection
              │
              ▼
       Image Quality Analysis
              │
              ▼
       Feature Detection
              │
              ▼
        Feature Matching
              │
              ▼
       Structure-from-Motion
              │
              ▼
        Camera Trajectory
              │
              ▼
       Sparse 3D Reconstruction
              │
              ▼
       Dense Reconstruction
              │
              ▼
         Dense Point Cloud
              │
              ▼
        Mesh Reconstruction
              │
              ▼
         Texture Mapping
              │
              ▼
       GPS / Sensor Fusion
              │
              ▼
       Georeferenced 3D Model
              │
              ▼
      AI Analysis & Inspection
              │
              ▼
       Interactive 3D Intelligence
```

The project is intended to support **rapid mapping, infrastructure inspection, disaster assessment, measurement, spatial analysis and digital-twin-style visualization**.

---

# 🎯 Problem Statement

Traditional photogrammetry and 3D reconstruction workflows often benefit from:

* Multiple flight passes
* Carefully planned viewpoints
* High image overlap
* Ground control points
* Extensive post-processing

However, certain operational environments may provide only **one opportunity to capture the target area**.

SIH26158 focuses on generating a useful 3D representation from a **single continuous drone video pass**, while incorporating available positioning and flight information.

The system is expected to handle environments containing:

* Terrain
* Buildings
* Roads
* Infrastructure
* Vegetation
* Obstacles
* Structures and objects

and produce 3D representations suitable for:

* Visualization
* Measurement
* Inspection
* Spatial analysis

---

# 💡 Our Approach

AeroTwin 3D treats the problem as an **end-to-end aerial intelligence pipeline**, rather than simply converting a video into a 3D model.

The platform combines:

### Computer Vision

* Frame analysis
* Feature extraction
* Feature matching
* Camera pose estimation
* Structure-from-Motion
* Dense reconstruction

### 3D Vision

* Sparse point clouds
* Dense point clouds
* Mesh reconstruction
* Texture mapping
* 3D visualization

### Geospatial Processing

* GPS integration
* Coordinate systems
* Georeferencing
* Metric scaling
* Spatial measurements

### AI / ML

* Object detection
* Semantic segmentation
* Dynamic-object removal
* Monocular depth estimation
* Anomaly and damage analysis
* Reconstruction confidence estimation

---

# 🖥️ Current Application

The current frontend is an interactive aerial intelligence interface built around a cinematic technical visualization experience.

It provides the visual and interaction layer for the complete reconstruction workflow.

### Current frontend capabilities include:

* Interactive landing experience
* Drone-to-3D transformation visualization
* Reconstruction pipeline visualization
* SfM visualization
* Sensor-fusion console
* Interactive Three.js 3D environment
* Point-cloud visualization
* Multiple visualization modes
* Camera/trajectory visualization
* Measurement interface
* AI intelligence interface
* Application scenarios
* Technical architecture visualization
* Reconstruction/demo console
* Responsive navigation and UI
* Reduced-motion support
* Telemetry-oriented interface elements

---

# 🧩 Project Structure

```text
SIH26/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── typescript.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   │
│   │   ├── ai-layer/
│   │   │   └── AiIntelligence.tsx
│   │   │
│   │   ├── applications/
│   │   │   └── ApplicationsSection.tsx
│   │   │
│   │   ├── architecture/
│   │   │   └── PipelineArchitecture.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── AerospaceCursor.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ShortcutsModal.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── cv-pipeline/
│   │   │   ├── SensorFusionConsole.tsx
│   │   │   └── SfmVisualizer.tsx
│   │   │
│   │   ├── demo/
│   │   │   └── DemoSimulator.tsx
│   │   │
│   │   ├── footer/
│   │   │   └── FooterSection.tsx
│   │   │
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   └── HeroTransformation.tsx
│   │   │
│   │   ├── problem/
│   │   │   └── ProblemSection.tsx
│   │   │
│   │   ├── tech-specs/
│   │   │   └── TechnicalCredibility.tsx
│   │   │
│   │   └── viewer-3d/
│   │       ├── ThreeCanvas.tsx
│   │       └── ViewerSection.tsx
│   │
│   ├── data/
│   │   └── datasets.ts
│   │
│   ├── hooks/
│   │   ├── useFlightTelemetry.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── types/
│   │   └── aerial.ts
│   │
│   ├── utils/
│   │   └── audioTelemetry.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| React        | Application UI                     |
| TypeScript   | Type-safe development              |
| Vite         | Development/build tooling          |
| Three.js     | 3D visualization                   |
| GSAP         | Motion and scroll-driven animation |
| Lucide React | Interface icons                    |
| Tailwind CSS | Styling                            |

## Planned / Target Backend

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Python     | CV/ML orchestration          |
| FastAPI    | Backend API                  |
| OpenCV     | Image/video processing       |
| COLMAP     | SfM / photogrammetry         |
| Open3D     | Point clouds and 3D geometry |
| FFmpeg     | Video processing             |
| NumPy      | Numerical processing         |
| SciPy      | Scientific computation       |
| PyTorch    | AI/ML models                 |

---

# 🧠 Core Reconstruction Pipeline

## 1. Video Ingestion

The system receives a continuous drone video together with available flight metadata.

Expected inputs include:

```text
Drone Video
GPS Coordinates
Flight Metadata
```

Optional sensor information may include:

```text
IMU
Barometric Altitude
Camera Intrinsics
RTK / PPK Corrections
```

---

## 2. Intelligent Frame Selection

Instead of processing every video frame, the system analyzes candidate frames and selects those that provide useful visual information.

Potential criteria include:

* Blur
* Exposure
* Redundancy
* Motion
* Scene change
* Viewpoint diversity
* Visual overlap

This reduces unnecessary computation while retaining useful observations.

---

## 3. Feature Detection

Stable visual features are detected across selected frames.

A baseline implementation can use:

**SIFT**

Learned feature extractors can later be added for difficult viewpoint or illumination conditions.

---

## 4. Feature Matching

Features are matched between overlapping frames.

Geometric verification is then used to reject unreliable correspondences.

Useful metrics include:

* Matches
* Verified matches
* Inliers
* Inlier ratio

---

## 5. Structure-from-Motion

The verified image correspondences are used to recover:

* Camera positions
* Camera orientations
* Sparse 3D structure

A mature SfM implementation such as **COLMAP** can be integrated rather than rebuilding a complete photogrammetry engine from scratch.

---

## 6. Sparse Reconstruction

The SfM stage produces a sparse representation of the captured environment.

Outputs can include:

```text
Camera trajectory
Camera poses
Sparse point cloud
Reconstruction statistics
```

---

## 7. Dense Reconstruction

Where sufficient visual overlap exists, multi-view reconstruction can be used to generate denser geometry.

The intended flow is:

```text
Camera poses
     ↓
Multi-view depth estimation
     ↓
Depth maps
     ↓
Dense point cloud
```

---

## 8. Mesh Reconstruction

The dense geometry can be converted into a surface representation.

Possible techniques include:

* Poisson reconstruction
* Ball-pivoting reconstruction
* Normal estimation
* Outlier removal

---

## 9. Texture Mapping

Source imagery can be projected onto the reconstructed surface to produce a visually realistic textured model.

---

# 🌍 Georeferencing

The system is designed to combine visual reconstruction with available geographic information.

Potential inputs:

* GPS
* IMU
* Altitude
* RTK
* PPK

The resulting model can then be aligned with a geographic coordinate reference system where the available data supports it.

The system should distinguish between:

**Visual reconstruction**

and

**Validated geospatial accuracy**.

Accuracy should never be claimed without appropriate reference data.

---

# 📏 Measurement

AeroTwin 3D is designed to provide measurements directly inside the 3D environment.

Supported measurement concepts include:

### Distance

```text
Point A ───────── Point B
             ↓
          Distance
```

### Height

```text
Ground
  │
  │
  │ Height
  │
  ● Selected point
```

### Area

A polygon can be used to estimate surface area where the reconstructed geometry supports reliable measurement.

All measurements should include appropriate accuracy limitations when ground truth is unavailable.

---

# 🤖 AI Intelligence Layer

AI is treated as a functional part of the system rather than a marketing layer.

Potential modules include:

### Object Detection

Identify objects relevant to inspection and mapping.

### Semantic Segmentation

Separate classes such as:

* Buildings
* Roads
* Vegetation
* Water
* Vehicles
* Structures

### Dynamic Object Removal

Mask moving objects such as:

* People
* Vehicles
* Animals

before they contaminate reconstruction.

### Depth Estimation

Monocular depth models can provide depth priors in areas where geometric constraints are weak.

### Damage / Anomaly Detection

Potential applications include:

* Cracks
* Missing components
* Structural anomalies
* Surface damage

### Confidence Mapping

The system can communicate which parts of a reconstruction are:

```text
HIGH CONFIDENCE
MEDIUM CONFIDENCE
LOW CONFIDENCE
INSUFFICIENT OBSERVATION
```

This is particularly important for single-pass reconstruction because not every surface can necessarily be observed.

---

# 🗺️ Target Applications

## Disaster Assessment

Rapidly reconstruct areas affected by:

* Floods
* Earthquakes
* Landslides
* Infrastructure damage

---

## Infrastructure Inspection

Create 3D records of:

* Bridges
* Buildings
* Industrial facilities
* Roads
* Other structures

---

## Construction Monitoring

Compare repeated aerial surveys to monitor construction progress.

---

## Urban Planning

Use aerial 3D representations for:

* Spatial visualization
* Asset mapping
* Planning

---

## Rapid Mapping

Generate useful spatial information when repeat flights or extensive ground surveys are impractical.

---

## Digital Twins

The reconstructed 3D environment can serve as the spatial layer of a broader asset-management system.

---

# 🎮 3D Viewer

The project uses **Three.js** for browser-based 3D visualization.

The viewer is designed to support:

* Orbit controls
* Zoom
* Pan
* Point-cloud visualization
* Mesh visualization
* Wireframe mode
* Elevation visualization
* Camera trajectory
* Measurement tools
* Segmentation visualization
* Nadir view
* Model inspection

The viewer architecture is intended to support both:

### Demo Geometry

Predefined/procedurally generated scenes used for UI demonstration and development.

### Real Reconstruction

Actual point clouds and meshes produced by the reconstruction backend.

These two modes should remain clearly distinguishable.

---

# 🧪 Current Development Status

## Frontend

**Highly developed prototype**

The frontend currently provides the visual and interaction framework for the complete product.

## 3D Visualization

**Functional**

Three.js-based interactive visualization and measurement functionality are implemented.

## Reconstruction Engine

**Under active development**

The target implementation requires integration of real:

* Video processing
* Frame selection
* Feature extraction
* Feature matching
* SfM
* Dense reconstruction
* Mesh generation

## Geospatial Layer

**Planned / under development**

GPS and flight metadata integration will be connected to the reconstruction pipeline.

## AI Layer

**Architecture / interface stage**

AI modules are designed as modular components to be integrated after the core reconstruction pipeline is stable.

---

# 📈 Development Roadmap

## Phase 1 — Feasibility

* [ ] Real drone video ingestion
* [ ] Video metadata extraction
* [ ] Frame extraction
* [ ] Frame quality analysis
* [ ] Keyframe selection

## Phase 2 — Computer Vision

* [ ] SIFT / learned feature extraction
* [ ] Feature matching
* [ ] Geometric verification
* [ ] Camera pose estimation

## Phase 3 — SfM

* [ ] COLMAP integration
* [ ] Camera trajectory
* [ ] Bundle adjustment
* [ ] Sparse point cloud

## Phase 4 — Dense 3D

* [ ] Dense reconstruction
* [ ] Dense point cloud
* [ ] Outlier filtering
* [ ] Surface reconstruction
* [ ] Mesh generation

## Phase 5 — Geospatial Accuracy

* [ ] GPS ingestion
* [ ] Flight metadata parsing
* [ ] Coordinate transformation
* [ ] Georeferencing
* [ ] Metric scale validation
* [ ] Accuracy reporting

## Phase 6 — Product Integration

* [ ] FastAPI backend
* [ ] Reconstruction job system
* [ ] Progress streaming
* [ ] Frontend/backend integration
* [ ] Real model loading
* [ ] Real measurements

## Phase 7 — AI Intelligence

* [ ] Dynamic-object detection
* [ ] Semantic segmentation
* [ ] Object detection
* [ ] Depth estimation
* [ ] Confidence mapping

## Phase 8 — Advanced Intelligence

* [ ] Change detection
* [ ] Infrastructure inspection
* [ ] Damage/anomaly detection
* [ ] Automated reports
* [ ] Digital-twin metadata

---

# 📊 Evaluation Metrics

The system should be evaluated using measurable technical metrics rather than visual quality alone.

### Reconstruction

* Reconstruction completeness
* Point-cloud density
* Outlier rate
* Mesh quality
* Texture quality

### Camera Estimation

* Camera trajectory consistency
* Pose estimation quality

### Geospatial

* Georeferencing error
* Scale error
* Position error

### Measurement

* Distance error
* Height error
* Area error

### Performance

* Processing time per minute of video
* CPU utilization
* GPU utilization
* Memory usage

### Robustness

Evaluate performance under:

* Motion blur
* Compression
* Lighting changes
* Dynamic objects
* Limited overlap

### AI

Where AI modules are implemented:

* Precision
* Recall
* Detection accuracy
* Segmentation quality

---

# ⚠️ Known Challenges

Single-pass reconstruction introduces several difficult conditions:

### Limited viewing angles

Some surfaces may never be visible from the flight path.

### Motion blur

Fast UAV movement can reduce feature quality.

### Compression

Drone videos may contain significant compression artifacts.

### Illumination

Lighting and shadows may change throughout the flight.

### Dynamic objects

Vehicles and people can introduce reconstruction artifacts.

### GPS noise

Standard GPS may not provide sufficient precision for highly accurate georeferencing.

### Occlusions

Hidden surfaces cannot always be recovered reliably.

### Computational cost

Dense reconstruction can require substantial CPU/GPU resources.

---

# 🛡️ Accuracy Philosophy

AeroTwin 3D follows an important principle:

> **Do not invent geometry and do not claim accuracy that has not been measured.**

When reconstruction evidence is weak, the system should communicate uncertainty rather than presenting estimated geometry as ground truth.

Where reference measurements, GCPs, RTK or other ground truth are available, errors should be reported explicitly.

---

# 🖥️ Local Development

## Requirements

### Frontend

* Node.js
* npm

### Recommended reconstruction environment

* Python 3.x
* FastAPI
* OpenCV
* Open3D
* FFmpeg
* COLMAP
* Optional NVIDIA GPU + CUDA for accelerated processing

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

The Vite development server will provide the local application URL.

---

## Production Build

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# 🔌 Planned Backend API

The target backend architecture will expose endpoints similar to:

```text
POST   /api/projects
POST   /api/projects/{id}/upload
POST   /api/projects/{id}/reconstruct

GET    /api/jobs/{id}
GET    /api/jobs/{id}/status
GET    /api/jobs/{id}/results

GET    /api/models/{id}
GET    /api/pointclouds/{id}

GET    /api/measurements/{id}
```

Real endpoint names may evolve as the backend implementation develops.

---

# 📂 Reconstruction Job Structure

A typical reconstruction job is expected to follow a structure similar to:

```text
jobs/
└── <job_id>/
    ├── input/
    │   ├── video.mp4
    │   ├── metadata.json
    │   └── gps.csv
    │
    ├── frames/
    ├── keyframes/
    ├── features/
    ├── sfm/
    ├── dense/
    ├── pointcloud/
    ├── mesh/
    ├── textures/
    └── reports/
```

---

# 🎬 Recommended Demonstration Flow

The intended SIH demonstration is:

```text
1. Select / upload a drone video
              ↓
2. Display video metadata
              ↓
3. Extract frames
              ↓
4. Filter low-quality frames
              ↓
5. Select keyframes
              ↓
6. Extract features
              ↓
7. Match features
              ↓
8. Recover camera trajectory
              ↓
9. Generate sparse point cloud
              ↓
10. Generate dense reconstruction
              ↓
11. Generate mesh
              ↓
12. Apply texture
              ↓
13. Georeference
              ↓
14. Open interactive 3D viewer
              ↓
15. Measure distance / height / area
              ↓
16. Display reconstruction confidence
              ↓
17. Run optional AI analysis
```

The objective is to make the transformation visually obvious:

> **ONE DRONE PASS → ONE USABLE 3D REPRESENTATION**

---

# 🏗️ Design Philosophy

AeroTwin 3D is intentionally designed as more than a conventional web application.

The interface follows a **mission-control / aerospace visualization aesthetic**, using motion, spatial visualization and 3D interaction to communicate complex computer-vision processes.

The design emphasizes:

* Technical credibility
* Visual storytelling
* Real-time feedback
* Spatial understanding
* Progressive disclosure
* Interactive 3D analysis

The interface should remain visually sophisticated while the underlying reconstruction engine becomes progressively more technically complete.

---

# 🔭 Future Vision

The long-term objective is to evolve AeroTwin 3D into a complete aerial intelligence platform capable of:

```text
Drone Capture
      ↓
Automated Reconstruction
      ↓
Geospatial Alignment
      ↓
3D Digital Twin
      ↓
AI Scene Understanding
      ↓
Inspection
      ↓
Measurement
      ↓
Change Detection
      ↓
Decision Support
```

This could enable rapid aerial intelligence for infrastructure, disaster response, construction, mapping and strategic situational awareness.

---

# 👥 Team

**Smart India Hackathon 2026**

**Problem Statement:** SIH26158

**Project:** AeroTwin 3D

---

# 📜 Problem Statement Reference

The system architecture and requirements are based on the SIH26158 problem statement:

**Single-Pass Drone Video to Accurate 3D Model Generation System**

The core requirement is to reconstruct a georeferenced and metrically useful 3D representation from a single continuous drone flight/video pass, including terrain, structures, infrastructure and other scene elements.

---

# ⚠️ Disclaimer

AeroTwin 3D is an active research and development project.

Reconstruction quality and metric accuracy depend on:

* Video quality
* Camera characteristics
* Flight trajectory
* Image overlap
* Lighting
* GPS quality
* Available sensor data
* Scene complexity
* Reconstruction algorithms

No absolute accuracy should be assumed without appropriate validation against ground truth.

---

## 🚁 AeroTwin 3D

### **One flight. One pass. One 3D world.**
