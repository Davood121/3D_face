import cv2
import mediapipe as mp
import json
import time

print("Initializing Face Capture...")
print("Please look at the camera with a NEUTRAL expression.")
print("Capturing in 3 seconds...")
time.sleep(1)
print("2...")
time.sleep(1)
print("1...")
time.sleep(1)

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

cap = cv2.VideoCapture(0)
ret, frame = cap.read()

if ret:
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)
    
    if results.multi_face_landmarks:
        landmarks = []
        for lm in results.multi_face_landmarks[0].landmark:
            landmarks.append([lm.x, lm.y, lm.z])
            
        with open('backend/base_face.json', 'w') as f:
            json.dump(landmarks, f)
            
        print("SUCCESS: Base face captured and saved to 'backend/base_face.json'")
    else:
        print("ERROR: No face detected. Please try again.")
else:
    print("ERROR: Could not read from camera.")

cap.release()
