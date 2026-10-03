from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.crop import router as crop_router
from backend.api.soil import router as soil_router
from backend.api.recommendations import router as recommendations_router
from backend.api.dashboard import router as dashboard_router

app = FastAPI(title="AgriMind AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop_router)
app.include_router(soil_router)
app.include_router(recommendations_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "AgriMind AI backend is running"}

