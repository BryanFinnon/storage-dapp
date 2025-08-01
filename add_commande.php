<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"] ?? null;
$fournisseur = $data["fournisseur"] ?? "";
$quantite = $data["quantite"] ?? "";

$conn = new mysqli("localhost", "root", "", "iot_datachain");
if ($conn->connect_error) {
  echo json_encode(["error" => "Connexion DB échouée"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO commandes (user_id, fournisseur, quantite) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $user_id, $fournisseur, $quantite);

if ($stmt->execute()) {
  echo json_encode(["message" => "Commande enregistrée"]);
} else {
  echo json_encode(["error" => "Erreur lors de l’enregistrement"]);
}

$conn->close();
