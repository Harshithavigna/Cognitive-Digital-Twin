<<<<<<< HEAD
# Cognitive Digital Twin: Learning Orchestrator (v2.2)

An AI-driven "Cognitive Digital Twin" designed to proactively manage student learning by detecting cognitive fatigue, knowledge decay, and learning plateaus. The system provides real-time interventions, including adaptive quizzes and mandatory recovery breaks, visualized through a futuristic dashboard.

## 🚀 Key Features

- **Real-Time Cognitive Telemetry**: Live tracking of retention probability, fatigue levels, and mastery scores via WebSockets.
- **Doubt Engine**: A conversational AI interface for resolving conceptual queries with step-by-step analytical breakdowns.
- **Theater Mode UI Isolation**: A premium UX feature that hides background distractions during critical interventions (Quizzes/Breaks).
- **Adaptive Intervention Engine**:
  - **Neural Flush**: Mandatory breaks triggered by high fatigue thresholds.
  - **Plateau Buster**: Modality shifts (Active Recall) when learning velocity stagnates.
  - **Mastery Mock Tests**: Automated assessment generation upon topic completion.
- **Futuristic Aesthetics**: High-end glassmorphism design with scanline effects and premium typography (Outfit & Space Grotesk).

## 🛠️ Tech Stack

### Backend (The Neural Core)
- **FastAPI**: Asynchronous Python web framework for low-latency WebSocket streaming.
- **Pydantic**: Robust data validation for student signal telemetry.
- **Uvicorn**: High-performance ASGI server.

### Frontend (The Digital Twin Interface)
- **React**: Component-based UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS for premium futuristic styling.
- **Framer Motion**: Advanced animation system for the "Theater Mode" and smooth transitions.
- **Lucide React**: Vector icons for the tech-centric aesthetic.
- **Recharts**: Responsive data visualization.

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*The server will run on `http://localhost:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:5173`*

## 🧠 AI/ML Logic & Implementation

The project implements a **Closed-Loop Pedagogical System**:
1. **Signal Generation**: A simulator mimics student behavior (fatigue accumulation, retention decay).
2. **Signal processing**: The `OrchestratorEngine` applies threshold-based classifiers to the signal vector.
3. **Action Execution**: The system triggers UI-level interventions (Theater Mode) to re-engage the student.

*For a detailed technical dive, refer to `brain/project_presentation.md` (if available).*

## 📄 License
This project is for educational and demonstration purposes as part of an AI/ML Engineering portfolio.
=======
# Cognitive-Digital-Twin
>>>>>>> eaebbb9c98481d9a04b634a2ac07ffa22cc80e66
