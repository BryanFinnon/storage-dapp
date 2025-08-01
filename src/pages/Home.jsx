import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <img src="/logo.png" alt="Logo" className="home-logo" />
        <h1>STORAGE DECENTRALISED WEBSITE</h1>
        <p>Welcome</p>
        <p>Access the platform securely</p>
        <button onClick={() => navigate("/login")}>
          Access the Platform
        </button>
      </div>
    </div>
  );
}
