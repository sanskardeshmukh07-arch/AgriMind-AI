import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Sprout, Layers, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import "./HistoryPage.css";

function HistoryPage() {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("recommendations"); // 'recommendations' | 'soil'
  const [recommendations, setRecommendations] = useState([]);
  const [soilRecords, setSoilRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const [recs, soils] = await Promise.all([
          api.getRecommendations().catch(() => []),
          api.getSoilHistory().catch(() => []),
        ]);

        if (isMounted) {
          if (Array.isArray(recs)) setRecommendations(recs);
          if (Array.isArray(soils)) setSoilRecords(soils);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load history.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout pageTitle={t("navHistory")}>
      <div className="history-page-container">
        {/* Page Intro Header */}
        <div className="page-intro-header">
          <h2>{t("historyPageHeading")}</h2>
          <p>{t("historyPageDescription")}</p>
        </div>

        {/* Tab Switcher */}
        <div className="history-tabs-nav">
          <button
            type="button"
            className={`history-tab-btn ${activeTab === "recommendations" ? "active" : ""}`}
            onClick={() => setActiveTab("recommendations")}
          >
            <Sprout size={18} />
            <span>{t("tabRecommendations")}</span>
            <span className="tab-count-badge">{recommendations.length}</span>
          </button>

          <button
            type="button"
            className={`history-tab-btn ${activeTab === "soil" ? "active" : ""}`}
            onClick={() => setActiveTab("soil")}
          >
            <Layers size={18} />
            <span>{t("tabSoilRecords")}</span>
            <span className="tab-count-badge">{soilRecords.length}</span>
          </button>
        </div>

        {error && <div className="history-error-banner">{error}</div>}

        {/* Tab 1: Crop Recommendations Table */}
        {activeTab === "recommendations" && (
          <div className="history-table-card">
            <div className="table-responsive-wrapper">
              <table className="recent-rec-table">
                <thead>
                  <tr>
                    <th>{t("colId")}</th>
                    <th>{t("colCrop")}</th>
                    <th>{t("colNPK")}</th>
                    <th>{t("colPH")}</th>
                    <th>{t("colRainfall")}</th>
                    <th>{t("colTemp")}</th>
                    <th>{t("colHumidity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="table-state-cell">
                        {t("loading")}
                      </td>
                    </tr>
                  ) : recommendations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="table-state-cell empty">
                        {t("noHistoryRecords")}
                      </td>
                    </tr>
                  ) : (
                    recommendations.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td className="crop-cell">
                          <strong>{item.recommended_crop}</strong>
                        </td>
                        <td className="npk-cell">
                          {item.nitrogen} · {item.phosphorus} · {item.potassium}
                        </td>
                        <td className="ph-cell">{item.ph_value}</td>
                        <td className="rainfall-cell">{item.rainfall} mm</td>
                        <td>{item.temperature}°C</td>
                        <td>{item.humidity}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Soil Records Table */}
        {activeTab === "soil" && (
          <div className="history-table-card">
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
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="table-state-cell">
                        {t("loading")}
                      </td>
                    </tr>
                  ) : soilRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="table-state-cell empty">
                        {t("noHistoryRecords")}
                      </td>
                    </tr>
                  ) : (
                    soilRecords.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td><strong>{item.soil_type || "—"}</strong></td>
                        <td className="npk-cell">
                          {item.nitrogen ?? "—"} · {item.phosphorus ?? "—"} · {item.potassium ?? "—"}
                        </td>
                        <td className="ph-cell">{item.ph ?? "—"}</td>
                        <td>{item.moisture !== null ? `${item.moisture}%` : "—"}</td>
                        <td>{item.temperature !== null ? `${item.temperature}°C` : "—"}</td>
                        <td>{item.humidity !== null ? `${item.humidity}%` : "—"}</td>
                        <td>{item.rainfall !== null ? `${item.rainfall} mm` : "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HistoryPage;
