import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import "./SoilAnalysisCard.css";

function SoilAnalysisCard({ soilHistory = [], loading: historyLoading }) {
  const { t, language } = useLanguage();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emptyReason, setEmptyReason] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const latestSoil = Array.isArray(soilHistory) && soilHistory.length > 0 ? soilHistory[0] : null;

  useEffect(() => {
    // If no soil records exist
    if (!latestSoil) {
      setAnalysis(null);
      setEmptyReason("no_records");
      return;
    }

    // Rule #6: If the latest soil record has null ph or moisture, show empty/incomplete state
    if (
      latestSoil.ph === null ||
      latestSoil.ph === undefined ||
      latestSoil.moisture === null ||
      latestSoil.moisture === undefined
    ) {
      setAnalysis(null);
      setEmptyReason("incomplete");
      return;
    }

    let active = true;
    setLoading(true);
    setEmptyReason(null);
    setErrorMessage("");

    api
      .analyzeSoil({
        nitrogen: Number(latestSoil.nitrogen ?? 0),
        phosphorus: Number(latestSoil.phosphorus ?? 0),
        potassium: Number(latestSoil.potassium ?? 0),
        ph: Number(latestSoil.ph),
        moisture: Number(latestSoil.moisture),
      })
      .then((data) => {
        if (active && data) {
          setAnalysis(data);
        }
      })
      .catch((err) => {
        if (active) {
          setEmptyReason("error");
          setErrorMessage(err.message || "Failed to analyze soil.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    latestSoil?.id,
    latestSoil?.ph,
    latestSoil?.moisture,
    latestSoil?.nitrogen,
    latestSoil?.phosphorus,
    latestSoil?.potassium
  ]);

  // Status Chip Class Helper
  const getChipClass = (val) => {
    if (!val) return "chip-neutral";
    const v = val.toLowerCase();
    if (["good", "fertile", "suitable", "neutral"].includes(v)) {
      return "chip-success";
    }
    if (["low", "moderate", "acidic", "alkaline"].includes(v)) {
      return "chip-warning";
    }
    return "chip-neutral";
  };

  const getTranslatedStatus = (status) => {
    if (!status) return t("emptyDash");
    const map = {
      Good: t("statusGood"),
      Fertile: t("statusFertile"),
      Moderate: t("statusModerate"),
      "Needs Improvement": t("statusNeedsImprovement"),
      Acidic: t("statusAcidic"),
      Neutral: t("statusNeutral"),
      Suitable: t("statusSuitable"),
      Alkaline: t("statusAlkaline"),
      Low: t("statusLow"),
      High: t("statusHigh"),
    };
    return map[status] || status;
  };

  return (
    <div className="soil-analysis-card">
      <div className="card-header-block">
        <h2 className="card-heading">{t("soilAnalysisTitle")}</h2>
        {latestSoil && (
          <span className="soil-record-badge">
            #{latestSoil.id} · {latestSoil.soil_type || "Recorded"}
          </span>
        )}
      </div>

      <div className="soil-analysis-body">
        {historyLoading || loading ? (
          <div className="soil-state-msg">{t("loading")}</div>
        ) : emptyReason === "no_records" ? (
          <div className="soil-state-msg">{t("noSoilDataYet")}</div>
        ) : emptyReason === "incomplete" ? (
          <div className="soil-state-msg">{t("incompleteSoilRecord")}</div>
        ) : emptyReason === "error" ? (
          <div className="soil-state-msg error-msg">{errorMessage || t("error")}</div>
        ) : analysis ? (
          <div className="soil-status-list">
            <div className="soil-status-row">
              <span className="status-label">{t("soilCondition")}</span>
              <span className={`status-chip ${getChipClass(analysis.soil_condition)}`}>
                {getTranslatedStatus(analysis.soil_condition)}
              </span>
            </div>

            <div className="soil-status-row">
              <span className="status-label">{t("phStatus")}</span>
              <span className={`status-chip ${getChipClass(analysis.ph_status)}`}>
                {getTranslatedStatus(analysis.ph_status)}
              </span>
            </div>

            <div className="soil-status-row">
              <span className="status-label">{t("moistureStatus")}</span>
              <span className={`status-chip ${getChipClass(analysis.moisture_status)}`}>
                {getTranslatedStatus(analysis.moisture_status)}
              </span>
            </div>
          </div>
        ) : (
          <div className="soil-state-msg">{t("noSoilDataYet")}</div>
        )}
      </div>
    </div>
  );
}

export default SoilAnalysisCard;
