import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./SummaryCards.css";

function SummaryCards({ dashboard, loading }) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "latest-crop",
      label: t("cardLatestCrop"),
      value: dashboard?.latest_crop && dashboard.latest_crop !== "None" ? dashboard.latest_crop : t("emptyDash"),
      subtext: t("subtextCropModel"),
    },
    {
      id: "latest-soil-type",
      label: t("cardLatestSoilType"),
      value: dashboard?.latest_soil_type && dashboard.latest_soil_type !== "None" ? dashboard.latest_soil_type : t("emptyDash"),
      subtext: t("subtextLatestSoilType"),
    },
    {
      id: "soil-records",
      label: t("cardSoilRecords"),
      value: dashboard?.soil_count !== undefined && dashboard.soil_count !== null ? dashboard.soil_count : t("emptyDash"),
      subtext: t("subtextSoilRecords"),
    },
    {
      id: "recommendations",
      label: t("cardRecommendations"),
      value: dashboard?.recommendation_count !== undefined && dashboard.recommendation_count !== null ? dashboard.recommendation_count : t("emptyDash"),
      subtext: t("subtextRecommendations"),
    },
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((card) => (
        <div key={card.id} className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-label">{card.label}</span>
            <span className="summary-card-value">
              {loading ? "..." : card.value}
            </span>
          </div>
          <p className="summary-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
