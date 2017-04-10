<?php

@include 'connect.php';

// -- ADD DATA - Detect if data is recieved then add data to DB
if(isset($_GET['currentData'])) {
  $currentData = $_GET['currentData'];

  // Go through all keys received and insert data into DB
  foreach ($currentData as $currentKey) {
    $id = $currentKey['id'];
    $type = $currentKey['type'];
    $posX = $currentKey['posX'];
    $posY = $currentKey['posY'];
    $timestamp = (string)microtime(true)*100;
    $valR = $currentKey['valR'];
    $valG = $currentKey['valG'];
    $valB = $currentKey['valB'];
    $keycode = $currentKey['keycode'];

    $sql = "INSERT INTO current_key (id, type, posX, posY, timestamp, valR, valG, valB, keycode)
    VALUES ($id, $type, $posX, $posY, $timestamp, $valR, $valG, $valB, $keycode)";

    if ($db->query($sql) === TRUE) {
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
  }
}

// -- RETURN DATA - Get all keys that were added to database since last time checked, and return
$lastTimeStamp = (string)microtime(true)*100;
if(isset($_GET['lastTimeStamp']) && $_GET['lastTimeStamp'] != null) {
	$lastTimeStamp = $_GET['lastTimeStamp'];
}
$sql = "SELECT * FROM current_key WHERE timestamp > $lastTimeStamp ORDER BY timestamp ASC";
if(!$result = $db->query($sql)){
    die('There was an error running the query [' . $db->error . ']');
}
if($result->num_rows === 0) {
    $sql = "SELECT * FROM current_key ORDER BY timestamp DESC LIMIT 1";
    if(!$result = $db->query($sql)){
        die('There was an error running the query [' . $db->error . ']');
    }
}
$rows = array();
while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
$data_array = json_encode ($rows);
echo $data_array;



// -- LIMIT ERROR RETURNS - Avoid crashing the page with specific errors
function shutDownFunction() {
    $error = error_get_last();
    if ($error['type'] === E_ERROR) {
    }
}
register_shutdown_function('shutDownFunction');
