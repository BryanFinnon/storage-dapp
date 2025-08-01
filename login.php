<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$username = $input["username"] ?? "";
$password = $input["password"] ?? "";

$conn = new mysqli("localhost", "root", "", "iot_datachain");
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Connexion to DB failed"]);
  exit;
}

$stmt = $conn->prepare("SELECT id, password, role FROM utilisateurs WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
  $stmt->bind_result($id, $hashedPassword, $role);
  $stmt->fetch();

  if (password_verify($password, $hashedPassword)) {
    echo json_encode(["message" => "Connexion accepted", "userId" => $id, "role" => $role]);
  } else {
    echo json_encode(["error" => "Password incorrect"]);
  }
} else {
  echo json_encode(["error" => "Username not found"]);
}

$conn->close();
