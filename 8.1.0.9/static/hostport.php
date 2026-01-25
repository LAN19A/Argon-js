<?php
header('Content-Type: application/json'); // 设置内容类型为 JSON

$scheme = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';

// 从请求头中获取主机名和端口
$host = isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : $_SERVER['HTTP_HOST'];
$port = isset($_SERVER['HTTP_X_FORWARDED_PORT']) ? $_SERVER['HTTP_X_FORWARDED_PORT'] : $_SERVER['SERVER_PORT'];

// 只在端口号非 80 或 443 时添加端口号
$hostport = "$scheme://$host";
if (($scheme === 'http' && $port != 80) || ($scheme === 'https' && $port != 443)) {
    $hostport .= ":$port";
}

// 输出 JSON 格式的 hostport
echo json_encode(['hostport' => $hostport]);
?>
