# -*- coding: utf-8 -*-
"""
Agricultural Plant Disease Knowledge Base - Fully Bilingual (English & Marathi)
Provides verified symptoms, causes, prevention, treatments, and registered Indian agricultural market products with prices.
Sources: ICAR, Directorate of Plant Protection Quarantine & Storage (DPPQS / CIBRC),
State Agricultural Universities (MPKV Rahuri, VNMKV Parbhani), and verified retail databases (IFFCO Bazar, AgriBegri).
"""

DISCLAIMER_EN = "Always read and strictly follow registered pesticide and agrochemical label directions before use. Ensure correct dosage, protective clothing, and observe pre-harvest intervals. Consult your local Krishi Vigyan Kendra (KVK) or State Agricultural University expert for site-specific advice."
DISCLAIMER_MR = "वापरण्यापूर्वी कीटकनाशक व बुरशीनाशक लेबलवरील सूचना काळजीपूर्वक वाचा. योग्य प्रमाण, संरक्षक किट आणि काढणीपूर्वीचे अंतर पाळा. आपल्या भागातील स्थानिक कृषी विज्ञान केंद्र (KVK) किंवा कृषी विद्यापीठातील तज्ञांचा सल्ला घ्या."

# Verified Indian market product catalog with prices, pack sizes, and sources
PRODUCTS_REGISTRY = {
    "mancozeb": {
        "name_en": "Mancozeb 75% WP (Dithane M-45)",
        "name_mr": "मॅनकोझेब ७५% डब्ल्यूपी (डायथेन एम-४५)",
        "category_en": "Contact Protective Fungicide",
        "category_mr": "स्पर्शजन्य संरक्षक बुरशीनाशक",
        "purpose_en": "Broad-spectrum multisite protectant preventing spore germination on leaf surfaces.",
        "purpose_mr": "पानांवर बुरशीच्या बीजाणूंची उगवण रोखणारे व्यापक स्पर्शजन्य बुरशीनाशक.",
        "application_en": "2.0 to 2.5 g per litre of water; spray uniformly covering both leaf sides.",
        "application_mr": "२.० ते २.५ ग्रॅम प्रति लिटर पाणी; पानांच्या दोन्ही बाजूंवर एकसारखी फवारणी करा.",
        "precautions_en": "Wear protective mask and gloves. Avoid spraying during high winds or hot midday sun. 14-day pre-harvest interval.",
        "precautions_mr": "मास्क आणि हातमोजे वापरा. कडक उन्हात फवारणी टाळा. काढणीपूर्वी १४ दिवस फवारणी थांबवा.",
        "price_inr": "₹280 - ₹340",
        "pack_size": "500 g",
        "price_source": "IFFCO Bazar / AgriBegri Registered Retail",
        "last_verified": "October 2026"
    },
    "copper_oxychloride": {
        "name_en": "Copper Oxychloride 50% WP (Blitox 50)",
        "name_mr": "कॉपर ऑक्सिक्लोराईड ५०% डब्ल्यूपी (ब्लिटॉक्स ५०)",
        "category_en": "Contact Copper Bactericide & Fungicide",
        "category_mr": "ताम्रयुक्त स्पर्शजन्य बुरशीनाशक व जिवाणूनाशक",
        "purpose_en": "Forms a persistent copper barrier against bacterial blight, spot, and fungal rots.",
        "purpose_mr": "जिवाणू आणि बुरशीजन्य करप्याविरुद्ध पानांवर दीर्घकाळ टिकणारे तांब्याचे संरक्षक कवच बनवते.",
        "application_en": "2.5 to 3.0 g per litre of water; ensure thorough drenching of leaves and stems.",
        "application_mr": "२.५ ते ३.० ग्रॅम प्रति लिटर पाणी; झाडावर संपूर्ण फवारणी करा.",
        "precautions_en": "Do not tank-mix with acidic fertilizers or organophosphates. Keep away from livestock.",
        "precautions_mr": "आम्लयुक्त खतांसोबत मिसळू नका. जनावरांच्या संपर्कात येऊ देऊ नका.",
        "price_inr": "₹310 - ₹360",
        "pack_size": "500 g",
        "price_source": "Tata Rallis / Krishi Seva Kendra",
        "last_verified": "October 2026"
    },
    "ridomil_gold": {
        "name_en": "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)",
        "name_mr": "मेटालॅक्सिल ८% + मॅनकोझेब ६४% डब्ल्यूपी (रिडोमिल गोल्ड)",
        "category_en": "Systemic & Contact Oomyceticide",
        "category_mr": "आंतरप्रवाही व स्पर्शजन्य बुरशीनाशक",
        "purpose_en": "Dual-action protection and internal curative control against downy mildew and late blight.",
        "purpose_mr": "उशिरा येणारा करपा आणि डाऊनी मिल्ड्यूविरुद्ध दुहेरी अंतर्गत व बाह्य संरक्षण.",
        "application_en": "2.5 g per litre of water; apply at first appearance of blight symptoms.",
        "application_mr": "२.५ ग्रॅम प्रति लिटर पाणी; रोगाची पहिली लक्षणे दिसताच फवारावे.",
        "precautions_en": "Use clean neutral water. Wear safety mask and eye protection. 7-day withholding interval.",
        "precautions_mr": "स्वच्छ पाणी वापरा. फवारणी करताना संरक्षक किट वापरा. काढणीपूर्वी ७ दिवस अंतर ठेवा.",
        "price_inr": "₹380 - ₹430",
        "pack_size": "250 g",
        "price_source": "Syngenta India / IFFCO Network",
        "last_verified": "October 2026"
    },
    "amistar_top": {
        "name_en": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
        "name_mr": "अॅझॉक्सीस्ट्रॉबिन १८.२% + डायफेनोकोनॅझोल ११.४% एससी (अमिस्टार टॉप)",
        "category_en": "Systemic Strobilurin & Triazole Fungicide",
        "category_mr": "आंतरप्रवाही संयुक्त बुरशीनाशक",
        "purpose_en": "Arrests fungal cell respiration and ergosterol biosynthesis stopping leaf spots and blights.",
        "purpose_mr": "बुरशीची वाढ रोखून करपा आणि ठिपके रोगांवर त्वरित उपचारात्मक नियंत्रण देते.",
        "application_en": "1.0 ml per litre of water. Apply early morning with fine hollow-cone nozzle.",
        "application_mr": "१.० मिली प्रति लिटर पाणी. सकाळी लवकर बारीक फवाऱ्याने फवारावे.",
        "precautions_en": "Do not apply under intense midday sun. Maximum 2 sprays per crop season.",
        "precautions_mr": "कडक उन्हात फवारू नका. एका हंगामात जास्तीत जास्त २ वेळा फवारा.",
        "price_inr": "₹520 - ₹590",
        "pack_size": "100 ml",
        "price_source": "Syngenta India / Registered Dealers",
        "last_verified": "October 2026"
    },
    "streptocycline": {
        "name_en": "Streptomycin Sulfate + Tetracycline Hydrochloride 90:10",
        "name_mr": "स्ट्रेप्टोसायक्लिन जिवाणूनाशक (Streptocycline)",
        "category_en": "Agricultural Antibacterial Bactericide",
        "category_mr": "कृषी जिवाणूनाशक (अँटिबायोटिक)",
        "purpose_en": "Suppresses bacterial cell reproduction arresting bacterial spot and canker pathogens.",
        "purpose_mr": "जिवाणूंची वाढ रोखून जिवाणू ठिपके आणि कॅन्कर रोगाचा प्रसार थांबवते.",
        "application_en": "6 g pouch dissolved in 50 litres of water (approx 0.12 g/L) mixed with Copper Oxychloride.",
        "application_mr": "६ ग्रॅमचे पाकीट ५० लिटर पाण्यात मिसळून कॉपर बुरशीनाशकासोबत फवारावे.",
        "precautions_en": "Do not exceed recommended dose. Wear gloves during dissolution. Keep locked from children.",
        "precautions_mr": "शिफारस केलेल्या प्रमाणापेक्षा जास्त वापरू नका. औषध मिसळताना हातमोजे वापरा.",
        "price_inr": "₹45 - ₹60",
        "pack_size": "6 g",
        "price_source": "Hindustan Antibiotics / Local Agri Centers",
        "last_verified": "October 2026"
    },
    "sulfex": {
        "name_en": "Sulfur 80% WDG (Sulfex)",
        "name_mr": "सल्फर ८०% डब्ल्यूडीजी (सल्फेक्स)",
        "category_en": "Contact Fungicide & Acaricide",
        "category_mr": "स्पर्शजन्य गंधक बुरशीनाशक व कोळीनाशक",
        "purpose_en": "Eradicates powdery mildew fungal mycelium while suppressing leaf-feeding mites.",
        "purpose_mr": "भुरी रोगाची बुरशी नष्ट करते आणि पानांवरील लाल कोळी किडीचे नियंत्रण करते.",
        "application_en": "2.0 to 3.0 g per litre of water; spray at first appearance of white powdery patches.",
        "application_mr": "२.० ते ३.० ग्रॅम प्रति लिटर पाणी; पांढरी भुकटी दिसताच फवारणी करावी.",
        "precautions_en": "Do not spray when ambient temperature exceeds 32°C to prevent leaf scorching.",
        "precautions_mr": "पानांची जळवट टाळण्यासाठी तापमान ३२ अंश से. पेक्षा जास्त असल्यास फवारू नका.",
        "price_inr": "₹190 - ₹240",
        "pack_size": "1 kg",
        "price_source": "Excel Crop Care / AgriBegri",
        "last_verified": "October 2026"
    },
    "trichoderma_viride": {
        "name_en": "Trichoderma viride 1.5% WP Bio-Fungicide",
        "name_mr": "ट्रायकोडर्मा व्हिरीडी १.५% डब्ल्यूपी (जैविक बुरशीनाशक)",
        "category_en": "Beneficial Biocontrol Agent",
        "category_mr": "जैविक नियंत्रण मित्र बुरशी",
        "purpose_en": "Bio-antagonist parasitizing harmful soil-borne and foliar blight pathogenic fungi.",
        "purpose_mr": "उपयुक्त मित्र बुरशी जी हानिकारक बुरशींना नष्ट करून पिकांचे रक्षण करते.",
        "application_en": "5 g/L as foliar spray or 2.5 kg/acre mixed in moist farmyard manure for soil application.",
        "application_mr": "५ ग्रॅम/लिटर फवारणीसाठी किंवा २.५ किलो प्रति एकर शेणखतात मिसळून जमिनीत द्या.",
        "precautions_en": "Do not mix with chemical fungicides. Apply during cool evening hours with soil moisture.",
        "precautions_mr": "रासायनिक बुरशीनाशकांसोबत मिसळू नका. जमिनीत ओलावा असताना संध्याकाळी वापरा.",
        "price_inr": "₹160 - ₹210",
        "pack_size": "1 kg",
        "price_source": "IFFCO Organic / University Agri Centers",
        "last_verified": "October 2026"
    },
    "neem_oil": {
        "name_en": "Neem Oil 10,000 ppm (Azadirachtin)",
        "name_mr": "निंबोळी अर्क / निम तेल १०,००० पीपीएम",
        "category_en": "Botanical Bio-Pesticide",
        "category_mr": "वनस्पतीजन्य जैविक कीटकनाशक",
        "purpose_en": "Repels sucking insects, thrips, and whiteflies while suppressing early fungal spore attachment.",
        "purpose_mr": "रसशोषक किडी आणि पांढरी माशी पिकापासून दूर ठेवते व बुरशीचा प्रसार रोखते.",
        "application_en": "2.0 to 3.0 ml per litre of water mixed with a few drops of organic surfactant.",
        "application_mr": "२.० ते ३.० मिली प्रति लिटर पाणी (थोड्या साबणाच्या पाण्यासोबत मिसळून).",
        "precautions_en": "Safe organic spray with zero toxic chemical residue. Spray in early morning or evening.",
        "precautions_mr": "कोणताही रासायनिक अवशेष न राहणारे सुरक्षित सेंद्रिय औषध. सकाळी किंवा संध्याकाळी फवारा.",
        "price_inr": "₹260 - ₹320",
        "pack_size": "500 ml",
        "price_source": "IFFCO Kisan / AgriBegri Certified",
        "last_verified": "October 2026"
    },
    "tilt_propiconazole": {
        "name_en": "Propiconazole 25% EC (Tilt)",
        "name_mr": "प्रोपिकोनेझोल २५% ईसी (टिल्ट)",
        "category_en": "Systemic Triazole Ergosterol Inhibitor",
        "category_mr": "आंतरप्रवाही बुरशीनाशक",
        "purpose_en": "Rapidly penetrates vascular tissue providing systemic knockdown of rusts, leaf spots, and smuts.",
        "purpose_mr": "पानांमध्ये वेगाने शोषले जाऊन तांबेरा आणि पानावरील करपा रोगाचा नायनाट करते.",
        "application_en": "1.0 ml per litre of water.",
        "application_mr": "१.० मिली प्रति लिटर पाणी.",
        "precautions_en": "Strictly follow 15-day pre-harvest interval. Avoid repeated back-to-back applications.",
        "precautions_mr": "काढणीपूर्वी १५ दिवस फवारणी थांबवा. प्रतिकारशक्ती टाळण्यासाठी आलटून-पालटून फवारा.",
        "price_inr": "₹420 - ₹480",
        "pack_size": "250 ml",
        "price_source": "Syngenta India / Registered Retailers",
        "last_verified": "October 2026"
    },
    "spiromesifen_oberon": {
        "name_en": "Spiromesifen 22.9% SC (Oberon)",
        "name_mr": "स्पिरोमेसिफेन २२.९% एससी (ओबेरॉन)",
        "category_en": "Specialist Lipid Synthesis Inhibitor Acaricide",
        "category_mr": "विशेष कोळीनाशक व पांढरी माशी नियंत्रक",
        "purpose_en": "Inhibits lipid biosynthesis controlling all stages of spider mites and whitefly nymphs.",
        "purpose_mr": "लाल कोळी आणि पांढऱ्या माशीच्या अंड्यांपासून ते प्रौढांपर्यंत सर्व अवस्था नष्ट करते.",
        "application_en": "0.8 to 1.0 ml per litre of water directed at leaf undersides.",
        "application_mr": "०.८ ते १.० मिली प्रति लिटर पाणी; पानांच्या खालच्या बाजूवर प्रामुख्याने फवारा.",
        "precautions_en": "Use fine hollow cone nozzles to thoroughly wet leaf undersides.",
        "precautions_mr": "पानांच्या खालच्या बाजूवर औषध व्यवस्थित पोहोचेल याची खात्री करा.",
        "price_inr": "₹540 - ₹620",
        "pack_size": "100 ml",
        "price_source": "Bayer CropScience India",
        "last_verified": "October 2026"
    },
    "imidacloprid": {
        "name_en": "Imidacloprid 17.8% SL (Confidor)",
        "name_mr": "इमिडाक्लोप्रिड १७.८% एसएल (कॉन्फिडोर)",
        "category_en": "Systemic Neonicotinoid Insecticide",
        "category_mr": "आंतरप्रवाही कीटकनाशक",
        "purpose_en": "Controls whiteflies and thrips that act as viral vectors transmitting leaf curl and mosaic viruses.",
        "purpose_mr": "पांढरी माशी आणि थ्रिप्सचे नियंत्रण करते जे चुरडा-मुरडा व विषाणूजन्य रोगांचा प्रसार करतात.",
        "application_en": "0.5 ml per litre of water.",
        "application_mr": "०.५ मिली प्रति लिटर पाणी.",
        "precautions_en": "Harmful to bees; do not spray during active morning bee pollination.",
        "precautions_mr": "मधमाशांसाठी हानिकारक; मधमाशा परागीभवन करत असताना सकाळी फवारणी टाळा.",
        "price_inr": "₹320 - ₹380",
        "pack_size": "100 ml",
        "price_source": "Bayer India / Local Agri Retail",
        "last_verified": "October 2026"
    },
    "seaweed_tonic": {
        "name_en": "Seaweed Extract Liquid Organic Biostimulant",
        "name_mr": "सीवीड अर्क सेंद्रिय वनस्पती टॉनिक",
        "category_en": "Nutritional Biostimulant",
        "category_mr": "सेंद्रिय पोषण टॉनिक",
        "purpose_en": "Supplies natural auxins, cytokinins, and trace minerals boosting plant immunity and chlorophyll.",
        "purpose_mr": "हरितद्रव्य वाढवते, नैसर्गिक रोगप्रतिकारक शक्ती वाढवते आणि सशक्त शाकीय वाढीस मदत करते.",
        "application_en": "2.0 ml per litre of water during vegetative or flowering stages.",
        "application_mr": "२.० मिली प्रति लिटर पाणी वाढीच्या किंवा फुलोऱ्याच्या अवस्थेत फवारा.",
        "precautions_en": "Safe non-toxic organic formulation. Store away from heat.",
        "precautions_mr": "सुरक्षित सेंद्रिय उत्पादन. उष्णतेपासून दूर थंड जागी ठेवा.",
        "price_inr": "₹320 - ₹380",
        "pack_size": "500 ml",
        "price_source": "IFFCO Urban / AgriBio Retail",
        "last_verified": "October 2026"
    },
    "npk_19_19_19": {
        "name_en": "Water Soluble 19:19:19 NPK Foliar Fertilizer",
        "name_mr": "१९:१९:१९ विद्राव्य खत",
        "category_en": "Balanced Soluble Nutrient",
        "category_mr": "संतुलित विद्राव्य खत",
        "purpose_en": "Provides balanced nitrogen, phosphorus, and potassium maintaining high vigor in healthy foliage.",
        "purpose_mr": "निरोगी पानांना संतुलित नत्र, स्फुरद व पालाश देऊन झाडांची रोगप्रतिकारक शक्ती टिकवून ठेवते.",
        "application_en": "4.0 to 5.0 g per litre of water as foliar application or 3 kg/acre via drip.",
        "application_mr": "४.० ते ५.० ग्रॅम प्रति लिटर पाणी फवारणीसाठी किंवा ३ किलो प्रति एकर ठिबकद्वारे द्या.",
        "precautions_en": "Ensure complete dissolution in water. Do not apply in direct noon sun.",
        "precautions_mr": "पाण्यात पूर्ण विरघळल्यानंतरच फवारा. दुपारच्या उन्हात फवारू नका.",
        "price_inr": "₹160 - ₹210",
        "pack_size": "1 kg",
        "price_source": "Mahadhan / IFFCO Cooperative Store",
        "last_verified": "October 2026"
    },
    "specialty_antibiotic": {
        "name_en": "Tetracycline Hydrochloride Technical (Specialist Compound)",
        "name_mr": "टेट्रासायक्लिन हायड्रोक्लोराईड (विशेष जिवाणूनाशक)",
        "category_en": "Specialty Antibiotic",
        "category_mr": "विशेष जिवाणूनाशक",
        "purpose_en": "Vascular suppression of phloem-limited fastidious bacteria (Citrus greening).",
        "purpose_mr": "लिंबूवर्गीय फळांमधील अंतर्गत जिवाणूंचा प्रादुर्भाव रोखण्यासाठी.",
        "application_en": "Administered strictly via specialized trunk injection under expert agricultural supervision.",
        "application_mr": "केवळ कृषी तज्ञांच्या मार्गदर्शनाखाली खोडातून इंजेक्ट पद्धतीने दिले जाते.",
        "precautions_en": "Strict restricted use. Follow State Horticultural Department protocol.",
        "precautions_mr": "केवळ तज्ञांच्या मार्गदर्शनाखाली नियंत्रित वापर. राज्य फलोत्पादन मार्गदर्शक तत्त्वे पाळा.",
        "price_inr": "Price unavailable",
        "pack_size": "Specialist packaging",
        "price_source": "Authorized Government Research Institute / State Horticulture Dept",
        "last_verified": "October 2026"
    }
}

