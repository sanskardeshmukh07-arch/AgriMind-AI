import os
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
import requests

router = APIRouter(prefix="/api/weather", tags=["Weather Integration"])

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY") or os.getenv("OPENWEATHERMAP_API_KEY")


def generate_agricultural_advisories(temp: float, humidity: float, wind_kmh: float, rain_mm: float, forecast_rain_mm: float):
    """
    Generates rule-based agricultural advisories based on real meteorological parameters.
    """
    # 1. Spraying Suitability
    if wind_kmh > 18.0 or rain_mm > 0.5 or forecast_rain_mm > 2.0:
        spray_status = "unsuitable"
        spray_advice_en = "Postpone agrochemical sprays. Strong winds (>18 km/h) cause drift, and impending rainfall washes away active ingredients."
        spray_advice_mr = "फवारणी पुढे ढकला. जास्त वाऱ्यामुळे औषध उडून जाते आणि पाऊस पडल्यास औषध वाहून जाते."
    else:
        spray_status = "suitable"
        spray_advice_en = "Favorable weather for foliar pesticide and nutrient spraying. Calm winds and dry conditions allow maximum absorption."
        spray_advice_mr = "फवारणीसाठी अनुकूल हवामान. शांत वारा आणि कोरडे वातावरण असल्याने औषध पानात चांगले शोषले जाते."

    # 2. Fungal Disease Risk
    if humidity >= 75.0 and 18.0 <= temp <= 30.0:
        disease_risk = "high"
        disease_advice_en = "High humidity (>75%) coupled with warm temperatures creates ideal conditions for fungal blights, rusts, and downy mildews. Inspect crops closely."
        disease_advice_mr = "जास्त आर्द्रता (>७५%) आणि उबदार हवामानामुळे करपा, तांबेरा आणि बुरशीजन्य रोगांचा प्रादुर्भाव वाढण्याची शक्यता आहे. पिकाची नियमित पाहणी करा."
    else:
        disease_risk = "low"
        disease_advice_en = "Low atmospheric fungal disease pressure under current dry atmospheric conditions."
        disease_advice_mr = "कोरड्या हवामानामुळे सध्या बुरशीजन्य रोगांचा धोका कमी आहे."

    # 3. Irrigation Guidance
    if rain_mm > 5.0 or forecast_rain_mm > 10.0:
        irrigation_status = "postpone"
        irrigation_advice_en = "Sufficient rainfall received or imminent. Suspend planned irrigation cycles to prevent waterlogging and root asphyxiation."
        irrigation_advice_mr = "पावसाची शक्यता असल्याने पाणी देणे पुढे ढकला जेणेकरून शेतात पाणी साचून मुळे कुजणार नाहीत."
    elif temp > 33.0 and humidity < 45.0:
        irrigation_status = "critical"
        irrigation_advice_en = "High evaporative demand and warm winds. Irrigate crops during evening or night hours through drip systems to conserve moisture."
        irrigation_advice_mr = "जास्त तापमान व कोरड्या वाऱ्यामुळे बाष्पीभवन वेगाने होत आहे. ओलावा टिकवण्यासाठी संध्याकाळी किंवा रात्री ठिबकने पाणी द्या."
    else:
        irrigation_status = "normal"
        irrigation_advice_en = "Maintain standard scheduled irrigation intervals according to crop growth stage."
        irrigation_advice_mr = "पिकाच्या गरजेनुसार नियमित वेळापत्रकाप्रमाणे पाणी देणे सुरू ठेवा."

    return {
        "spray_status": spray_status,
        "spray_advice_en": spray_advice_en,
        "spray_advice_mr": spray_advice_mr,
        "disease_risk": disease_risk,
        "disease_advice_en": disease_advice_en,
        "disease_advice_mr": disease_advice_mr,
        "irrigation_status": irrigation_status,
        "irrigation_advice_en": irrigation_advice_en,
        "irrigation_advice_mr": irrigation_advice_mr
    }


