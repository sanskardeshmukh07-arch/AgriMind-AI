from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.core.database import engine
from backend.models.user import User
from backend.models.recommendation import Recommendation
from backend.services.crop_recommendation import recommend_crop

router = APIRouter(prefix="/api/crop", tags=["Crop Recommendation"])


class CropRecommendationRequest(BaseModel):
    user_id: int
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph_value: float
    rainfall: float


@router.post("/recommend")
def crop_recommendation(request: CropRecommendationRequest):
    crop = recommend_crop(
        request.nitrogen,
        request.phosphorus,
        request.potassium,
        request.temperature,
        request.humidity,
        request.ph_value,
        request.rainfall,
    )

    with Session(engine) as session:
        recommendation = Recommendation(
            user_id=request.user_id,
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            temperature=request.temperature,
            humidity=request.humidity,
            ph_value=request.ph_value,
            rainfall=request.rainfall,
            recommended_crop=crop,
        )

        session.add(recommendation)
        session.commit()
        session.refresh(recommendation)

        return {
            "recommended_crop": crop,
            "recommendation_id": recommendation.id
        }
