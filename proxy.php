<?php

$ref = $_GET['ref'];
$url = "https://gem.exorciser.ch/$ref";

$headers = get_headers($url, 1);

$responsecode = preg_replace("/.*(\d\d\d).*/", "$1", $headers[0]);
http_response_code($responsecode);

if ($responsecode >= 400) exit();

$type = $headers["Content-Type"];
header("Content-Type: $type");

try{
  echo file_get_contents($url);
} catch (Exception $ex) {

}
