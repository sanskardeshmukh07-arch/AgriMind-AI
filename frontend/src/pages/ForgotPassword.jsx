import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { Wheat, AlertCircle, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import "./Login.css";

function ForgotPassword() {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!email.trim()) {
      setError(language === "mr" ? "कृपया आपला ईमेल प्रविष्ट करा." : "Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword(email.trim().toLowerCase());
      setResult(res);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? language === "mr"
            ? "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया बॅकएंड सुरू असल्याची खात्री करा."
            : "Cannot connect to server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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

        <div className="auth-heading">
          <h2>{t("forgotPasswordHeading")}</h2>
          <p>{t("forgotPasswordSubtitle")}</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="auth-success-alert">
            <CheckCircle2 size={20} />
            <div>
              <strong>{t("resetLinkSentNotice")}</strong>
              {result.reset_url && (
                <div className="dev-reset-box">
                  <span className="dev-label">{t("devResetNotice")}</span>
                  <a href={result.reset_url} className="dev-reset-link">
                    <span>{result.reset_url}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">{t("emailAddress")}</label>
            <input
              id="email"
              type="email"
              placeholder={language === "mr" ? "आपला नोंदणीकृत ईमेल टाका" : "name@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? t("sendingResetLink") : t("sendResetLinkBtn")}
          </button>
        </form>

        <div className="auth-switch-footer">
          <Link to="/login" className="back-to-login-link">
            <ArrowLeft size={16} />
            <span>{t("loginHere")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
