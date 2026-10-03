from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.core.database import engine
from backend.models.soil_data import SoilData

router = APIRouter(prefix="/api/soil", tags=["Soil Data"])


class SoilDataRequest(BaseModel):
    user_id: int
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
def save_soil_data(request: SoilDataRequest):
    with Session(engine) as session:
        soil_data = SoilData(
            user_id=request.user_id,
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph=request.ph,
            moisture=request.moisture,
            soil_type=request.soil_type,
        
            temperature=request.temperature,
            humidity=request.humidity,
            rainfall=request.rainfall,)

        session.add(soil_data)
        session.commit()
        session.refresh(soil_data)

        return {
            "message": "Soil data saved successfully",
            "id": soil_data.id
        }


@router.get("/{user_id}")
def get_soil_history(user_id: int):
    with Session(engine) as session:
        soil_records = (
            session.query(SoilData)
            .filter(SoilData.user_id == user_id)
            .order_by(SoilData.id.desc())
            .all()
        )

        return [
            {
                "id": record.id,
                "nitrogen": record.nitrogen,
                "phosphorus": record.phosphorus,
                "potassium": record.potassium,
                "ph": record.ph,
                "moisture": record.moisture,
                "soil_type": record.soil_type,
                "temperature": record.temperature,
                "humidity": record.humidity,
                "rainfall": record.rainfall,
            }
            for record in soil_records
        ]


@router.delete("/{soil_id}")
def delete_soil_data(soil_id: int):
    with Session(engine) as session:
        soil_data = session.query(SoilData).filter(
            SoilData.id == soil_id
        ).first()

        if not soil_data:
            raise HTTPException(
                status_code=404,
                detail="Soil record not found"
            )

        session.delete(soil_data)
        session.commit()

        return {
            "message": "Soil record deleted successfully",
            "id": soil_id
        }

class SoilAnalysisRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture: float


@router.post("/analyze")
def analyze_soil(request: SoilAnalysisRequest):
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

    if request.ph < 5.5:
        ph_status = "Acidic"
    elif request.ph <= 7.5:
        ph_status = "Suitable"
    else:
        ph_status = "Alkaline"

    if request.moisture < 30:
        moisture_status = "Low"
    elif request.moisture <= 70:
        moisture_status = "Suitable"
    else:
        moisture_status = "High"

    suitable_count = sum([
        50 <= request.nitrogen <= 100,
        30 <= request.phosphorus <= 60,
        30 <= request.potassium <= 60,
        5.5 <= request.ph <= 7.5,
        30 <= request.moisture <= 70,
    ])

    if suitable_count >= 4:
        soil_condition = "Good"
    elif suitable_count >= 2:
        soil_condition = "Moderate"
    else:
        soil_condition = "Needs Improvement"

    return {
        "soil_condition": soil_condition,
        "ph_status": ph_status,
        "moisture_status": moisture_status,
        "insights": insights,
    }




