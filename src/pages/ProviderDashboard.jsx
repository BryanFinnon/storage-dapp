import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProviderDashboard.css"; // Assurez-vous que ce fichier CSS existe

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

  // Nouveaux états pour le modal de livraison
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [currentOrderToDeliver, setCurrentOrderToDeliver] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryFournisseur: "",
    deliveryQuantite: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStockChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  // Gestion des changements dans le formulaire de livraison du modal
  const handleDeliveryFormChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value });
  };

  // Ouvrir le modal de livraison
  const openDeliveryModal = (cmd) => {
    setCurrentOrderToDeliver(cmd); // Stocke la commande à livrer
    setDeliveryForm({ // Pré-remplir le formulaire avec les infos de la commande pour facilité
      deliveryFournisseur: cmd.fournisseur,
      deliveryQuantite: parseInt(cmd.quantite) || "" // Tente de parser la quantité de la commande
    });
    setShowDeliveryModal(true);
  };

  // Fermer le modal de livraison
  const closeDeliveryModal = () => {
    setShowDeliveryModal(false);
    setCurrentOrderToDeliver(null);
    setDeliveryForm({ deliveryFournisseur: "", deliveryQuantite: "" });
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
      alert(data.message || "Erreur lors de la publication de l'offre");
      if (response.ok && data.message.includes("succès")) {
        setFormData({ fournisseur: "", quantite: "", prix: "" });
      }
    } catch (err) {
      alert("Échec lors de l’ajout de l’offre. Vérifiez la connexion au backend.");
    }
  };

  const ajouterStock = async (e) => {
    e.preventDefault();

    const quantiteNumerique = parseInt(stockForm.stockQuantite, 10);

    if (isNaN(quantiteNumerique) || quantiteNumerique <= 0) {
      alert("Veuillez entrer une quantité valide et positive pour le stock.");
      return;
    }

    try {
      const res = await fetch("http://localhost/iot-backend/add_stock.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockFournisseur: stockForm.stockFournisseur,
          stockQuantite: quantiteNumerique
        }),
      });
      const data = await res.json();
      alert(data.message || "Erreur lors de l'ajout au stock");

      if (res.ok && data.message && (data.message.includes("Stock mis à jour") || data.message.includes("Stock ajouté avec succès"))) {
        setStockForm({
          stockFournisseur: "",
          stockQuantite: ""
        });
      }
    } catch (err) {
      alert("Erreur connexion stock. Vérifiez que le serveur PHP est en cours d'exécution.");
    }
  };

  // Fonction pour gérer la soumission du formulaire de livraison
  const handleDeliverSubmit = async (e) => {
    e.preventDefault();
    if (!currentOrderToDeliver) return;

    const quantiteNumerique = parseInt(deliveryForm.deliveryQuantite, 10);

    if (isNaN(quantiteNumerique) || quantiteNumerique <= 0) {
      alert("Veuillez entrer une quantité valide et positive pour la livraison.");
      return;
    }

    try {
      const response = await fetch("http://localhost/iot-backend/livrer_commande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commande_id: currentOrderToDeliver.id,
          fournisseur: deliveryForm.deliveryFournisseur, // Le fournisseur entré par le provider
          quantite: quantiteNumerique, // La quantité numérique entrée par le provider
        }),
      });

      const data = await response.json(); // Tente de parser la réponse en JSON

      // Si le PHP renvoie une erreur (capturée par le try-catch du PHP)
      if (data.error) {
        alert("Erreur du backend: " + data.error);
      } else if (data.message && data.message.includes("Livraison réussie")) {
        alert(data.message);
        // Mettre à jour le statut de la commande dans l'état local
        setCommandes(prevCmds =>
          prevCmds.map(cmd =>
            cmd.id === currentOrderToDeliver.id ? { ...cmd, statut: "Livrée" } : cmd
          )
        );
        closeDeliveryModal(); // Fermer le modal
        // Optionnel: Recharger les commandes pour s'assurer que l'état est à jour
        fetch("http://localhost/iot-backend/get_all_commandes.php")
          .then((res) => res.json())
          .then((data) => setCommandes(data))
          .catch((err) => console.error("Erreur chargement commandes après livraison", err));
      } else {
        // Cas générique si la réponse n'est ni un message ni une erreur explicite
        alert("Réponse inattendue du backend lors de la livraison: " + JSON.stringify(data));
      }
    } catch (err) {
      // Cette erreur se déclenche si la requête fetch elle-même échoue (réseau, CORS, PHP ne répond pas JSON)
      console.error("Erreur lors de la livraison:", err);
      alert("Erreur de connexion lors de la livraison. Vérifiez que le serveur PHP est en cours d'exécution et accessible.");
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
            <input type="text" name="fournisseur" value={formData.fournisseur} onChange={handleChange} placeholder="Ex: Apple" required />
          </label>
          <label>
            Quantity :
            <input type="text" name="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 5 To" required />
          </label>
          <label>
            Price (£) :
            <input type="number" name="prix" value={formData.prix} onChange={handleChange} placeholder="Ex: 10" required min="0" />
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
                      <button onClick={() => openDeliveryModal(cmd)}>Deliver</button>
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
              required
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
              required
              min="1"
            />
          </label>
          <button type="submit">Add to stock</button>
        </form>
      </section>

      {/* Modal de livraison */}
      {showDeliveryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Deliver Order #{currentOrderToDeliver?.id}</h3>
            <p>Customer: {currentOrderToDeliver?.username}</p>
            <p>Ordered Provider: {currentOrderToDeliver?.fournisseur}</p>
            <p>Ordered Quantity: {currentOrderToDeliver?.quantite}</p>
            <form onSubmit={handleDeliverSubmit}>
              <label>
                Delivering Provider:
                <input
                  type="text"
                  name="deliveryFournisseur"
                  value={deliveryForm.deliveryFournisseur}
                  onChange={handleDeliveryFormChange}
                  placeholder="Ex: Apple"
                  required
                />
              </label>
              <label>
                Delivering Quantity:
                <input
                  type="number"
                  name="deliveryQuantite"
                  value={deliveryForm.deliveryQuantite}
                  onChange={handleDeliveryFormChange}
                  placeholder="Ex: 5"
                  required
                  min="1"
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Confirm Delivery</button>
                <button type="button" onClick={closeDeliveryModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}