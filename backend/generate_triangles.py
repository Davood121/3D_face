import json
import numpy as np
from scipy.spatial import Delaunay

# Load base face
try:
    with open('backend/base_face.json', 'r') as f:
        landmarks = json.load(f)
except FileNotFoundError:
    print("Error: backend/base_face.json not found. Run capture_base.py first.")
    exit(1)

# Extract 2D points (x, y) for triangulation
points_2d = np.array([[lm[0], lm[1]] for lm in landmarks])

# Compute Delaunay Triangulation
tri = Delaunay(points_2d)

# Extract triangles (indices)
triangles = tri.simplices.tolist()

# Save to JSON
with open('frontend/src/triangles.json', 'w') as f:
    json.dump(triangles, f)

print(f"Generated {len(triangles)} triangles. Saved to frontend/src/triangles.json")
