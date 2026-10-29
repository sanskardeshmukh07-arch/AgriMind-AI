// Central API client for AgriMind AI
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

// Helper to get auth headers using the token storage established in Login.jsx
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("agrimind_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request wrapper with automatic 401 handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const isAuthEndpoint =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register") ||
    endpoint.startsWith("/auth/forgot-password") ||
    endpoint.startsWith("/auth/reset-password");

  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  // If body is NOT FormData and Content-Type is not set, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized for protected endpoints only
  if (response.status === 401 && !isAuthEndpoint) {
    sessionStorage.removeItem("agrimind_token");
    sessionStorage.removeItem("agrimind_name");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  // Handle JSON response and error extraction
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      data && typeof data === "object" && data.detail
        ? typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  // Authentication
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request("/auth/me"),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, new_password) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password }),
    }),

  // Dashboard
  getDashboardStats: () => request("/api/dashboard/me"),

  // Crop Recommendation
  recommendCrop: (cropData) =>
    request("/api/crop/recommend", {
      method: "POST",
      body: JSON.stringify(cropData),
    }),

  // Recommendation History
  getRecommendations: () => request("/api/recommendations/me"),

  // Disease Detection
  // Note: For FormData, do not set Content-Type header so the browser sets boundary
  predictDisease: (formData) =>
    request("/disease/predict", {
      method: "POST",
      body: formData,
    }),

  // Weather
  getWeatherByCity: (city) =>
    request(`/api/weather/by-city?city=${encodeURIComponent(city)}`),

  getWeatherByCoords: (lat, lon) =>
    request(`/api/weather/by-coords?lat=${lat}&lon=${lon}`),

  // AI Farmer Assistant
  chatAssistant: (message, context = null) =>
    request("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),

  // Soil Data
  getSoilHistory: () => request("/api/soil/me"),

  saveSoil: (soilData) =>
    request("/api/soil/save", {
      method: "POST",
      body: JSON.stringify(soilData),
    }),

  deleteSoil: (soilId) =>
    request(`/api/soil/${soilId}`, {
      method: "DELETE",
    }),

  analyzeSoil: (soilParams) =>
    request("/api/soil/analyze", {
      method: "POST",
      body: JSON.stringify(soilParams),
    }),
};

export default api;
