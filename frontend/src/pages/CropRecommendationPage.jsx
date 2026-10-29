import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Check, Loader2, Sprout, FileDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { generateCropReportPdf } from "../utils/pdfGenerator";
import "./CropRecommendationPage.css";

function CropRecommendationPage() {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph_value: "",
    rainfall: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [recommendedCrop, setRecommendedCrop] = useState(null);

  const [recommendations, setRecommendations] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const loadRecommendations = async () => {
    try {
      setListLoading(true);
      setListError("");
      const data = await api.getRecommendations();
      if (Array.isArray(data)) {
        setRecommendations(data);
      }
    } catch (err) {
      setListError(err.message || "Failed to load past recommendations.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setFormError(t("cropRecommendationError"));
        return;
      }
    }

    try {
      setSubmitting(true);
      setFormError("");

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
        // Prepend new recommendation to the list
        setRecommendations((prev) => [
          {
            ...payload,
            id: res.recommendation_id,
            recommended_crop: res.recommended_crop,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setFormError(err.message || t("cropRecommendationError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout pageTitle={t("navCropRecommendation")}>
      <div className="crop-page-container">
        {/* Page Intro Card */}
        <div className="page-intro-header">
          <h2>{t("cropPageHeading")}</h2>
          <p>{t("cropPageDescription")}</p>
        </div>

        {/* Form Card */}
        <div className="crop-card-container">
          <form onSubmit={handleSubmit} className="crop-page-form">
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
                  disabled={submitting}
                >
                  {submitting ? (
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

          {formError && <div className="crop-error-message">{formError}</div>}

          {/* Result Panel */}
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
              <div className="result-actions-row">
                <button
                  type="button"
                  className="download-pdf-btn"
                  onClick={() =>
                    generateCropReportPdf(
                      {
                        nitrogen: formData.nitrogen,
                        phosphorus: formData.phosphorus,
                        potassium: formData.potassium,
                        temperature: formData.temperature,
                        humidity: formData.humidity,
                        ph: formData.ph_value,
                        rainfall: formData.rainfall,
                      },
                      recommendedCrop,
                      { name: sessionStorage.getItem("agrimind_name") },
                      language
                    )
                  }
                >
                  <FileDown size={15} />
                  <span>{t("downloadPdfReport")}</span>
                </button>
                <span className="saved-history-pill">{t("savedToHistory")}</span>
              </div>
            </div>
          )}
        </div>

        {/* History List Section */}
        <div className="crop-history-card">
          <div className="card-header-block">
            <h3 className="card-heading">{t("pastRecommendationsHeading")}</h3>
          </div>

          {listError && <div className="crop-error-message">{listError}</div>}

          <div className="table-responsive-wrapper">
            <table className="recent-rec-table">
              <thead>
                <tr>
                  <th>{t("colCrop")}</th>
                  <th>{t("colNPK")}</th>
                  <th>{t("colPH")}</th>
                  <th>{t("colRainfall")}</th>
                  <th>{t("colTemp")}</th>
                  <th>{t("colHumidity")}</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan="6" className="table-state-cell">
                      {t("loading")}
                    </td>
                  </tr>
                ) : recommendations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-state-cell empty">
                      {t("noRecommendationsYet")}
                    </td>
                  </tr>
                ) : (
                  recommendations.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="crop-cell">
                        <strong>{item.recommended_crop}</strong>
                      </td>
                      <td className="npk-cell">
                        {item.nitrogen} · {item.phosphorus} · {item.potassium}
                      </td>
                      <td className="ph-cell">{item.ph_value}</td>
                      <td className="rainfall-cell">{item.rainfall} mm</td>
                      <td className="rainfall-cell">{item.temperature}°C</td>
                      <td className="rainfall-cell">{item.humidity}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CropRecommendationPage;
