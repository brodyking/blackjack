<!DOCTYPE html>
<html>

<head>
    <title>Blackjack</title>
    <?php include $snippets["head"]; ?>
    <link href="/lib/svg-playing-cards-master/playing-cards.min.css" rel="stylesheet">
</head>

<body style="max-width: 1000px;margin:auto;margin-top:25px" class="dark">
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
                <i>menu</i>
                <menu class="no-wrap right">
                    <li><a href="/"><i>playing_cards</i>Play</a></li>
                    <li><a href="/settings"><i>settings</i>Settings</a></li>
                    <li><a href="/credits"><i>history_edu</i>Credits</a></li>
                </menu>
            </button>
            <h6 class="max center-align">Blackjack</h6>
            <button class="circle transparent">
                <i>person</i>
                <menu class="no-wrap left">
                    <li><i>person</i><?php echo $username; ?></li>
                    <li><a href="/api/usr/logout"><i>door_back</i>Logout</a></li>
                </menu>

            </button>
        </nav>
    </header>
    <div id="gameBody">
    </div>
    <script type="module" src="/js/main.js"></script>
</body>

</html>