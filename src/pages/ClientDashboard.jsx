import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ClientDashboard.css";

export default function ClientDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [offres, setOffres] = useState([]);
  const [stockRecu, setStockRecu] = useState([]);
  const navigate = useNavigate();

  // 🔐 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔄 Charger les offres
  useEffect(() => {
    fetch("http://localhost/iot-backend/get_offres.php")
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error("Erreur chargement offres", err));
  }, []);

  // 🔄 Charger commandes du client
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userId) { // Vérifier que user et userId existent
      fetch(`http://localhost/iot-backend/get_commandes_user.php?user_id=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) { // S'assurer que les données sont un tableau
            setCommandes(data);
          } else {
            console.error("Données de commandes inattendues:", data);
            setCommandes([]); // Réinitialiser pour éviter les erreurs
          }
        })
        .catch((err) => console.error("Erreur chargement commandes", err));
    }
  }, []);

  // 🔄 Charger stock livré (stock_client)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userId) { // Vérifier que user et userId existent
      fetch(`http://localhost/iot-backend/get_stock_client.php?user_id=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) { // S'assurer que les données sont un tableau
            setStockRecu(data);
          } else {
            console.error("Données de stock reçu inattendues:", data);
            setStockRecu([]); // Réinitialiser pour éviter les erreurs
          }
        })
        .catch((err) => console.error("Erreur chargement stock client", err));
    }
  }, []);

  // 🛒 Passer une commande
  const passerCommande = async (offre) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) return alert("You need to be logged in to order");

    const commande = {
      user_id: user.userId,
      fournisseur: offre.fournisseur,
      quantite: offre.quantite, // Garde la quantité telle qu'elle est dans l'offre ("5 To")
    };

    try {
      const res = await fetch("http://localhost/iot-backend/add_commande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commande),
      });

      const data = await res.json();
      if (res.ok && data.message) { // Vérifier aussi res.ok pour une réponse 2xx
        alert(data.message);
        // Mettre à jour la liste des commandes du client après avoir passé une commande
        setCommandes(prevCmds => [...prevCmds, { ...commande, id: data.orderId, statut: "En attente" }]);
      } else {
        alert(data.message || "Error while placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error while placing order. Check backend connection.");
    }
  };

  return (
    <div className="client-dashboard">
      <header className="dashboard-header">
        <h1>Client Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
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
              {commandes.map((cmd, index) => (
                <tr key={cmd.id || index}>
                  <td>{index + 1}</td>
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
                <th>Date Received</th> {/* Ajout de la colonne Date Received */}
              </tr>
            </thead>
            <tbody>
              {stockRecu.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fournisseur}</td>
                  <td>{item.quantite}</td>
                  <td>{new Date(item.date_reception).toLocaleDateString()}</td> {/* Formatage de la date */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}