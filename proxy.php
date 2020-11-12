<?php

$ref = $_GET['ref'];
$url = "https://gem.exorciser.ch/$ref";

$headers = get_headers($url, 1);
$type = $headers["Content-Type"];
header("Content-Type: $type");

$data = file_get_contents($url);
echo $data;
