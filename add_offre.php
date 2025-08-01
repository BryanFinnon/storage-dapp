<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "root", "", "iot_datachain");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}

$fournisseur = $conn->real_escape_string($input["fournisseur"]);
$quantite = $conn->real_escape_string($input["quantite"]);
$prix = floatval($input["prix"]);

$sql = "INSERT INTO offres (fournisseur, quantite, prix) VALUES ('$fournisseur', '$quantite', $prix)";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["message" => "Offre ajoutée"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => $conn->error]);
}

$conn->close();
