from sqlalchemy import Column, Integer, Float, String, ForeignKey
from backend.core.database import Base

class SoilData(Base):
    __tablename__ = "soil_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    moisture = Column(Float, nullable=True)
    soil_type = Column(String(100), nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)

