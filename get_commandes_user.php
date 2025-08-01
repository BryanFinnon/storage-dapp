<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$user_id = $_GET["user_id"] ?? 0;

$conn = new mysqli("localhost", "root", "", "iot_datachain");
if ($conn->connect_error) {
  echo json_encode(["error" => "Connexion échouée"]);
  exit;
}

$sql = "SELECT * FROM commandes WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$commandes = [];
while ($row = $result->fetch_assoc()) {
  $commandes[] = $row;
}

echo json_encode($commandes);
$conn->close();
