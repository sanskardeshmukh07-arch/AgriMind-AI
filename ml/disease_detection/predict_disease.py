import os
import numpy as np
import tensorflow as tf
from PIL import Image


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "plant_disease_mobilenetv2.keras"
)

IMG_SIZE = (160, 160)

CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]


print("Loading disease detection model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully!")


def predict_disease(image_path: str):

    image = Image.open(image_path).convert("RGB")
    image = image.resize(IMG_SIZE)

    image_array = np.array(image, dtype=np.float32)

    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)

    predicted_index = int(np.argmax(predictions[0]))

    confidence = float(
        predictions[0][predicted_index]
    ) * 100

    disease = CLASS_NAMES[predicted_index]

    return {
        "disease": disease,
        "confidence": round(confidence, 2)
    }


if __name__ == "__main__":

    image_path = input("Enter image path: ").strip()

    result = predict_disease(image_path)

    print("\nPrediction Result")
    print("-----------------")
    print("Disease:", result["disease"])
    print("Confidence:", str(result["confidence"]) + "%")

