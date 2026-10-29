import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Lightbulb, Sprout, TestTube2, Droplets, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import "./AdvisoryPage.css";

function AdvisoryPage() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [latestRec, setLatestRec] = useState(null);
  const [latestSoil, setLatestSoil] = useState(null);
  const [soilAnalysis, setSoilAnalysis] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadAdvisoryData = async () => {
      try {
        setLoading(true);
        const [recs, soils] = await Promise.all([
          api.getRecommendations().catch(() => []),
          api.getSoilHistory().catch(() => []),
        ]);

        if (!isMounted) return;

        const rec = Array.isArray(recs) && recs.length > 0 ? recs[0] : null;
        const soil = Array.isArray(soils) && soils.length > 0 ? soils[0] : null;

        setLatestRec(rec);
        setLatestSoil(soil);

        // If soil has complete parameters, call real backend /api/soil/analyze
        if (
          soil &&
          soil.nitrogen !== null &&
          soil.phosphorus !== null &&
          soil.potassium !== null &&
          soil.ph !== null &&
          soil.moisture !== null
        ) {
          try {
            const analysis = await api.analyzeSoil({
              nitrogen: Number(soil.nitrogen),
              phosphorus: Number(soil.phosphorus),
              potassium: Number(soil.potassium),
              ph: Number(soil.ph),
              moisture: Number(soil.moisture),
            });
            if (isMounted && analysis) {
              setSoilAnalysis(analysis);
            }
          } catch (e) {
            console.error("Advisory soil analysis fetch error:", e);
          }
        }
      } catch (err) {
        console.error("Failed to load advisory data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAdvisoryData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout pageTitle={t("navAdvisory")}>
      <div className="advisory-page-container">
        {/* Page Intro Header */}
        <div className="page-intro-header">
          <h2>{t("advisoryPageHeading")}</h2>
          <p>{t("advisoryPageDescription")}</p>
        </div>

        {loading ? (
          <div className="advisory-card loading-card">{t("loading")}</div>
        ) : !latestRec && !latestSoil ? (
          <div className="advisory-card empty-advisory">
            <Lightbulb size={36} color="#E8B13A" />
            <p>{t("noAdvisoryDataYet")}</p>
          </div>
        ) : (
          <div className="advisory-grid">
            {/* 1. Crop Advisory Card (Real data from GET /api/recommendations/me) */}
            {latestRec && (
              <div className="advisory-card crop-advisory-card">
                <div className="advisory-card-header">
                  <div className="advisory-icon-circle green">
                    <Sprout size={20} color="#1F6B43" />
                  </div>
                  <div>
                    <h3>{t("cropAdvisoryTitle")}</h3>
                    <p className="crop-highlight">
                      Optimal Crop: <strong>{latestRec.recommended_crop}</strong>
                    </p>
                  </div>
                </div>

                <div className="advisory-content-body">
                  <p className="advisory-text">
                    Based on your recorded parameters (pH {latestRec.ph_value}, Rainfall {latestRec.rainfall} mm, Temperature {latestRec.temperature}°C), <strong>{latestRec.recommended_crop}</strong> is strongly recommended for highest yield and resilience.
                  </p>
                  <div className="parameter-tags">
                    <span>N: {latestRec.nitrogen}</span>
                    <span>P: {latestRec.phosphorus}</span>
                    <span>K: {latestRec.potassium}</span>
                    <span>Rain: {latestRec.rainfall} mm</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Soil Analysis & Nutrient Insights (Real data from POST /api/soil/analyze) */}
            {soilAnalysis && (
              <div className="advisory-card soil-advisory-card">
                <div className="advisory-card-header">
                  <div className="advisory-icon-circle amber">
                    <TestTube2 size={20} color="#6B3A00" />
                  </div>
                  <div>
                    <h3>{t("soilAdvisoryTitle")}</h3>
                    <div className="soil-chips-row">
                      <span className="mini-chip">{soilAnalysis.soil_condition}</span>
                      <span className="mini-chip">pH: {soilAnalysis.ph_status}</span>
                      <span className="mini-chip">Moisture: {soilAnalysis.moisture_status}</span>
                    </div>
                  </div>
                </div>

                <div className="advisory-content-body">
                  <h4 className="insights-subheading">{t("aiInsightsTitle")}:</h4>
                  <ul className="advisory-insights-list">
                    {soilAnalysis.insights.map((insight, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} color="#1F6B43" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. General Best Practices (From Dashboard.old.jsx features & ag advisory) */}
        <div className="best-practices-section">
          <h3 className="section-title">{t("bestPracticesTitle")}</h3>

          <div className="practices-cards-grid">
            <div className="practice-card">
              <div className="practice-icon-box">
                <Sprout size={22} color="#1F6B43" />
              </div>
              <h4>{t("practice1Title")}</h4>
              <p>{t("practice1Desc")}</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon-box">
                <Droplets size={22} color="#1F6B43" />
              </div>
              <h4>{t("practice2Title")}</h4>
              <p>{t("practice2Desc")}</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon-box">
                <ShieldCheck size={22} color="#1F6B43" />
              </div>
              <h4>{t("practice3Title")}</h4>
              <p>{t("practice3Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdvisoryPage;
