<!DOCTYPE html>
<html>

<head>
    <title>Blackjack</title>
    <?php include $snippets["head"]; ?>
    <link href="/lib/svg-playing-cards-master/playing-cards.min.css" rel="stylesheet">
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
        </nav>
    </header>
    <div id="gameBody">
    </div>
    <script type="module" src="/js/main.js"></script>
</body>

</html>