<?php

# read Heroku DATABASE_URL configuration
function pg_connection_string() {
	return "dbname=d7am24ir1dih0m host=ec2-184-73-162-34.compute-1.amazonaws.com port=5432 user=haixijvtehbrpr password=WYCyCU0S0IsYlhjfS4Dkd4n8ET sslmode=require";
}

# establish db connection
$db = pg_connect(pg_connection_string());
if (!$db) {
	echo "Database connection error.";
	exit;
}

$result = pg_query($db, "SELECT *");