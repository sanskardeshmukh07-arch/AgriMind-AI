from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.api.auth import get_current_user, get_db
from backend.models.user import User
from backend.models.recommendation import Recommendation

router = APIRouter(prefix="/api/recommendations", tags=["Recommendation History"])


@router.get("/me")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recommendations = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.id.desc()).all()
    )
    return [{
        "id": item.id,
        "recommended_crop": item.recommended_crop,
        "nitrogen": item.nitrogen,
        "phosphorus": item.phosphorus,
        "potassium": item.potassium,
        "temperature": item.temperature,
        "humidity": item.humidity,
        "ph_value": item.ph_value,
        "rainfall": item.rainfall,
    } for item in recommendations]
