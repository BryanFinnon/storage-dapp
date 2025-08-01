import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Auth.css"; // On utilisera un seul fichier CSS

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "client"
  });

  // Initialiser le rôle si passé depuis Home
  useEffect(() => {
    if (location.state?.role) {
      setFormData((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/iot-backend/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.message) {
      alert(data.message);
      navigate("/login");
    } else {
      alert(data.error || "Erreur");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
          <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <select onChange={(e) => setFormData({ ...formData, role: e.target.value })} value={formData.role}>
            <option value="client">Customer</option>
            <option value="provider">Provider</option>
          </select>
          <button type="submit">Sign up </button>
        </form>
      </div>
    </div>
  );
}
