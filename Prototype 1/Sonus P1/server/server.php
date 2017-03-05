<?php

@include 'connect.php';

// ADD DATA TO DATABASE
if(isset($_GET['currentData'])) {
  $currentData = $_GET['currentData'];

  $id = $currentData['id'];
  $type = $currentData['type'];
  $posX = $currentData['posX'];
  $posY = $currentData['posY'];
  $timestamp = (string)microtime(true)*100;
  $valR = $currentData['valR'];
  $valG = $currentData['valG'];
  $valB = $currentData['valB'];
  $keycode = $currentData['keycode'];

  $sql = "INSERT INTO current_key (id, type, posX, posY, timestamp, valR, valG, valB, keycode)
  VALUES ($id, $type, $posX, $posY, $timestamp, $valR, $valG, $valB, $keycode)";

  if ($db->query($sql) === TRUE) {
  } else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

// RETURN DATA FROM DATABASE
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