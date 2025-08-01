// Game body is a DIV inside of the body, where the game content gets updated
const gameBody = document.getElementById("gameBody");
// You can find the deck and card classes inside of js/classes.js
let deck = null;
// This object contains all the info for the current hand.
// Note that while currentHand will reset every hand, the count and deck will not.
let currentHand = [null, null];

// This is the intro screen before the game starts.
function gameSettings() {
  gameBody.innerHTML = `
    <fieldset style="padding-bottom:0px;">
      <legend>How many decks?</legend>
      <div class="field border">
        <input type="number" id="gameSettingsDeckCount" value="4">
      </div>
    </fieldset>
    <div class="space"></div>
    <button class="responsive" onclick="startGame();">
      <i>play_arrow</i>
      <span>Start game</span>
    </button>
  `;
}

// Called on the button press in settings. Inits the deck and starts a hand. 
function startGame() {
  if (document.getElementById("gameSettingsDeckCount").value < 1) {
    document.location.href = "/play?error=You must have at least 1 deck.";
  }
  deck = new Deck(document.getElementById("gameSettingsDeckCount").value);
  startHand();
}

// This is the function to call when starting a new hand.
function startHand() {
  // Blank a first, it's populated later in this function with hit calls
  currentHand = {
    "house": {
      "cards": [],
      "sum": 0,
      "toString": "",
      "acesUsed": 0
    },
    "player": {
      "cards": [],
      "sum": 0,
      "toString": "",
      "acesUsed": 0
    },
    "isaction": true
  };
  gameBody.innerHTML = `
<article class="border" style="float:left;display:block;text-align:left;margin-top:5px;">
  <h5>House (<span id="houseHandSum"></span>)</h5>
  <span id="houseHand"></span>
</article>
<article class="border" style="float:right;display:block;text-align:right;margin-top:5px;">
  <h5>Player (<span id="playerHandSum"></span>)</h5>
  <span id="playerHand"></span>
</article>
<nav class="tiny-space actionbar" style="width:100%!important;">
  <nav class="toolbar" style="width:100%!important;">
    <a onclick="playerHit()">
      <i>wrist</i>
      <div class="nomobile"> Hit</div>
    </a>
    <a>
      <i>attach_money</i>
      <div class="nomobile"> Double</div>
    </a>
    <a onclick="stand()">
      <i>front_hand</i>
      <div class="nomobile"> Stand</div>
    </a>
    <a onclick="countOpen()">
      <i>quiz</i>
      <div class="nomobile">Count</div>
    </a>
  </nav>
</nav>
<dialog id="bustDialog">
  <h5>You busted.</h5>
  <div>You'll get em next time.</div>
  <nav class="right-align no-space">
    <button onclick="startHand();" class="transparent link">Next Round</button>
  </nav>
</dialog>
<dialog id="lossDialog">
  <h5>You lost.</h5>
  <div>You'll get em next time.</div>
  <nav class="right-align no-space">
    <button onclick="startHand();" class="transparent link">Next Round</button>
  </nav>
</dialog>
<dialog id="winDialog">
  <h5>You won!</h5>
  <div>Good job!</div>
  <nav class="right-align no-space">
    <button onclick="startHand();" class="transparent link">Next Round</button>
  </nav>
</dialog>
<dialog id="countDialog">
  <div>The current count is <span id="countDialogNumber"></span>.</div>
  <nav class="right-align no-space">
    <button onclick="document.getElementById('countDialog').close();" class="transparent link">Close</button>
  </nav>
</dialog>
  `;
  houseHit();
  houseHit();
  playerHit();
  playerHit();
  hydrate();
}

// Refreshes the data on screen.
// The "isaction" var is used to determine when the first dealer card should be shown.
// Its a little hacky but idc.
function hydrate() {
  document.getElementById("playerHand").innerHTML = currentHand["player"]["toString"];
  document.getElementById("playerHandSum").innerHTML = currentHand["player"]["sum"];
  if (currentHand["house"]["cards"].length > 1) {
    if (currentHand["isaction"]) {
      document.getElementById("houseHand").innerHTML = `<span class="pcard-back"></span>` + currentHand["house"]["cards"][1].toString();
      document.getElementById("houseHandSum").innerHTML = currentHand["house"]["cards"][1].getValue();
    } else {
      document.getElementById("houseHand").innerHTML = currentHand["house"]["toString"];
      document.getElementById("houseHandSum").innerHTML = currentHand["house"]["sum"];
    }
  }
  if (currentHand["player"]["sum"] > 21) {
    if (currentHand["player"]["acesUsed"] > 0) {
      currentHand["player"]["sum"] -= 10;
      currentHand["player"]["acesUsed"]--;
      hydrate();
    } else {
      bust();
    }
  }
}

// Player hit function.
function playerHit() {
  let newCard = deck.getRandomCard();
  if (newCard.getValue() == 11) {
    currentHand["player"]["acesUsed"] += 1;
  }
  currentHand["player"]["cards"].push(newCard);
  currentHand["player"]["toString"] += newCard.toString();
  currentHand["player"]["sum"] += newCard.getValue();
  hydrate();
}

// House hit function
function houseHit() {
  let newCard = deck.getRandomCard();
  if (newCard.getValue() == 11) {
    currentHand["house"]["acesUsed"] += 1;
  }
  currentHand["house"]["cards"].push(newCard);
  currentHand["house"]["toString"] += newCard.toString();
  currentHand["house"]["sum"] += newCard.getValue()
  hydrate();
}

// All of the functions below are just opening dialogs.

function bust() {
  document.getElementById("bustDialog").show();
}

function loss() {
  document.getElementById("lossDialog").show();
}

function win() {
  document.getElementById("winDialog").show();
}

function countOpen() {
  document.getElementById("countDialogNumber").innerHTML = deck.getCount();
  document.getElementById("countDialog").show();
}

// Turns action off, hydrates to show the dealers card, and then runs out the dealers cards if neccesary.
function stand() {
  currentHand["isaction"] = false;
  hydrate();
  if (currentHand["house"]["sum"] < 17) {
    while (currentHand["house"]["sum"] < 17) {
      houseHit();
    }
  }
  if (currentHand["house"]["sum"] > 21) {
    win();
  } else if (currentHand["house"]["sum"] > currentHand["player"]["sum"]) {
    loss();
  } else {
    win();
  }
}

gameSettings();
