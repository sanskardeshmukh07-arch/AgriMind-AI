# AgriMind AI 🌾🤖

AgriMind AI is an intelligent agricultural decision-support system designed to empower farmers and agricultural experts. It leverages Machine Learning and Deep Learning to provide real-time crop recommendations, plant disease detection from leaf imagery, and comprehensive soil health analysis.

---

## 🌟 Key Features

1. **AI Crop Recommendation**:
   - Uses an ML model trained on environmental metrics (Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, and Rainfall) to suggest the optimal crop for cultivation.
2. **Plant Disease Detection & Treatment Advisory**:
   - MobileNetV2 Deep Learning CNN model trained on 38 plant disease classes (PlantVillage dataset) to identify crop diseases from leaf photos.
   - Comprehensive agricultural advisory providing key symptoms, organic & cultural treatments, chemical controls, and proactive prevention for all 38 classes.
3. **Live Environmental Weather Auto-Fill**:
   - Integrated Open-Meteo weather intelligence that auto-populates live temperature, humidity, and precipitation using GPS coordinates or city search with regional offline resilience.
4. **Soil Health Analysis & Monitoring**:
   - Evaluates N-P-K balances, moisture, and pH levels with actionable insights to improve soil fertility and crop yield.
5. **Historical Tracking & Dashboard**:
   - Centralized dashboard displaying historical recommendations, saved soil tests, and farm analytics.
6. **Secure Authentication**:
   - JWT-based authentication with Argon2 password hashing for multi-user security.

---

## 🏗️ System Architecture

- **Frontend**: React 19, Vite, React Router 7, Bootstrap 5, Bootstrap Icons.
- **Backend**: FastAPI, SQLAlchemy ORM, Pydantic, PyJWT, Argon2 (`pwdlib`).
- **Machine Learning**:
  - Scikit-Learn (`crop_recommendation_model.pkl`)
  - TensorFlow / Keras (`plant_disease_mobilenetv2.keras`)
- **Database**: MySQL (Default) or SQLite (Zero-config development).

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10 or 3.11
- **Node.js**: v18+ and npm
- **Database**: MySQL Server (or SQLite without any installation)

---

### 1. Environment Configuration

The application reads configuration from `.env` in the project root:

```env
# For MySQL:
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/agrimind_ai

# OR For SQLite (Zero configuration needed):
# DATABASE_URL=sqlite:///./database/agrimind_ai.db

JWT_SECRET_KEY=your_secure_secret_key_here
```

---

### 2. Backend Setup

1. **Activate Virtual Environment**:
   - Windows PowerShell:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - Linux / macOS:
     ```bash
     source .venv/bin/activate
     ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize Database Tables**:
   ```bash
   python -m backend.create_tables
   ```

4. **Start Backend Server**:
   ```bash
   uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   API Swagger docs will be accessible at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the URL shown in the console).

---

## 📁 Project Structure

```text
AgriMind-AI/
├── backend/
│   ├── api/                   # REST API routes (auth, crop, disease, soil, dashboard)
│   ├── core/                  # Database connections and configs
│   ├── models/                # SQLAlchemy database models
│   ├── services/              # Business logic & ML inference services
│   ├── create_tables.py       # Script to generate DB schema
│   ├── main.py                # FastAPI entry point
│   └── requirements.txt       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/             # Dashboard, Login, Register, Navbar components
│   │   ├── App.jsx            # Routing and protected routes
│   │   └── main.jsx           # React DOM root & Bootstrap imports
│   ├── package.json
│   └── vite.config.js
├── ml/
│   ├── disease_detection/     # MobileNetV2 disease detection model & scripts
│   ├── models/                # Scikit-learn crop recommendation model
│   └── training/              # Training scripts for ML models
├── dataset/                   # Training & evaluation datasets
├── database/                  # SQLite storage & database migrations
├── .env                       # Environment configuration
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```

---

## 🧪 Testing the Models & Services

To verify the crop recommendation and disease detection models locally:

```powershell
python -c "from backend.services.crop_recommendation import recommend_crop; print('Crop:', recommend_crop(90, 42, 43, 20.8, 82.0, 6.5, 202.9))"
```
