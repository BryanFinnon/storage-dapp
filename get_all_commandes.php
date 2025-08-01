<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "iot_datachain");
if ($conn->connect_error) {
  echo json_encode(["error" => "Connexion DB échouée"]);
  exit;
}

$sql = "SELECT c.*, u.username FROM commandes c
        JOIN utilisateurs u ON c.user_id = u.id";
$result = $conn->query($sql);

$commandes = [];
while ($row = $result->fetch_assoc()) {
  $commandes[] = $row;
}

echo json_encode($commandes);
$conn->close();
