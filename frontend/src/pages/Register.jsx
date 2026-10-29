import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { Wheat, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import "./Login.css";

function Register() {
  const { t, language, setLanguage } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (name.trim().length < 2) {
      setError(language === "mr" ? "कृपया आपले पूर्ण नाव प्रविष्ट करा." : "Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError(
        language === "mr"
          ? "पासवर्ड किमान ८ अक्षरांचा असणे आवश्यक आहे."
          : "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);
      await api.register(name.trim(), email.trim().toLowerCase(), password);

      setSuccessMsg(
        language === "mr"
          ? "नोंदणी यशस्वी झाली! कृपया लॉगिन करा."
          : "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? language === "mr"
            ? "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया बॅकएंड सुरू असल्याची खात्री करा."
            : "Cannot connect to server. Please verify backend status."
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
          <h2>{t("createAccountTitle")}</h2>
          <p>{t("createAccountSubtitle")}</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success-alert">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-field">
            <label htmlFor="name">{t("fullName")}</label>
            <input
              id="name"
              type="text"
              placeholder={language === "mr" ? "उदा. रमेश पाटील" : "e.g. Ramesh Patil"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

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
            <label htmlFor="password">{t("password")}</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
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
            {loading ? t("registeringBtn") : t("registerBtn")}
          </button>
        </form>

        <div className="auth-switch-footer">
          <span>{t("alreadyHaveAccount")}</span>{" "}
          <Link to="/login" className="auth-action-link">
            {t("loginHere")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
