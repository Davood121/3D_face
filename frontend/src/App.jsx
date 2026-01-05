import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HologramFace } from './components/HologramFace';
import io from 'socket.io-client';
import './App.css';

// Connect to backend
const socket = io('http://localhost:8000');

function App() {
  const [emotion, setEmotion] = useState('NEUTRAL');

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 60, near: 0.1, far: 1000 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={['#000']} />
        <fog attach="fog" args={['#000', 2, 10]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <gridHelper args={[20, 20, '#111', '#050505']} position={[0, -2, 0]} />

        <Suspense fallback={null}>
          <HologramFace onEmotion={setEmotion} />
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
            intensity={2}
          />
        </EffectComposer>

        <OrbitControls enablePan={false} />
      </Canvas>

      <div className="overlay">
        <h1>NEON HOLOGRAM</h1>
        <p>System Active. Tracking Face...</p>

        <h2 style={{ color: emotion === 'HAPPY' ? 'yellow' : emotion === 'SURPRISE' ? 'orange' : 'cyan' }}>
          MOOD: {emotion}
        </h2>
      </div>
    </div>
  );
}

export default App;
