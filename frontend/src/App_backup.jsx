import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    user_id: 1,
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph_value: "",
    rainfall: "",
  });

  const [result, setResult] = useState("");
  const [recommendationId, setRecommendationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);
  const [dashboard, setDashboard] = useState({
    recommendation_count: 0,
    soil_count: 0,
    latest_crop: "None",
    latest_soil_type: "None",
  });

  const chartData = [
    { name: "AI Recommendations", value: dashboard.recommendation_count },
    { name: "Soil Records", value: dashboard.soil_count },
  ];
  const [soilForm, setSoilForm] = useState({
    user_id: 1,
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    moisture: "",
    soil_type: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const [soilMessage, setSoilMessage] = useState("");
  const [soilAnalysis, setSoilAnalysis] = useState(null);

  useEffect(() => {
    
    fetch("http://127.0.0.1:8000/api/dashboard/1")
      .then((response) => response.json())
      .then((data) => setDashboard(data))
      .catch((error) => console.error("Dashboard error:", error));

fetch("http://127.0.0.1:8000/api/recommendations/1")
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("History error:", error));

    fetch("http://127.0.0.1:8000/api/soil/1")
      .then((response) => response.json())
      .then((data) => setSoilHistory(data))
      .catch((error) => console.error("Soil history error:", error));
  }, []);  const deleteSoilRecord = async (soilId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/soil/${soilId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete soil record");
      }

      setSoilHistory((current) =>
        current.filter((soil) => soil.id !== soilId)
      );

      setDashboard((current) => ({
        ...current,
        soil_count: Math.max(0, current.soil_count - 1),
      }));

    } catch (error) {
      console.error("Delete soil error:", error);
    }
  };

  const handleSoilChange = (e) => {
    setSoilForm({
      ...soilForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveSoilData = async () => {
    const requiredFields = [
      ['Nitrogen', soilForm.nitrogen],
      ['Phosphorus', soilForm.phosphorus],
      ['Potassium', soilForm.potassium],
      ['Soil pH', soilForm.ph],
      ['Moisture', soilForm.moisture],
      ['Temperature', soilForm.temperature],
      ['Humidity', soilForm.humidity],
      ['Rainfall', soilForm.rainfall],
      ['Soil Type', soilForm.soil_type]
    ];

    const emptyField = requiredFields.find(([name, value]) => value === '');

    if (emptyField) {
      setSoilMessage('Please enter ' + emptyField[0] + '.');
      setSoilAnalysis(null);
      return;
    }

    if (Number(soilForm.ph) < 0 || Number(soilForm.ph) > 14) {
      setSoilMessage('Soil pH must be between 0 and 14.');
      setSoilAnalysis(null);
      return;
    }

    try {
      setSoilMessage("Saving soil data...");

      const response = await fetch(
        "http://127.0.0.1:8000/api/soil/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(soilForm.user_id),
            nitrogen: Number(soilForm.nitrogen),
            phosphorus: Number(soilForm.phosphorus),
            potassium: Number(soilForm.potassium),
            ph: Number(soilForm.ph),
            moisture: Number(soilForm.moisture),
            soil_type: soilForm.soil_type,
          
            temperature: Number(soilForm.temperature),
            humidity: Number(soilForm.humidity),
            rainfall: Number(soilForm.rainfall),}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save soil data");
      }

      setSoilMessage(
        "Soil data saved successfully. ID: " + data.id
      );

      
      const analysisResponse = await fetch(
        "http://127.0.0.1:8000/api/soil/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nitrogen: Number(soilForm.nitrogen),
            phosphorus: Number(soilForm.phosphorus),
            potassium: Number(soilForm.potassium),
            ph: Number(soilForm.ph),
            moisture: Number(soilForm.moisture),
          }),
        }
      );

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(analysisData.detail || "Soil analysis failed");
      }

      setSoilAnalysis(analysisData);
