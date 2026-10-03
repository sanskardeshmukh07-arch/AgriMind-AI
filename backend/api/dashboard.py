from fastapi import APIRouter
from sqlalchemy.orm import Session

from backend.core.database import engine
from backend.models.recommendation import Recommendation
from backend.models.soil_data import SoilData

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/{user_id}")
def get_dashboard(user_id: int):
    with Session(engine) as session:
        recommendations = (
            session.query(Recommendation)
            .filter(Recommendation.user_id == user_id)
            .order_by(Recommendation.id.desc())
            .all()
        )

        soil_records = (
            session.query(SoilData)
            .filter(SoilData.user_id == user_id)
            .order_by(SoilData.id.desc())
            .all()
        )

        return {
            "recommendation_count": len(recommendations),
            "soil_count": len(soil_records),
            "latest_crop": (
                recommendations[0].recommended_crop
                if recommendations else "None"
            ),
            "latest_soil_type": (
                soil_records[0].soil_type
                if soil_records and soil_records[0].soil_type
                else "None"
            ),
        }
