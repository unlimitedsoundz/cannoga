<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$fileName = time() . '_' . basename($file['name']);
$targetFilePath = $targetDir . $fileName;

// Allow certain file formats
$allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'pdf', 'doc', 'docx');
$fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

if (in_array(strtolower($fileType), $allowTypes)) {
    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        // Construct the URL. Since this lives in /public (root of static export), 
        // the path will be /uploads/filename.
        // We should return a relative or absolute path depending on preference.
        // Relative to root is usually best for static sites.
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $url = "/uploads/" . $fileName;
        
        echo json_encode(['success' => true, 'url' => $url]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'File type not allowed']);
}
?>
