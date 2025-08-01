<?php

$url = $_SERVER["REQUEST_URI"];
$dbpath = __DIR__ . "/database.db";
$snippets = [
    "head" => __DIR__ . "/php/snippets/head.snippet.php"
];

// All available routes
$routes = [
    "noAuth" => [
        "/" => "/php/pages/login.page.php",
        "/login" => "/php/pages/login.page.php",
        "/register" => "/php/pages/register.page.php"
    ],
    "withAuth" => [
        "/" => "/php/pages/dash.page.php",
        "/settings" => "/php/pages/settings.page.php",
        "/play" => "/php/pages/play.page.php"
    ],
    "global" => [
        "/api/usr/register" => "/php/api/usr/register.api.php",
        "/api/usr/logout" => "/php/api/usr/logout.api.php",
        "/api/usr/login" => "/php/api/usr/login.api.php"
    ]
];

// Removes any params from url
if (str_contains($url, "?")) {
    $url = substr($url, 0, strpos($url, "?"));
}

// Removes extra slash at the end of the url
if (strlen($url) > 1 && substr($url, -1) == "/") {
    $url = substr($url, 0, strlen($url) - 1);
}

function isloggedin()
{
    global $dbpath;
    if (isset($_COOKIE["username"]) && isset($_COOKIE["session"])) {
        try {

            $db = new PDO("sqlite:" . $dbpath);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Good practice to set error mode

            $sql = "SELECT * FROM users WHERE username=:usernameInput AND session=:sessionInput";

            $statement = $db->prepare($sql);

            $username = filter_input(INPUT_COOKIE, 'username');
            $statement->bindValue(":usernameInput", $username, PDO::PARAM_STR);

            $session = filter_input(INPUT_COOKIE, 'session');
            $statement->bindValue(":sessionInput", $session, PDO::PARAM_STR);

            $statement->execute(); // <--- YOU WERE MISSING THIS LINE!

            $r = $statement->fetch(PDO::FETCH_ASSOC); // Fetch as an associative array

            $db = null; // Close the database connection

            if (!$r) {
                return false;
            }

            return true;
        } catch (PDOException $e) {
            return false;
        }
    } else {
        return false;
    }
}


if (isset($routes["global"][$url])) {
    include __DIR__ . $routes["global"][$url];
} else if (isloggedin()) {
    if (isset($routes["withAuth"][$url])) {
        $username = $_COOKIE["username"];
        include __DIR__ . $routes["withAuth"][$url];
    } else {
        include __DIR__ . "/php/pages/404.page.php";
    }
} else if (isset($routes["noAuth"][$url])) {
    include __DIR__ . $routes["noAuth"][$url];
} else {
    include __DIR__ . "/php/pages/404.page.php";
}
