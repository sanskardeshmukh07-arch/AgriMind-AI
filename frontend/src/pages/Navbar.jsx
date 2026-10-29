import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="app-navbar">
      <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
        <div className="navbar-logo">AI</div>
        <div>
          <h2>AgriMind <span>AI</span></h2>
          <p>Smart Agriculture Intelligence</p>
        </div>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/crop-recommendation">Recommendation</NavLink>
        <NavLink to="/disease">Disease</NavLink>
        <NavLink to="/soil">Soil</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>

      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
