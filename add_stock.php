<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$fournisseur = $data["stockFournisseur"] ?? null;
$quantite = $data["stockQuantite"] ?? null;

// Vérification améliorée
if (empty($fournisseur) || !is_numeric($quantite) || intval($quantite) <= 0) {
  echo json_encode(["message" => "Champs invalides ou manquants"]);
  exit;
}

$conn = new mysqli("localhost", "root", "", "iot_marketplace");

if ($conn->connect_error) {
  echo json_encode(["message" => "Erreur de connexion à la base"]);
  exit;
}

// Préparer et exécuter la requête
$stmt = $conn->prepare("INSERT INTO stock_reel (fournisseur, quantite) VALUES (?, ?)");
$stmt->bind_param("si", $fournisseur, $quantite);

if ($stmt->execute()) {
  echo json_encode(["message" => "Stock ajouté avec succès"]);
} else {
  echo json_encode(["message" => "Erreur SQL", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
