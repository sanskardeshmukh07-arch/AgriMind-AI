import React, { useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import {
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileDown,
  ShieldAlert,
  Tag,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { generateDiseaseReportPdf } from "../utils/pdfGenerator";
import "./DiseaseDetectionPage.css";

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

function DiseaseDetectionPage() {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelectFile = (file) => {
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectFile(file);
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
      handleSelectFile(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError(t("selectImageFirst"));
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const data = await api.predictDisease(formData);
      if (data && data.disease) {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || t("diseaseDetectionError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePrintReport = () => {
    if (!result) return;
    generateDiseaseReportPdf(
      {
        readable_name: formatDiseaseName(result.disease, "en", details),
        disease_name_mr: formatDiseaseName(result.disease, "mr", details),
        confidence: result.confidence,
        is_healthy: isHealthy(result.disease),
        recommended_products_en: details.products || [],
        recommended_products_mr: details.products || []
      },
      { name: sessionStorage.getItem("agrimind_name") },
      lang
    );
  };

  const details = result?.details || {};
  const isMr = lang === "mr";
  const desc = isMr ? (details.description_mr || details.description) : (details.description_en || details.description);
  const causes = isMr ? (details.causes_mr || details.causes) : (details.causes_en || details.causes);
  const symptomsList = isMr ? (details.symptoms_mr || details.symptoms || []) : (details.symptoms_en || details.symptoms || []);
  const preventionList = isMr ? (details.prevention_mr || details.prevention || []) : (details.prevention_en || details.prevention || []);
  const organicList = isMr ? (details.organic_treatment_mr || details.organic_treatment || []) : (details.organic_treatment_en || details.organic_treatment || []);
  const chemicalList = isMr ? (details.chemical_treatment_mr || details.chemical_treatment || []) : (details.chemical_treatment_en || details.chemical_treatment || []);
  const products = details.products || [];
  const disclaimer = isMr ? (details.disclaimer_mr || t("diseaseDisclaimerTitle")) : (details.disclaimer_en || t("diseaseDisclaimerTitle"));

  return (
    <Layout pageTitle={t("navDiseaseDetection")}>
      <div className="disease-page-container">
        {/* Printable Report Header (visible on print only) */}
        <div className="print-report-header">
          <h1>AgriMind AI - {isMr ? "वनस्पती रोग निदान अहवाल" : "Plant Disease Diagnostic Report"}</h1>
          <p>Date: {new Date().toLocaleDateString()} | Farmer: {sessionStorage.getItem("agrimind_name") || "Farmer"}</p>
        </div>

        {/* Page Intro Header */}
        <div className="page-intro-header no-print">
          <h2>{t("diseasePageHeading")}</h2>
          <p>{t("diseasePageDescription")}</p>
        </div>

        <div className="disease-main-grid">
          {/* Left Column: Upload & Preview Card */}
          <div className="disease-upload-card no-print">
            <h3 className="card-heading">{t("diseaseCardTitle")}</h3>
            <p className="card-description">{t("diseaseCardSubtitle")}</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              style={{ display: "none" }}
            />

            {/* Drag and Drop Zone */}
            <div
              className={`disease-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-wrapper">
                <UploadCloud size={32} strokeWidth={2} color="#1F6B43" />
              </div>
              <p className="drop-main-text">{t("dropImageText")}</p>
              <p className="drop-format-text">{t("dropImageFormat")}</p>

              <button
                type="button"
                className="choose-file-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
              >
                {t("chooseFileButton")}
              </button>
            </div>

            {/* Selected Image Preview Area */}
            {previewUrl && (
              <div className="image-preview-block">
                <div className="preview-header">
                  <span className="preview-label">
                    <ImageIcon size={15} />
                    {t("selectedImagePreview")}
                  </span>
                  <button
                    type="button"
                    className="clear-preview-btn"
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    <RefreshCw size={14} />
                    {isMr ? "दुसरा फोटो निवडा" : "Change Photo"}
                  </button>
                </div>

                <div className="preview-img-wrapper">
                  <img src={previewUrl} alt="Leaf Preview" className="preview-img" />
                </div>

                <button
                  type="button"
                  className="predict-action-btn"
                  onClick={handlePredict}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="btn-spinner" />
                      <span>{t("analyzingImage")}</span>
                    </>
                  ) : (
                    t("predictDiseaseButton")
                  )}
                </button>
              </div>
            )}

            {error && <div className="disease-error-banner">{error}</div>}
          </div>

          {/* Right Column: Diagnosis Result Card */}
          <div className="disease-result-card">
            <div className="result-header-row">
              <h3 className="card-heading">{t("diagnosisBadge")}</h3>
              {result && (
                <button
                  type="button"
                  className="download-report-btn no-print"
                  onClick={handlePrintReport}
                  title="Download / Print PDF Report"
                >
                  <FileDown size={15} />
                  <span>{t("downloadPdfReport")}</span>
                </button>
              )}
            </div>

            {result ? (
              <div className="diagnosis-full-content">
                <div className="diagnosis-result-header">
                  <div>
                    <span className="diagnosis-label-mini">{t("diagnosisBadge")}</span>
                    <h4 className="diagnosis-crop-title">
                      {formatDiseaseName(result.disease, lang, details)}
                    </h4>
                  </div>

                  {isHealthy(result.disease) ? (
                    <span className="status-badge-chip healthy">
                      <CheckCircle size={14} />
                      {t("healthyPlant")}
                    </span>
                  ) : (
                    <span className="status-badge-chip diseased">
                      <AlertTriangle size={14} />
                      {t("diseaseDetected")}
                    </span>
                  )}
                </div>

                {/* Confidence Bar */}
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

                {/* Description & Causes */}
                <div className="disease-details-box">
                  {desc && (
                    <div className="details-section">
                      <strong>{t("diseaseOverview")}:</strong>
                      <p>{desc}</p>
                    </div>
                  )}

                  {causes && (
                    <div className="details-section">
                      <strong>{t("diseaseCauses")}:</strong>
                      <p>{causes}</p>
                    </div>
                  )}

                  {symptomsList.length > 0 && (
                    <div className="details-section">
                      <strong>{t("diseaseSymptoms")}:</strong>
                      <ul className="details-bullet-list">
                        {symptomsList.map((symp, i) => (
                          <li key={i}>{symp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {preventionList.length > 0 && (
                    <div className="details-section">
                      <strong>{t("diseasePrevention")}:</strong>
                      <ul className="details-bullet-list">
                        {preventionList.map((prev, i) => (
                          <li key={i}>{prev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {organicList.length > 0 && (
                    <div className="details-section">
                      <strong>{t("organicTreatments")}:</strong>
                      <ul className="details-bullet-list">
                        {organicList.map((org, i) => (
                          <li key={i}>{org}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* FEATURE 2: Verified Treatment Recommendations With Prices */}
                {products.length > 0 && (
                  <div className="treatment-products-section">
                    <h4 className="products-section-heading">
                      <Tag size={17} color="#1F6B43" />
                      {t("treatmentProductsTitle")}
                    </h4>

                    <div className="products-cards-grid">
                      {products.map((prod, idx) => (
                        <div key={idx} className="product-option-card">
                          <div className="product-card-top">
                            <span className="product-pill-category">
                              {isMr ? prod.category_mr : prod.category_en}
                            </span>
                            <div className="product-price-tag">
                              {prod.price_inr === "Price unavailable" ? (
                                <span className="price-unavailable-badge">
                                  {t("priceUnavailable")}
                                </span>
                              ) : (
                                <span className="price-inr-val">
                                  {prod.price_inr}
                                </span>
                              )}
                            </div>
                          </div>

                          <h5 className="product-brand-title">
                            {isMr ? prod.name_mr : prod.name_en}
                          </h5>

                          <div className="product-pack-info">
                            <strong>{t("packSize")}:</strong> {prod.pack_size}
                          </div>

                          <p className="product-purpose-text">
                            <strong>{t("productPurpose")}:</strong>{" "}
                            {isMr ? prod.purpose_mr : prod.purpose_en}
                          </p>

                          <div className="product-guidance-box">
                            <div className="guidance-line">
                              <strong>{t("productApplication")}:</strong>{" "}
                              {isMr ? prod.application_mr : prod.application_en}
                            </div>
                            <div className="guidance-line precautions">
                              <strong>{t("productPrecautions")}:</strong>{" "}
                              {isMr ? prod.precautions_mr : prod.precautions_en}
                            </div>
                          </div>

                          <div className="product-meta-footer">
                            <span>
                              <strong>{t("priceSource")}:</strong> {prod.price_source}
                            </span>
                            <span>
                              <strong>{t("lastVerified")}:</strong> {prod.last_verified}
                            </span>
                          </div>

                          {prod.price_inr === "Price unavailable" && (
                            <div className="price-note-alert">
                              <HelpCircle size={13} />
                              <span>{t("priceUnavailableNote")}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Official Advisory Disclaimer */}
                    <div className="disease-disclaimer-card">
                      <ShieldAlert size={18} color="#E8B13A" />
                      <div>
                        <strong>{t("diseaseDisclaimerTitle")}:</strong>
                        <p>{disclaimer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="diagnosis-placeholder">
                <div className="placeholder-icon">🍃</div>
                <p>
                  {isMr
                    ? "पानाचा फोटो निवडा आणि 'रोग निदान करा' बटण दाबा. आपल्याला रोगाची सविस्तर माहिती व बाजारभावासह औषधांचे पर्याय मिळतील."
                    : "Upload a leaf photo and click 'Predict Disease' to view the automated diagnosis, complete symptoms, and verified treatment options with prices."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DiseaseDetectionPage;
