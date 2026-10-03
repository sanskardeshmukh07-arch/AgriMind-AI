from sqlalchemy import Column, Integer, String, Float
from backend.core.database import Base

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    season = Column(String(50), nullable=True)
    soil_type = Column(String(100), nullable=True)
    min_temperature = Column(Float, nullable=True)
    max_temperature = Column(Float, nullable=True)
    min_rainfall = Column(Float, nullable=True)
    max_rainfall = Column(Float, nullable=True)
