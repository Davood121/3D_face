import mediapipe as mp
import json

mp_face_mesh = mp.solutions.face_mesh

tesselation = mp_face_mesh.FACEMESH_TESSELATION
contours = mp_face_mesh.FACEMESH_CONTOURS
irises = mp_face_mesh.FACEMESH_IRISES

tesselation_list = list(tesselation)
contours_list = list(contours)
irises_list = list(irises)

data = {
    "tesselation": tesselation_list,
    "contours": contours_list,
    "irises": irises_list
}

with open('frontend/src/connections.json', 'w') as f:
    json.dump(data, f)

print("Exported connections.json")
