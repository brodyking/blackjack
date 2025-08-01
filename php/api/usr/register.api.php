<?php

if (isset($_POST["username"]) && isset($_POST["password"])) {

    if ($_POST["username"] == "") {
        Header("Location: /register?error=Username cannot be blank.");
        die();
    }

    if ($_POST["password"] == "") {
        Header("Location: /register?error=Password cannot be blank.");
        die();
    }


    try {

        $db = new PDO("sqlite:" . $dbpath);
        $session = random_int(0, 999999999999999999);
        $sql = "INSERT INTO users (username,password,session,joindate) VALUES (:usernameInput,:passwordInput,:sessionInput,:joindateInput);";

        $statement = $db->prepare($sql);

        $username = filter_input(INPUT_POST, 'username');
        $username = strtolower($username);
        $statement->bindValue(":usernameInput", $username, PDO::PARAM_STR);

        $password = filter_input(INPUT_POST, 'password');
        $statement->bindValue(":passwordInput", $password, PDO::PARAM_STR);

        $statement->bindValue(":sessionInput", $session, PDO::PARAM_INT);

        $statement->bindValue(":joindateInput", date("m/d/Y"), PDO::PARAM_STR);

        $success = $statement->execute();

        if ($success) {
            setcookie("session", $session, time() + (86400 * 30), "/");
            setcookie("username", $username, time() + (86400 * 30), "/");
            Header("Location: /");
        } else {
            Header("Location: /register?error=Unknown Error");
            die();
            //echo "error";
        }
        $db = null;
    } catch (PDOException $e) {
        Header("Location: /register?error=Username already taken");
        //echo $e;
        die();
    }
} else {
    Header("Location: /register?error=Unknown Error");
    die();
    //echo "error";
}
