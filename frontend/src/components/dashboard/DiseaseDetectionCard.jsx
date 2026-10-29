import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import "./DiseaseDetectionCard.css";

function formatDiseaseName(raw, lang, details) {
  if (lang === "mr" && details?.condition_mr) {
    const crop = details.crop_mr || "";
    return `${crop} · ${details.condition_mr}`;
  }
  if (details?.condition_en) {
    const crop = details.crop_en || "";
    return `${crop} · ${details.condition_en}`;
  }
  if (!raw) return "";
  return raw
    .replace(/_{2,3}/g, " · ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isHealthy(raw) {
  if (!raw) return false;
  return raw.toLowerCase().includes("healthy");
}

function DiseaseDetectionCard() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setError(lang === "mr" ? "केवळ JPG, JPEG किंवा PNG फोटो चालतील." : "Only JPG, JPEG, or PNG images are allowed.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setResult(null);

    // Call /disease/predict automatically using FormData
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const data = await api.predictDisease(formData);
      if (data && data.disease) {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || t("diseaseDetectionError"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const details = result?.details || {};

  return (
    <div className="disease-det-card">
      <div className="card-header-block">
        <h2 className="card-heading">{t("diseaseCardTitle")}</h2>
        <p className="card-description">{t("diseaseCardSubtitle")}</p>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        style={{ display: "none" }}
      />

      {/* Drag & Drop Upload Area */}
      <div
        className={`drop-upload-box ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-wrapper">
          <UploadCloud size={28} strokeWidth={2} color="#1F6B43" />
        </div>
        <p className="drop-main-text">{t("dropImageText")}</p>
        <p className="drop-format-text">{t("dropImageFormat")}</p>

        <button
          type="button"
          className="choose-file-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="btn-spinner" />
              <span>{t("analyzingImage")}</span>
            </>
          ) : (
            t("chooseFileButton")
          )}
        </button>

        {selectedFile && !loading && (
          <p className="selected-filename">
            <ImageIcon size={14} />
            <span>{selectedFile.name}</span>
          </p>
        )}
      </div>

      {error && <div className="disease-error-banner">{error}</div>}

      {/* Diagnosis Result Panel */}
      {result && (
        <div className="diagnosis-result-panel">
          <div className="diagnosis-top-row">
            <div>
              <span className="diagnosis-label">{t("diagnosisBadge")}</span>
              <strong className="diagnosis-name">
                {formatDiseaseName(result.disease, lang, details)}
              </strong>
            </div>

            {isHealthy(result.disease) ? (
              <span className="status-badge-chip healthy">
                {t("healthyPlant")}
              </span>
            ) : (
              <span className="status-badge-chip diseased">
                {t("diseaseDetected")}
              </span>
            )}
          </div>

          <div className="diagnosis-confidence-block">
            <div className="confidence-label-row">
              <span>{t("confidenceLabel")}</span>
              <strong>{result.confidence}%</strong>
            </div>
            <div className="confidence-bar-track">
              <div
                className="confidence-bar-fill"
                style={{ width: `${Math.min(Math.max(result.confidence, 0), 100)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className="view-treatments-link-btn"
            onClick={() => navigate("/disease-detection")}
          >
            <span>{lang === "mr" ? "सविस्तर उपचार व औषध दर पहा" : "View Treatment Products & Prices"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetectionCard;
