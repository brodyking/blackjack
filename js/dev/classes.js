// Possible suits: ["spade","club","diamond","heart"]
// Possible ranks are ints 2-14 (11-14 being J-A)
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
  // The toString() method is to be used when displaying the cards to the page.
  // The syntax of the class inside the span the value of the card (2,9,j,k) and then the first letter of the suit.
  // It outputs the <span> tag needed for the SVG.
  // Example: 10 of spades -> <span class="pcard-10s"></span>
  toString() {
    let output = "";
    switch (this.rank) {
      case 11:
        output = "j"
        break;
      case 12:
        output = "q"
        break;
      case 13:
        output = "k"
        break;
      case 14:
        output = "a"
        break;
      default:
        output = this.rank;
    }
    output += this.suit.charAt(0);
    return '<span class="pcard-' + output + '"></span>';
  }
  // Returns the actual value of the card
  // Output will be an integer (1-11)
  // Aces will always return 11, and will be changed to 1 inside of the hand class.
  getValue() {
    if (this.rank < 11) {
      return this.rank;
    } else {
      switch (this.rank) {
        case "j":
          return 10;
        case "q":
          return 10;
        case "k":
          return 10;
        case "a":
          return 11;
      }
    }
  }
}

class Deck {
  // The constructor builds the deck.
  // It loops through each suit and rank and adds all the cards into this.cards
  constructor() {
    this.cards = [];
    let suits = ["diamond", "spade", "club", "heart"];
    let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        this.cards.push(new Card(suit, rank));
      });
    });
  }
  getCards() {
    return this.cards;
  }
}

class Shoe {
  // The constructor in the shoe creates multiple decks, and puts all the cards into the cards array. 
  constructor(numOfDecks) {
    // Array of cards that have not been dealt
    this.cardsRemaining = [];
    // Array of cards that have already been dealt
    this.cardsDealt = [];
    // Total decks in the shoe
    this.decksTotal = numOfDecks;
    // Total decks used
    this.decksUsed = 0;
    // This tracks how many cards have been given in the current deck. Once at 52, it is reset to 0 and decksUsed is incremented.
    this.currentDeckCardsUsed = 0;
    // The running count
    this.count = 0;

    for (let i = 0; i < numOfDecks; i++) {
      let nextDeck = new Deck;
      nextDeck.getCards().forEach((card) => {
        this.cardsRemaining.push(card);
      })
    }
  }

  // Returns a random card and removes it from cardsRemaning, adds to cardsDealt
  popRandomCard() {
    let randomIndex = Math.floor(Math.random() * this.cardsRemaining.length);
    let card = this.cardsRemaining[randomIndex];
    if (card.rank < 7) {
      this.count += 1;
    } else if (card.rank > 9) {
      this.count -= 1;
    }
    // Adds card to the cardsDealt array
    this.cardsDealt.push(card);
    // Removes card from cardsRemaining 
    this.cardsRemaining.splice(randomIndex, 1);
    // Adds one to the d
    this.currentDeckCardsUsed++;
    if (this.currentDeckCardsUsed == 52) {
      this.decksUsed++;
      this.currentDeckCardsUsed = 0;
    }
    return card;
  }

  getRunningCount() {
    return this.count;
  }

  // getTrueCount returns the running count devided by the amount of decks used
  getTrueCount() {
    return this.count / (this.decksTotal - this.decksUsed);
  }

}

class Hand {
  constructor(isDealer) {
    // isDealer determines which cards are shown in the toString
    this.isDealer = isDealer;
    // if it is the dealers turn, all the cards will be shown.
    this.isDealerPlaying = false;
    this.cards = [];
    this.aces = 0;
    this.sum = 0;
  }

  clear() {
    this.cards = [];
    this.aces = 0;
    this.sum = 0;
  }

  // addCard adds the card to the cards array, then checks if it is an ace.
  // If so, it adds to the aces var and adds 11, then calls checkAce().
  addCard(card) {
    this.cards.push(card);
    if (card.rank == "a") {
      this.aces++;
      this.sum += 11;
      this.checkAce();
    } else {
      this.sum += parseInt(card.getValue());
    }
  }

  checkAce() {
    if (this.aces > 0 && this.sum > 21) {
      this.sum -= 10;
      this.aces--;

      if (this.sum > 21 && this.aces > 0) {
        checkAce();
      }

    }
  }

  getSum() {
    if (this.isDealer && this.isDealerPlaying == false) {
      return this.cards[1].getValue();
    } else {
      return this.sum;
    }
  }

