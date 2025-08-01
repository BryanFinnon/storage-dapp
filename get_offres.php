<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "iot_datachain");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB error"]);
  exit();
}

$result = $conn->query("SELECT * FROM offres ORDER BY date_creation DESC");

$offres = [];

while ($row = $result->fetch_assoc()) {
  $offres[] = $row;
}

echo json_encode($offres);

$conn->close();
