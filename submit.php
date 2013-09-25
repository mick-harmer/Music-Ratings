<?php

if (isSet($_POST["artist"], $_POST["album"], $_POST["rating"]))
{
	$artist = $_POST["artist"];
	$album = $_POST["album"];
	$rating = $_POST["rating"];
	$_POST["artist"] = NULL;
	$_POST["album"] = NULL;
	$_POST["rating"] = NULL;

	$dsn = "pgsql:"
    . "host=ec2-184-73-162-34.compute-1.amazonaws.com;"
    . "dbname=d7am24ir1dih0m;"
    . "user=haixijvtehbrpr;"
    . "port=5432;"
    . "sslmode=require;"
    . "password=WYCyCU0S0IsYlhjfS4Dkd4n8ET";
	$pdo = new PDO($dsn);

	$stmt = $pdo->prepare('
		INSERT INTO ratings (artist,album,rating)
		VALUES (:artist,:album,:rating)');
	
	$stmt->execute(array(':artist'=>$artist, ':album'=>$album, ':rating'=>$rating));

	echo "<br><br>Thanks for rating " . $artist . " - " . $album . "<br>";
	return;
}
?>