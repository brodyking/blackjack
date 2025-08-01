<!DOCTYPE html>
<html>

<head>
    <title>Blackjack</title>
    <?php include $snippets["head"]; ?>
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
                <i>menu</i>
                <menu class="no-wrap right">
                    <li><a href="/"><i>home</i>Home</a></li>
                    <li><a href="/settings"><i>settings</i>Settings</a></li>
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
    <article class="medium middle-align center-align">
        <div>
            <i class="extra">casino</i>
            <h5>No active games</h5>
            <p>Click the button below to start a new game</p>
            <div class="space"></div>
            <nav class="center-align">
                <button class="responsive">
                    <i>add</i>
                    <span>New Game</span>
                </button>
            </nav>
        </div>
    </article>
</body>

</html>