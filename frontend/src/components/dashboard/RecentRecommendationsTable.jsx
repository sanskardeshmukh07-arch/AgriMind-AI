import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./RecentRecommendationsTable.css";

function RecentRecommendationsTable({ recommendations = [], loading }) {
  const { t } = useLanguage();

  // Show only the 5 newest records
  const recentRecords = recommendations.slice(0, 5);

  return (
    <div className="recent-rec-card">
      <div className="card-header-block">
        <h2 className="card-heading">{t("recentRecTitle")}</h2>
      </div>

      <div className="table-responsive-wrapper">
        <table className="recent-rec-table">
          <thead>
            <tr>
              <th>{t("colCrop")}</th>
              <th>{t("colNPK")}</th>
              <th>{t("colPH")}</th>
              <th>{t("colRainfall")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="table-state-cell">
                  {t("loading")}
                </td>
              </tr>
            ) : recentRecords.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-state-cell empty">
                  {t("noRecommendationsYet")}
                </td>
              </tr>
            ) : (
              recentRecords.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="crop-cell">
                    <strong>{item.recommended_crop}</strong>
                  </td>
                  <td className="npk-cell">
                    {item.nitrogen} · {item.phosphorus} · {item.potassium}
                  </td>
                  <td className="ph-cell">{item.ph_value}</td>
                  <td className="rainfall-cell">{item.rainfall} mm</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentRecommendationsTable;
