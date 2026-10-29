import React, { useState, useEffect, useRef } from "react";
import { Menu, LogOut, ChevronDown, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import "./TopBar.css";

function TopBar({ onMenuClick, pageTitle }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem("agrimind_name") || t("userDefaultRole");
  });

  useEffect(() => {
    let isMounted = true;
    api
      .getMe()
      .then((data) => {
        if (isMounted && data && data.name) {
          setUserName(data.name);
          sessionStorage.setItem("agrimind_name", data.name);
        }
      })
      .catch((err) => {
        // Fallback already in state
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("agrimind_token");
    sessionStorage.removeItem("agrimind_name");
    navigate("/login", { replace: true });
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : "F";

  return (
    <header className="agrimind-topbar">
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="topbar-title">{pageTitle || t("navDashboard")}</h1>
          <p className="topbar-subtitle">{t("welcomeBack")}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Language Switcher Pill */}
        <div className="lang-switcher-pill">
          <button
            type="button"
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => toggleLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === "mr" ? "active" : ""}`}
            onClick={() => toggleLanguage("mr")}
          >
            मराठी
          </button>
        </div>

        {/* User Pill with Dropdown */}
        <div className="user-profile-wrapper" ref={dropdownRef}>
          <button
            className="user-profile-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            aria-expanded={userDropdownOpen}
          >
            <div className="user-avatar">{initial}</div>
            <span className="user-name">{userName}</span>
            <ChevronDown size={14} className="user-chevron" />
          </button>

          {userDropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="user-dropdown-header">
                <strong>{userName}</strong>
                <small>{sessionStorage.getItem("agrimind_token") ? "Logged in" : ""}</small>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>{t("logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
