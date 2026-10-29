import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Leaf,
  CloudSun,
  Bot,
  Layers,
  Lightbulb,
  Clock,
  X,
  Wheat
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();

  const navItems = [
    { to: "/dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { to: "/crop-recommendation", label: t("navCropRecommendation"), icon: Sprout },
    { to: "/disease-detection", label: t("navDiseaseDetection"), icon: Leaf },
    { to: "/weather", label: t("navWeather"), icon: CloudSun },
    { to: "/assistant", label: t("navAssistant"), icon: Bot },
    { to: "/soil-data", label: t("navSoilData"), icon: Layers },
    { to: "/advisory", label: t("navAdvisory"), icon: Lightbulb },
    { to: "/history", label: t("navHistory"), icon: Clock },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`agrimind-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">
              <Wheat size={20} strokeWidth={2.4} color="#12301F" />
            </div>
            <span className="sidebar-brand-title">{t("brandName")}</span>
          </div>

          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                onClick={onClose}
              >
                <Icon size={19} className="sidebar-icon" strokeWidth={2} />
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
