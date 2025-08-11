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
    window.scrollTo(0, 0);
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
    players.forEach((player) => {
      let handIndex = 0;
      player.hands.forEach((hand) => {
        // Ids: box: name-handindex-box
        //      hand: name-handindex-hand
        playersarea += `
      <article class="border" id="`+ player.name + `-` + handIndex + `-box" style="float:left;display:block;text-align:left;margin-top:5px;">
        <h5>` + player.name + ` <span style="font-size:15px!important;">Bet: <span id="` + player.name + `-` + handIndex + `-bet"></span></h5>
        <span id="`+ player.name + `-` + handIndex + `-hand"></span>
        <h5 style="text-align:center;margin:0px;" id="` + player.name + `-` + handIndex + `-sum"></h5>
        </article>`
        handIndex++;
      })
    });
    this.dom.innerHTML = playersarea +
      `<article class="border" style="float:right;display:block;text-align:right;margin-top:5px;" id="house-box">
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
          <a class="mobile-toolbar" id="toolbarDoubleDown">
            <i class="align-center">attach_money</i>
            <div> Double</div>
          </a>
          <a class="mobile-toolbar" id="toolbarSplit">
            <i class="align-center">call_split</i>
            <div> Split</div>
          </a>
          <a class="mobile-toolbar" id="toolbarStand">
            <i class="middle-align">front_hand</i>
            <div> Stand</div>
          </a>
        </nav>
      </nav>

      <!-- Alert Dialog -->
      <dialog id="alertDialog">
        <h5 id="alertDialogHead"></h5>
        <div id="alertDialogBody"></div>
                <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <!-- Loss Dialog -->
      <dialog id="lossDialog">
        <h5 class="error-text">You lost $<span id="lossDialogAmount"></span>.</h5>
        <div id="lossDialogHands"></div>
        <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <dialog id="winDialog">
        <h5 style="color:#8bc34a">You won $<span id="winDialogAmount"></span>!</h5>
        <div id="winDialogHands"></div>
        <nav class="right-align no-space">
          <button onclick="window.game.interface.betScreen(window.game.players[window.game.posAtTable]);" class="transparent link">Next Round</button>
        </nav>
      </dialog>

      <dialog id="pushDialog">
        <h5 style="color:#8bc34a">You pushed!</h5>
        <div id="pushDialogHands"></div>
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
      let handIndex = 0;
      player.hands.forEach((hand) => {
        if (activePlayer.name == player.name && player.currentHand == handIndex) {
          document.getElementById(player.name + "-" + handIndex + "-box").classList.add("primary-border");
        } else {
          document.getElementById(player.name + "-" + handIndex + "-box").classList.remove("primary-border");
        }
        document.getElementById(player.name + "-" + handIndex + "-hand").innerHTML = player.hands[handIndex].toString();
        document.getElementById(player.name + "-" + handIndex + "-sum").innerHTML = player.hands[handIndex].getSum();
        document.getElementById(player.name + "-" + handIndex + "-bet").innerHTML = player.hands[handIndex].bet;
        if (hand.isBust) {
          document.getElementById(player.name + "-" + handIndex + "-sum").innerHTML += " - Bust";
          document.getElementById(player.name + "-" + handIndex + "-sum").classList.add("error-text");
        } else if (hand.isBlackjack) {
          document.getElementById(player.name + "-" + handIndex + "-sum").innerHTML += " - Blackjack";
          document.getElementById(player.name + "-" + handIndex + "-sum").classList.add("primary-text");
        }
        handIndex++;
      });
      if (activePlayer.name == "House") {
        document.getElementById("house-box").classList.add("primary-border");
      } else {
        document.getElementById("house-box").classList.remove("primary-border");
      }
    });
    document.getElementById("house-hand").innerHTML = house.handToString();
    document.getElementById("house-sum").innerHTML = " (" + house.handGetSum() + ")";
  }

  lose(amount, hands) {
    document.getElementById("lossDialogAmount").innerHTML = amount;
    let handsHtml = "<div style='font-size:20px;text-align:center;margin-top:15px!important;'>Your hand(s):</div>";
    hands.users.forEach((hand) => {
      handsHtml += "<article class='border'>";
      handsHtml += hand.toString() + "<br>";
      handsHtml += "<h5 style='text-align:center;margin:0px;'>" + hand.getSum() + "</h5>";
      handsHtml += "</article>";
    });
    handsHtml += "<div style='font-size:20px;text-align:center;margin-top:10px!important;'>House's hand:</div><article class='border'>" + hands.house.toString() + "<h5 style='text-align:center;margin:0px;'>" + hands.house.getSum() + "</h5></article>";
    document.getElementById("lossDialogHands").innerHTML = handsHtml;
    document.getElementById("lossDialog").show();
  }

  win(amount, hands) {
    document.getElementById("winDialogAmount").innerHTML = amount;
    let handsHtml = "<div style='font-size:20px;text-align:center;margin-top:15px!important;'>Your hand(s):</div>";
    hands.users.forEach((hand) => {
      handsHtml += "<article class='border'>";
      handsHtml += hand.toString() + "<br>";
      handsHtml += "<h5 style='text-align:center;margin:0px;'>" + hand.getSum() + "</h5>";
      handsHtml += "</article>";
    });
    handsHtml += "<div style='font-size:20px;text-align:center;margin-top:10px!important;'>House's hand:</div><article class='border'>" + hands.house.toString() + "<h5 style='text-align:center;margin:0px;'>" + hands.house.getSum() + "</h5></article>";
    document.getElementById("winDialogHands").innerHTML = handsHtml;
    document.getElementById("winDialog").show();
  }


  push(amount, hands) {
    let handsHtml = "<div style='font-size:20px;text-align:center;margin-top:15px!important;'>Your hand(s):</div>";
    hands.users.forEach((hand) => {
      handsHtml += "<article class='border'>";
      handsHtml += hand.toString() + "<br>";
      handsHtml += "<h5 style='text-align:center;margin:0px;'>" + hand.getSum() + "</h5>";
      handsHtml += "</article>";
    });
    handsHtml += "<div style='font-size:20px;text-align:center;margin-top:10px!important;'>House's hand:</div><article class='border'>" + hands.house.toString() + "<h5 style='text-align:center;margin:0px;'>" + hands.house.getSum() + "</h5></article>";
    document.getElementById("pushDialogHands").innerHTML = handsHtml;
    document.getElementById("pushDialog").show();
  }

  blackjack() {
    document.getElementById("blackjackDialog").show();
  }

  count() {
    document.getElementById("countDialog").show();
  }

  dialog(head, body) {
    document.getElementById("alertDialogHead").innerHTML = head;
    document.getElementById("alertDialogBody").innerHTML = body;
    document.getElementById("alertDialog").show();
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
