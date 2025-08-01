import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ClientDashboard.css";

export default function ClientDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [offres, setOffres] = useState([]);
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

  // 🔄 Charger commandes de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetch(`http://localhost/iot-backend/get_commandes_user.php?user_id=${user.userId}`)
        .then((res) => res.json())
        .then((data) => setCommandes(data))
        .catch((err) => console.error("Erreur chargement commandes", err));
    }
  }, []);

  // 🛒 Enregistrer une commande
  const passerCommande = async (offre) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("You need to be logged in to order");

    const commande = {
      user_id: user.userId,
      fournisseur: offre.fournisseur,
      quantite: offre.quantite,
    };

    const res = await fetch("http://localhost/iot-backend/add_commande.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commande),
    });

    const data = await res.json();
    if (data.message) {
      alert("Order registred !");
      // Optionnel : recharge la liste
      setCommandes([...commandes, { ...commande, statut: "En attente" }]);
    } else {
      alert("Error while placing order");
    }
  };

  return (
    <div className="client-dashboard">
      <header className="dashboard-header">
        <h1>Client  Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="offres">
        <h2>📦 Offers available</h2>
        <div className="offres-liste">
          {offres.map((offre) => (
            <div className="offre-card" key={offre.id}>
              <h3>{offre.fournisseur}</h3>
              <p>{offre.quantite}</p>
              <p>{offre.prix} £</p>
              <button onClick={() => passerCommande(offre)}>Order</button>
            </div>
          ))}
        </div>
      </section>

      <section className="historique">
        <h2>🧾 My orders</h2>
        {commandes.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Provider</th>
                <th>Quantity</th>
                <th>Statut</th>
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
    </div>
  );
}
