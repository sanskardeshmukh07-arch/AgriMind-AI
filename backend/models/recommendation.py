from sqlalchemy import Column, Integer, String, Float, ForeignKey
from backend.core.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    ph_value = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)

    recommended_crop = Column(String(100), nullable=False)
