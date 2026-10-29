from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.api.auth import get_current_user, get_db
from backend.models.user import User
from backend.models.recommendation import Recommendation
from backend.models.soil_data import SoilData

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/me")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recommendations = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.id.desc()).all()
    )
    soil_records = (
        db.query(SoilData)
        .filter(SoilData.user_id == current_user.id)
        .order_by(SoilData.id.desc()).all()
    )
    return {
        "recommendation_count": len(recommendations),
        "soil_count": len(soil_records),
        "latest_crop": recommendations[0].recommended_crop if recommendations else "None",
        "latest_soil_type": soil_records[0].soil_type if soil_records and soil_records[0].soil_type else "None",
    }
