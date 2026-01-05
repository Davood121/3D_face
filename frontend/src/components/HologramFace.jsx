import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import io from 'socket.io-client';
import connections from '../connections.json';

// Connect to the backend
const socket = io('http://localhost:8000');

const NUM_POINTS = 478;

export function HologramFace({ onEmotion, audioVolume = 0 }) {
    const [faceData, setFaceData] = useState(null);

    // Refs for geometries
    const cyanGeoRef = useRef();
    const redGeoRef = useRef();

    // Prepare indices for lines
    const { cyanIndices, redIndices } = useMemo(() => {
        // Tesselation -> Cyan (Main face structure)
        const cyanIndices = [];
        connections.tesselation.forEach(([a, b]) => {
            cyanIndices.push(a, b);
        });

        // Contours + Irises -> Red (Eyes, Lips, Face Oval)
        const redIndices = [];
        connections.contours.forEach(([a, b]) => {
            redIndices.push(a, b);
        });
        connections.irises.forEach(([a, b]) => {
            redIndices.push(a, b);
        });

        return { cyanIndices, redIndices };
    }, []);

    // Initialize positions (shared buffer)
    const positions = useMemo(() => {
        return new Float32Array(NUM_POINTS * 3);
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to backend');
        });

        socket.on('face_data', (data) => {
            setFaceData(data);
            if (data.emotion && onEmotion) {
                onEmotion(data.emotion);
            }
        });

        return () => {
            socket.off('connect');
            socket.off('face_data');
        };
    }, []);

    useFrame((state) => {
        if (!faceData) return;

        const { landmarks } = faceData;

        // Update the shared positions array
        for (let i = 0; i < landmarks.length; i++) {
            if (i >= NUM_POINTS) break;
            const lm = landmarks[i];

            // Scale and center
            let x = -(lm[0] - 0.5) * 3;
            let y = -(lm[1] - 0.5) * 3;
            let z = -lm[2] * 3;

            // LIP SYNC LOGIC - REFINED
            // Upper Lip Center: 13
            // Lower Lip Center: 14
            // Mouth Corners: 61, 291

            // We want to open the mouth by moving lips apart.
            // In our 3D space (y inverted):
            // - Moving UP means INCREASING y (because y = -(lm.y - 0.5) * 3)
            //   Wait, let's re-verify: 
            //   lm.y increases downwards (0 top, 1 bottom).
            //   y = -(lm.y - 0.5) * 3.
            //   If lm.y increases (moves down), (lm.y - 0.5) increases, so -(...) decreases.
            //   So y DECREASES as we go DOWN.

            // To Open Mouth:
            // Upper Lip (13) needs to go UP (Increase y)
            // Lower Lip (14) needs to go DOWN (Decrease y)

            // Simple distance check from center y (approx 0)
            // Or just use the y-coordinate directly.

            // Apply to points near the mouth center
            // Upper Lip Area (y approx -0.02 to 0.05)
            if (y > -0.05 && y < 0.1) {
                // Determine if it's upper or lower lip based on index or position relative to mouth center
                // Since we don't have easy index access inside this loop without a map, 
                // we'll use a spatial heuristic.

                // Center of mouth is roughly y = -0.15 (based on previous observation)
                // Let's assume a split point.

                if (y > -0.12) { // Upper Lip / Nose area
                    y += audioVolume * 0.1; // Move UP
                } else { // Lower Lip / Jaw area
                    y -= audioVolume * 0.2; // Move DOWN
                }
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        // Update both geometries
        if (cyanGeoRef.current) {
            cyanGeoRef.current.attributes.position.needsUpdate = true;
        }
        if (redGeoRef.current) {
            redGeoRef.current.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Cyan Mesh (Tesselation) */}
            <lineSegments>
                <bufferGeometry ref={cyanGeoRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={NUM_POINTS}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="index"
                        count={cyanIndices.length}
                        array={new Uint16Array(cyanIndices)}
                        itemSize={1}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#00ffff" transparent opacity={0.3} linewidth={1} />
            </lineSegments>

            {/* Red Mesh (Contours - Eyes, Lips) */}
            <lineSegments>
                <bufferGeometry ref={redGeoRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={NUM_POINTS}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="index"
                        count={redIndices.length}
                        array={new Uint16Array(redIndices)}
                        itemSize={1}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#ff0000" transparent opacity={1} linewidth={2} />
            </lineSegments>
        </group>
    );
}
