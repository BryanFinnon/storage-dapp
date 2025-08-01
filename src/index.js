import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // <-- Cela va chercher App.jsx automatiquement
import './index.css'; // tu peux le laisser pour des styles globaux si tu veux

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
