<!DOCTYPE html>
<html>

<head>
    <title>Blackjack</title>
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
                <i>menu</i>
                <menu class="no-wrap right">
                    <li><a href="/"><i>playing_cards</i>Games</a></li>
                    <li><a href="/settings"><i>settings</i>Settings</a></li>
                    <li><a href="/api/usr/logout"><i>door_back</i>Logout</a></li>
                </menu>
            </button>
            <h6 class="max center-align">Blackjack</h6>
            <button class="circle transparent">
                <i>code</i>
                <menu class="no-wrap left">
                    <li><a href="https://www.github.com/brodyking/blackjack"><i>open_in_new</i>Github</a></li>
                </menu>

            </button>
        </nav>
    </header>
    <article class="middle-align center-align">
        <div style="width: 250px;">
            Logged in.
        </div>
    </article>
</body>

</html>