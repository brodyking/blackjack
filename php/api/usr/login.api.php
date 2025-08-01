<?php

if (isset($_POST["username"]) && isset($_POST["password"])) {
    try {

        $db = new PDO("sqlite:" . $dbpath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Good practice to set error mode

        $sql = "SELECT * FROM users WHERE username=:usernameInput AND password=:passwordInput";

        $statement = $db->prepare($sql);

        $username = urldecode(filter_input(INPUT_POST, 'username'));
        $statement->bindValue(":usernameInput", $username, PDO::PARAM_STR);

        $password = urldecode(filter_input(INPUT_POST, 'password'));
        $statement->bindValue(":passwordInput", $password, PDO::PARAM_STR);

        $statement->execute(); // <--- YOU WERE MISSING THIS LINE!

        $r = $statement->fetch(PDO::FETCH_ASSOC); // Fetch as an associative array

        $db = null; // Close the database connection

        if (!$r) {
            Header("Location: /login?error=Incorrect Login Details");
            exit();
        }
    } catch (PDOException $e) {
        Header("Location: /login?error=Unknown Error");
        die();
    }

    try {

        $db = new PDO("sqlite:" . $dbpath);

        $session = random_int(0, 99999999999999);

        $sql = "UPDATE users SET session = :sessionInput WHERE username=:usernameInput";

        $statement = $db->prepare($sql);

        $username = filter_input(INPUT_POST, 'username');
        $statement->bindValue(":usernameInput", $username, PDO::PARAM_STR);

        $statement->bindValue(":sessionInput", $session, PDO::PARAM_INT);

        $success = $statement->execute();
        if ($success) {
            setcookie("session", $session, time() + (86400 * 30), "/");
            setcookie("username", $username, time() + (86400 * 30), "/");
            Header("Location: /");
        } else {
            Header("Location: /login?error=Unknown Error");
            die();
        }
        $db = null;
    } catch (PDOException $e) {
        //echo $e;
        Header("Location: /login?error=Unknown Error");
        die();
    }
} else {
    Header("Location: /login?error=Unknown Error");
}
