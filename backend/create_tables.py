from backend.core.database import Base, engine
from backend.models.user import User
from backend.models.crop import Crop
from backend.models.soil_data import SoilData
from backend.models.recommendation import Recommendation

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")
