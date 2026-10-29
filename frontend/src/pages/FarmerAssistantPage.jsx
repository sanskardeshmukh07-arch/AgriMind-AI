import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import {
  Bot,
  User,
  Send,
  Trash2,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Wheat,
  Layers,
  Sprout
} from "lucide-react";
import "./FarmerAssistantPage.css";

const QUICK_QUESTIONS_EN = [
  "How to control pink bollworm in cotton?",
  "What is the balanced NPK fertilizer schedule?",
  "How to treat early and late blight in tomato?",
  "How to manage powdery mildew in vegetables?",
  "What are the best government subsidy schemes for farmers?",
  "How to correct acidic and alkaline soil pH?"
];

const QUICK_QUESTIONS_MR = [
  "कापसावरील बोंडअळी नियंत्रण कसे करावे?",
  "पिकांसाठी योग्य NPK खत व्यवस्थापन कसे करावे?",
  "टोमॅटोवरील करपा (Blight) कसा रोखावा?",
  "भाजीपाल्यावरील भुरी रोगाचे नियंत्रण कसे करावे?",
  "शेतकऱ्यांसाठी महत्त्वाच्या सरकारी योजना कोणत्या आहेत?",
  "मातीचा सामू (pH) सुधारण्यासाठी काय करावे?"
];

function FarmerAssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestContext, setLatestContext] = useState(null);
  const [useContext, setUseContext] = useState(true);
  const chatBottomRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMsg = {
      id: "welcome-1",
      sender: "assistant",
      text:
        language === "mr"
          ? "नमस्कार शेतकरी बंधूंनो! मी AgriMind AI शेतकरी सहाय्यक आहे. मी आपल्याला पिकांचे नियोजन, खते, कीड व रोग नियंत्रण, हवामान आणि शासकीय योजनांवर अधिकृत कृषी सल्ला देऊ शकतो. खालील त्वरित प्रश्नांवर क्लिक करा किंवा आपला प्रश्न खाली विचारा."
          : "Hello Farmer! I am your AgriMind AI Assistant. I can assist you with crop management, fertilizer schedules, pest and disease identification, weather adaptations, and government subsidies. Feel free to click any quick question below or ask me directly.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "knowledge_base"
    };
    setMessages([welcomeMsg]);
  }, [language]);

  // Load latest recommendation & soil context to assist farmer
  useEffect(() => {
    const loadContext = async () => {
      try {
        const [recs, soils] = await Promise.all([
          api.getRecommendations().catch(() => []),
          api.getSoilHistory().catch(() => [])
        ]);
        if ((recs && recs.length > 0) || (soils && soils.length > 0)) {
          setLatestContext({
            latest_crop: recs && recs.length > 0 ? recs[0].crop : null,
            latest_soil: soils && soils.length > 0 ? soils[0] : null
          });
        }
      } catch (err) {
        // Context is optional
      }
    };
    loadContext();
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    setError(null);

    try {
      const payloadContext = useContext ? latestContext : null;
      const res = await api.chatAssistant(query, payloadContext);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: res.response || "No response received.",
        source: res.source || "knowledge_base",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || (language === "mr" ? "सल्ला मिळवण्यात अडचण आली." : "Failed to receive advice."));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const resetWelcome = {
      id: `welcome-${Date.now()}`,
      sender: "assistant",
      text:
        language === "mr"
          ? "संभाषण पुसले आहे. नवीन प्रश्न विचारण्यासाठी तयार आहे!"
          : "Chat cleared. Ready for your next agricultural question!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "knowledge_base"
    };
    setMessages([resetWelcome]);
  };

  const quickQuestions = language === "mr" ? QUICK_QUESTIONS_MR : QUICK_QUESTIONS_EN;

  return (
    <Layout>
      <div className="assistant-page">
        {/* Header */}
        <div className="assistant-header">
          <div>
            <h1 className="assistant-title">{t("assistantHeading")}</h1>
            <p className="assistant-subtitle">{t("assistantDescription")}</p>
          </div>
          <button className="clear-chat-btn" onClick={handleClearChat} title={t("clearChatBtn")}>
            <Trash2 size={16} />
            <span>{t("clearChatBtn")}</span>
          </button>
        </div>

        {/* Farmer Farm Context Badge (if available) */}
        {latestContext && (
          <div className="assistant-context-banner">
            <div className="context-left">
              <Sparkles size={16} color="#1F6B43" />
              <span>
                {language === "mr"
                  ? `आपल्या खात्याचा संदर्भ जोडला: ${latestContext.latest_crop ? `पीक: ${latestContext.latest_crop}` : ""} ${latestContext.latest_soil ? `| माती: ${latestContext.latest_soil.soil_type || ""}` : ""}`
                  : `Active Farm Context: ${latestContext.latest_crop ? `Crop: ${latestContext.latest_crop}` : ""} ${latestContext.latest_soil ? `| Soil: ${latestContext.latest_soil.soil_type || ""}` : ""}`}
              </span>
            </div>
            <label className="context-toggle">
              <input
                type="checkbox"
                checked={useContext}
                onChange={(e) => setUseContext(e.target.checked)}
              />
              <span>{language === "mr" ? "संदर्भ वापरा" : "Include farm context"}</span>
            </label>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="quick-inquiries-box">
          <span className="quick-inquiries-label">
            <HelpCircle size={15} />
            {t("examplePromptsTitle")}
          </span>
          <div className="quick-prompts-grid">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-prompt-chip"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window-card">
          <div className="messages-stream">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "assistant-row"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="chat-avatar assistant-avatar">
                    <Wheat size={18} color="#12301F" />
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "assistant-bubble"}`}>
                  <div className="chat-bubble-content">
                    {/* Render message lines with bold bullet points formatting */}
                    {msg.text.split("\n").map((line, lIdx) => {
                      if (!line.trim()) return <br key={lIdx} />;
                      return (
                        <p key={lIdx} className="message-line">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  <div className="chat-bubble-footer">
                    <span className="message-time">{msg.timestamp}</span>
                    {msg.source && (
                      <span className="message-source-tag">
                        {msg.source === "gemini" ? "✦ Gemini AI" : "✓ ICAR Agronomy Engine"}
                      </span>
                    )}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="chat-avatar user-avatar">
                    <User size={18} color="#FFFFFF" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row assistant-row">
                <div className="chat-avatar assistant-avatar">
                  <Wheat size={18} color="#12301F" />
                </div>
                <div className="chat-bubble assistant-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">
                    {language === "mr" ? "कृषी सल्लागार विचार करत आहे..." : "Agronomist is typing advice..."}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error-notice">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-input-bar"
          >
            <input
              type="text"
              className="chat-text-input"
              placeholder={t("assistantPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !inputText.trim()}
              title={t("sendBtn")}
            >
              <Send size={18} />
              <span>{t("sendBtn")}</span>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default FarmerAssistantPage;