def fetch_from_openweather(query_params: dict):
    """
    Calls OpenWeatherMap API for both current weather and 5-day forecast.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY") or os.getenv("OPENWEATHERMAP_API_KEY")

    if not api_key or api_key.strip() == "" or "your_" in api_key.lower():
        # OpenWeather key is not configured
        return {
            "success": False,
            "api_configured": False,
            "message": "OpenWeather API key not configured. Add OPENWEATHER_API_KEY to your backend .env file.",
            "message_mr": "बॅकएंड .env फाईलमध्ये OPENWEATHER_API_KEY सेट केलेली नाही. थेट हवामानासाठी कृपया API की जोडा."
        }

    try:
        # 1. Fetch Current Weather
        current_url = "https://api.openweathermap.org/data/2.5/weather"
        c_params = {**query_params, "appid": api_key, "units": "metric"}
        c_resp = requests.get(current_url, params=c_params, timeout=5)
        
        if c_resp.status_code == 401:
            return {
                "success": False,
                "api_configured": False,
                "message": "Invalid OpenWeather API Key. Please verify your OPENWEATHER_API_KEY in .env.",
                "message_mr": "अवैध OpenWeather API की. कृपया .env मधील OPENWEATHER_API_KEY तपासा."
            }
        
        if c_resp.status_code == 404:
            return {
                "success": False,
                "api_configured": True,
                "message": "City or location not found. Please verify the name.",
                "message_mr": "हे गाव किंवा शहर सापडले नाही. कृपया अचूक नाव प्रविष्ट करा."
            }

        c_resp.raise_for_status()
        c_data = c_resp.json()

        # 2. Fetch 5-Day Forecast
        forecast_url = "https://api.openweathermap.org/data/2.5/forecast"
        f_params = {**query_params, "appid": api_key, "units": "metric"}
        f_resp = requests.get(forecast_url, params=f_params, timeout=5)
        f_data = f_resp.json() if f_resp.ok else {}

        # Extract current weather values
        main = c_data.get("main", {})
        wind = c_data.get("wind", {})
        weather_list = c_data.get("weather", [{}])
        first_weather = weather_list[0] if weather_list else {}
        rain = c_data.get("rain", {})

        temp = float(main.get("temp", 0.0))
        feels_like = float(main.get("feels_like", temp))
        humidity = float(main.get("humidity", 0.0))
        wind_speed_ms = float(wind.get("speed", 0.0))
        wind_kmh = round(wind_speed_ms * 3.6, 1)
        rain_1h = float(rain.get("1h", 0.0))
        condition = first_weather.get("main", "Clear")
        condition_desc = first_weather.get("description", "clear sky").title()
        icon = first_weather.get("icon", "01d")
        location_name = f"{c_data.get('name', '')}, {c_data.get('sys', {}).get('country', '')}".strip(", ")
        coord = c_data.get("coord", {})

        # Process 5-day daily forecast summary
        daily_forecast = []
        forecast_rain_sum = 0.0
        forecast_items = f_data.get("list", [])

        # Group forecast items by calendar date
        days_map = {}
        for item in forecast_items:
            dt_txt = item.get("dt_txt", "")
            if not dt_txt:
                continue
            date_str = dt_txt.split(" ")[0]
            item_temp = item.get("main", {}).get("temp", 0.0)
            item_rain = item.get("rain", {}).get("3h", 0.0)
            forecast_rain_sum += item_rain

            if date_str not in days_map:
                item_w = item.get("weather", [{}])[0]
                days_map[date_str] = {
                    "date": date_str,
                    "temps": [item_temp],
                    "condition": item_w.get("main", "Clear"),
                    "description": item_w.get("description", "clear").title(),
                    "icon": item_w.get("icon", "01d"),
                    "rain": item_rain
                }
            else:
                days_map[date_str]["temps"].append(item_temp)
                days_map[date_str]["rain"] += item_rain

        for d_str, d_val in list(days_map.items())[:5]:
            temps = d_val["temps"]
            try:
                dt_obj = datetime.strptime(d_str, "%Y-%m-%d")
                day_name = dt_obj.strftime("%a")
                formatted_date = dt_obj.strftime("%d %b")
            except Exception:
                day_name = d_str
                formatted_date = d_str

            daily_forecast.append({
                "date": d_str,
                "day_name": day_name,
                "formatted_date": formatted_date,
                "temp_min": round(min(temps), 1),
                "temp_max": round(max(temps), 1),
                "condition": d_val["condition"],
                "description": d_val["description"],
                "icon": d_val["icon"],
                "rain_mm": round(d_val["rain"], 1)
            })

        # Calculate rule-based agricultural advisories
        advisories = generate_agricultural_advisories(
            temp=temp,
            humidity=humidity,
            wind_kmh=wind_kmh,
            rain_mm=rain_1h,
            forecast_rain_mm=forecast_rain_sum
        )

        return {
            "success": True,
            "api_configured": True,
            "is_live": True,
            "provider": "OpenWeather",
            "location": location_name or "Local Farm",
            "latitude": coord.get("lat", 0.0),
            "longitude": coord.get("lon", 0.0),
            "temperature": round(temp, 1),
            "feels_like": round(feels_like, 1),
            "humidity": round(humidity, 1),
            "wind_kmh": wind_kmh,
            "wind_speed_ms": round(wind_speed_ms, 1),
            "rainfall": round(rain_1h, 1),
            "condition": condition,
            "condition_description": condition_desc,
            "icon": icon,
            "daily_forecast": daily_forecast,
            "advisories": advisories
        }

    except Exception as e:
        return {
            "success": False,
            "api_configured": True,
            "message": f"OpenWeather request failed: {str(e)}",
            "message_mr": f"हवामान माहिती मिळवण्यात त्रुटी: {str(e)}"
        }


@router.get("/by-city")
def get_weather_by_city(city: str = Query(..., min_length=2, description="City name to fetch weather for")):
    return fetch_from_openweather({"q": city.strip()})


@router.get("/by-coords")
def get_weather_by_coords(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    return fetch_from_openweather({"lat": lat, "lon": lon})
