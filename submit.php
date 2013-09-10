<?php

if (isSet($_POST["artist"], $_POST["album"], $_POST["rating"]))
{
	$artist = $_POST["artist"];
	$album = $_POST["album"];
	$rating = $_POST["rating"];
	$_POST["artist"] = NULL;
	$_POST["album"] = NULL;
	$_POST["rating"] = NULL;

	$pdo = new PDO("mysql:host=localhost;dbname=rate_album_db", "root", "qwe1234");

	$stmt = $pdo->prepare('
		INSERT INTO ratings (artist,album,rating)
		VALUES (:artist,:album,:rating)');
	
	$stmt->execute(array(':artist'=>$artist, ':album'=>$album, ':rating'=>$rating));

	echo "<br>Thanks for rating " . $artist . " - " . $album . "<br>";
	return;
}
?>