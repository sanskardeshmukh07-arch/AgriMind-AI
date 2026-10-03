from fastapi import APIRouter
from sqlalchemy.orm import Session

from backend.core.database import engine
from backend.models.recommendation import Recommendation

router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendation History"]
)


@router.get("/{user_id}")
def get_recommendations(user_id: int):
    with Session(engine) as session:
        recommendations = (
            session.query(Recommendation)
            .filter(Recommendation.user_id == user_id)
            .order_by(Recommendation.id.desc())
            .all()
        )

        return [
            {
                "id": recommendation.id,
                "recommended_crop": recommendation.recommended_crop,
                "nitrogen": recommendation.nitrogen,
                "phosphorus": recommendation.phosphorus,
                "potassium": recommendation.potassium,
                "temperature": recommendation.temperature,
                "humidity": recommendation.humidity,
                "ph_value": recommendation.ph_value,
                "rainfall": recommendation.rainfall,
            }
            for recommendation in recommendations
        ]
