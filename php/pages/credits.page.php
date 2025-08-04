<!DOCTYPE html>
<html>

<head>
    <title>Credits - Blackjack</title>
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
                <a href="/"><i>arrow_back</i></a>
            </button>
            <h6 class="max">Credits</h6>
        </nav>
    </header>
    <article>
        <ul class="list border">
            <li>
                <div class="max">
                    <h6 class="small">Noor Sandhu</h6>
                    <div>Developer</div>
                </div>
                <button onclick="document.location.href= 'https://github.com/notzzzz/';">GitHub</button>
            </li>
            <li>
                <div class="max">
                    <h6 class="small">Brody King</h6>
                    <div>Developer</div>
                </div>
                <button onclick="document.location.href= 'https://github.com/brodyking/';">GitHub</button>
            </li>
        </ul>
    </article>
</body>

</html>