fetch("http://127.0.0.1:8000/api/soil/1")
        .then((response) => response.json())
        .then((data) => setSoilHistory(data))
        .catch((error) => console.error("Soil refresh error:", error));
    } catch (error) {
      setSoilMessage("Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getRecommendation = async () => {
    try {

      const requiredFields = [
        ["Nitrogen", form.nitrogen],
        ["Phosphorus", form.phosphorus],
        ["Potassium", form.potassium],
        ["Temperature", form.temperature],
        ["Humidity", form.humidity],
        ["Soil pH", form.ph_value],
        ["Rainfall", form.rainfall],
      ];

      const emptyField = requiredFields.find(
        ([name, value]) => value === ""
      );

      if (emptyField) {
        setResult(`Please enter ${emptyField[0]}.`);
        setRecommendationId(null);
        return;
      }      if (Number(form.nitrogen) < 0) {
        setResult("Nitrogen cannot be negative.");
        setRecommendationId(null);
        return;
      }

      if (Number(form.phosphorus) < 0) {
        setResult("Phosphorus cannot be negative.");
        setRecommendationId(null);
        return;
      }

      if (Number(form.potassium) < 0) {
        setResult("Potassium cannot be negative.");
        setRecommendationId(null);
        return;
      }

      if (Number(form.humidity) < 0 || Number(form.humidity) > 100) {
        setResult("Humidity must be between 0 and 100.");
        setRecommendationId(null);
        return;
      }

      if (Number(form.ph_value) < 0 || Number(form.ph_value) > 14) {
        setResult("Soil pH must be between 0 and 14.");
        setRecommendationId(null);
        return;
      }

      if (Number(form.rainfall) < 0) {
        setResult("Rainfall cannot be negative.");
        setRecommendationId(null);
        return;
      }


      setResult("Getting recommendation...");
      setRecommendationId(null);

      const requestData = {
        user_id: Number(form.user_id),
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph_value: Number(form.ph_value),
        rainfall: Number(form.rainfall),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/crop/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Recommendation failed");
      }

      setResult(data.recommended_crop);

      if (data.recommendation_id) {
        setRecommendationId(data.recommendation_id);
      }

      fetch("http://127.0.0.1:8000/api/recommendations/1")
        .then((response) => response.json())
        .then((data) => setHistory(data))
        .catch((error) => console.error("History refresh error:", error));
    } catch (error) {
      setResult("Error: " + error.message);
    }
  };  const latestRecommendation = history.length > 0 ? history[0] : null;
  const latestSoil = soilHistory.length > 0 ? soilHistory[0] : null;

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">AgriMind AI</div>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#recommend">Recommendation</a>
          <a href="#soil-analysis">Soil Analysis</a>
          <a href="#soil-history">Soil History</a>
          <a href="#history">History</a>
        </nav>
      </header>

      <main>
                <section className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon">AI</span>
            <h3>{dashboard.recommendation_count}</h3>
            <p>AI Recommendations</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">SOIL</span>
            <h3>{dashboard.soil_count}</h3>
            <p>Soil Records</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">CROP</span>
            <h3>
              {dashboard.latest_crop}
            </h3>
            <p>Latest Recommended Crop</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">TYPE</span>
            <h3>
              {dashboard.latest_soil_type}
            </h3>
            <p>Latest Soil Type</p>
          </div>
        </section>
        <section className="analytics-section"><div className="section-heading"><p className="tagline">PROJECT ANALYTICS</p><h2>AgriMind AI Overview</h2><p>Track your AI recommendations and saved soil records.</p></div><div className="analytics-card"><div className="analytics-item"><div className="analytics-label"><span>AI Recommendations</span><strong>{dashboard.recommendation_count}</strong></div><div className="analytics-bar"><div className="analytics-fill" style={{width:`${Math.min(dashboard.recommendation_count * 10,100)}%`}}></div></div></div><div className="analytics-item"><div className="analytics-label"><span>Soil Records</span><strong>{dashboard.soil_count}</strong></div><div className="analytics-bar"><div className="analytics-fill" style={{width:`${Math.min(dashboard.soil_count * 10,100)}%`}}></div></div></div></div></section><section className="hero" id="dashboard">
          <div>
            <p className="tagline">AI-POWERED SMART AGRICULTURE</p>

            <h1>
              Smarter Farming.
              <br />
              Better Decisions.
            </h1>

            <p className="description">
              AgriMind AI uses machine learning and soil information
              to help farmers make better crop decisions.
            </p>

            <a href="#recommend">
              <button>Get Crop Recommendation</button>
            </a>
          </div>

          <div className="hero-card">
            <div className="plant-icon">AI</div>
            <h2>AI Crop Intelligence</h2>
            <p>Data-driven recommendations for smarter farming.</p>
          </div>
        </section>

        <section className="recommend-section" id="recommend">
          <div className="section-heading">
            <p className="tagline">AI CROP RECOMMENDATION</p>

            <h2>Enter Your Field Conditions</h2>

            <p>
              Provide the required environmental and soil parameters to get
              an AI-powered crop recommendation.
            </p>
          </div>

          <div className="recommend-container">
            <div className="form-card">
              <div className="input-grid">

                <div className="input-group">
                  <label>Nitrogen (N)</label>
                  <input
                    name="nitrogen"
                    type="number"
                    placeholder="e.g. 90"
                    value={form.nitrogen}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Phosphorus (P)</label>
                  <input
                    name="phosphorus"
                    type="number"
                    placeholder="e.g. 42"
                    value={form.phosphorus}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Potassium (K)</label>
                  <input
                    name="potassium"
                    type="number"
                    placeholder="e.g. 43"
                    value={form.potassium}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Temperature (C)</label>
                  <input
                    name="temperature"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 20.88"
                    value={form.temperature}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Humidity (%)</label>
                  <input
                    name="humidity"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 82"
                    value={form.humidity}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Soil pH</label>
                  <input
                    name="ph_value"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 6.5"
                    value={form.ph_value}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Rainfall (mm)</label>
                  <input
                    name="rainfall"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 202.94"
                    value={form.rainfall}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <button
                className="recommend-button"
                onClick={getRecommendation}
              >
                Get AI Recommendation
              </button>
            </div>

            <div className="result-card">
              <p>AI Recommendation</p>

              {result ? (
                <>
                  <div className="result-icon">CROP</div>
                  <h3>{result}</h3>
                  <span>Recommended Crop</span>

                  {recommendationId && (
                    <small style={{ marginTop: "12px", opacity: 0.8 }}>
                      Recommendation ID: {recommendationId}
                    </small>
                  )}
                </>
              ) : (
                <>
                  <div className="result-icon">AI</div>
                  <h3>Waiting for input</h3>
                  <span>Your recommendation will appear here.</span>
                </>
              )}
            </div>
          </div>
        </section>        <section className="soil-section" id="soil-analysis">
          <div className="section-heading">
            <p className="tagline">SOIL ANALYSIS</p>
            <h2>Analyze Your Soil</h2>
            <p>
              Enter your soil parameters to store and analyze field conditions.
            </p>
          </div>

          <div className="soil-container">
            <div className="soil-form-card">

              <div className="input-grid">

                <div className="input-group">
                  <label>Nitrogen (N)</label>
                  <input
                    name="nitrogen"
                    type="number"
                    placeholder="e.g. 90"
                    value={soilForm.nitrogen}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Phosphorus (P)</label>
                  <input
                    name="phosphorus"
                    type="number"
                    placeholder="e.g. 42"
                    value={soilForm.phosphorus}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Potassium (K)</label>
                  <input
                    name="potassium"
                    type="number"
                    placeholder="e.g. 43"
                    value={soilForm.potassium}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Soil pH</label>
                  <input
                    name="ph"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 6.5"
                    value={soilForm.ph}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Moisture (%)</label>
                  <input
                    name="moisture"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 72"
                    value={soilForm.moisture}
                    onChange={handleSoilChange}
                  />
                </div>
                <div className="input-group">
                  <label>Temperature (�C)</label>
                  <input
                    name="temperature"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 20.88"
                    value={soilForm.temperature}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Humidity (%)</label>
                  <input
                    name="humidity"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 82"
                    value={soilForm.humidity}
                    onChange={handleSoilChange}
                  />
                </div>

                <div className="input-group">
                  <label>Rainfall (mm)</label>
                  <input
                    name="rainfall"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 202.94"
                    value={soilForm.rainfall}
                    onChange={handleSoilChange}
                  />
                </div>

                

                <div className="input-group">
                  <label>Soil Type</label>
                  <select
                    name="soil_type"
                    value={soilForm.soil_type}
                    onChange={handleSoilChange}
                  >
                    <option value="">Select soil type</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black">Black</option>
                    <option value="Red">Red</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

              </div>

              <button
                className="recommend-button"
                onClick={saveSoilData}
              >
                Save Soil Data
              </button>

              {soilMessage && (
                <p className="soil-message">{soilMessage}</p>
              )}

              {soilAnalysis && (
                <div className="soil-analysis-result">
                  <h3>Soil Analysis Result</h3>
                  <p><strong>Soil Condition:</strong> {soilAnalysis.soil_condition}</p>
                  <p><strong>pH Status:</strong> {soilAnalysis.ph_status}</p>
                  <p><strong>Moisture:</strong> {soilAnalysis.moisture_status}</p>
                  <p><strong>Temperature:</strong> {soilForm.temperature} �C</p>
                  <p><strong>Humidity:</strong> {soilForm.humidity} %</p>
                  <p><strong>Humidity Status:</strong> {Number(soilForm.humidity) <= 70 ? "Suitable" : "High"}</p>
                  <p><strong>Rainfall:</strong> {soilForm.rainfall} mm</p>
                  <div>
                    <strong>AI Insights:</strong>
                    {soilAnalysis.insights.map((insight, index) => (
                      <p key={index}>� {insight}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>        <section className="soil-history-section" id="soil-history">
          <div className="section-heading">
            <p className="tagline">SOIL HISTORY</p>
            <h2>Previous Soil Records</h2>
            <p>
              View your previously saved soil conditions.
            </p>
          </div>

          <div className="history-container">
            {soilHistory.length === 0 ? (
              <div className="empty-history">
                <h3>No soil records yet</h3>
                <p>Your saved soil data will appear here.</p>
              </div>
            ) : (
              soilHistory.map((soil) => (
                <div className="history-card" key={soil.id}>
                  <div className="history-header">
                    <div>
                      <span>Soil Record #{soil.id}</span>
                      <h3>{soil.soil_type || "Unknown Soil"}</h3>
                    </div>

                    <div className="crop-badge">
                      Soil Data
                    </div>
                    <button
                      className="delete-soil-button"
                      onClick={() => deleteSoilRecord(soil.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="history-values">
                    <div>
                      <strong>{soil.nitrogen}</strong>
                      <span>Nitrogen</span>
                    </div>

                    <div>
                      <strong>{soil.phosphorus}</strong>
                      <span>Phosphorus</span>
                    </div>

                    <div>
                      <strong>{soil.potassium}</strong>
                      <span>Potassium</span>
                    </div>

                    <div>
                      <strong>{soil.ph}</strong>
                      <span>Soil pH</span>
                    </div>

                    <div>
                      <strong>{soil.moisture}</strong>
                      <span>Moisture</span>
                    </div>

                    <div>
                      <strong>{soil.soil_type}</strong>
                      <span>Soil Type</span>
                    </div>
                    <div>
                      <strong>{soil.temperature ?? "�"}</strong>
                      <span>Temperature �C</span>
                    </div>

                    <div>
                      <strong>{soil.humidity ?? "�"}</strong>
                      <span>Humidity %</span>
                    </div>

                    <div>
                      <strong>{soil.rainfall ?? "�"}</strong>
                      <span>Rainfall mm</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="history-section" id="history">
          <div className="section-heading">
            <p className="tagline">RECOMMENDATION HISTORY</p>
            <h2>Previous AI Recommendations</h2>
            <p>
              View your previous crop recommendations and field conditions.
            </p>
          </div>

          <div className="history-container">
            {history.length === 0 ? (
              <div className="empty-history">
                <h3>No recommendations yet</h3>
                <p>Your previous recommendations will appear here.</p>
              </div>
            ) : (
              history.map((item) => (
                <div className="history-card" key={item.id}>
                  <div className="history-header">
                    <div>
                      <span>Recommendation #{item.id}</span>
                      <h3>{item.recommended_crop}</h3>
                    </div>

                    <div className="crop-badge">
                      AI Result
                    </div>
                  </div>

                  <div className="history-values">
                    <div>
                      <strong>{item.nitrogen}</strong>
                      <span>Nitrogen</span>
                    </div>

                    <div>
                      <strong>{item.phosphorus}</strong>
                      <span>Phosphorus</span>
                    </div>

                    <div>
                      <strong>{item.potassium}</strong>
                      <span>Potassium</span>
                    </div>

                    <div>
                      <strong>{item.temperature}</strong>
                      <span>Temperature</span>
                    </div>

                    <div>
                      <strong>{item.humidity}</strong>
                      <span>Humidity</span>
                    </div>

                    <div>
                      <strong>{item.ph_value}</strong>
                      <span>Soil pH</span>
                    </div>

                    <div>
                      <strong>{item.rainfall}</strong>
                      <span>Rainfall</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <span className="stat-icon">AI</span>
            <h3>Crop Recommendation</h3>
            <p>
              Get AI-powered crop recommendations based on environmental
              conditions.
            </p>
          </div>

          <div className="feature-card">
            <span className="stat-icon">SOIL</span>
            <h3>Soil Analysis</h3>
            <p>
              Store and analyze important soil parameters such as N, P, K and
              pH.
            </p>
          </div>

          <div className="feature-card">
            <span className="stat-icon">CROP</span>
            <h3>Recommendation History</h3>
            <p>
              View previous crop recommendations and input conditions.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;



































































