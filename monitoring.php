<?php
/**
 * Custom Firebase monitoring tool
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Sébastien Lucas <sebastien@slucas.fr>
 */

$curl = curl_init();
$token = "<TOKEN>";
$url = 'https://<YOUR FIREBASE APP>.firebaseio.com/readings/consigne.json?orderBy="$key"&limitToLast=1&auth=' . $token;
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $url
));
$response = curl_exec($curl);
curl_close($curl);
echo var_dump($response);
if (preg_match('/"time":(\d+)\}/', $response, $matches)) {
    $lastUpdate = $matches[1];
    $current = time();
    echo "\nCurrent date: " . date('c', $current);
    echo "\nLast Update: " . date('c', $lastUpdate);
    if (($current - $lastUpdate) <= 60 * 31) {
        echo ("\nMonitoring OK");
        return;
    }
}
echo ("\nWorld is ending");
