<?php
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

clearstatcache();

$servername = "localhost";
$username = "fetivoco_stamga_sonus";
$password = "l1,yNo?xarB]";
$database = "fetivoco_stamga_sonus";

$db = new mysqli($servername, $username, $password, $database);

if ($db->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
