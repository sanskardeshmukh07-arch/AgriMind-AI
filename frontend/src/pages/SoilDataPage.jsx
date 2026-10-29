import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Loader2, Trash2, CheckCircle2, FlaskConical, Save, FileDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { generateSoilReportPdf } from "../utils/pdfGenerator";
import "./SoilDataPage.css";

function SoilDataPage() {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    moisture: "",
    soil_type: "Loamy",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [analysisResult, setAnalysisResult] = useState(null);

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadSoilRecords = async () => {
    try {
      setLoadingRecords(true);
      const data = await api.getSoilHistory();
      if (Array.isArray(data)) {
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to load soil records:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadSoilRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        nitrogen: formData.nitrogen !== "" ? parseFloat(formData.nitrogen) : null,
        phosphorus: formData.phosphorus !== "" ? parseFloat(formData.phosphorus) : null,
        potassium: formData.potassium !== "" ? parseFloat(formData.potassium) : null,
        ph: formData.ph !== "" ? parseFloat(formData.ph) : null,
        moisture: formData.moisture !== "" ? parseFloat(formData.moisture) : null,
        soil_type: formData.soil_type || null,
        temperature: formData.temperature !== "" ? parseFloat(formData.temperature) : null,
        humidity: formData.humidity !== "" ? parseFloat(formData.humidity) : null,
        rainfall: formData.rainfall !== "" ? parseFloat(formData.rainfall) : null,
      };

      const res = await api.saveSoil(payload);
      setMessage(t("soilSavedSuccess"));
      // Refresh list
      loadSoilRecords();
    } catch (err) {
      setError(err.message || "Failed to save soil record.");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    // Validate required fields for analysis
    const required = ["nitrogen", "phosphorus", "potassium", "ph", "moisture"];
    for (const f of required) {
      if (formData[f] === "" || isNaN(Number(formData[f]))) {
        setError("Please enter valid Nitrogen, Phosphorus, Potassium, pH, and Moisture values to run Soil Analysis.");
        return;
      }
    }

    try {
      setAnalyzing(true);
      setError("");

      const res = await api.analyzeSoil({
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        ph: parseFloat(formData.ph),
        moisture: parseFloat(formData.moisture),
      });

      if (res) {
        setAnalysisResult(res);
      }
    } catch (err) {
      setError(err.message || "Soil analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (soilId) => {
    if (!window.confirm(t("soilDeleteConfirm"))) return;

    try {
      setDeletingId(soilId);
      await api.deleteSoil(soilId);
      setRecords((prev) => prev.filter((r) => r.id !== soilId));
    } catch (err) {
      alert(err.message || "Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  const getChipClass = (val) => {
    if (!val) return "chip-neutral";
    const v = val.toLowerCase();
    if (["good", "fertile", "suitable", "neutral"].includes(v)) return "chip-success";
    if (["low", "moderate", "acidic", "alkaline"].includes(v)) return "chip-warning";
    return "chip-neutral";
  };

  return (
    <Layout pageTitle={t("navSoilData")}>
      <div className="soil-page-container">
        {/* Page Intro Header */}
        <div className="page-intro-header">
          <h2>{t("soilPageHeading")}</h2>
          <p>{t("soilPageDescription")}</p>
        </div>

        {/* Top 2 Columns: Form & Analysis Result */}
        <div className="soil-top-grid">
          {/* Soil Form */}
          <div className="soil-form-card">
            <h3 className="card-heading">{t("soilFormTitle")}</h3>

            <form onSubmit={handleSave} className="soil-form-inner">
              <div className="soil-inputs-grid">
                <div className="input-group">
                  <label htmlFor="soil_type">{t("soilType")}</label>
                  <select
                    id="soil_type"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="soil-select-input"
                  >
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Black">Black</option>
                    <option value="Red">Red</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

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
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="ph">{t("phValue")}</label>
                  <input
                    id="ph"
                    name="ph"
                    type="number"
                    step="any"
                    placeholder="e.g. 6.5"
                    value={formData.ph}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="moisture">{t("moisture")}</label>
                  <input
                    id="moisture"
                    name="moisture"
                    type="number"
                    step="any"
                    placeholder="e.g. 45"
                    value={formData.moisture}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="temperature">{t("temperature")}</label>
                  <input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="any"
                    placeholder="e.g. 26"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="humidity">{t("humidity")}</label>
                  <input
                    id="humidity"
                    name="humidity"
                    type="number"
                    step="any"
                    placeholder="e.g. 70"
                    value={formData.humidity}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="rainfall">{t("rainfall")}</label>
                  <input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    step="any"
                    placeholder="e.g. 150"
                    value={formData.rainfall}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <div className="soil-alert-box error">{error}</div>}
              {message && <div className="soil-alert-box success">{message}</div>}

              {/* Action Buttons */}
              <div className="soil-form-actions">
                <button
                  type="submit"
                  className="soil-btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="btn-spinner" />
                      <span>{t("savingSoilBtn")}</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{t("saveSoilBtn")}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="soil-btn-secondary"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={16} className="btn-spinner" />
                      <span>{t("analyzingSoilBtn")}</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical size={16} />
                      <span>{t("analyzeSoilBtn")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Soil Analysis Result Card */}
          <div className="soil-analysis-card">
            <div className="soil-card-header-row">
              <h3 className="card-heading">{t("soilAnalysisTitle")}</h3>
              {analysisResult && (
                <button
                  type="button"
                  className="download-pdf-btn"
                  onClick={() =>
                    generateSoilReportPdf(
                      formData,
                      analysisResult,
                      { name: sessionStorage.getItem("agrimind_name") },
                      language
                    )
                  }
                  title="Download / Print PDF Report"
                >
                  <FileDown size={15} />
                  <span>{t("downloadPdfReport")}</span>
                </button>
              )}
            </div>

            {analysisResult ? (
              <div className="soil-analysis-details">
                <div className="soil-chips-list">
                  <div className="soil-status-row">
                    <span className="status-label">{t("soilCondition")}</span>
                    <span className={`status-chip ${getChipClass(analysisResult.soil_condition)}`}>
                      {analysisResult.soil_condition}
                    </span>
                  </div>

                  <div className="soil-status-row">
                    <span className="status-label">{t("phStatus")}</span>
                    <span className={`status-chip ${getChipClass(analysisResult.ph_status)}`}>
                      {analysisResult.ph_status}
                    </span>
                  </div>

                  <div className="soil-status-row">
                    <span className="status-label">{t("moistureStatus")}</span>
                    <span className={`status-chip ${getChipClass(analysisResult.moisture_status)}`}>
                      {analysisResult.moisture_status}
                    </span>
                  </div>
                </div>

                {/* AI Insights List from Backend */}
                {analysisResult.insights && analysisResult.insights.length > 0 && (
                  <div className="soil-insights-wrapper">
                    <h4>{t("aiInsightsTitle")}</h4>
                    <ul className="soil-insights-list">
                      {analysisResult.insights.map((insight, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={15} color="#1F6B43" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="analysis-empty-placeholder">
                <FlaskConical size={36} color="#8E9E92" />
                <p>Enter soil values (N, P, K, pH, Moisture) and click <strong>{t("analyzeSoilBtn")}</strong> to get instant quality insights.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Saved Soil Records Table */}
        <div className="soil-table-card">
          <div className="card-header-block">
            <h3 className="card-heading">{t("soilHistoryTitle")}</h3>
          </div>

          <div className="table-responsive-wrapper">
            <table className="recent-rec-table">
              <thead>
                <tr>
                  <th>{t("colId")}</th>
                  <th>{t("colSoilType")}</th>
                  <th>{t("colNPK")}</th>
                  <th>{t("colPH")}</th>
                  <th>{t("colMoisture")}</th>
                  <th>{t("colTemp")}</th>
                  <th>{t("colHumidity")}</th>
                  <th>{t("colRainfall")}</th>
                  <th>{t("colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {loadingRecords ? (
                  <tr>
                    <td colSpan="9" className="table-state-cell">
                      {t("loading")}
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="table-state-cell empty">
                      {t("noSoilRecordsYet")}
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td><strong>{r.soil_type || "—"}</strong></td>
                      <td className="npk-cell">
                        {r.nitrogen ?? "—"} · {r.phosphorus ?? "—"} · {r.potassium ?? "—"}
                      </td>
                      <td className="ph-cell">{r.ph ?? "—"}</td>
                      <td>{r.moisture !== null ? `${r.moisture}%` : "—"}</td>
                      <td>{r.temperature !== null ? `${r.temperature}°C` : "—"}</td>
                      <td>{r.humidity !== null ? `${r.humidity}%` : "—"}</td>
                      <td>{r.rainfall !== null ? `${r.rainfall} mm` : "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="soil-delete-action-btn"
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          title="Delete record"
                        >
                          {deletingId === r.id ? (
                            <Loader2 size={14} className="btn-spinner" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          <span>{t("deleteBtn")}</span>
                        </button>
                      </td>
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

export default SoilDataPage;
