<?php

$dsn = "pgsql:"
    . "host=ec2-184-73-162-34.compute-1.amazonaws.com;"
    . "dbname=d7am24ir1dih0m;"
    . "user=haixijvtehbrpr;"
    . "port=5432;"
    . "sslmode=require;"
    . "password=WYCyCU0S0IsYlhjfS4Dkd4n8ET";
$pdo = new PDO($dsn);

// search for a particular artist
if (isSet($_POST["artist_search"]))
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