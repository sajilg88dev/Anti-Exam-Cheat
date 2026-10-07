<div align="center">

# 🛡️ Edge Proctor

### Browser-Based AI Exam Proctoring · Zero Server · 100% Edge Inference

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks--Vision-00897B?logo=google&logoColor=white&style=for-the-badge)](https://ai.google.dev/edge/mediapipe)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)](LICENSE)

<br/>

**A production-grade AI proctoring prototype that runs entirely in the browser.**  
No backend. No API keys. No data ever leaves your device.

<br/>

[**🚀 Live Demo**](#) · [**📖 Features**](#-features) · [**🧠 How It Works**](#-how-it-works) · [**⚙️ Setup**](#️-getting-started)

<br/>

</div>

---

## ✨ Features

| Feature | Detail |
|---|---|
| 👥 **Multi-Face Detection** | Detects 1–4 faces per frame. Triggers a real-time alert whenever more than one face enters the frame. |
| 👁️ **Gaze & Attention Tracking** | Analyses 478 facial landmarks to compute head yaw and pitch. Flags when the user looks away from the screen. |
| ⏱️ **5-Second Alert Threshold** | Only triggers a violation after **5 uninterrupted seconds** of looking away — eliminating false positives from brief glances. |
| 🧠 **5-Frame Smoothing** | Gaze state transitions require 5 consecutive frames to agree, preventing jitter on noisy single frames. |
| ⚡ **100% Edge Inference** | All AI runs via WebAssembly + WebGL directly in the browser at ~**15 FPS**. Zero data sent to any server. |
| 📋 **Session Event Log** | Every state change — face events, gaze changes, alerts — is timestamped and added to a live event log. |
| 📊 **Live Metrics Dashboard** | Violation counters, longest look-away streak, session duration timer, and face count — all updated in real time. |
| 🎨 **Premium Dark UI** | Full-page landing dashboard + monitoring view with glassmorphism, gradient accents, and micro-animations. |

---

## 🧠 How It Works

```
Browser Tab
│
├── useWebcam.js
│     └─ getUserMedia() → attaches stream to <video> element
│
├── faceLandmarkerService.js  
│     └─ Loads MediaPipe FaceLandmarker WASM + float16 model (~5 MB, cached)
│         └─ detectForVideo() runs on every animation frame
│
└── useProctoringEngine.js  ← State Machine
      ├── requestAnimationFrame loop @ ~15 FPS
      ├── Face count   → FACE_STATUS (no_face / one_face / multiple_faces)
      ├── Head orientation (yaw + pitch from landmarks)
      │     └─ 5-frame smoothing window → GAZE_STATUS
      ├── 5-second look-away timer → violation alert
      └── Event log + summary metrics → UI
```

**Gaze detection** is based on the geometric ratio between key facial landmarks (nose bridge, eye corners, chin). No ML model is used for gaze itself — it uses pure landmark math, making it fast, lightweight, and interpretable.

---

## 🏗️ Project Architecture

```
src/
├── App.jsx                          # Root — page routing (landing ↔ monitor)
│
├── components/
│   ├── LandingPage/                 # Full landing dashboard with features, steps, tech stack
│   ├── WebcamPanel/                 # Live video feed + canvas debug overlay
│   ├── StatusPanel/                 # Camera / face / gaze / alert status rows
│   ├── AlertPanel/                  # Active violation alerts
│   ├── SessionSummary/              # Session metrics grid
│   └── EventLog/                    # Scrollable timestamped event log
│
├── hooks/
│   ├── useWebcam.js                 # Camera access, stream lifecycle, cleanup
│   ├── useProctoringEngine.js       # Main state machine + detection loop
│   └── useSessionTimer.js           # Elapsed time with formatted output
│
├── services/
│   └── mediapipe/
│       └── faceLandmarkerService.js # MediaPipe init, detectForVideo wrapper
│
├── utils/
│   ├── constants.js                 # All thresholds + enums in one place
│   ├── faceUtils.js                 # Face bounding box extraction
│   ├── gazeUtils.js                 # Head orientation math from landmarks
│   ├── eventLogger.js               # Typed event creation helpers
│   └── timerUtils.js                # Time formatting utilities
│
└── styles/
    └── globals.css                  # Design tokens, layout, global utilities
```

---

## ⚙️ Getting Started

This project uses **MediaPipe Tasks Vision** because it offers a practical balance of:

- **Node.js** v18 or higher
- A modern browser with **WebAssembly** + **WebGL** support (Chrome / Edge / Firefox)
- A working **webcam**

### Installation

```bash
# 1. Clone the repository
git clone 
cd 

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

> **First run note:** The MediaPipe model (~5 MB) is downloaded on first use and cached by the browser. Subsequent starts are instant.

### Build for Production

```bash
npm run build
```

Output is in `dist/` — a fully static bundle with no server requirements. Deploy to Vercel, Netlify, GitHub Pages, or any CDN.

---

## 🔧 Configuration

All detection thresholds are centralized in [`src/utils/constants.js`](src/utils/constants.js) — no digging through component code.

```js
// Gaze sensitivity (landmark-based ratios)
YAW_THRESHOLD:  0.28   // How far left/right counts as "looking away"
PITCH_THRESHOLD: 0.22  // How far up/down counts as "looking away"

// Alert timing
AWAY_ALERT_THRESHOLD_S: 5  // Seconds of continuous look-away before violation

// Smoothing
SMOOTHING_WINDOW: 5     // Frames that must agree before gaze state flips

// Performance
FRAME_INTERVAL_MS: 66   // ~15 FPS detection loop
MAX_FACES: 4            // Maximum faces tracked simultaneously
```

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | React 18 | Component tree, state, hooks |
| **Build Tool** | Vite 6 | Dev server, HMR, optimized bundles |
| **AI / Vision** | MediaPipe Tasks-Vision | Face landmarking — 478 points per face |
| **Runtime** | WebAssembly + WebGL | In-browser GPU-accelerated inference |
| **Styling** | Vanilla CSS | Custom design system, no external UI lib |
| **Language** | JavaScript (ES2024) | No TypeScript overhead for this POC |

---

## 🚦 Detection States

### Face Status
| State | Meaning | UI |
|---|---|---|
| `one_face` | Exactly one face detected ✅ | Green indicator |
| `no_face` | No face in frame | Orange "No Face Detected" badge |
| `multiple_faces` | 2+ faces detected | Red "N Faces Detected" badge |

### Gaze Status
| State | Trigger | Alert |
|---|---|---|
| `looking_at_screen` | Head within yaw/pitch thresholds | — |
| `look_away_started` | Head outside thresholds for 1+ frames | Warning badge |
| `looking_away_alert` | Continuous look-away ≥ 5 seconds | Violation logged |

---

## 📸 Screenshots

> The app has two main views:

**Landing Dashboard** — overview of all project features, how it works, and tech stack with a "Launch Monitor" CTA.

**Monitoring Dashboard** — live webcam feed with debug overlay (face bounding boxes + gaze direction arrow), real-time status panel, active alerts, session metrics, and event log.

---

## 🔒 Privacy

> **All processing is 100% local.**

- The webcam stream **never leaves your browser tab**.
- No frames, images, or metadata are sent to any server.
- No analytics, no tracking, no cookies.
- The MediaPipe model is loaded from Google's CDN once and cached in the browser.



<div align="center">

</div>
