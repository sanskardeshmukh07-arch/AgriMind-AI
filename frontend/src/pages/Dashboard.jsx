import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SummaryCards from "../components/dashboard/SummaryCards";
import CropRecommendationCard from "../components/dashboard/CropRecommendationCard";
import DiseaseDetectionCard from "../components/dashboard/DiseaseDetectionCard";
import RecentRecommendationsTable from "../components/dashboard/RecentRecommendationsTable";
import SoilAnalysisCard from "../components/dashboard/SoilAnalysisCard";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import {
  Sprout,
  Leaf,
  CloudSun,
  Bot,
  Layers,
  ArrowRight,
  Sparkles,
  Calendar
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const { t, language } = useLanguage();

  const [dashboard, setDashboard] = useState({
    recommendation_count: 0,
    soil_count: 0,
    latest_crop: "—",
    latest_soil_type: "—",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerName, setFarmerName] = useState(
    sessionStorage.getItem("agrimind_name") || "Farmer"
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, recsData, soilData, meData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRecommendations().catch(() => []),
        api.getSoilHistory().catch(() => []),
        api.getMe().catch(() => null),
      ]);

      if (statsData) {
        setDashboard(statsData);
      }
      if (Array.isArray(recsData)) {
        setRecommendations(recsData);
      }
      if (Array.isArray(soilData)) {
        setSoilHistory(soilData);
      }
      if (meData?.name) {
        setFarmerName(meData.name);
        sessionStorage.setItem("agrimind_name", meData.name);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNewRecommendation = (newRec) => {
    setRecommendations((prev) => [newRec, ...prev]);
    setDashboard((prev) => ({
      ...prev,
      recommendation_count: (prev.recommendation_count || 0) + 1,
      latest_crop: newRec.recommended_crop,
    }));
  };

  const currentDateFormatted = new Date().toLocaleDateString(
    language === "mr" ? "mr-IN" : "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const quickServices = [
    {
      to: "/crop-recommendation",
      title: t("navCropRecommendation"),
      icon: Sprout,
      desc: language === "mr" ? "माती व हवामानानुसार योग्य पिकाची निवड करा" : "Find optimal crops based on soil nutrients & rainfall",
      color: "#1F6B43",
      bg: "#EAF3EC"
    },
    {
      to: "/disease-detection",
      title: t("navDiseaseDetection"),
      icon: Leaf,
      desc: language === "mr" ? "पानाचा फोटो अपलोड करून रोग व औषधे जाणून घ्या" : "Instant leaf diagnosis with verified ICAR remedies & prices",
      color: "#D97706",
      bg: "#FEF3C7"
    },
    {
      to: "/weather",
      title: t("navWeather"),
      icon: CloudSun,
      desc: language === "mr" ? "थेट हवामान, फवारणी व सिंचन सल्ला" : "OpenWeather live forecast with agrochemical spraying advice",
      color: "#2563EB",
      bg: "#EFF6FF"
    },
    {
      to: "/assistant",
      title: t("navAssistant"),
      icon: Bot,
      desc: language === "mr" ? "मराठी व इंग्रजीत AI शेती सल्लागार" : "Bilingual AI agronomist for 24/7 crop and scheme queries",
      color: "#7C3AED",
      bg: "#F5F3FF"
    },
    {
      to: "/soil-data",
      title: t("navSoilData"),
      icon: Layers,
      desc: language === "mr" ? "मातीचे नमुने नोंदवा व सामू विश्लेषण पहा" : "Record soil tests, track moisture & analyze soil condition",
      color: "#059669",
      bg: "#ECFDF5"
    }
  ];

  return (
    <Layout pageTitle={t("navDashboard")}>
      <div className="dashboard-content">
        {/* Welcome Header */}
        <div className="dashboard-welcome-banner">
          <div className="welcome-left">
            <h1 className="welcome-title">
              {language === "mr" ? `नमस्कार, ${farmerName}!` : `Welcome back, ${farmerName}!`}
            </h1>
            <p className="welcome-subtitle">
              {language === "mr"
                ? "आपल्या शेतीचे संपूर्ण नियोजन, हवामान व रोग व्यवस्थापन एकाच ठिकाणी."
                : "Your central intelligence hub for smart crop planning, pathology, and farm analytics."}
            </p>
          </div>
          <div className="welcome-date-badge">
            <Calendar size={15} color="#1F6B43" />
            <span>{currentDateFormatted}</span>
          </div>
        </div>

        {/* 4 Summary Live Cards */}
        <SummaryCards dashboard={dashboard} loading={loading} />

        {/* Quick Services Navigation */}
        <div className="quick-services-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">{t("quickActionsTitle")}</h2>
              <p className="section-subtitle">{t("quickActionsSubtitle")}</p>
            </div>
          </div>

          <div className="quick-services-grid">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link key={srv.to} to={srv.to} className="quick-service-card">
                  <div className="service-icon-wrapper" style={{ background: srv.bg, color: srv.color }}>
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">{srv.title}</h3>
                    <p className="service-desc">{srv.desc}</p>
                  </div>
                  <div className="service-action-link">
                    <span>{t("openService")}</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Interactive Modules: Crop Recommendation & Plant Disease Detection */}
        <div className="dashboard-two-col-grid">
          <CropRecommendationCard
            onRecommendationSuccess={handleNewRecommendation}
          />
          <DiseaseDetectionCard />
        </div>

        {/* Recent Activity: Recommendations Table & Soil Analysis Card */}
        <div className="dashboard-bottom-grid">
          <RecentRecommendationsTable
            recommendations={recommendations}
            loading={loading}
          />
          <SoilAnalysisCard
            soilHistory={soilHistory}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
