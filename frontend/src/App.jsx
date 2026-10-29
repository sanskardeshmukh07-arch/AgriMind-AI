import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CropRecommendationPage from "./pages/CropRecommendationPage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import WeatherPage from "./pages/WeatherPage";
import FarmerAssistantPage from "./pages/FarmerAssistantPage";
import SoilDataPage from "./pages/SoilDataPage";
import AdvisoryPage from "./pages/AdvisoryPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const protectedRoute = (element) => (
    <ProtectedRoute>{element}</ProtectedRoute>
  );

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Phase 2: Distinct Pages per Sidebar Nav item */}
        <Route path="/dashboard" element={protectedRoute(<Dashboard />)} />
        <Route path="/crop-recommendation" element={protectedRoute(<CropRecommendationPage />)} />
        <Route path="/disease-detection" element={protectedRoute(<DiseaseDetectionPage />)} />
        <Route path="/weather" element={protectedRoute(<WeatherPage />)} />
        <Route path="/assistant" element={protectedRoute(<FarmerAssistantPage />)} />
        <Route path="/soil-data" element={protectedRoute(<SoilDataPage />)} />
        <Route path="/advisory" element={protectedRoute(<AdvisoryPage />)} />
        <Route path="/history" element={protectedRoute(<HistoryPage />)} />

        {/* Backward Compatibility Aliases */}
        <Route path="/soil-analysis" element={<Navigate to="/soil-data" replace />} />
        <Route path="/soil-history" element={<Navigate to="/soil-data" replace />} />
        <Route path="/recommendation-history" element={<Navigate to="/history" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
