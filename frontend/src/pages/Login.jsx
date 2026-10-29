import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { Wheat, Eye, EyeOff, AlertCircle } from "lucide-react";
import "./Login.css";

function Login() {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError(
        language === "mr"
          ? "कृपया आपला ईमेल आणि पासवर्ड प्रविष्ट करा."
          : "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);
      const data = await api.login(email.trim().toLowerCase(), password);

      // Save token in sessionStorage (consistent with existing app architecture)
      sessionStorage.setItem("agrimind_token", data.access_token);
      sessionStorage.setItem("agrimind_name", data.name);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? language === "mr"
            ? "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया बॅकएंड सुरू असल्याची खात्री करा."
            : "Cannot connect to server. Please ensure backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top right language switch */}
      <div className="auth-top-actions">
        <div className="auth-lang-toggle">
          <button
            type="button"
            className={`lang-pill-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-pill-btn ${language === "mr" ? "active" : ""}`}
            onClick={() => setLanguage("mr")}
          >
            मराठी
          </button>
        </div>
      </div>

      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <Wheat size={26} color="#1F6B43" strokeWidth={2.4} />
          </div>
          <h1 className="auth-brand-name">
            AgriMind <span>AI</span>
          </h1>
          <p className="auth-brand-tagline">
            {language === "mr"
              ? "स्मार्ट शेती आणि कृषी निर्णय प्रणाली"
              : "Smart Agriculture Intelligence System"}
          </p>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>{t("loginTitle")}</h2>
          <p>{t("loginSubtitle")}</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">{t("emailAddress")}</label>
            <input
              id="email"
              type="email"
              placeholder={language === "mr" ? "आपला ईमेल टाका" : "name@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">{t("password")}</label>
              <Link to="/forgot-password" className="auth-link forgot-link">
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t("hidePassword") : t("showPassword")}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? t("signingIn") : t("signInBtn")}
          </button>
        </form>

        <div className="auth-switch-footer">
          <span>{t("dontHaveAccount")}</span>{" "}
          <Link to="/register" className="auth-action-link">
            {t("registerNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
