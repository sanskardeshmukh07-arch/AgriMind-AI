import os
import re
import requests
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.core.database import SessionLocal
from backend.models.user import User
from backend.api.auth import get_current_user, get_db

router = APIRouter(prefix="/api/assistant", tags=["Farmer Assistant"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


# Comprehensive Agronomy Knowledge Base for offline / unconfigured mode
AGRONOMY_KNOWLEDGE_BASE = [
    {
        "keywords": ["bollworm", "cotton", "बोंडअळी", "कापूस", "गुलाबी बोंडअळी"],
        "response_en": """**Pink Bollworm Management in Cotton (ICAR / CICR Guidelines):**
1. **Pheromone Traps:** Install 5 Phero-sensor traps per acre for pest monitoring. If 8 moths/trap are caught for 3 consecutive days, initiate control measures.
2. **Biological Control:** Release *Trichogramma bactrae* @ 60,000 eggs/acre at weekly intervals when flowering begins.
3. **Chemical Sprays:**
   - Early infestation: Spray Profenofos 50% EC @ 30 ml or Emamectin Benzoate 5% SG @ 5 g per 10 L water.
   - For rosette flowers: Chlorantraniliprole 18.5% SC @ 3 ml per 10 L water.
4. **Safety & Precautions:** Spray in calm weather wearing gloves and masks. Maintain a 15-day pre-harvest interval.""",
        "response_mr": """**कापसावरील गुलाबी बोंडअळीचे एकात्मिक नियंत्रण (ICAR व CICR शिफारसी):**
१. **कामगंध सापळे:** कीड निरीक्षणासाठी एकरी ५ कामगंध सापळे लावा. सलग ३ दिवस प्रति सापळा ८ पतंग आढळल्यास नियंत्रण उपाय सुरू करा.
२. **जैविक उपाय:** फुलधारणा अवस्थेत ट्रायकोकार्ड (*ट्रायकोrequest ग्राम्मा*) एकरी ६०,००० या प्रमाणात ८ दिवसांच्या अंतराने लावा.
३. **रासायनिक फवारणी:**
   - सुरुवातीला: प्रोफेनोफॉस ५०% ईसी ३० मि.ली. किंवा इमामेक्टिन बेन्झोएट ५% एसजी ५ ग्रॅम प्रति १० लिटर पाणी.
   - प्रादुर्भाव जास्त असल्यास: क्लोराँट्रानिलीप्रोल १८.५% एससी ३ मि.ली. प्रति १० लिटर पाणी.
४. **खबरदारी:** फवारणी शांत हवेत करावी आणि सुरक्षितता किट वापरावे."""
    },
    {
        "keywords": ["fertilizer", "urea", "dap", "npk", "खत", "युरिया", "डीएपी", "खत व्यवस्थापन", "potash"],
        "response_en": """**Balanced Fertilizer (NPK) Management (ICAR Norms):**
1. **Soil-Test Based Application:** Always adjust fertilizer dosage based on your soil test values.
2. **Basal Dose:** Apply 50% Nitrogen and 100% Phosphorus and Potassium at the time of sowing/planting.
3. **Top Dressing:** Apply the remaining 50% Nitrogen in two equal splits during peak vegetative growth and flowering stages.
4. **Neem-Coated Urea:** Use Neem-coated urea to minimize nitrogen leaching and enhance nutrient efficiency.
5. **Micronutrients:** Zinc Sulphate (25 kg/ha) or Ferrous Sulphate (15 kg/ha) should be applied if deficiency symptoms appear, never mixing directly with DAP.""",
        "response_mr": """**संतुलित खत व्यवस्थापन (NPK शिफारसी):**
१. **माती परीक्षणानुसार खते:** मातीतील उपलब्ध अन्नद्रव्यांनुसार खतांचे प्रमाण ठरवा.
२. **पायाभूत खत (पेरणीच्या वेळी):** एकूण नत्राचा ५०% भाग आणि संपूर्ण स्फुरद व पालाश पेरणीच्या वेळी द्या.
३. **वरखते (Top Dressing):** उरलेला ५०% नत्र पीक वाढीच्या आणि फुलोऱ्याच्या अवस्थेत दोन समान हप्त्यांत द्या.
४. **कडुलिंबयुक्त (Neem Coated) युरिया:** यामुळे नत्राचा अपव्यय कमी होऊन पिकाला दीर्घकाळ पोषण मिळते.
५. **सूक्ष्म अन्नद्रव्ये:** झिंक किंवा लोहाची कमतरता असल्यास झिंक सल्फेट किंवा फेरस सल्फेट स्वतंत्रपणे द्यावे (डीएपी सोबत एकत्र करू नये)."""
    },
    {
        "keywords": ["blight", "early blight", "late blight", "करपा", "टॉमेटो करपा", "बटाटा करपा"],
        "response_en": """**Management of Early and Late Blight (Foliar Diseases):**
1. **Symptoms:** Brown-black concentric rings on leaves (Early Blight) or water-soaked lesions turning dark brown with white fuzz beneath (Late Blight).
2. **Preventative Spray:** Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3 g/L as soon as cloudy, humid conditions prevail.
3. **Curative Spray (Late Blight Outbreak):**
   - Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L of water.
   - Or Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L.
4. **Field Sanitation:** Remove and burn infected lower foliage. Avoid overhead sprinkler irrigation during high humidity.""",
        "response_mr": """**टोमॅटो व बटाट्यावरील करपा (Blight) नियंत्रण:**
१. **लक्षणे:** पानाच्या खालच्या भागावर तपकिरी-काळे गोलाकार डाग पडणे किंवा पाने काळवंडून जळाल्यासारखी दिसणे.
२. **प्रतिबंधात्मक उपाय:** ढगाळ व दमट हवामानात मँकोझेब ७५% डब्ल्यूपी २.५ ग्रॅम किंवा कॉपर ऑक्सिक्लोराईड ३ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.
३. **उपचारात्मक फवारणी:**
   - मेटालाक्सिल ८% + मँकोझेब ६४% डब्ल्यूपी (रिडोमिल) २.५ ग्रॅम प्रति लिटर पाणी.
   - किंवा सायमोक्सॅनिल + मँकोझेब २ ग्रॅम प्रति लिटर पाणी.
४. **मशागत:** शेतातील तण काढून टाका आणि पाण्याचा निचरा योग्य राखा."""
    },
    {
        "keywords": ["powdery mildew", "भुरी", "पांढरी बुरशी", "mildew"],
        "response_en": """**Powdery Mildew Management (Grapes, Pulses, Vegetables):**
1. **Identification:** White powdery fungal patches on upper surface of leaves and young shoots.
2. **Organic Control:** Spray Wettable Sulphur 80% WP @ 2.5 g/L or Neem Oil (10,000 ppm) @ 3 ml/L of water.
3. **Systemic Fungicides:**
   - Hexaconazole 5% EC @ 1 ml/L water, OR
   - Difenoconazole 25% EC (Score) @ 0.5 ml/L water.
4. **Best Practices:** Ensure proper plant canopy ventilation and morning sunlight penetration.""",
        "response_mr": """**भुरी रोगाचे नियंत्रण (द्राक्ष, भाजीपाला, कडधान्ये):**
१. **लक्षणे:** पानांवर आणि कोवळ्या फांद्यांवर पांढऱ्या पिठासारखी बुरशीची थर दिसणे.
२. **जैविक/सेंद्रिय उपाय:** विद्राव्य गंधक (Wettable Sulphur 80% WP) २.५ ग्रॅम प्रति लिटर किंवा कडुनिंब अर्क (Neem Oil) ३ मि.ली. प्रति लिटर फवारा.
३. **रासायनिक उपाय:**
   - हेक्झाकोनॅझोल ५% ईसी १ मि.ली. प्रति लिटर पाणी, किंवा
   - डायफेनोकोनॅझोल २५% ईसी (स्कोअर) ०.५ मि.ली. प्रति लिटर पाणी.
४. **काळजी:** झाडांमध्ये हवा खेळती राहील अशी मशागत ठेवावी."""
    },
    {
        "keywords": ["scheme", "pm kisan", "subsidy", "योजना", "पीएम किसान", "अनुदान", "विमा", "पीक विमा"],
        "response_en": """**Key Government Agricultural Schemes for Farmers:**
1. **PM-KISAN:** Income support of ₹6,000 per year in 3 equal installments of ₹2,000 directly into farmer bank accounts.
2. **Pradhan Mantri Fasal Bima Yojana (PMFBY):** Comprehensive crop insurance covering natural calamities, pests, and post-harvest losses with nominal farmer premium (1.5% Rabi, 2% Kharif).
3. **MahaDBT (Maharashtra Farmers):** Subsidies up to 50-80% on drip irrigation systems, farm ponds, tractors, and agricultural implements.
4. **Soil Health Card Scheme:** Free testing of soil samples every 2 years with crop-specific fertilizer recommendations.""",
        "response_mr": """**शेतकऱ्यांसाठी महत्त्वाच्या शासकीय कृषी योजना:**
१. **पीएम-किसान (PM-KISAN):** शेतकऱ्यांच्या खात्यात वार्षिक ₹६,००० (दर ४ महिन्यांनी ₹२,००० चे ३ हप्ते) थेट जमा होतात.
२. **पंतप्रधान पीक विमा योजना (PMFBY):** नैसर्गिक आपत्ती, दुष्काळ, कीड व रोगांमुळे होणाऱ्या नुकसानापासून संरक्षण (खरीप २%, रब्बी १.५% प्रीमियम).
३. **महाडीबीटी (MahaDBT):** ठिबक सिंचन, शेततळे, ट्रॅक्टर आणि कृषी अवजारांवर ५०% ते ८०% पर्यंत शासकीय अनुदान उपलब्ध.
४. **मृदा आरोग्य पत्रिका (Soil Health Card):** मातीचे मोफत परीक्षण व खतांचा संतुलित वापर करण्यासाठी अधिकृत पत्रिका."""
    },
    {
        "keywords": ["soil", "ph", "acidic", "alkaline", "माती", "सामू", "खारवट", "सुपीकता"],
        "response_en": """**Soil Health and pH Correction Guidance:**
1. **Acidic Soils (pH < 6.0):** Apply agricultural lime (Calcium carbonate) or dolomite @ 2-4 quintals/acre based on acidity to raise pH and improve phosphorus availability.
2. **Alkaline/Saline Soils (pH > 8.0):** Apply agricultural Gypsum @ 5 quintals/acre followed by deep leaching to flush excess sodium salts.
3. **Organic Matter:** Incorporate 5-8 tons of well-decomposed FYM (Farm Yard Manure) or vermicompost per acre to enhance microbial activity and buffer pH.
4. **Green Manuring:** Grow and incorporate Dhaincha (Sesbania) or Sunnhemp prior to main season planting.""",
        "response_mr": """**मातीची सुपीकता आणि सामू (pH) सुधारणा:**
१. **आम्लयुक्त जमीन (pH < ६.०):** जमिनीचा आम्लधर्म कमी करण्यासाठी एकरी २ ते ४ क्विंटल शेती चुना किंवा डोलोमाइट मिसळा.
२. **खारवट/अल्कधर्मी जमीन (pH > ८.०):** मातीतील अतिरिक्त क्षार काढून टाकण्यासाठी एकरी ५ क्विंटल जिप्सम वापरा आणि पाण्याचा चांगला निचरा करा.
३. **सेंद्रिय कर्ब वाढवणे:** दरवर्षी एकरी ५ ते ८ टन चांगले कुजलेले शेणखत किंवा गांडूळ खत वापरा.
४. **हिरवळीची खते:** ताग किंवा ढेंचा पेरून फुलोऱ्यात असताना जमिनीत गाडल्यास सेंद्रिय कर्ब व नत्राचे प्रमाण वाढते."""
    }
]


def detect_language(text: str) -> str:
    """Detects whether text has Devanagari script (Marathi/Hindi) or Latin (English)."""
    if re.search(r'[\u0900-\u097F]', text):
        return "mr"
    return "en"


def get_rule_based_response(message: str, user_lang: str, context: Optional[dict] = None) -> str:
    """Matches agricultural keywords against curated ICAR agronomy database."""
    clean_msg = message.lower()
    
    for item in AGRONOMY_KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw.lower() in clean_msg:
                return item["response_mr"] if user_lang == "mr" else item["response_en"]
    
    # Generic intelligent fallback
    if user_lang == "mr":
        return """**AgriMind AI शेतकरी सहाय्यक सल्ला:**
आपला प्रश्न शेतीशी संबंधित आहे. अचूक सल्ला देण्यासाठी खालील माहिती उपयुक्त ठरेल:
१. **पिकाचे नाव व वय:** पीक कोणत्या अवस्थेत आहे? (उदा. वाढ, फुलोरा, फळधारणा)
२. **दिसणारी लक्षणे:** पानांवर डाग, पाने पिवळी पडणे किंवा अळीचा प्रादुर्भाव?
३. **माती व पाणी स्थिती:** ठिबक सिंचन आहे की पाटपाणी?

कृपया वर दिलेल्या त्वरित प्रश्नांवर क्लिक करा किंवा रोगाचे नाव/पिकाचे नाव नमूद करून प्रश्न विचारा. आम्ही आपल्याला ICAR व कृषी विद्यापीठाच्या अधिकृत शिफारसीनुसार मार्गदर्शन करू."""
    else:
        return """**AgriMind AI Farmer Advisory:**
To provide the most accurate agronomic advice, please specify:
1. **Crop name & stage:** (e.g., vegetative growth, flowering, grain filling)
2. **Observed symptoms:** (e.g., leaf spots, wilting, chewing damage, pest presence)
3. **Soil & irrigation conditions:** (e.g., drip irrigated, rainfed, black soil)

You can also click on the recommended quick questions above or ask about specific fertilizers, diseases, pest controls, or government schemes."""


@router.post("/chat")
def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_msg = request.message.strip()
    if not user_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    user_lang = detect_language(user_msg)
    api_key = os.getenv("GEMINI_API_KEY")

    # If GEMINI_API_KEY is configured, call Gemini API
    if api_key and api_key.strip() and "your_" not in api_key.lower():
        try:
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            system_instruction = (
                "You are AgriMind AI, a trusted, highly experienced agricultural scientist and agronomist working with Indian farmers. "
                "Your mission is to provide accurate, practical, and farmer-friendly advice on crops, plant diseases, fertilizers, pest management, weather adaptation, and government schemes. "
                "Follow these rules strictly:\n"
                f"1. Language: Answer in {'fluent, polite Marathi (मराठी)' if user_lang == 'mr' else 'clear, practical English'}.\n"
                "2. Structure: Use bullet points, clear headings, and highlight approved ICAR / Indian agricultural university norms.\n"
                "3. Chemical safety: Always mention safety gear and dosage per 10 Litres or per acre.\n"
                "4. Organic first: Mention viable biological or organic solutions (like Trichoderma, Neem oil, Jeevamrut) alongside registered chemical controls.\n"
                "5. Never hallucinate fake products or hazardous combinations."
            )

            prompt_content = f"Farmer inquiry: {user_msg}\n"
            if request.context:
                prompt_content += f"\nContext information from farmer's dashboard:\n{str(request.context)}"

            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {"text": f"{system_instruction}\n\n{prompt_content}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 800
                }
            }

            resp = requests.post(gemini_url, json=payload, timeout=10)
            if resp.ok:
                resp_json = resp.json()
                candidates = resp_json.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return {
                            "success": True,
                            "response": parts[0]["text"],
                            "source": "gemini",
                            "api_configured": True,
                            "language": user_lang
                        }
        except Exception as e:
            # Silently fall back to built-in agronomy knowledge base on network/api error
            pass

    # Built-in Agronomy Knowledge Base Fallback
    fallback_answer = get_rule_based_response(user_msg, user_lang, request.context)
    return {
        "success": True,
        "response": fallback_answer,
        "source": "knowledge_base",
        "api_configured": bool(api_key and "your_" not in api_key.lower()),
        "language": user_lang
    }
