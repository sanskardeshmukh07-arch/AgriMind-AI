from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.api.auth import get_current_user, get_db
from backend.models.user import User
from backend.models.recommendation import Recommendation
from backend.services.crop_recommendation import recommend_crop

router = APIRouter(prefix="/api/crop", tags=["Crop Recommendation"])


class CropRecommendationRequest(BaseModel):
    # user_id is intentionally not accepted from the client; JWT determines ownership.
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph_value: float
    rainfall: float


@router.post("/recommend")
def crop_recommendation(
    request: CropRecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crop = recommend_crop(
        request.nitrogen, request.phosphorus, request.potassium,
        request.temperature, request.humidity, request.ph_value,
        request.rainfall,
    )
    recommendation = Recommendation(
        user_id=current_user.id,
        nitrogen=request.nitrogen,
        phosphorus=request.phosphorus,
        potassium=request.potassium,
        temperature=request.temperature,
        humidity=request.humidity,
        ph_value=request.ph_value,
        rainfall=request.rainfall,
        recommended_crop=crop,
    )
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)
    return {"recommended_crop": crop, "recommendation_id": recommendation.id}
