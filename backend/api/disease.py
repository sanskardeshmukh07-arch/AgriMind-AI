from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io
import os
import sys

# Project root path
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

# Add project root to Python path
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from ml.disease_detection.predict_disease import predict_disease


router = APIRouter(
    prefix="/disease",
    tags=["Disease Detection"]
)


@router.post("/predict")
async def predict_plant_disease(file: UploadFile = File(...)):

    # Check file type
    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG images are allowed."
        )

    try:
        # Read uploaded image
        image_bytes = await file.read()

        # Validate image
        Image.open(io.BytesIO(image_bytes)).verify()

        # Save temporary image
        temp_dir = os.path.join(
            PROJECT_ROOT,
            "dataset",
            "temp"
        )

        os.makedirs(temp_dir, exist_ok=True)

        temp_path = os.path.join(
            temp_dir,
            file.filename
        )

        with open(temp_path, "wb") as f:
            f.write(image_bytes)

        # Run CNN prediction
        result = predict_disease(temp_path)

        # Delete temporary image
        os.remove(temp_path)

        return {
            "success": True,
            "filename": file.filename,
            "disease": result["disease"],
            "confidence": result["confidence"]
        }

    except Exception as e:

        if "temp_path" in locals() and os.path.exists(temp_path):
            os.remove(temp_path)

        raise HTTPException(
            status_code=500,
            detail=f"Disease detection failed: {str(e)}"
        )