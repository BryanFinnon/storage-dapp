<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$username = $input["username"] ?? "";
$password = $input["password"] ?? "";
$role = $input["role"] ?? "client";

if (!$username || !$password) {
  echo json_encode(["error" => "Required fields are missing."]);
  exit;
}

$conn = new mysqli("localhost", "root", "", "iot_datachain");
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Connexion DB failed"]);
  exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO utilisateurs (username, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $hashed, $role);

if ($stmt->execute()) {
  echo json_encode(["message" => "Account created successfully"]);
} else {
  echo json_encode(["error" => "User name already in use"]);
}

$conn->close();
