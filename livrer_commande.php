<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$commande_id = $data["commande_id"];
$fournisseur = $data["fournisseur"];
$quantite = intval($data["quantite"]);

$conn = new mysqli("localhost", "root", "", "iot_datachain");

if ($conn->connect_error) {
  echo json_encode(["error" => "Connexion échouée"]);
  exit;
}

// Vérifier stock
$sql = "SELECT quantite_disponible FROM stocks_fournisseur WHERE fournisseur = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $fournisseur);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row || $row["quantite_disponible"] < $quantite) {
  echo json_encode(["error" => "Stock insuffisant pour livrer"]);
  exit;
}

// Décrémenter le stock
$new_stock = $row["quantite_disponible"] - $quantite;
$update_stock = $conn->prepare("UPDATE stocks_fournisseur SET quantite_disponible = ? WHERE fournisseur = ?");
$update_stock->bind_param("is", $new_stock, $fournisseur);
$update_stock->execute();

// Mettre à jour le statut de la commande
$update_commande = $conn->prepare("UPDATE commandes SET statut = 'Livrée' WHERE id = ?");
$update_commande->bind_param("i", $commande_id);
$update_commande->execute();

echo json_encode(["message" => "Commande livrée avec succès"]);
$conn->close();
