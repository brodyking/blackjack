<!DOCTYPE html>
<html>

<head>
    <title>Settings - Blackjack</title>
    <?php include $snippits["head"]; ?>
</head>

<body style="max-width: 600px;margin:auto;margin-top:25px" class="dark">
    <?php

    if (isset($_GET["error"])) {
        echo '<article class="error-container">
                  <p>' . filter_input(INPUT_GET, "error") . '</p>
            </article>';
    }

    ?>
    <header>
        <nav>
            <button class="circle transparent">
                <a href="/"><i>arrow_back</i></a>
            </button>
            <h6 class="max">Settings</h6>
        </nav>
    </header>
    <article class="middle-align center-align">
        Will add this later.
    </article>
</body>

</html>