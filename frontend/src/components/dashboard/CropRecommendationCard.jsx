import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import "./CropRecommendationCard.css";

function CropRecommendationCard({ onRecommendationSuccess }) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph_value: "",
    rainfall: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendedCrop, setRecommendedCrop] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all 7 fields have numerical values
    const fields = [
      "nitrogen",
      "phosphorus",
      "potassium",
      "temperature",
      "humidity",
      "ph_value",
      "rainfall",
    ];

    for (const field of fields) {
      if (formData[field] === "" || isNaN(Number(formData[field]))) {
        setError(t("cropRecommendationError"));
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph_value: parseFloat(formData.ph_value),
        rainfall: parseFloat(formData.rainfall),
      };

      const res = await api.recommendCrop(payload);

      if (res && res.recommended_crop) {
        setRecommendedCrop(res.recommended_crop);
        if (onRecommendationSuccess) {
          onRecommendationSuccess({
            ...payload,
            id: res.recommendation_id,
            recommended_crop: res.recommended_crop,
          });
        }
      }
    } catch (err) {
      setError(err.message || t("cropRecommendationError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-rec-card">
      <div className="card-header-block">
        <h2 className="card-heading">{t("cropCardTitle")}</h2>
        <p className="card-description">{t("cropCardSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="crop-form">
        <div className="crop-inputs-grid">
          <div className="input-group">
            <label htmlFor="nitrogen">{t("nitrogen")}</label>
            <input
              id="nitrogen"
              name="nitrogen"
              type="number"
              step="any"
              placeholder="e.g. 90"
              value={formData.nitrogen}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phosphorus">{t("phosphorus")}</label>
            <input
              id="phosphorus"
              name="phosphorus"
              type="number"
              step="any"
              placeholder="e.g. 42"
              value={formData.phosphorus}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="potassium">{t("potassium")}</label>
            <input
              id="potassium"
              name="potassium"
              type="number"
              step="any"
              placeholder="e.g. 43"
              value={formData.potassium}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="temperature">{t("temperature")}</label>
            <input
              id="temperature"
              name="temperature"
              type="number"
              step="any"
              placeholder="e.g. 20.9"
              value={formData.temperature}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="humidity">{t("humidity")}</label>
            <input
              id="humidity"
              name="humidity"
              type="number"
              step="any"
              placeholder="e.g. 82"
              value={formData.humidity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="ph_value">{t("phValue")}</label>
            <input
              id="ph_value"
              name="ph_value"
              type="number"
              step="any"
              placeholder="e.g. 6.5"
              value={formData.ph_value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="rainfall">{t("rainfall")}</label>
            <input
              id="rainfall"
              name="rainfall"
              type="number"
              step="any"
              placeholder="e.g. 203"
              value={formData.rainfall}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group button-group">
            <button
              type="submit"
              className="recommend-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="btn-spinner" />
                  <span>{t("recommendingButton")}</span>
                </>
              ) : (
                t("recommendButton")
              )}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="crop-error-message">{error}</div>}

      {/* Result Panel matching the screenshot */}
      {recommendedCrop && (
        <div className="crop-result-panel">
          <div className="crop-result-left">
            <div className="check-icon-circle">
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <span className="result-label">{t("recommendedCropBadge")}</span>
              <strong className="result-crop-name">{recommendedCrop}</strong>
            </div>
          </div>
          <span className="saved-history-pill">{t("savedToHistory")}</span>
        </div>
      )}
    </div>
  );
}

export default CropRecommendationCard;
