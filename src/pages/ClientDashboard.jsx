import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { keccak256, toUtf8Bytes } from "ethers";
import "../styles/ClientDashboard.css";
import { createAgreementOrder } from "../services/blockchain";

export default function ClientDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [offres, setOffres] = useState([]);
  const [stockRecu, setStockRecu] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost/iot-backend/get_offres.php")
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error("Erreur chargement offres", err));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      fetch(`http://localhost/iot-backend/get_commandes_user.php?user_id=${user.userId}`)
        .then((res) => res.json())
        .then((data) => setCommandes(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Erreur chargement commandes", err));
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      fetch(`http://localhost/iot-backend/get_stock_client.php?user_id=${user.userId}`)
        .then((res) => res.json())
        .then((data) => setStockRecu(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Erreur chargement stock client", err));
    }
  }, []);

  const passerCommande = async (offre) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) return alert("You need to be logged in to order");

    const quantiteNumeric = parseInt(offre.quantite, 10);
    if (isNaN(quantiteNumeric) || quantiteNumeric <= 0) {
      alert("Invalid quantity in offer");
      return;
    }

    const details = `provider:${offre.fournisseur},quantity:${quantiteNumeric}`;
    const order_hash = keccak256(toUtf8Bytes(details));

    const commande = {
      user_id: user.userId,
      fournisseur: offre.fournisseur,
      quantite: `${quantiteNumeric}`,
      order_hash: order_hash,
    };

    try {
      // Enregistrer dans la base
      const res = await fetch("http://localhost/iot-backend/add_commande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commande),
      });

      const data = await res.json();
      if (res.ok && data.orderId) {
        try {
          // Enregistrer aussi sur la blockchain
          await createAgreementOrder(details);
          alert("Commande ajoutée et enregistrée sur la blockchain.");
        } catch (err) {
          console.error("Erreur Blockchain:", err);
          alert("Commande enregistrée, mais erreur lors de l'ajout blockchain: " + err.message);
        }

        setCommandes(prev => [...prev, { ...commande, id: data.orderId, statut: "En attente" }]);
      } else {
        alert(data.message || "Erreur lors de l'ajout de la commande");
      }
    } catch (error) {
      console.error("Erreur côté client:", error);
      alert("Erreur de communication avec le backend.");
    }
  };

  return (
    <div className="client-dashboard">
      <header className="dashboard-header">
        <h1>Client Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <section className="offres">
        <h2>📦 Offers available</h2>
        <div className="offres-liste">
          {offres.length === 0 ? (
            <p>No offers available yet.</p>
          ) : (
            offres.map((offre) => (
              <div className="offre-card" key={offre.id}>
                <h3>{offre.fournisseur}</h3>
                <p>{offre.quantite}</p>
                <p>{offre.prix} £</p>
                <button onClick={() => passerCommande(offre)}>Order</button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="historique">
        <h2>🧾 My Orders</h2>
        {commandes.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Provider</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((cmd, idx) => (
                <tr key={cmd.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{cmd.fournisseur}</td>
                  <td>{cmd.quantite}</td>
                  <td>{cmd.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="stock-recu">
        <h2>📂 My Received Storage</h2>
        {stockRecu.length === 0 ? (
          <p>You have not received any storage yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Quantity</th>
                <th>Date Received</th>
              </tr>
            </thead>
            <tbody>
              {stockRecu.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fournisseur}</td>
                  <td>{item.quantite}</td>
                  <td>{new Date(item.date_reception).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
