# 3D AI Face Tracking & Hologram

A real-time 3D face tracking application that detects facial landmarks and emotions using Python/MediaPipe and renders a holographic visualization in the browser using React Three Fiber.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **Real-time Face Tracking**: High-precision 478-point face landmark detection using MediaPipe.
- **Emotion Recognition**: Detects facial expressions to classify emotions (Happy, Surprise, Neutral).
- **Holographic Visualization**: Renders a 3D digital twin of the face with neon aesthetics.
- **Interactive UI**: Dynamic lighting and post-processing bloom effects.
- [Low Latency]: WebSocket communication for smooth real-time performance.

## Demo

![Demo Placeholder](https://via.placeholder.com/800x450?text=Demo+Video+Coming+Soon)

*Watch the hologram react to facial expressions in real-time!*


## Tech Stack

### Backend
- **Python 3.x**
- **MediaPipe**: For ML-based face solution.
- **OpenCV**: For video capture and image processing.
- **AIOHTTP & Python-SocketIO**: For async web server and real-time communication.

### Frontend
- **React 19**: UI framework.
- **Vite**: Build tool and dev server.
- **Three.js & React Three Fiber**: For 3D rendering.
- **React Three Postprocessing**: For visual effects (Bloom).
- **Socket.io-client**: For connecting to the backend.

## Installation

### Prerequisites
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the backend server:
```bash
python main.py
```
*The server will start on `http://localhost:8000` and look for a camera.*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*Open the provided local URL (usually `http://localhost:5173`) in your browser to see the application.*

## Usage

1. Ensure your webcam is connected.
2. Start the backend server first.
3. Start the frontend server.
4. Allow camera access if prompted (though the backend handles the camera feed accessing, the browser page visualizes the data).
5. Move your face in front of the camera to see the 3D hologram mimic your movements in real-time.
6. Try smiling or opening your mouth to see the emotion detection change the color theme!

## Roadmap

- [ ] 📱 **Mobile Support**: Optimize for mobile browsers and cameras.
- [ ] 🎭 **More Emotions**: Add support for Anger, Sadness, and Fear.
- [ ] 👤 **Custom Avatars**: Allow users to upload or generate their own 3D models.
- [ ] 🥽 **VR Integration**: WebXR support for immersive experience.
- [ ] 🤖 **Voice Interaction**: Integrate LLMs for the avatar to speak back.

## Project Structure

```
3D_Ai face/
├── backend/            # Python backend (Computer Vision)
│   ├── main.py         # Main server and CV logic
│   └── requirements.txt
├── frontend/           # React frontend (3D Visualization)
│   ├── src/
│   │   ├── components/
│   │   │   └── HologramFace.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License.
