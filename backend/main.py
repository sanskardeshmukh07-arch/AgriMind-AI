from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.crop import router as crop_router
from backend.api.dashboard import router as dashboard_router
from backend.api.recommendations import router as recommendations_router
from backend.api.soil import router as soil_router
from backend.api.disease import router as disease_router
from backend.api.auth import router as auth_router

app = FastAPI(
    title="AgriMind AI",
    description="AI-powered agriculture assistance system",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routers
app.include_router(crop_router)
app.include_router(dashboard_router)
app.include_router(recommendations_router)
app.include_router(soil_router)
app.include_router(disease_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "AgriMind AI backend is running"
    }