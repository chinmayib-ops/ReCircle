# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO
# import cv2
# import numpy as np

# app = FastAPI()
# model = YOLO("yolov8n.pt") 

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/detect/")
# async def detect(file: UploadFile = File(...)):
#     contents = await file.read()
#     nparr = np.frombuffer(contents, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     results = model(img)
#     detections = results[0].boxes.data.cpu().numpy()
#     class_names = results[0].names
#     output = []
#     for box in detections:
#         x1, y1, x2, y2, conf, cls = box
#         output.append({
#             "bbox": [float(x1), float(y1), float(x2), float(y2)],
#             "confidence": float(conf),
#             "class": class_names[int(cls)]
#         })
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

model = YOLO("yolov8n.pt")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(img)[0]  # Only first image
    output = []

    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        output.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": conf,
            "class": results.names[cls]
        })
        print(output)

    return output