  // Checks if the hand is a dealers hand.
  // If it is a dealer, it returns a blank card and their second card.
  // If not a dealer, it returns all the cards.
  toString() {
    if (this.isDealer && this.isDealerPlaying == false) {
      return "<span class='pcard-back'></span>" + this.cards[1].toString();
    } else {
      let deckToString = "";
      this.cards.forEach((element) => {
        deckToString += element.toString();
      })
      return deckToString;
    }
  }

}

class Player {
  constructor(name, balance, isDealer) {
    // The players name
    this.name = name;
    // The players balance
    this.balance = balance;
    // The plsyers current bet
    this.bet = 0;
    //
    this.isDealer = isDealer;
    // The players current hand
    this.hand = new Hand(this.isDealer);
  }
  betPlace(amount) {
    if (amount > balance) {
      return false;
    }
    this.bet = amount;
    this.balance -= amount;
    return true;
  }
  betWin() {
    this.balance += this.bet * 2;
    this.bet = 0;
  }
  betPush() {
    this.balance += this.bet;
    this.bet = 0;
  }
  betLose() {
    this.bet = 0;
  }
}

class Game {
  constructor() {
    this.interface = new Interface;
  }

  startGame(numOfDecks, numOfPlayers, startingBalance) {
    this.numOfDecks = numOfDecks;
    this.numOfPlayers = numOfPlayers;
    this.startingBalance = startingBalance;

    this.shoe = new Shoe(this.numOfDecks);
    this.players = [];
    this.house = new Player("House", Infinity, true);
    this.isUsersTurn = false; // Used to determine if the user is allowed to bet, stand, etc

    for (let i = 0; i < numOfPlayers; i++) {
      // Adds a new player, gives it the name "Player" and the number player it is.
      this.players.push(new Player("Player " + (this.players.length + 1), this.startingBalance, false));
    }

    // Puts the user into a random position in the players[] list.
    this.posAtTable = Math.round(Math.random() * this.players.length);
    this.players.splice(this.posAtTable, 0, new Player("You", this.startingBalance, false));
  }

  startRound() {

    // Clears and deals two cards to each player
    this.players.forEach((player) => {
      player.hand.clear();
      player.hand.addCard(this.shoe.popRandomCard());
      player.hand.addCard(this.shoe.popRandomCard());
    })

    // Clears and deals two cards for the house
    this.house.hand.clear();
    this.house.hand.addCard(this.shoe.popRandomCard());
    this.house.hand.addCard(this.shoe.popRandomCard());

    // Draw the inital screen
    this.interface.gameScreen(this.players);

    // Run the Bots before the user
    this.preUserTurn();

    if (this.players[this.posAtTable].hand.getSum() == 21) {
      this.interface.blackjack();
    }

  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Loops through all of the CPU players before the user.
  async preUserTurn() {
    // Loop through each player, and then stop at the users locatiion.
    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];
      // This is where the CPUS could make an action
      this.interface.hydrate(this.players, this.house, currentPlayer);
      if (currentPlayer.name == "You") {
        this.isUsersTurn = true;
        break;
      }
      await this.delay(1000);
    }
  }

  // Loops through all of the CPU players after the user.
  postUserTurn() {
    if (this.posAtTable + 1 < this.players.length) {
      for (let i = this.posAtTable + 1; i < this.players.length; i++) {
        let currentPlayer = this.players[i];
        // This is where the CPUS could make an action
        this.interface.hydrate(this.players, this.house, currentPlayer);
      }
    }
  }

  userHit() {
    if (this.isUsersTurn) {
      // Gives a new card to the user, and hydrates the screen
      this.players[this.posAtTable].hand.addCard(this.shoe.popRandomCard());
      this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
      if (this.players[this.posAtTable].hand.getSum() > 21) {
        this.interface.bust(this.players[this.posAtTable].hand.getSum(), this.house.hand.getSum());
      } else if (this.players[this.posAtTable].hand.getSum() == 21) {
        this.interface.blackjack();
      }
    }
  }

  userStand() {
    this.isUsersTurn = false;
    this.house.hand.isDealerPlaying = true;
    this.postUserTurn();
    this.houseTurn();
  }

  houseTurn() {
    this.interface.hydrate(this.players, this.house, this.house);
    if (this.house.hand.getSum() > 21) {
      this.interface.win(this.players[this.posAtTable].hand.getSum(), this.house.hand.getSum());
    } else if (this.house.hand.getSum() < 17 || (this.house.hand.getSum() == 17 && this.house.hand.aces > 0)) {
      this.house.hand.addCard(this.shoe.popRandomCard());
      this.interface.hydrate(this.players, this.house, this.house);
      this.houseTurn();
    } else if (this.house.hand.getSum() > this.players[this.posAtTable].hand.getSum()) {
      this.interface.lose(this.players[this.posAtTable].hand.getSum(), this.house.hand.getSum());
    } else {
      this.interface.win(this.players[this.posAtTable].hand.getSum(), this.house.hand.getSum());
    }
  }
}

