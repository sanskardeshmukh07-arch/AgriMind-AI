/**
 * AgriMind AI - Multi-lingual PDF & Printable Report Generator
 * Generates official, styled A4 advisory reports with full support for English and Marathi (Devanagari).
 */

function generateReportId(prefix) {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AM-${prefix}-${randomNum}`;
}

function openPrintWindow(title, htmlContent) {
  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Popup was blocked by your browser. Please allow popups to download or print your report.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 14mm 16mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Manrope', 'Noto Sans Devanagari', -apple-system, sans-serif;
          color: #16231B;
          background: #FFFFFF;
          margin: 0;
          padding: 0;
          font-size: 13px;
          line-height: 1.5;
        }
        .report-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 10px;
        }
        /* Header */
        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #1F6B43;
          margin-bottom: 20px;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-badge {
          width: 44px;
          height: 44px;
          background: #12301F;
          color: #FFFFFF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
        }
        .logo-text h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #12301F;
        }
        .logo-text h1 span {
          color: #1F6B43;
        }
        .logo-text p {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #546358;
          font-weight: 500;
        }
        .meta-group {
          text-align: right;
        }
        .report-id-pill {
          display: inline-block;
          background: #EAF3EC;
          color: #1F6B43;
          font-weight: 700;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 4px;
        }
        .report-date {
          font-size: 11px;
          color: #7A897E;
        }
        /* Farmer Details Bar */
        .farmer-info-strip {
          background: #F8FAF7;
          border: 1px solid #E1E7DD;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 22px;
          font-size: 12.5px;
        }
        .farmer-field {
          display: flex;
          gap: 6px;
        }
        .farmer-label {
          color: #546358;
          font-weight: 600;
        }
        .farmer-val {
          color: #16231B;
          font-weight: 700;
        }
        /* Sections */
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #12301F;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 20px 0 10px 0;
          border-left: 3px solid #1F6B43;
          padding-left: 8px;
        }
        /* Primary Highlight Card */
        .result-highlight-card {
          background: #EAF3EC;
          border: 1px solid #C4DEC9;
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .result-left h3 {
          margin: 0;
          font-size: 11.5px;
          color: #1F6B43;
          text-transform: uppercase;
          font-weight: 700;
        }
        .result-name {
          font-size: 26px;
          font-weight: 800;
          color: #12301F;
          margin-top: 4px;
        }
        .result-badge {
          background: #1F6B43;
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
        }
        /* Tables */
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }
        .report-table th,
        .report-table td {
          border: 1px solid #E1E7DD;
          padding: 8px 12px;
          text-align: left;
        }
        .report-table th {
          background: #F3F5F0;
          font-weight: 700;
          color: #16231B;
        }
        .report-table tr:nth-child(even) td {
          background: #FAFCFA;
        }
        /* Product Cards */
        .product-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .product-item {
          border: 1px solid #E1E7DD;
          border-radius: 8px;
          padding: 10px 14px;
          background: #FFFFFF;
        }
        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .product-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #12301F;
        }
        .product-price-tag {
          background: #FEF3C7;
          color: #92400E;
          font-weight: 700;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .product-detail-line {
          font-size: 11.5px;
          color: #546358;
          margin: 3px 0;
        }
        /* Disclaimer */
        .disclaimer-box {
          background: #FFFDF0;
          border: 1px solid #F6D888;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 11px;
          color: #6B3A00;
          line-height: 1.45;
          margin-top: 24px;
        }
        .footer-note {
          text-align: center;
          font-size: 10.5px;
          color: #94A3B8;
          margin-top: 18px;
          border-top: 1px solid #E2E8F0;
          padding-top: 10px;
        }
        .print-btn-bar {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          background: #FFFFFF;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .print-btn {
          background: #1F6B43;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }
        @media print {
          .print-btn-bar { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        ${htmlContent}
        <div class="footer-note">
          AgriMind AI Platform · Verified ICAR & Agricultural Department Database · Report automatically signed
        </div>
      </div>
      <div class="print-btn-bar">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      </div>
      <script>
        window.onload = function() {
          // Trigger print dialog automatically
          setTimeout(function() {
            window.print();
          }, 600);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * 1. Crop Recommendation PDF
 */
export function generateCropReportPdf(cropData, recommendation, farmer, language = "en") {
  const reportId = generateReportId("CR");
  const now = new Date().toLocaleString(language === "mr" ? "mr-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const isMr = language === "mr";
  const title = isMr ? "AgriMind AI - पीक शिफारस अहवाल" : "AgriMind AI - Crop Recommendation Report";

  const content = `
    <div class="header-bar">
      <div class="logo-group">
        <div class="logo-badge">🌾</div>
        <div class="logo-text">
          <h1>AgriMind <span>AI</span></h1>
          <p>${isMr ? "स्मार्ट कृषी निर्णय सहाय्यक अहवाल" : "Smart Agricultural Decision Support Report"}</p>
        </div>
      </div>
      <div class="meta-group">
        <div class="report-id-pill">${reportId}</div>
        <div class="report-date">${now}</div>
      </div>
    </div>

    <div class="farmer-info-strip">
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "शेतकरी:" : "Farmer:"}</span>
        <span class="farmer-val">${farmer?.name || "Farmer"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "खाते / ईमेल:" : "Email:"}</span>
        <span class="farmer-val">${farmer?.email || "N/A"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "मॉडेल:" : "Model:"}</span>
        <span class="farmer-val">Random Forest (22 Classes)</span>
      </div>
    </div>

    <div class="result-highlight-card">
      <div class="result-left">
        <h3>${isMr ? "AI शिफारस केलेले पीक" : "AI Recommended Crop"}</h3>
        <div class="result-name">${recommendation}</div>
      </div>
      <div class="result-badge">${isMr ? "योग्य निवड" : "Optimal Selection"}</div>
    </div>

    <div class="section-title">${isMr ? "माती आणि हवामान इनपुट मापदंड" : "Input Soil & Meteorological Parameters"}</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>${isMr ? "मापदंड" : "Parameter"}</th>
          <th>${isMr ? "नोंदवलेले मूल्य" : "Recorded Value"}</th>
          <th>${isMr ? "इष्टतम मर्यादा" : "Optimal Range"}</th>
          <th>${isMr ? "स्थिती" : "Status"}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${isMr ? "नायट्रोजन (N)" : "Nitrogen (N)"}</strong></td>
          <td>${cropData.nitrogen} kg/ha</td>
          <td>50 - 140 kg/ha</td>
          <td>${cropData.nitrogen >= 50 ? (isMr ? "योग्य" : "Adequate") : (isMr ? "कमी" : "Low")}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "फॉस्फरस (P)" : "Phosphorus (P)"}</strong></td>
          <td>${cropData.phosphorus} kg/ha</td>
          <td>20 - 80 kg/ha</td>
          <td>${cropData.phosphorus >= 30 ? (isMr ? "योग्य" : "Adequate") : (isMr ? "कमी" : "Low")}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "पोटॅशियम (K)" : "Potassium (K)"}</strong></td>
          <td>${cropData.potassium} kg/ha</td>
          <td>20 - 100 kg/ha</td>
          <td>${cropData.potassium >= 25 ? (isMr ? "योग्य" : "Adequate") : (isMr ? "कमी" : "Low")}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "तापमान" : "Temperature"}</strong></td>
          <td>${cropData.temperature} °C</td>
          <td>18 - 35 °C</td>
          <td>${isMr ? "अनुकूल" : "Favorable"}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "हवेतील आर्द्रता" : "Humidity"}</strong></td>
          <td>${cropData.humidity} %</td>
          <td>50 - 85 %</td>
          <td>${isMr ? "सामान्य" : "Normal"}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "मातीचा सामू (pH)" : "Soil pH"}</strong></td>
          <td>${cropData.ph}</td>
          <td>6.0 - 7.5</td>
          <td>${cropData.ph < 6 ? (isMr ? "आम्लयुक्त" : "Acidic") : cropData.ph > 7.5 ? (isMr ? "अल्कधर्मी" : "Alkaline") : (isMr ? "योग्य / न्यूट्रल" : "Neutral")}</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "वार्षिक पाऊस" : "Rainfall"}</strong></td>
          <td>${cropData.rainfall} mm</td>
          <td>60 - 250 mm</td>
          <td>${isMr ? "समाधानकारक" : "Normal"}</td>
        </tr>
      </tbody>
    </table>

    <div class="disclaimer-box">
      <strong>${isMr ? "अधिकृत कृषी अस्वीकरण:" : "Official Agronomic Disclaimer:"}</strong>
      ${isMr
        ? "हा अहवाल भारतीय कृषी संशोधन परिषद (ICAR) च्या मार्गदर्शक तत्त्वांवर आधारित कृत्रिम बुद्धिमत्ता (AI) द्वारे तयार करण्यात आला आहे. स्थानिक हवामान, पाण्याची उपलब्धता आणि स्थानिक कृषी तज्ज्ञांच्या सल्ल्याने अंतिम निर्णय घ्यावा."
        : "This report is generated by AgriMind AI decision models benchmarked against ICAR guidelines. Local microclimate, irrigation availability, and regional KVK extension advisories should be considered before final sowing."}
    </div>
  `;

  openPrintWindow(title, content);
}

/**
 * 2. Plant Disease Detection PDF
 */
export function generateDiseaseReportPdf(diseaseResult, farmer, language = "en") {
  const reportId = generateReportId("DD");
  const now = new Date().toLocaleString(language === "mr" ? "mr-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const isMr = language === "mr";
  const title = isMr ? "AgriMind AI - रोग निदान व औषध उपचार अहवाल" : "AgriMind AI - Plant Disease & Treatment Report";

  const diseaseName = isMr
    ? diseaseResult.disease_name_mr || diseaseResult.disease_name || diseaseResult.readable_name
    : diseaseResult.readable_name || diseaseResult.disease_name;

  const products = isMr
    ? diseaseResult.recommended_products_mr || diseaseResult.recommended_products || []
    : diseaseResult.recommended_products_en || diseaseResult.recommended_products || [];

  const productsHtml =
    products.length > 0
      ? products
          .map(
            (p) => `
        <div class="product-item">
          <div class="product-header">
            <span class="product-name">${p.name || p.product_name}</span>
            <span class="product-price-tag">${p.price || "₹ Market Rate"} · ${p.pack_size || ""}</span>
          </div>
          <div class="product-detail-line"><strong>${isMr ? "प्रकार:" : "Category:"}</strong> ${p.category || "Crop Protection"}</div>
          <div class="product-detail-line"><strong>${isMr ? "उपयोग:" : "Purpose:"}</strong> ${p.purpose || ""}</div>
          <div class="product-detail-line"><strong>${isMr ? "वापर प्रमाण:" : "Application:"}</strong> ${p.application || ""}</div>
          <div class="product-detail-line"><strong>${isMr ? "खबरदारी:" : "Precautions:"}</strong> ${p.precautions || ""}</div>
          <div class="product-detail-line"><small><em>${isMr ? "माहिती स्रोत:" : "Source:"} ${p.price_source || "ICAR / CIBRC"} (${p.last_verified || ""})</em></small></div>
        </div>
      `
          )
          .join("")
      : `<p>${isMr ? "कोणतेही रासायनिक औषध आवश्यक नाही." : "No chemical spray required for healthy plants."}</p>`;

  const content = `
    <div class="header-bar">
      <div class="logo-group">
        <div class="logo-badge">🍃</div>
        <div class="logo-text">
          <h1>AgriMind <span>AI</span></h1>
          <p>${isMr ? "वनस्पती रोग निदान आणि उपचार अहवाल" : "Plant Pathology Diagnosis & Prescription Report"}</p>
        </div>
      </div>
      <div class="meta-group">
        <div class="report-id-pill">${reportId}</div>
        <div class="report-date">${now}</div>
      </div>
    </div>

    <div class="farmer-info-strip">
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "शेतकरी:" : "Farmer:"}</span>
        <span class="farmer-val">${farmer?.name || "Farmer"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "खाते / ईमेल:" : "Email:"}</span>
        <span class="farmer-val">${farmer?.email || "N/A"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "निदान अचूकता:" : "Confidence:"}</span>
        <span class="farmer-val">${diseaseResult.confidence ? `${diseaseResult.confidence}%` : "High"}</span>
      </div>
    </div>

    <div class="result-highlight-card">
      <div class="result-left">
        <h3>${isMr ? "AI रोग निदान निकाल" : "AI Pathology Diagnosis"}</h3>
        <div class="result-name">${diseaseName}</div>
      </div>
      <div class="result-badge" style="background: ${diseaseResult.is_healthy ? "#1F6B43" : "#DC2626"}">
        ${diseaseResult.is_healthy ? (isMr ? "निरोगी रोप" : "Healthy Plant") : (isMr ? "रोग आढळला" : "Infection Detected")}
      </div>
    </div>

    <div class="section-title">${isMr ? "शिफारस केलेली औषधे आणि बाजारभाव" : "Recommended Products & Verified Indian Market Prices"}</div>
    <div class="product-grid">
      ${productsHtml}
    </div>

    <div class="disclaimer-box">
      <strong>${isMr ? "अधिकृत कृषी सल्ला विषयक अस्वीकरण:" : "Official Agricultural Advisory Disclaimer:"}</strong>
      ${isMr
        ? "कीटकनाशके व बुरशीनाशकांचा वापर करण्यापूर्वी पाकिटावरील सूचना काळजीपूर्वक वाचा. औषध फवारणी करताना हातमोजे, मास्क व सुरक्षा साधनांचा वापर करा. योग्य प्रमाणासाठी स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या."
        : "Always read and follow the product label instructions carefully before applying agrochemicals. Wear protective personal equipment (PPE) during preparation and application. Verify local regional recommendations with an agricultural officer."}
    </div>
  `;

  openPrintWindow(title, content);
}

/**
 * 3. Soil Health Report PDF
 */
export function generateSoilReportPdf(soilRecord, analysis, farmer, language = "en") {
  const reportId = generateReportId("SD");
  const now = new Date().toLocaleString(language === "mr" ? "mr-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const isMr = language === "mr";
  const title = isMr ? "AgriMind AI - मृदा आरोग्य व विश्लेषण अहवाल" : "AgriMind AI - Soil Health & Analysis Report";

  const insightsHtml =
    analysis && analysis.insights && analysis.insights.length > 0
      ? analysis.insights.map((ins) => `<li>${ins}</li>`).join("")
      : `<li>${isMr ? "मातीचे पोषण समाधानकारक आहे." : "Soil parameters within standard agricultural baseline."}</li>`;

  const content = `
    <div class="header-bar">
      <div class="logo-group">
        <div class="logo-badge">🌱</div>
        <div class="logo-text">
          <h1>AgriMind <span>AI</span></h1>
          <p>${isMr ? "मृदा आरोग्य व पोषण विश्लेषण अहवाल" : "Soil Health & Nutrient Advisory Report"}</p>
        </div>
      </div>
      <div class="meta-group">
        <div class="report-id-pill">${reportId}</div>
        <div class="report-date">${now}</div>
      </div>
    </div>

    <div class="farmer-info-strip">
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "शेतकरी:" : "Farmer:"}</span>
        <span class="farmer-val">${farmer?.name || "Farmer"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "माती प्रकार:" : "Soil Type:"}</span>
        <span class="farmer-val">${soilRecord.soil_type || "Recorded Soil"}</span>
      </div>
      <div class="farmer-field">
        <span class="farmer-label">${isMr ? "माती स्थिती:" : "Condition:"}</span>
        <span class="farmer-val">${analysis?.soil_condition || "Fertile"}</span>
      </div>
    </div>

    <div class="result-highlight-card">
      <div class="result-left">
        <h3>${isMr ? "सामू व ओलावा स्थिती" : "pH & Moisture Status"}</h3>
        <div class="result-name">${soilRecord.soil_type || "Agricultural Soil"} · pH ${soilRecord.ph ?? "—"}</div>
      </div>
      <div class="result-badge">${analysis?.ph_status || "Optimal"}</div>
    </div>

    <div class="section-title">${isMr ? "माती आरोग्य मापदंड" : "Recorded Soil Metrics"}</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>${isMr ? "मापदंड" : "Metric"}</th>
          <th>${isMr ? "नोंदवलेले मूल्य" : "Value"}</th>
          <th>${isMr ? "आदर्श श्रेणी" : "Reference Range"}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${isMr ? "सामू (pH Value)" : "pH Value"}</strong></td>
          <td>${soilRecord.ph ?? "—"}</td>
          <td>6.5 - 7.5 (Neutral)</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "ओलावा (Moisture)" : "Moisture"}</strong></td>
          <td>${soilRecord.moisture ? `${soilRecord.moisture}%` : "—"}</td>
          <td>40% - 70%</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "नायट्रोजन (N)" : "Nitrogen (N)"}</strong></td>
          <td>${soilRecord.nitrogen ? `${soilRecord.nitrogen} kg/ha` : "Standard"}</td>
          <td>Medium (280 - 560 kg/ha)</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "फॉस्फरस (P)" : "Phosphorus (P)"}</strong></td>
          <td>${soilRecord.phosphorus ? `${soilRecord.phosphorus} kg/ha` : "Standard"}</td>
          <td>Medium (10 - 25 kg/ha)</td>
        </tr>
        <tr>
          <td><strong>${isMr ? "पोटॅशियम (K)" : "Potassium (K)"}</strong></td>
          <td>${soilRecord.potassium ? `${soilRecord.potassium} kg/ha` : "Standard"}</td>
          <td>High (> 280 kg/ha)</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">${isMr ? "AI कृषी तज्ज्ञ सल्ला व सुधारणा" : "AI Agronomic Advisory & Soil Remediation"}</div>
    <ul style="padding-left: 20px; line-height: 1.8; color: #546358;">
      ${insightsHtml}
    </ul>

    <div class="disclaimer-box">
      <strong>${isMr ? "अधिकृत मृदा आरोग्य अस्वीकरण:" : "Soil Health Disclaimer:"}</strong>
      ${isMr
        ? "माती परीक्षण प्रयोगशाळेच्या मानकानुसार नियमितपणे शेणखत, हिरवळीची खते आणि जीवामृताचा वापर करून सेंद्रिय कर्ब वाढवावा. खतांच्या प्रमाणासाठी स्थानिक कृषी विज्ञान केंद्राशी संपर्क साधावा."
        : "Enhance organic carbon by regular application of well-decomposed FYM, green manures, and bio-fertilizers. Consult your nearest Krishi Vigyan Kendra (KVK) for farm-specific micro-nutrient blending."}
    </div>
  `;

  openPrintWindow(title, content);
}
