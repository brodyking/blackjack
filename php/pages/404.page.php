<!DOCTYPE html>
<html>

<head>
    <title>404- Blackjack</title>
    <?php include $snippets["head"]; ?>
</head>

<body style="max-width: 400px;margin:auto;margin-top:50px" class="dark">
    <?php

    if (isset($_GET["error"])) {
        echo '<article class="error-container">
                  <p>' . filter_input(INPUT_GET, "error") . '</p>
            </article>';
    }

    ?>
    <article class="center-align">
        <h5>Error 404</h5>
        <p>Page not found</p>
        <div class="space"></div>
        <a href="/">
            <button class="responsive large-elevate">
                <i>arrow_back</i>
                <span>Back to safety</span>
            </button>
        </a>
    </article>
</body>

</html>