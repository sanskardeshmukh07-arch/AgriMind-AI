import os
import joblib
import pandas as pd

MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "ml", "models", "crop_recommendation_model.pkl")
)

model = joblib.load(MODEL_PATH)


def recommend_crop(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    temperature: float,
    humidity: float,
    ph_value: float,
    rainfall: float,
) -> str:

    input_data = pd.DataFrame(
        [
            [
                nitrogen,
                phosphorus,
                potassium,
                temperature,
                humidity,
                ph_value,
                rainfall,
            ]
        ],
        columns=[
            "Nitrogen",
            "Phosphorus",
            "Potassium",
            "Temperature",
            "Humidity",
            "pH_Value",
            "Rainfall",
        ],
    )

    prediction = model.predict(input_data)

    return prediction[0]
