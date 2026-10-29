from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.api.auth import get_current_user, get_db
from backend.models.user import User
from backend.models.soil_data import SoilData

router = APIRouter(prefix="/api/soil", tags=["Soil Data"])


class SoilDataRequest(BaseModel):
    nitrogen: float | None = None
    phosphorus: float | None = None
    potassium: float | None = None
    ph: float | None = None
    moisture: float | None = None
    soil_type: str | None = None
    temperature: float | None = None
    humidity: float | None = None
    rainfall: float | None = None


@router.post("/save")
def save_soil_data(
    request: SoilDataRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    soil_data = SoilData(
        user_id=current_user.id,
        nitrogen=request.nitrogen,
        phosphorus=request.phosphorus,
        potassium=request.potassium,
        ph=request.ph,
        moisture=request.moisture,
        soil_type=request.soil_type,
        temperature=request.temperature,
        humidity=request.humidity,
        rainfall=request.rainfall,
    )
    db.add(soil_data)
    db.commit()
    db.refresh(soil_data)
    return {"message": "Soil data saved successfully", "id": soil_data.id}


@router.get("/me")
def get_soil_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(SoilData)
        .filter(SoilData.user_id == current_user.id)
        .order_by(SoilData.id.desc()).all()
    )
    return [{
        "id": r.id, "nitrogen": r.nitrogen, "phosphorus": r.phosphorus,
        "potassium": r.potassium, "ph": r.ph, "moisture": r.moisture,
        "soil_type": r.soil_type, "temperature": r.temperature,
        "humidity": r.humidity, "rainfall": r.rainfall,
    } for r in records]


@router.delete("/{soil_id}")
def delete_soil_data(
    soil_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(SoilData)
        .filter(SoilData.id == soil_id, SoilData.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Soil record not found")
    db.delete(record)
    db.commit()
    return {"message": "Soil record deleted successfully", "id": soil_id}


class SoilAnalysisRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture: float


@router.post("/analyze")
def analyze_soil(
    request: SoilAnalysisRequest,
    current_user: User = Depends(get_current_user),
):
    insights = []
    if request.nitrogen < 50:
        insights.append("Nitrogen level is low.")
    elif request.nitrogen <= 100:
        insights.append("Nitrogen level is suitable.")
    else:
        insights.append("Nitrogen level is high.")

    if request.phosphorus < 30:
        insights.append("Phosphorus level is low.")
    elif request.phosphorus <= 60:
        insights.append("Phosphorus level is suitable.")
    else:
        insights.append("Phosphorus level is high.")

    if request.potassium < 30:
        insights.append("Potassium level is low.")
    elif request.potassium <= 60:
        insights.append("Potassium level is suitable.")
    else:
        insights.append("Potassium level is high.")

    ph_status = "Acidic" if request.ph < 5.5 else "Suitable" if request.ph <= 7.5 else "Alkaline"
    moisture_status = "Low" if request.moisture < 30 else "Suitable" if request.moisture <= 70 else "High"
    suitable_count = sum([
        50 <= request.nitrogen <= 100,
        30 <= request.phosphorus <= 60,
        30 <= request.potassium <= 60,
        5.5 <= request.ph <= 7.5,
        30 <= request.moisture <= 70,
    ])
    soil_condition = "Good" if suitable_count >= 4 else "Moderate" if suitable_count >= 2 else "Needs Improvement"
    return {
        "soil_condition": soil_condition,
        "ph_status": ph_status,
        "moisture_status": moisture_status,
        "insights": insights,
    }
