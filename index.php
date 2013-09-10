<?php

# read Heroku DATABASE_URL configuration
function pg_connection_string() {

}

# establish db connection
$db = pg_connect(pg_connection_string());
if (!$db) {
	echo "Database connection error.";
	exit;
}

$result = pg_query($db, "SELECT *");