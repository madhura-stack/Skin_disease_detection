from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PIL import Image
import tensorflow as tf
import numpy as np
import base64
import io
import uuid
from datetime import datetime

from database import SessionLocal, engine, Base
from models import History
from disease_data import disease_database


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI
app = FastAPI()


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained ML model
model = tf.keras.models.load_model(
    "skin_model.h5",
    compile=False,
    safe_mode=False
)


# Model class labels
labels = [
    "akiec",
    "bcc",
    "bkl",
    "df",
    "mel",
    "nv",
    "vasc"
]


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Image preprocessing
def preprocess(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


# Prediction endpoint
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Read image
    image = Image.open(file.file).convert("RGB")

    # Preprocess
    processed = preprocess(image)

    # Predict
    prediction = model.predict(processed)

    index = np.argmax(prediction)

    confidence = float(np.max(prediction)) * 100

    label = labels[index]


    # Get disease info
    disease_info = disease_database[label]


    # Convert image to base64
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")

    img_str = base64.b64encode(
        buffered.getvalue()
    ).decode()


    # Save history record
    record = History(
        id=str(uuid.uuid4()),
        disease=disease_info["name"],
        confidence=round(confidence, 2),
        risk=disease_info["risk"],
        image=img_str,
        timestamp=datetime.utcnow()
    )

    db.add(record)
    db.commit()


    return {
        "disease": disease_info["name"],
        "confidence": round(confidence, 2),
        "risk": disease_info["risk"],
        "description": disease_info["description"],
        "common_in": disease_info["common_in"],
        "symptoms": disease_info["symptoms"],
        "treatable": disease_info["treatable"],
        "what_to_do": disease_info["what_to_do"],
        "medications": disease_info["medications"],
        "prevention": disease_info["prevention"],
        "image_b64": img_str
    }


# Fetch history
@app.get("/history")
def get_history(db: Session = Depends(get_db)):

    records = db.query(History).all()

    return [
        {
            "id": r.id,
            "disease": r.disease,
            "confidence": r.confidence,
            "risk": r.risk,
            "image": r.image,
            "timestamp": r.timestamp
        }
        for r in records[::-1]
    ]


# Delete history record
@app.delete("/history/{id}")
def delete_history(
    id: str,
    db: Session = Depends(get_db)
):

    record = db.query(History).filter(
        History.id == id
    ).first()

    if record:
        db.delete(record)
        db.commit()

    return {
        "message": "Deleted successfully"
    }