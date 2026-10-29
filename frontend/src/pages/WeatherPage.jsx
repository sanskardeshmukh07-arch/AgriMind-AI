import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import {
  CloudSun,
  MapPin,
  Search,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  Thermometer
} from "lucide-react";
import "./WeatherPage.css";

const POPULAR_DISTRICTS = [
  "Pune",
  "Nashik",
  "Nagpur",
  "Kolhapur",
  "Chhatrapati Sambhajinagar",
  "Solapur",
  "Amravati"
];

function WeatherPage() {
  const { t, language } = useLanguage();
  const [cityInput, setCityInput] = useState("Pune");
  const [currentCity, setCurrentCity] = useState("Pune");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWeatherByCity(city);
      if (data && data.success) {
        setWeatherData(data);
        setCurrentCity(data.location || city);
      } else {
        setWeatherData(data);
        const errMsg =
          language === "mr"
            ? data?.message_mr || data?.message || "हवामान माहिती उपलब्ध नाही."
            : data?.message || "Weather information unavailable.";
        setError(errMsg);
      }
    } catch (err) {
      setError(err.message || (language === "mr" ? "हवामान डेटा लोड करण्यात त्रुटी आली." : "Failed to load weather data."));
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      setError(language === "mr" ? "आपल्या ब्राउझरमध्ये GPS स्थान समर्थित नाही." : "Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await api.getWeatherByCoords(latitude, longitude);
          if (data && data.success) {
            setWeatherData(data);
            setCurrentCity(data.location || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          } else {
            setWeatherData(data);
            const errMsg =
              language === "mr"
                ? data?.message_mr || data?.message || "स्थानिक हवामान उपलब्ध नाही."
                : data?.message || "Location weather unavailable.";
            setError(errMsg);
          }
        } catch (err) {
          setError(err.message || "Failed to load location weather.");
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        setLoading(false);
        setError(
          language === "mr"
            ? `स्थान मिळवण्यात अयशस्वी: ${geoErr.message}`
            : `GPS error: ${geoErr.message}. You can search your district manually.`
        );
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchWeather(currentCity);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
    }
  };

  return (
    <Layout>
      <div className="weather-page">
        {/* Page Header */}
        <div className="weather-header">
          <div>
            <h1 className="weather-title">{t("weatherPageHeading")}</h1>
            <p className="weather-subtitle">{t("weatherPageDescription")}</p>
          </div>
        </div>

        {/* Search & Location Bar */}
        <div className="weather-search-card">
          <form onSubmit={handleSearchSubmit} className="weather-search-form">
            <div className="weather-search-input-wrapper">
              <Search size={18} className="weather-search-icon" />
              <input
                type="text"
                className="weather-search-input"
                placeholder={t("searchCityPlaceholder")}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
            </div>
            <button type="submit" className="weather-search-btn" disabled={loading}>
              <Search size={16} />
              <span>{t("searchCityBtn")}</span>
            </button>
            <button
              type="button"
              className="weather-location-btn"
              onClick={handleLocationSearch}
              disabled={loading}
            >
              <MapPin size={16} />
              <span>{t("useCurrentLocation")}</span>
            </button>
          </form>

          {/* Quick Select District Chips */}
          <div className="quick-districts">
            <span className="quick-districts-label">
              {language === "mr" ? "प्रमुख कृषी जिल्हे:" : "Agricultural Hubs:"}
            </span>
            <div className="district-chips-row">
              {POPULAR_DISTRICTS.map((district) => (
                <button
                  key={district}
                  type="button"
                  className={`district-chip ${currentCity.toLowerCase().includes(district.toLowerCase()) ? "active" : ""}`}
                  onClick={() => {
                    setCityInput(district);
                    fetchWeather(district);
                  }}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error / Warning Notice */}
        {error && (
          <div className="weather-alert-card error">
            <AlertTriangle size={20} className="alert-icon" />
            <div className="alert-content">
              <strong>{language === "mr" ? "सूचना" : "Notice"}</strong>
              <p>{error}</p>
              {weatherData && !weatherData.api_configured && (
                <div className="api-config-guide">
                  <p>
                    {language === "mr"
                      ? "थेट OpenWeather डेटा सक्रिय करण्यासाठी, backend/.env फाईलमध्ये OPENWEATHER_API_KEY सेट करा."
                      : "To enable live OpenWeather data, add OPENWEATHER_API_KEY to your backend .env file."}
                  </p>
                  <code>OPENWEATHER_API_KEY=your_openweather_api_key_here</code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="weather-loading-card">
            <div className="spinner"></div>
            <p>{t("loading")}</p>
          </div>
        )}

        {/* Weather Results Content */}
        {!loading && weatherData && weatherData.success && (
          <div className="weather-content-grid">
            {/* 1. Current Observation Card */}
            <div className="weather-card current-obs-card">
              <div className="card-top-row">
                <div className="location-heading">
                  <MapPin size={20} color="#1F6B43" />
                  <div>
                    <h2 className="current-location-name">{weatherData.location}</h2>
                    <span className="live-badge">
                      <span className="live-dot"></span>
                      {language === "mr" ? "थेट OpenWeather निरीक्षण" : "Live OpenWeather Observation"}
                    </span>
                  </div>
                </div>
                <div className="current-condition-badge">
                  {weatherData.condition}
                </div>
              </div>

              <div className="current-temp-layout">
                <div className="temp-main-display">
                  <div className="temp-number">{Math.round(weatherData.temperature)}°C</div>
                  <div className="temp-desc">
                    {weatherData.condition_description} · {language === "mr" ? "जाणवणारे तापमान" : "Feels like"}{" "}
                    {Math.round(weatherData.feels_like)}°C
                  </div>
                </div>
                {weatherData.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
                    alt={weatherData.condition}
                    className="weather-main-icon"
                  />
                )}
              </div>

              {/* Key Metric Tiles */}
              <div className="weather-metrics-row">
                <div className="metric-box">
                  <div className="metric-header">
                    <Droplets size={16} color="#1F6B43" />
                    <span>{t("humidityLabel")}</span>
                  </div>
                  <div className="metric-val">{weatherData.humidity}%</div>
                  <span className="metric-sub">
                    {weatherData.humidity > 70
                      ? language === "mr" ? "जास्त आर्द्रता" : "High humidity"
                      : language === "mr" ? "सामान्य आर्द्रता" : "Optimal"}
                  </span>
                </div>

                <div className="metric-box">
                  <div className="metric-header">
                    <Wind size={16} color="#1F6B43" />
                    <span>{t("windSpeed")}</span>
                  </div>
                  <div className="metric-val">{weatherData.wind_kmh} <small>km/h</small></div>
                  <span className="metric-sub">
                    {weatherData.wind_kmh > 18
                      ? language === "mr" ? "जोरदार वारा" : "Breezy / Strong"
                      : language === "mr" ? "शांत हवा" : "Calm / Mild"}
                  </span>
                </div>

                <div className="metric-box">
                  <div className="metric-header">
                    <CloudRain size={16} color="#1F6B43" />
                    <span>{t("rainChance")}</span>
                  </div>
                  <div className="metric-val">{weatherData.rainfall} <small>mm</small></div>
                  <span className="metric-sub">
                    {weatherData.rainfall > 0
                      ? language === "mr" ? "पाऊस सुरू" : "Rain reported"
                      : language === "mr" ? "कोरडे हवामान" : "Dry"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Agricultural Advisories Card */}
            <div className="weather-card advisories-card">
              <div className="advisories-card-header">
                <Sparkles size={18} color="#1F6B43" />
                <h3 className="section-title">{t("agriAdvisoriesTitle")}</h3>
              </div>

              <div className="advisories-list">
                {/* Spraying Advice */}
                <div className={`advisory-item ${weatherData.advisories?.spray_status === "suitable" ? "status-positive" : "status-warning"}`}>
                  <div className="advisory-icon-wrapper">
                    {weatherData.advisories?.spray_status === "suitable" ? (
                      <CheckCircle size={20} className="icon-success" />
                    ) : (
                      <AlertTriangle size={20} className="icon-warn" />
                    )}
                  </div>
                  <div className="advisory-text">
                    <div className="advisory-title-row">
                      <span className="advisory-label">{t("sprayConditionLabel")}</span>
                      <span className={`advisory-chip ${weatherData.advisories?.spray_status === "suitable" ? "chip-green" : "chip-amber"}`}>
                        {weatherData.advisories?.spray_status === "suitable"
                          ? language === "mr" ? "अनुकूल" : "Suitable"
                          : language === "mr" ? "पुढे ढकला" : "Avoid Spraying"}
                      </span>
                    </div>
                    <p className="advisory-detail">
                      {language === "mr"
                        ? weatherData.advisories?.spray_advice_mr
                        : weatherData.advisories?.spray_advice_en}
                    </p>
                  </div>
                </div>

                {/* Fungal Disease Risk */}
                <div className={`advisory-item ${weatherData.advisories?.disease_risk === "high" ? "status-danger" : "status-positive"}`}>
                  <div className="advisory-icon-wrapper">
                    {weatherData.advisories?.disease_risk === "high" ? (
                      <AlertTriangle size={20} className="icon-danger" />
                    ) : (
                      <CheckCircle size={20} className="icon-success" />
                    )}
                  </div>
                  <div className="advisory-text">
                    <div className="advisory-title-row">
                      <span className="advisory-label">{t("diseaseRiskLabel")}</span>
                      <span className={`advisory-chip ${weatherData.advisories?.disease_risk === "high" ? "chip-amber" : "chip-green"}`}>
                        {weatherData.advisories?.disease_risk === "high"
                          ? language === "mr" ? "धोका जास्त" : "High Risk"
                          : language === "mr" ? "धोका कमी" : "Low Risk"}
                      </span>
                    </div>
                    <p className="advisory-detail">
                      {language === "mr"
                        ? weatherData.advisories?.disease_advice_mr
                        : weatherData.advisories?.disease_advice_en}
                    </p>
                  </div>
                </div>

                {/* Irrigation Guidance */}
                <div className="advisory-item status-info">
                  <div className="advisory-icon-wrapper">
                    <Droplets size={20} className="icon-info" />
                  </div>
                  <div className="advisory-text">
                    <div className="advisory-title-row">
                      <span className="advisory-label">{t("irrigationAdvice")}</span>
                      <span className="advisory-chip chip-blue">
                        {weatherData.advisories?.irrigation_status === "postpone"
                          ? language === "mr" ? "पाऊस सुरू / पाणी थांबवा" : "Postpone"
                          : weatherData.advisories?.irrigation_status === "critical"
                          ? language === "mr" ? "जास्त गरज" : "Irrigation Needed"
                          : language === "mr" ? "नियमित" : "Normal"}
                      </span>
                    </div>
                    <p className="advisory-detail">
                      {language === "mr"
                        ? weatherData.advisories?.irrigation_advice_mr
                        : weatherData.advisories?.irrigation_advice_en}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 5-Day Agricultural Forecast */}
            {weatherData.daily_forecast && weatherData.daily_forecast.length > 0 && (
              <div className="weather-card forecast-card">
                <div className="forecast-card-header">
                  <CloudSun size={18} color="#1F6B43" />
                  <h3 className="section-title">{t("forecastTitle")}</h3>
                </div>

                <div className="forecast-grid">
                  {weatherData.daily_forecast.map((day, idx) => (
                    <div key={idx} className="forecast-day-box">
                      <div className="forecast-day-name">{day.day_name}</div>
                      <div className="forecast-day-date">{day.formatted_date}</div>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.condition}
                        className="forecast-weather-icon"
                      />
                      <div className="forecast-condition-name">{day.condition}</div>
                      <div className="forecast-temps">
                        <span className="temp-max">{Math.round(day.temp_max)}°</span>
                        <span className="temp-divider">/</span>
                        <span className="temp-min">{Math.round(day.temp_min)}°</span>
                      </div>
                      <div className="forecast-rain-pill">
                        <Droplets size={12} />
                        <span>{day.rain_mm} mm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WeatherPage;
