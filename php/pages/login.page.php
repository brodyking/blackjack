<!DOCTYPE html>
<html>

<head>
    <title>Login - Blackjack</title>
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
    <article class="middle-align center-align">
        <div style="width: 250px;">
            <form method="POST" action="/api/usr/login">
                <img src="/img/logo512.png" style="width: 50px;">
                <h5>Blackjack</h5>
                <p>Please Login</p>
                <div class="space"></div>
                <div class="field border round label">
                    <input type="text" name="username">
                    <label>Username</label>
                </div>
                <div class="field border round label">
                    <input type="password" name="password">
                    <label>Password</label>
                </div>
                <button class="responsive" type="submit">Login</button>
                <div class="space"></div>
                <p>Dont have an account? <a class="text-link" href="/register">Register here</a></p>
            </form>
        </div>
    </article>
</body>

</html>