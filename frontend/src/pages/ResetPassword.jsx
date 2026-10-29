import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { Wheat, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import "./Login.css";

function ResetPassword() {
  const { t, language, setLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(
        language === "mr"
          ? "पासवर्ड रीसेट टोकन आढळले नाही किंवा लिंक अवैध आहे."
          : "No reset token found in the URL. Link is invalid."
      );
    }
  }, [token, language]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(
        language === "mr"
          ? "पासवर्ड किमान ८ अक्षरांचा असावा."
          : "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      setLoading(true);
      await api.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.message || t("invalidOrExpiredToken"));
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
          <h2>{t("resetPasswordHeading")}</h2>
          <p>{t("resetPasswordSubtitle")}</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="auth-success-card">
            <CheckCircle2 size={36} color="#1F6B43" />
            <h3>{t("passwordResetSuccess")}</h3>
            <p>
              {language === "mr"
                ? "आपल्याला आपोआप लॉगिन पृष्ठावर नेले जात आहे..."
                : "Redirecting you to the login page..."}
            </p>
            <Link to="/login" className="auth-submit-btn">
              {t("loginHere")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="newPassword">{t("newPassword")}</label>
              <div className="password-input-wrapper">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  disabled={!token || loading}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">{t("confirmNewPassword")}</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  disabled={!token || loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !token}
            >
              {loading ? t("savingPassword") : t("setNewPasswordBtn")}
            </button>
          </form>
        )}

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

export default ResetPassword;