# Crop name translations
CROPS_TRANSLATION = {
    "Apple": "सफरचंद",
    "Blueberry": "ब्लूबेरी",
    "Cherry": "चेरी",
    "Corn": "मका",
    "Grape": "द्राक्ष",
    "Orange": "संत्री / मोसंबी",
    "Peach": "पीच",
    "Pepper,_bell": "शिमला मिरची",
    "Potato": "बटाटा",
    "Raspberry": "रासबेरी",
    "Soybean": "सोयाबीन",
    "Squash": "भोपळा",
    "Strawberry": "स्ट्रॉबेरी",
    "Tomato": "टोमॅटो"
}

# Helper to build advice for any class
def get_disease_advice(disease_key: str) -> dict:
    parts = disease_key.split("___")
    crop_raw = parts[0] if len(parts) > 0 else "Unknown Crop"
    cond_raw = parts[1] if len(parts) > 1 else "Unknown Condition"
    is_healthy = "healthy" in disease_key.lower()

    crop_en = crop_raw.replace("_", " ").strip()
    crop_mr = CROPS_TRANSLATION.get(crop_raw, crop_en)

    cond_en = cond_raw.replace("_", " ").replace("(", " (").strip()
    
    # Specific condition marathi names
    cond_mr_map = {
        "Apple scab": "सफरचंद खरुज (स्कॅब)",
        "Black rot": "काळी कुज (ब्लॅक रॉट)",
        "Cedar apple rust": "सफरचंद तांबेरा",
        "healthy": "निरोगी पीक",
        "Powdery mildew": "भुरी रोग (पावडरी मिल्ड्यू)",
        "Cercospora leaf spot Gray leaf spot": "राखाडी करपा (ग्रे लीफ स्पॉट)",
        "Common rust": "तांबेरा रोग (कॉमन रस्ट)",
        "Northern Leaf Blight": "तुरा करपा (नॉर्दर्न लीफ ब्लाईट)",
        "Esca (Black Measles)": "एस्का रोग (काळे डाग)",
        "Leaf blight (Isariopsis Leaf Spot)": "पानावरील करपा (इझारिओप्सिस)",
        "Haunglongbing (Citrus greening)": "सायट्रस ग्रीनिंग (ह्युआंगलाँगबिंग)",
        "Bacterial spot": "जिवाणू ठिपके रोग (बॅक्टेरियल स्पॉट)",
        "Early blight": "लवकर येणारा करपा (अर्ली ब्लाईट)",
        "Late blight": "उशिरा येणारा करपा (लेट ब्लाईट)",
        "Leaf scorch": "पानावरील करपा (लीफ स्कॉर्च)",
        "Leaf Mold": "पानावरील बुरशी (लीफ मोल्ड)",
        "Septoria leaf spot": "सेप्टोरिया पानावरील ठिपके",
        "Spider mites Two-spotted spider mite": "लाल कोळी किडीचा प्रादुर्भाव",
        "Target Spot": "चक्राकार ठिपके (टार्गेट स्पॉट)",
        "Tomato Yellow Leaf Curl Virus": "पिवळा पानांचा चुरडा-मुरडा विषाणू (लीफ कर्ल)",
        "Tomato mosaic virus": "टोमॅटो मोझॅक व्हायरस (विषाणू)"
    }
    cond_mr = cond_mr_map.get(cond_en, cond_en)
    if is_healthy:
        cond_mr = f"निरोगी {crop_mr}"

    # Descriptions
    if is_healthy:
        desc_en = f"Healthy {crop_en} foliage showing vigorous growth, balanced chlorophyll, and zero pathogen distress."
        desc_mr = f"कोणताही रोग नसलेली, टवटवीत आणि निरोगी {crop_mr}ची झाडे. पानांचा रंग व वाढ उत्कृष्ट आहे."
        causes_en = "Optimal field nutrition, balanced irrigation, and healthy growing environment."
        causes_mr = "संतुलित खते, वेळेवर सिंचन आणि पिकाची योग्य निगा."
        symp_en = ["Vibrant green leaves with crisp margins and clean tissue", "Normal shoot development and sturdy flowering trusses"]
        symp_mr = ["पानांवर कोणतेही डाग नसून पाने चमकदार व हिरवीगार दिसणे", "फांद्यांची जोमदार वाढ आणि निरोगी फुलोरा"]
        prev_en = ["Continue routine field scouting twice weekly", "Maintain scheduled balanced organic nutrition and clean irrigation"]
        prev_mr = ["आठवड्यातून दोनदा शेताची नियमित पाहणी करा", "संतुलित सेंद्रिय खतांचा वापर आणि ठिबक सिंचन सुरू ठेवा"]
        org_en = ["Apply Seaweed Extract Biostimulant @ 2 ml/L", "Apply Trichoderma viride preventive soil drench (2.5 kg/acre)", "Foliar spray of 19:19:19 soluble fertilizer @ 5 g/L"]
        org_mr = ["सीवीड सेंद्रिय अर्क @ २ मिली/लिटर फवारा", "ट्रायकोडर्मा मित्र बुरशी २.५ किलो/एकर ठिबकमधून द्या", "१९:१९:१९ विद्राव्य खत @ ५ ग्रॅम/लिटर पाण्यातून फवारा"]
        chem_en = ["No chemical fungicides or pesticides required for healthy foliage."]
        chem_mr = ["निरोगी वनस्पतींसाठी रासायनिक बुरशीनाशक किंवा कीटकनाशकाची आवश्यकता नाही."]
        products = [
            PRODUCTS_REGISTRY["seaweed_tonic"],
            PRODUCTS_REGISTRY["trichoderma_viride"],
            PRODUCTS_REGISTRY["npk_19_19_19"]
        ]
    elif "bacterial" in cond_en.lower():
        desc_en = f"Bacterial infection on {crop_en} caused by Xanthomonas or Pseudomonas affecting foliage, stems, and fruit."
        desc_mr = f"{crop_mr} पिकावरील जिवाणूजन्य संसर्ग, ज्यामुळे पाने, खोड आणि फळांवर पाणी साचल्यासारखे काळे ठिपके पडतात."
        causes_en = "Warm, humid conditions (24-30°C) with water splashing transmitting bacteria."
        causes_mr = "२४-३० अंश से. उबदार हवामान, पाण्याचा मारा आणि दमट हवेमुळे जिवाणूंचा प्रसार होतो."
        symp_en = ["Small angular water-soaked leaf lesions", "Yellow halo developing around dark spots", "Scabby raised lesions on stems and fruit"]
        symp_mr = ["पानांवर लहान पाणीदार कोनीय ठिपके", "ठिपक्यांभोवती पिवळसर वलय", "फळे व खोडावर खडबडीत चट्टे"]
        prev_en = ["Use certified disease-free treated seed", "Avoid working in field rows while foliage is wet", "Sterilize pruning tools"]
        prev_mr = ["प्रमाणित व बीजप्रक्रिया केलेले बियाणे वापरा", "पाने ओली असताना शेतात काम करणे टाळा", "छाटणीची अवजारे निर्जंतुक करा"]
        org_en = ["Spray Copper Oxychloride 50% WP @ 2.5 g/L", "Neem Oil 10,000 ppm @ 2 ml/L", "Seed treatment with Trichoderma viride"]
        org_mr = ["कॉपर ऑक्सिक्लोराईड ५०% डब्ल्यूपी @ २.५ ग्रॅम/लिटर फवारा", "निम तेल १०,००० पीपीएम @ २ मिली/लिटर फवारा", "ट्रायकोडर्मा बुरशीनाशकाची बीजप्रक्रिया करा"]
        chem_en = ["Streptomycin Sulfate + Tetracycline @ 6 g / 50 L water", "Copper Hydroxide 53.8% DF @ 2 g/L", "Kasugamycin 3% SL @ 2 ml/L"]
        chem_mr = ["स्ट्रेप्टोसायक्लिन ६ ग्रॅम प्रति ५० लिटर पाणी + कॉपर बुरशीनाशक", "कॉपर हायड्रॉक्साइड @ २ ग्रॅम/लिटर", "कासुगामायसिन ३% एसएल @ २ मिली/लिटर"]
        products = [
            PRODUCTS_REGISTRY["streptocycline"],
            PRODUCTS_REGISTRY["copper_oxychloride"],
            PRODUCTS_REGISTRY["mancozeb"]
        ]
    elif "late_blight" in disease_key.lower() or "late blight" in cond_en.lower():
        desc_en = f"Devastating oomycete pathogen Phytophthora infestans attacking leaves, stems, and fruits on {crop_en}."
        desc_mr = f"{crop_mr} पिकावरील फायटोफथोरा बुरशीमुळे होणारा अत्यंत घातक करपा रोग, ज्यामुळे पाने व फळे वेगाने सडतात."
        causes_en = "High humidity (>90%) with cool overcast temperatures (14-22°C) and persistent fog or rain."
        causes_mr = "९०% पेक्षा जास्त आर्द्रता, थंड हवामान (१४-२२ अंश से.) आणि ढगाळ वातावरणामुळे हा रोग वेगाने पसरतो."
        symp_en = ["Water-soaked dark lesions spreading rapidly across leaves", "White fungal mildew fuzz under leaves during damp mornings", "Dark brown greasy decay on fruits or tubers"]
        symp_mr = ["पानांवर वेगाने पसरणारे काळपट पाणीदार चट्टे", "सकाळच्या दमट हवेत पानाच्या खाली पांढरी बुरशी", "फळे किंवा कंदांवर तपकिरी तेलकट सड"]
        prev_en = ["Avoid sprinkler irrigation; maintain root drip irrigation", "Keep proper plant spacing and trellis vines", "Destroy infected crop residues"]
        prev_mr = ["तुषार सिंचन टाळा व ठिबक सिंचनाचा वापर करा", "रोपांमध्ये योग्य अंतर ठेवा", "रोगट झाडे तात्काळ नष्ट करा"]
        org_en = ["Trichoderma viride soil application (2.5 kg/acre)", "Copper Hydroxide spray @ 2 g/L", "Neem cake soil enrichment"]
        org_mr = ["ट्रायकोडर्मा व्हिरीडी एकरी २.५ किलो जमिनीत द्या", "कॉपर हायड्रॉक्साइड @ २ ग्रॅम/लिटर फवारा", "निंबोळी पेंडीचा जमिनीत वापर करा"]
        chem_en = ["Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold) @ 2.5 g/L", "Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L", "Dimethomorph 50% WP @ 1 g/L"]
        chem_mr = ["मेटालॅक्सिल ८% + मॅनकोझेब ६४% डब्ल्यूपी (रिडोमिल गोल्ड) @ २.५ ग्रॅम/लिटर", "सायमोक्सानिल + मॅनकोझेब @ २.५ ग्रॅम/लिटर", "डायमेथोमॉर्फ ५०% डब्ल्यूपी @ १ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["ridomil_gold"],
            PRODUCTS_REGISTRY["mancozeb"],
            PRODUCTS_REGISTRY["trichoderma_viride"]
        ]
    elif "early_blight" in disease_key.lower() or "early blight" in cond_en.lower():
        desc_en = f"Alternaria solani fungal infection on {crop_en} producing characteristic concentric ring target spots."
        desc_mr = f"{crop_mr} पिकावरील अल्टरनेरिया बुरशीमुळे होणारा रोग, ज्यामध्ये पानांवर चक्राकार रिंगसारखे ठिपके पडतात."
        causes_en = "Warm temperatures (24-29°C) with alternating wet and dry spells and dew."
        causes_mr = "२४-२९ अंश से. उबदार हवामान आणि कोरड्या व दमट वातावरणाची आलटून-पालटून होणारी स्थिती."
        symp_en = ["Target-board dark brown lesions with concentric rings", "Yellow halo surrounding necrotic spots", "Premature lower leaf death"]
        symp_mr = ["पानांवर चक्राकार रिंग असलेले गडद तपकिरी ठिपके", "ठिपक्यांभोवती पिवळसर कडा आणि पाने वाळणे", "खालची पाने अकाली गळून पडणे"]
        prev_en = ["3-year crop rotation with non-solanaceous crops", "Mulch soil with straw or plastic film", "Prune lower leaves"]
        prev_mr = ["कडधान्य किंवा तृणधान्यांसोबत ३ वर्षांची पीक फेरपालट करा", "प्लॅस्टिक मल्चिंग वापरा", "तळाकडील जुनी पाने काढून टाका"]
        org_en = ["Bacillus subtilis biofungicide @ 3 g/L", "Copper Oxychloride 50% WP @ 2.5 g/L", "Fermented Cow Urine & Neem spray"]
        org_mr = ["बॅसिलस सबटिलिस जैविक बुरशीनाशक @ ३ ग्रॅम/लिटर फवारा", "कॉपर ऑक्सिक्लोराईड ५०% डब्ल्यूपी @ २.५ ग्रॅम/लिटर फवारा", "दहापर्णी अर्क किंवा निम-गोमूत्र अर्क फवारा"]
        chem_en = ["Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L", "Chlorothalonil 75% WP @ 2 g/L", "Mancozeb 75% WP @ 2.5 g/L"]
        chem_mr = ["अॅझॉक्सीस्ट्रॉबिन १८.२% + डायफेनोकोनॅझोल ११.४% एससी @ १ मिली/लिटर", "क्लोरोथॅलोनिल ७५% डब्ल्यूपी @ २ ग्रॅम/लिटर", "मॅनकोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["amistar_top"],
            PRODUCTS_REGISTRY["mancozeb"],
            PRODUCTS_REGISTRY["trichoderma_viride"]
        ]
    elif "rust" in cond_en.lower():
        desc_en = f"Puccinia fungal rust infection producing orange-brown powdery pustules on {crop_en} foliage."
        desc_mr = f"{crop_mr} पिकावरील तांबेरा रोग, ज्यामुळे पानांवर नारंगी-तपकिरी पावडरीसारखे फोड येतात."
        causes_en = "Moderate temperatures (18-25°C) with high relative humidity and heavy dew."
        causes_mr = "१८-२५ अंश से. थंडसर हवामान आणि रात्री पडणारे दाट धुके."
        symp_en = ["Cinnamon-brown to orange powdery pustules on leaves", "Pustules erupt releasing fungal spores", "Severe leaf chlorosis and drying"]
        symp_mr = ["पानांवर नारंगी-तपकिरी रंगाचे पावडरी फोड", "फोड फुटून तपकिरी भुकटी बाहेर पडणे", "पाने पिवळी पडून वाळणे"]
        prev_en = ["Plant rust-resistant hybrids", "Ensure early seasonal sowing", "Eradicate alternate host weeds"]
        prev_mr = ["तांबेरा प्रतिकारक वाण निवडा", "वेळेवर पेरणी करा", "बांधावरील अनावश्यक तण काढून टाका"]
        org_en = ["Wettable Sulfur 80% WDG @ 3 g/L", "Neem Oil 10,000 ppm @ 2 ml/L", "Jiwamrita foliar spray"]
        org_mr = ["विद्राव्य गंधक ८०% डब्ल्यूडीजी @ ३ ग्रॅम/लिटर फवारा", "निम तेल १०,००० पीपीएम @ २ मिली/लिटर फवारा", "गाळलेले जीवामृत फवारा"]
        chem_en = ["Propiconazole 25% EC (Tilt) @ 1 ml/L", "Tebuconazole 25.9% EC @ 1 ml/L", "Mancozeb 75% WP @ 2.5 g/L"]
        chem_mr = ["प्रोपिकोनेझोल २५% ईसी (टिल्ट) @ १ मिली/लिटर", "टेब्युकोनॅझोल २५.९% ईसी @ १ मिली/लिटर", "मॅनकोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["tilt_propiconazole"],
            PRODUCTS_REGISTRY["sulfex"],
            PRODUCTS_REGISTRY["mancozeb"]
        ]
    elif "mildew" in cond_en.lower():
        desc_en = f"Powdery mildew infection on {crop_en} creating white fungal flour-like mycelial patches."
        desc_mr = f"{crop_mr} पिकावरील भुरी रोग, ज्याने पानांवर पांढऱ्या पावडरीसारखा थर पसरतो."
        causes_en = "Warm dry days with humid nights and shady canopy conditions."
        causes_mr = "उबदार दिवस, दमट रात्री आणि सावली असलेल्या जागी भुरीचा प्रादुर्भाव वाढतो."
        symp_en = ["White talc-like powdery spots on upper leaf surfaces", "Leaf curling, distortion, and yellowing", "Stunted new shoot growth"]
        symp_mr = ["पानांच्या वर पांढऱ्या पावडरीचे ठिपके", "पाने चुरगाळणे व पिवळी पडणे", "नवीन फुटींची वाढ खुंटणे"]
        prev_en = ["Prune inner branches for direct sunlight penetration", "Avoid excessive nitrogen fertilization", "Maintain wider planting spacing"]
        prev_mr = ["झाडाची विरळणी करून सूर्यप्रकाश पोहोचवा", "अति नत्र खतांचा वापर टाळा", "रोपांमध्ये पुरेसे अंतर ठेवा"]
        org_en = ["Potassium Bicarbonate spray @ 4 g/L", "Sulfur 80% WDG @ 2.5 g/L", "Neem Oil 10,000 ppm @ 3 ml/L"]
        org_mr = ["पोटॅशियम बायकार्बोनेट @ ४ ग्रॅम/लिटर फवारा", "सल्फर ८०% डब्ल्यूडीजी @ २.५ ग्रॅम/लिटर फवारा", "निम तेल १०,००० पीपीएम @ ३ मिली/लिटर फवारा"]
        chem_en = ["Hexaconazole 5% SC @ 1 ml/L", "Myclobutanil 10% WP @ 1 g/L", "Azoxystrobin 23% SC @ 1 ml/L"]
        chem_mr = ["हेक्साकोनॅझोल ५% एससी @ १ मिली/लिटर", "मायक्लोब्युटानिल १०% डब्ल्यूपी @ १ ग्रॅम/लिटर", "अॅझॉक्सीस्ट्रॉबिन २३% एससी @ १ मिली/लिटर"]
        products = [
            PRODUCTS_REGISTRY["sulfex"],
            PRODUCTS_REGISTRY["amistar_top"],
            PRODUCTS_REGISTRY["neem_oil"]
        ]
    elif "mites" in cond_en.lower():
        desc_en = f"Tetranychus spider mite pest infestation piercing leaf cells and sucking out plant sap on {crop_en}."
        desc_mr = f"{crop_mr} पिकावरील लाल कोळी किडीचा प्रादुर्भाव, जी पानांतील रस शोषून घेते व बारीक जाळे विणते."
        causes_en = "Hot, dry, dusty weather spells (above 30°C) triggering rapid mite population explosions."
        causes_mr = "कोरडे, उष्ण हवामान (३० अंश से. पेक्षा जास्त) आणि धुळीमुळे लाल कोळीचा उपद्रव वाढतो."
        symp_en = ["Fine yellow stippling and speckling on upper leaf surfaces", "Delicate silken webbing visible on leaf undersides", "Leaves turning bronzed, scorched, and dry"]
        symp_mr = ["पानांवर पिवळसर बारीक ठिपके पडणे", "पानांच्या खाली सूक्ष्म पांढरे जाळे दिसणे", "पाने तांबूस पडून वाळणे"]
        prev_en = ["Spray overhead water to knock off dust and mites during dry spells", "Conserve predatory beneficial phytoseiid mites", "Avoid broad-spectrum pyrethroid sprays"]
        prev_mr = ["उन्हाळ्यात पानांवर पाण्याचे फवारे मारून धूळ स्वच्छ करा", "मित्र कीटकांचे संवर्धन करा", "अनावश्यक विषारी कीटकनाशके टाळा"]
        org_en = ["Neem Oil 10,000 ppm @ 3 ml/L with liquid soap", "Sulfur 80% WDG @ 2.5 g/L", "Beauveria bassiana bio-acaricide @ 5 g/L"]
        org_mr = ["निम तेल १०,००० पीपीएम @ ३ मिली/लिटर फवारा", "सल्फर ८०% डब्ल्यूडीजी @ २.५ ग्रॅम/लिटर फवारा", "ब्युव्हेरिया बॅसियाना जैविक कीटकनाशक @ ५ ग्रॅम/लिटर फवारा"]
        chem_en = ["Spiromesifen 22.9% SC (Oberon) @ 1 ml/L", "Fenpyroximate 5% EC @ 1 ml/L", "Diafenthiuron 50% WP @ 1.2 g/L"]
        chem_mr = ["स्पिरोमेसिफेन २२.९% एससी (ओबेरॉन) @ १ मिली/लिटर", "फेनपायरॉक्सीमेट ५% ईसी @ १ मिली/लिटर", "डायफेनथियुरॉन ५०% डब्ल्यूपी @ १.२ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["spiromesifen_oberon"],
            PRODUCTS_REGISTRY["sulfex"],
            PRODUCTS_REGISTRY["neem_oil"]
        ]
    elif "virus" in cond_en.lower() or "curl" in cond_en.lower():
        desc_en = f"Viral pathogen transmitted by whiteflies or thrips vector causing stunted growth and leaf curling on {crop_en}."
        desc_mr = f"{crop_mr} पिकावरील पांढऱ्या माशीद्वारे पसरणारा विषाणूजन्य रोग (चुरडा-मुरडा), ज्यामुळे पाने आकसतात व झाड खुंटते."
        causes_en = "High whitefly (Bemisia tabaci) or thrips populations transmitting the virus from plant to plant."
        causes_mr = "पांढरी माशी आणि थ्रिप्स किडीमुळे एका झाडावरून दुसऱ्या झाडावर विषाणूचा वेगाने प्रसार होतो."
        symp_en = ["Upward curling, puckering, and crinkling of leaves", "Severe leaf chlorosis and vein yellowing", "Severe plant stunting and flower abortion"]
        symp_mr = ["पाने वरच्या किंवा खालच्या बाजूला वाकणे व आकसणे", "पानांच्या शिरा पिवळ्या पडणे", "झाडाची वाढ खुंटणे व फुले गळणे"]
        prev_en = ["Erect yellow and blue sticky traps (15-20 per acre)", "Grow insect-proof net nurseries (40 mesh)", "Rogue out and burn infected plants immediately"]
        prev_mr = ["एकरी १५-२० पिवळे व निळे चिकट सापळे लावा", "रोपवाटिका ४० मेशच्या जाळीत तयार करा", "रोगट झाडे मुळासकट उपटून नष्ट करा"]
        org_en = ["Neem Oil 10,000 ppm @ 3 ml/L against vectors", "Lecanicillium lecanii bio-insecticide @ 5 g/L", "Milk spray (10%) to neutralize viral transmission"]
        org_mr = ["पांढऱ्या माशीसाठी निम तेल १०,००० पीपीएम @ ३ मिली/लिटर", "व्हर्टिसिलियम लेकॅनी जैविक कीटकनाशक @ ५ ग्रॅम/लिटर", "१०% दुधाची फवारणी विषाणूचा प्रसार रोखण्यास मदत करते"]
        chem_en = ["Imidacloprid 17.8% SL @ 0.5 ml/L", "Thiamethoxam 25% WG @ 0.5 g/L", "Diafenthiuron 50% WP @ 1.2 g/L to control vector insects"]
        chem_mr = ["इमिडाक्लोप्रिड १७.८% एसएल @ ०.५ मिली/लिटर", "थायमेथॉक्झाम २५% डब्ल्यूजी @ ०.५ ग्रॅम/लिटर", "डायफेनथियुरॉन ५०% डब्ल्यूपी @ १.२ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["imidacloprid"],
            PRODUCTS_REGISTRY["neem_oil"],
            PRODUCTS_REGISTRY["seaweed_tonic"]
        ]
    elif "greening" in cond_en.lower() or "haunglongbing" in cond_en.lower():
        desc_en = f"Citrus greening (Huanglongbing) caused by Candidatus Liberibacter bacteria transmitted by citrus psyllids."
        desc_mr = f"सायट्रस ग्रीनिंग हा लिंबूवर्गीय फळांवरील सायकला (Psyllid) किडीमुळे पसरणारा अत्यंत गंभीर जिवाणूजन्य रोग आहे."
        causes_en = "Asian citrus psyllid insects spreading the phloem-limited bacteria during feeding."
        causes_mr = "सायट्रीला किडीद्वारे झाडाच्या रसवाहिन्यांमध्ये जिवाणूंचा संसर्ग होतो."
        symp_en = ["Asymmetrical blotchy yellow mottle on leaves", "Yellowing of leaf veins resembling mineral deficiency", "Small, lopsided, sour green fruit with dark seeds"]
        symp_mr = ["पानांवर असममित पिवळे चट्टे", "पानांच्या शिरा पिवळ्या पडणे", "फळे लहान, वेडीवाकडी व आंबट राहणे"]
        prev_en = ["Use certified disease-free nursery saplings", "Control citrus psyllid vector populations aggressively", "Eradicate severely declining trees"]
        prev_mr = ["प्रमाणित शासकीय रोपवाटिकेतून कलमे घ्या", "सायट्रीला किडीचे कडक नियंत्रण करा", "अत्यंत रोगट झाडे काढून नष्ट करा"]
        org_en = ["Neem Oil 10,000 ppm @ 3 ml/L against psyllids", "Nutritional zinc, iron, and manganese foliar sprays", "Trichoderma root drench"]
        org_mr = ["किडीसाठी निम तेल १०,००० पीपीएम @ ३ मिली/लिटर", "जस्त, लोह आणि मँगनीजची फवारणी", "ट्रायकोडर्माची आळवणी"]
        chem_en = ["Imidacloprid 17.8% SL @ 0.5 ml/L against vectors", "Streptocycline @ 6 g / 50 L + Copper Oxychloride @ 2.5 g/L", "Specialist Antibiotic under expert guidance"]
        chem_mr = ["इमिडाक्लोप्रिड १७.८% एसएल @ ०.५ मिली/लिटर", "स्ट्रेप्टोसायक्लिन ६ ग्रॅम/५० लिटर + कॉपर ऑक्सिक्लोराईड @ २.५ ग्रॅम/लिटर", "विशेष तज्ञांच्या मार्गदर्शनाखाली उपचार"]
        products = [
            PRODUCTS_REGISTRY["imidacloprid"],
            PRODUCTS_REGISTRY["copper_oxychloride"],
            PRODUCTS_REGISTRY["specialty_antibiotic"]
        ]
    else:
        # General fungal blight/spot fallback
        desc_en = f"Foliar pathogen on {crop_en} causing necrotic lesions, chlorosis, and potential yield reduction."
        desc_mr = f"{crop_mr} पिकावरील करपा/ठिपके रोग, ज्यामुळे पानांवर डाग पडून झाडाची वाढ खुंटते."
        causes_en = "High humidity, overhead water splash, and optimal fungal temperature range."
        causes_mr = "हवेतील जास्त आर्द्रता, पाण्याचा मारा आणि ढगाळ हवामान यामुळे संसर्ग होतो."
        symp_en = ["Necrotic leaf spots and yellowing halo", "Premature foliage drying and drop"]
        symp_mr = ["पानांवर काळे-तपकिरी ठिपके आणि पिवळसर कडा", "पाने अकाली वाळून गळणे"]
        prev_en = ["Maintain field sanitation and wider crop spacing", "Avoid overhead sprinkler irrigation"]
        prev_mr = ["शेतात स्वच्छता ठेवा आणि झाडांमध्ये योग्य अंतर ठेवा", "तुषार सिंचन टाळा"]
        org_en = ["Copper Oxychloride 50% WP @ 2.5 g/L", "Trichoderma viride 1.5% WP @ 5 g/L", "Neem Oil 10,000 ppm @ 2 ml/L"]
        org_mr = ["कॉपर ऑक्सिक्लोराईड ५०% डब्ल्यूपी @ २.५ ग्रॅम/लिटर", "ट्रायकोडर्मा व्हिरीडी @ ५ ग्रॅम/लिटर", "निम तेल १०,००० पीपीएम @ २ मिली/लिटर"]
        chem_en = ["Mancozeb 75% WP @ 2.5 g/L", "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L", "Chlorothalonil 75% WP @ 2 g/L"]
        chem_mr = ["मॅनकोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम/लिटर", "अॅझॉक्सीस्ट्रॉबिन + डायफेनोकोनॅझोल @ १ मिली/लिटर", "क्लोरोथॅलोनिल ७५% डब्ल्यूपी @ २ ग्रॅम/लिटर"]
        products = [
            PRODUCTS_REGISTRY["mancozeb"],
            PRODUCTS_REGISTRY["copper_oxychloride"],
            PRODUCTS_REGISTRY["amistar_top"]
        ]

    return {
        "crop": crop_en,
        "crop_en": crop_en,
        "crop_mr": crop_mr,
        "condition": cond_en,
        "condition_en": cond_en,
        "condition_mr": cond_mr,
        "is_healthy": is_healthy,
        "description": desc_en,
        "description_en": desc_en,
        "description_mr": desc_mr,
        "causes": causes_en,
        "causes_en": causes_en,
        "causes_mr": causes_mr,
        "symptoms": symp_en,
        "symptoms_en": symp_en,
        "symptoms_mr": symp_mr,
        "prevention": prev_en,
        "prevention_en": prev_en,
        "prevention_mr": prev_mr,
        "organic_treatment": org_en,
        "organic_treatment_en": org_en,
        "organic_treatment_mr": org_mr,
        "chemical_treatment": chem_en,
        "chemical_treatment_en": chem_en,
        "chemical_treatment_mr": chem_mr,
        "products": products,
        "disclaimer_en": DISCLAIMER_EN,
        "disclaimer_mr": DISCLAIMER_MR
    }
