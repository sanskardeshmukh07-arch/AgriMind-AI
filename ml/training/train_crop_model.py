import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

DATASET_PATH = "dataset/crop_recommendation.csv"
MODEL_PATH = "ml/models/crop_recommendation_model.pkl"

df = pd.read_csv(DATASET_PATH)

X = df[
    [
        "Nitrogen",
        "Phosphorus",
        "Potassium",
        "Temperature",
        "Humidity",
        "pH_Value",
        "Rainfall",
    ]
]

y = df["Crop"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model accuracy: {accuracy * 100:.2f}%")

joblib.dump(model, MODEL_PATH)

print(f"Model saved to: {MODEL_PATH}")
