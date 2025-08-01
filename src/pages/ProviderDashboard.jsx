import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProviderDashboard.css";

export default function ProviderDashboard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fournisseur: "",
    quantite: "",
    prix: ""
  });

  const [commandes, setCommandes] = useState([]);
  const [stockForm, setStockForm] = useState({
  stockFournisseur: "",
  stockQuantite: ""
});
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStockChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  const publierOffre = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/iot-backend/add_offre.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message || "Erreur");
    } catch (err) {
      alert("Échec lors de l’ajout de l’offre");
    }
  };

  const ajouterStock = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/iot-backend/add_stock.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockForm),
      });
      const data = await res.json();
      alert(data.message || "Erreur lors de l'ajout au stock");
    } catch (err) {
      alert("Erreur connexion stock");
    }
  };

  const livrerCommande = async (cmd) => {
    const confirm = window.confirm(
      `Confirmer la livraison de ${cmd.quantite} à ${cmd.username} ?`
    );
    if (!confirm) return;

    try {
      const response = await fetch("http://localhost/iot-backend/livrer_commande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commande_id: cmd.id,
          fournisseur: cmd.fournisseur,
          quantite: cmd.quantite,
        }),
      });
      const data = await response.json();
      alert(data.message || "Livraison enregistrée.");
      window.location.reload(); // Recharge pour voir les changements
    } catch (err) {
      alert("Erreur de livraison.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost/iot-backend/get_all_commandes.php")
      .then((res) => res.json())
      .then((data) => setCommandes(data))
      .catch((err) => console.error("Erreur chargement commandes", err));
  }, []);

  return (
    <div className="provider-dashboard">
      <header className="dashboard-header">
        <h1>Provider DashBoard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Log out 
        </button>
      </header>

      <section className="actions">
        <h2>Publish a new offer</h2>
        <form onSubmit={publierOffre}>
          <label>
            Provider:
            <input type="text" name="fournisseur" onChange={handleChange} placeholder="Ex: Apple" />
          </label>
          <label>
            Quantity :
            <input type="text" name="quantite" onChange={handleChange} placeholder="Ex: 5 To" />
          </label>
          <label>
            Price (£) :
            <input type="number" name="prix" onChange={handleChange} placeholder="Ex: 10" />
          </label>
          <button type="submit">Publish</button>
        </form>
      </section>

      

      <section className="liste-commandes">
        <h2>📋 Orders</h2>
        {commandes.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Quantity</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((cmd) => (
                <tr key={cmd.id}>
                  <td>{cmd.id}</td>
                  <td>{cmd.username}</td>
                  <td>{cmd.fournisseur}</td>
                  <td>{cmd.quantite}</td>
                  <td>{cmd.statut}</td>
                  <td>
                    {cmd.statut === "En attente" ? (
                      <button onClick={() => livrerCommande(cmd)}>Deliver</button>
                    ) : (
                      "✔️"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>


    <section className="ajout-stock">
  <h2>🧮 Add to stock</h2>
  <form onSubmit={ajouterStock}>
    <label>
      Provider:
      <input
        type="text"
        name="stockFournisseur"
        value={stockForm.stockFournisseur}
        onChange={handleStockChange}
        placeholder="Ex: Apple"
      />
    </label>
    <label>
      Quantity:
      <input
        type="number"
        name="stockQuantite"
        value={stockForm.stockQuantite}
        onChange={handleStockChange}
        placeholder="Ex: 20"
      />
    </label>
    <button type="submit">Add to stock</button>
  </form>
</section>



    </div>
  );
}
