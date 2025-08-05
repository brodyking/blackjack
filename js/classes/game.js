import { Interface } from './interface.js';
import { Shoe } from './shoe.js';
import { Player } from './player.js';

export class Game {
  constructor() {
    this.interface = new Interface;
  }

  // This is ran from a button on the startScreen inside of interface
  // It sets almost all aspects of the game besides the players current hands
  initGame() {
    let startScreenValues = this.interface.startScreenGetValues();
    this.numOfDecks = startScreenValues.numOfDecks;
    this.numOfPlayers = startScreenValues.numOfPlayers;
    this.startingBalance = startScreenValues.startingBalance;

    this.shoe = new Shoe(this.numOfDecks);
    this.players = [];
    this.house = new Player("House", Infinity, true);
    this.isUsersTurn = false; // Used to determine if the user is allowed to bet, stand, etc

    for (let i = 0; i < this.numOfPlayers; i++) {
      // Adds a new player, gives it the name "Player" and the number player it is.
      this.players.push(new Player("Player " + (this.players.length + 1), this.startingBalance, false));
    }

    // Puts the user into a random position in the players[] list.
    // this.posAtTable is used lots, as it gets to location of the user
    // If you call this.players[this.posAtTable] you can get the users Player obj
    this.posAtTable = Math.round(Math.random() * this.players.length);
    this.players.splice(this.posAtTable, 0, new Player("You", this.startingBalance, false));
    this.interface.betScreen(this.players[this.posAtTable]);
  }

  // This collects the bet for that round, checks the size, and calls startRound().
  initRound() {
    let betScreenValues = this.interface.betScreenGetValues();
    if (parseInt(betScreenValues.betAmount) > parseInt(this.players[this.posAtTable].balance)) {
      this.interface.showError("You cannot bet more than you balance.");
    } else {
      this.players[this.posAtTable].betPlace(parseInt(betScreenValues.betAmount));
      this.startRound();
    }
  }

  startRound() {

    // Clears and deals two cards to each player
    this.players.forEach((player) => {
      player.handClear();
      player.handAddCard(this.shoe.popRandomCard());
      player.handAddCard(this.shoe.popRandomCard());
    })

    // Clears and deals two cards for the house
    this.house.handClear();
    this.house.handAddCard(this.shoe.popRandomCard());
    this.house.handAddCard(this.shoe.popRandomCard());

    // Draw the inital screen
    this.interface.gameScreen(this.players);

    // Run the Bots before the user
    this.preUserTurn();

    if (this.players[this.posAtTable].handGetSum() == 21) {
      this.interface.blackjack();
    }

  }

  // Loops through all of the CPU players before the user.
  preUserTurn() {
    // Loop through each player, and then stop at the users locatiion.
    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];
      // This is where the CPUS could make an action
      this.interface.hydrate(this.players, this.house, currentPlayer);
      if (currentPlayer.name == "You") {
        this.isUsersTurn = true;

        // User Hits
        document.getElementById("toolbarHit").addEventListener("click", function() {
          game.userHit();
        });

        // User Stand
        document.getElementById("toolbarStand").addEventListener("click", function() {
          game.userStand();
        });

        // User Double Down
        document.getElementById("toolbarDoubleDown").addEventListener("click", function() {
          game.userDoubleDown();
        });

        // User Split
        document.getElementById("toolbarSplit").addEventListener("click", function() {
          game.userSplit();
        });

        break;
      }
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
    if (this.isUsersTurn == true) {
      // Gives a new card to the user, and hydrates the screen
      this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
      this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
      if (this.players[this.posAtTable].handGetSum() > 21) {
        this.interface.bust(this.players[this.posAtTable].handGetSum(), this.house.handGetSum());
        this.players[this.posAtTable].betLose();
      } else if (this.players[this.posAtTable].handGetSum() == 21) {
        this.interface.blackjack();
        this.players[this.posAtTable].betWin();
      }
    }
  }

  userDoubleDown() {
    if (parseInt(this.players[this.posAtTable].bet) > parseInt(this.players[this.posAtTable].balance)) {
      // If bet is bigger than balance
      this.interface.showError("You cannot bet more than you balance.");
    } else if (this.players[this.posAtTable].handCards.length > 2) {
      // If hit before double down
      this.interface.showError("You cannot double down after hitting.");
    } else if (this.players[this.posAtTable].isDoubleDown != false) {
      // Already doubled down
      this.interface.showError("You already doubled down.");
    } else {
      // Allowed to double down
      this.players[this.posAtTable].doubleDown();
      this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
      if (this.players[this.posAtTable].handGetSum() > 21) {
        this.interface.bust(this.players[this.posAtTable].handGetSum(), this.house.handGetSum());
      } else {
        this.userStand();
      }
    }
  }

  userSplit() {
    if (this.players[this.posAtTable].handIsSplitable()) {
      this.players[this.posAtTable].handSplit();
      this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
      this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
      this.interface.showSuccess("You have split your hand.");
    } else {
      this.interface.showError("You cannot split your hand if the cards arent the same");
    }
  }

  userStand() {
    if (this.players[this.posAtTable].handIsSplit() && this.players[this.posAtTable].currentHand + 1 < this.players[this.posAtTable].hands.length) {
      this.players[this.posAtTable].handNext();
      console.log(this.players[this.posAtTable].handLength());
      if (this.players[this.posAtTable].handLength() == 1) {
        this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
      }
      this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
    } else {
      this.isUsersTurn = false;
      this.postUserTurn();
      this.house.hands[0].isDealerPlaying = true;
      console.log(this.house.handGetSum());
      this.houseTurn();
    }
  }

  houseTurn() {
    this.interface.hydrate(this.players, this.house, this.house);
    if (this.house.handGetSum() > 21) {
      // If house busts
      this.interface.win(this.players[this.posAtTable].handGetSum(), this.house.handGetSum());
      this.players[this.posAtTable].betWin();
    } else if (this.house.handGetSum() < 17 || (this.house.handGetSum() == 17 && this.house.handAces > 0)) {
      // If house can still hit (<17 or soft 17)
      this.house.handAddCard(this.shoe.popRandomCard());
      this.interface.hydrate(this.players, this.house, this.house);
      this.houseTurn();
    } else if (this.house.handGetSum() > this.players[this.posAtTable].handGetSum()) {
      // if the house's hand is greater
      this.interface.lose(this.players[this.posAtTable].handGetSum(), this.house.handGetSum());
      this.players[this.posAtTable].betLose();
    } else if (this.house.handGetSum() == this.players[this.posAtTable].handGetSum()) {
      // If house's hand is equal to player's hand.
      this.players[this.posAtTable].betPush();
    } else {
      this.interface.win(this.players[this.posAtTable].handGetSum(), this.house.handGetSum());
      this.players[this.posAtTable].betWin();
    }
  }


  count() {
    this.interface.count();
  }
}
