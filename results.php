<?php

$pdo = new PDO("mysql:host=localhost;dbname=rate_album_db", "root", "qwe1234");

// search for a particular artist
if (isSet($_POST["artist"]))
{
	$stmt = $pdo->prepare('
		SELECT artist, album, rating
		FROM ratings
		WHERE artist LIKE :search
		LIMIT 100');
	$stmt->execute(array(':search' => $_POST["artist"]));
	
	$results = $stmt->fetchAll(PDO::FETCH_OBJ);

	echo json_encode($results);
	return;
}

// return x results, default 10
else if (isSet($_POST["browse"]))
{
	$stmt = $pdo->prepare('
		SELECT *
		FROM ratings
		LIMIT 100');
	$stmt->execute();
	
	$results = $stmt->fetchAll(PDO::FETCH_OBJ);

	echo json_encode($results);
	return;
}

?>