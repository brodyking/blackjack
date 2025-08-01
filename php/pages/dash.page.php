<!DOCTYPE html>
<html>

<head>
    <title>Blackjack</title>
    <?php include $snippits["head"]; ?>
</head>

<body style="max-width: 400px;margin:auto;margin-top:25px" class="dark">
    <?php

    if (isset($_GET["error"])) {
        echo '<article class="error-container">
                  <p>' . filter_input(INPUT_GET, "error") . '</p>
            </article>';
    }

    ?>

    <?php include $snippits["nav"]; ?>
    <article class="middle-align center-align">
        <div style="width: 250px;">
            Logged in.
        </div>
    </article>
</body>

</html>