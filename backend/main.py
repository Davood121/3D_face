import cv2
import mediapipe as mp
import socketio
from aiohttp import web
import math

# Initialize Socket.IO server
sio = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

# Initialize MediaPipe Face Landmarker
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def detect_emotion(landmarks):
    upper_lip = landmarks[13]
    lower_lip = landmarks[14]
    left_corner = landmarks[61]
    right_corner = landmarks[291]
    
    mouth_open = abs(upper_lip.y - lower_lip.y)
    mouth_width = abs(left_corner.x - right_corner.x)
    
    if mouth_open > 0.05:
        return "SURPRISE"
    elif mouth_width > 0.15 and mouth_open < 0.03: 
        return "HAPPY"
    else:
        return "NEUTRAL"

async def video_loop():
    cap = cv2.VideoCapture(0)
    print("Camera started...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        results = face_mesh.process(rgb_frame)
        
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks_list = []
                for lm in face_landmarks.landmark:
                    landmarks_list.append([lm.x, lm.y, lm.z])
                
                emotion = detect_emotion(face_landmarks.landmark)
                
                await sio.emit('face_data', {'landmarks': landmarks_list, 'emotion': emotion})
        
        await sio.sleep(0.03)

    cap.release()
    cv2.destroyAllWindows()

async def start_background_tasks(app):
    sio.start_background_task(video_loop)

app.on_startup.append(start_background_tasks)

if __name__ == '__main__':
    print("Starting server on port 8000...")
    web.run_app(app, port=8000)
