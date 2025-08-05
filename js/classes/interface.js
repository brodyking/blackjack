export class Interface {

  constructor() {
    this.dom = document.getElementById("gameBody");
  }

  startScreen() {
    this.dom.innerHTML = `
    <article class="middle-align center-align">
      <fieldset style="width:100%;">
        <legend>Game Settings</legend>
        <div class="field border prefix label">
          <i>attach_money</i>
          <input type="number" id="gameSettingsStartingBalance" value="100">
          <label>Starting Balance</label>
        </div>
        <div class="field border label">
          <select id="gameSettingsPlayerCount">
            <option value="0">Singleplayer</option>
            <option value="1">1 Bot</option>
            <option value="2">2 Bots</option>
            <option value="3">3 Bots</option>
            <option value="4">4 Bots</option>
            <option value="5">5 Bots</option>
            <option value="6">6 Bots</option>
          </select>
          <label>Bots</label>
        </div>
        <div class="field border label">
          <select id="gameSettingsDeckCount">
            <option value="1">1 Deck</option>
            <option value="2">2 Decks</option>
            <option value="3">3 Decks</option>
            <option value="4">4 Decks</option>
            <option value="5">5 Decks</option>
            <option value="6">6 Decks</option>
            <option value="7">7 Decks</option>
            <option value="8" selected>8 Decks</option>
          </select>
          <label>Deck Count</label>
        </div>
        <div class="field border label">
          <div class="space"></div>
          <button class="responsive" onclick="window.game.initGame();">
            <i>play_arrow</i>
            <span>Start game</span>
          </button>
        </div>
      </fieldset>
    </article>
  `;
    document.getElementById("gameSettingsStartingBalance").focus();
  }

  // Grabs the values "numofCount", "PlayersCount", and "StartingBalance" from the DOM.
  startScreenGetValues() {
    let output = {
      "numOfDecks": document.getElementById("gameSettingsDeckCount").value,
      "numOfPlayers": document.getElementById("gameSettingsPlayerCount").value,
      "startingBalance": document.getElementById("gameSettingsStartingBalance").value
    };
    return output;
  }


  betScreen(currentPlayer) {
    this.dom.innerHTML = `
    <article class="medium middle-align center-align">
      <div><i class="extra">poker_chip</i>
      <div class="space"></div>
      <legend>How much would you like to bet?<br><strong>Current Balance: </strong>$`+ currentPlayer.balance + `</legend>
      <div class="field border prefix">
        <i>attach_money</i>
        <input type="number" id="gameBetAmount" value="25">
      </div>    
    <div class="space"></div>
    <button class="responsive" onclick="window.game.initRound();">
      <i>play_arrow</i>
      <span>Start round</span>
    </button>
      </div>
    </article>
    <div id="errorSnackbar" class="snackbar error top"></div>
    <div id="successSnackbar" class="snackbar primary top"></div>
 `;
    document.getElementById("gameBetAmount").focus();
  }

  betScreenGetValues() {
    let output = {
      "betAmount": document.getElementById("gameBetAmount").value
    }
    return output;
  }

  gameScreen(players) {
    let playersarea = "";
    let floatdirection = "left";
    players.forEach((player) => {
      playersarea += `
      <article class="border" id="`+ player.name + `-box" style="float:` + floatdirection + `;display:block;text-align:` + floatdirection + `;margin-top:5px;">
        <h5>` + player.name + `<span style="color: #4caf50;" id="` + player.name + `-balance"></span></h5>
        <span id="`+ player.name + `-hand"></span>
        <h5 style="text-align:center;margin:0px;" id="` + player.name + `-sum"></h5>
        </article>`
      if (floatdirection == "left") {
        floatdirection = "right";
      } else {
        floatdirection = "left";
      }
    });
    this.dom.innerHTML = playersarea +
      `<article class="border" style="float:` + floatdirection + `;display:block;text-align:left;margin-top:5px;" id="house-box">
        <h5>House <span id="house-balance"></span></h5>
        <span id="house-hand"></span>
        <h5 style="text-align:center;margin:0px;" id="house-sum"></h5>
      </article>
      <nav class="tiny-space actionbar" style="width:100%!important;">
        <nav class="toolbar" style="width:100%!important;">
          <a class="mobile-toolbar" id="toolbarHit">
            <i class="align-center">wrist</i>
            <div> Hit</div>
          </a>
          <a class="mobile-toolbar" onclick="game.userDoubleDown()">
            <i class="align-center">attach_money</i>
            <div> Double</div>
          </a>
          <a class="mobile-toolbar" onclick="game.userSplit()">
            <i class="align-center">call_split</i>
            <div> Split</div>
          </a>
          <a class="mobile-toolbar" onclick="game.userStand()">
            <i class="middle-align">front_hand</i>
            <div> Stand</div>
          </a>
          <a class="mobile-toolbar" onclick="game.count()">
            <i class="middle-align">quiz</i>
            <div>Count</div>
          </a>
        </nav>
      </nav>

      <!-- Bust Dialog -->
      <dialog id="bustDialog">
        <h5 class="error-text">You busted at <span id="bustDialogScore"></span>.</h5>
        <div class="error-text">You'll get em next time.</div>
                <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <!-- Loss Dialog -->
      <dialog id="lossDialog">
        <h5 class="error-text">You lost at <span id="lossDialogScore"></span>.</h5>
        <div>You'll get em next time.</div>
        <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <!-- Win Dialog -->
      <dialog id="winDialog">
        <h5 style="color:#8bc34a">You won at <span id="winDialogScore"></span>!</h5>
        <div>Good job!</div>
        <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <!-- Blackjack Dialog -->
      <dialog id="blackjackDialog">
        <h5 style="color:#8bc34a">Blackjack!</h5>
        <div>Good job!</div>
        <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <!-- Count Dialog -->
      <dialog id="countDialog">
        <div>The current count is <span id="countDialogNumber"></span>.</div>
        <nav class="right-align no-space">
          <button onclick="document.getElementById('countDialog').close();" class="transparent link">Close</button>
        </nav>
      </dialog>

    <div id="errorSnackbar" class="snackbar error top"></div>
    <div id="successSnackbar" class="snackbar primary top"></div>
`;
  }

  hydrate(players, house, activePlayer) {
    players.forEach((player) => {
      if (activePlayer.name == player.name) {
        document.getElementById(player.name + "-box").classList.add("primary-border");
      } else {
        document.getElementById(player.name + "-box").classList.remove("primary-border");
      }
      if (activePlayer.name == "House") {
        document.getElementById("house-box").classList.add("primary-border");
      } else {
        document.getElementById("house-box").classList.remove("primary-border");
      }
      document.getElementById(player.name + "-hand").innerHTML = "";
      player.hands.forEach((hand) => {
        document.getElementById(player.name + "-hand").innerHTML += player.handToString() + "<br>";
      })
      document.getElementById(player.name + "-balance").innerHTML = " ($" + player.balance + ")";
      document.getElementById(player.name + "-sum").innerHTML = " (" + player.handGetSum() + ")";
    });
    document.getElementById("house-hand").innerHTML = house.handToString();
    document.getElementById("house-sum").innerHTML = " (" + house.handGetSum() + ")";
  }

  bust(playerSum, houseSum) {
    document.getElementById("bustDialog").show();
    document.getElementById("bustDialogScore").innerHTML = playerSum + " - " + houseSum;
  }


  lose(playerSum, houseSum) {
    document.getElementById("lossDialog").show();
    document.getElementById("lossDialogScore").innerHTML = playerSum + " - " + houseSum;
  }

  win(playerSum, houseSum) {
    document.getElementById("winDialog").show();
    document.getElementById("winDialogScore").innerHTML = playerSum + " - " + houseSum;
  }

  win(playerSum, houseSum) {
    document.getElementById("winDialog").show();
    document.getElementById("winDialogScore").innerHTML = playerSum + " - " + houseSum;
  }

  blackjack() {
    document.getElementById("blackjackDialog").show();
  }

  count() {
    document.getElementById("countDialog").show();
  }

  showError(message) {
    document.getElementById("errorSnackbar").innerHTML = message;
    document.getElementById("errorSnackbar").classList.add("active");
    setTimeout(function() {
      document.getElementById("errorSnackbar").classList.remove("active");
    }, 2000); // 1000 milliseconds = 1 second
  }

  showSuccess(message) {
    document.getElementById("successSnackbar").innerHTML = message;
    document.getElementById("successSnackbar").classList.add("active");
    setTimeout(function() {
      document.getElementById("successSnackbar").classList.remove("active");
    }, 2000); // 1000 milliseconds = 1 second
  }
}
