<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Cho phép React gọi API

// Cấu hình kết nối MySQL
$host = "localhost";
$user = "root";     // user mặc định của XAMPP
$pass = "";         // password mặc định rỗng
$db   = "construction_store";

$conn = new mysqli($host, $user, $pass, $db);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Query lấy tất cả sản phẩm
$sql = "SELECT id, name, price, rating, image FROM products";
$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

// Trả về JSON
echo json_encode($products);

$conn->close();
?>