class Interface {

  constructor() {
    this.dom = document.getElementById("gameBody");
  }

  startScreen() {
    this.dom.innerHTML = `
    <fieldset style="padding-bottom:0px;">
      <legend>How many decks?</legend>
      <div class="field border">
        <input type="number" id="gameSettingsDeckCount" value="4">
      </div>    
    </fieldset>
    <fieldset style="padding-bottom:0px;">
      <legend>How many Players?</legend>
        <div class="field border">
        <input type="number" id="gameSettingsPlayersCount" value="4">
      </div>
    </fieldset>
    <fieldset style="padding-bottom:0px;">
      <legend>What is the starting balance?</legend>
        <div class="field border">
        <input type="number" id="gameSettingsStartingBalance" value="4">
      </div>
    </fieldset>
    <div class="space"></div>
    <button class="responsive" onclick="startGame();">
      <i>play_arrow</i>
      <span>Start game</span>
    </button>
  `;
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
          <a onclick="game.userHit()">
            <i>wrist</i>
            <div class="nomobile"> Hit</div>
          </a>
          <a>
            <i>attach_money</i>
            <div class="nomobile"> Double</div>
          </a>
          <a onclick="game.userStand()">
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
        <h5 class="error-text">You busted at <span id="bustDialogScore"></span>.</h5>
        <div class="error-text">You'll get em next time.</div>
                <nav class="right-align no-space">
          <button onclick="game.startRound();" class="transparent link">Next Round</button>
        </nav>
      </dialog>
      <dialog id="lossDialog">
        <h5 class="error-text">You lost at <span id="lossDialogScore"></span>.</h5>
        <div>You'll get em next time.</div>
        <nav class="right-align no-space">
          <button onclick="game.startRound();" class="transparent link">Next Round</button>
        </nav>
      </dialog>
      <dialog id="winDialog">
        <h5 style="color:#8bc34a">You won at <span id="winDialogScore"></span>!</h5>
        <div>Good job!</div>
        <nav class="right-align no-space">
          <button onclick="game.startRound();" class="transparent link">Next Round</button>
        </nav>
      </dialog>
      <dialog id="blackjackDialog">
        <h5 style="color:#8bc34a">Blackjack!</h5>
        <div>Good job!</div>
        <nav class="right-align no-space">
          <button onclick="game.startRound();" class="transparent link">Next Round</button>
        </nav>
      </dialog>
      <dialog id="countDialog">
        <div>The current count is <span id="countDialogNumber"></span>.</div>
        <nav class="right-align no-space">
          <button onclick="document.getElementById('countDialog').close();" class="transparent link">Close</button>
        </nav>
      </dialog>`;
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
      document.getElementById(player.name + "-hand").innerHTML = player.hand.toString();
      document.getElementById(player.name + "-balance").innerHTML = " ($" + player.balance + ")";
      document.getElementById(player.name + "-sum").innerHTML = " (" + player.hand.getSum() + ")";
    });
    document.getElementById("house-hand").innerHTML = house.hand.toString();
    document.getElementById("house-sum").innerHTML = " (" + house.hand.getSum() + ")";
    // document.getElementById("playerHand").innerHTML = currentHand["player"]["toString"];
    // document.getElementById("playerHandSum").innerHTML = currentHand["player"]["sum"];
    // if (currentHand["house"]["cards"].length > 1) {
    //   if (currentHand["isaction"]) {
    //     document.getElementById("houseHand").innerHTML = `<span class="pcard-back"></span>` + currentHand["house"]["cards"][1].toString();
    //     document.getElementById("houseHandSum").innerHTML = currentHand["house"]["cards"][1].getValue();
    //   } else {
    //     document.getElementById("houseHand").innerHTML = currentHand["house"]["toString"];
    //     document.getElementById("houseHandSum").innerHTML = currentHand["house"]["sum"];
    //   }
    // }
    // if (currentHand["player"]["sum"] > 21) {
    //   if (currentHand["player"]["acesUsed"] > 0) {
    //     currentHand["player"]["sum"] -= 10;
    //     currentHand["player"]["acesUsed"]--;
    //     hydrate();
    //   } else {
    //     bust();
    //   }
    // }
    // if (currentHand["player"]["sum"] == 21) {
    //   win();
    // }
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

  blackjack() {
    document.getElementById("blackjackDialog").show();
  }

  showError(errormessage) {
    console.log(errormessage);
  }

}
