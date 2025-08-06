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

    this.gameLoop();

    if (this.players[this.posAtTable].handGetSum() == 21) {
      this.interface.blackjack();
    }

  }

  gameLoop() {

    // If it is the users turn
    let isUsersTurn = false;
    // Is the round still active
    // If player gets blackjack on deal or busts
    let isRoundActive = true;

    const hit = () => {
      // If it is the user playing
      if (isUsersTurn) {
        // Gives the player a card
        this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
        // Updates interface
        this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
        // Checking for a blackjack
        if (this.players[this.posAtTable].handIsBlackjack()) {
          // If hand is split and another hand can be played, move to next hand
          // If not split, it will simply goto the dealer
          if (!this.players[this.posAtTable].handNext()) {
            houseTurn();
          }
        } else if (this.players[this.posAtTable].handIsBust()) {
          // Checking for a bust.
          // If not split, it will simply goto the dealer
          if (!this.players[this.posAtTable].handNext()) {
            houseTurn();
          }
        }
      } else {
        // This is where the other CPU players actions will go.
      }
    }

    const doubleDown = () => {
      if (isUsersTurn) {
        // Gives the player a new card
        this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
        // Sets it as a double down
        this.players[this.posAtTable].doubleDown();
        // Redraw screen
        this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
        // Next hand if split
        if (!this.players[this.posAtTable].handNext()) {
          houseTurn();
        }
      }
    }

    const split = () => {
      if (isUsersTurn) {
        if (this.players[this.posAtTable].handIsSplitable()) {
          this.players[this.posAtTable].handSplit();
          this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
        } else {
          this.interface.showError("You must have 2 cards of the same value to split");
        }
      }
    }

    const stand = () => {

      if (isUsersTurn) {

        if (this.players[this.posAtTable].handHasNext()) {
          this.players[this.posAtTable].handNext();
        } else {
          isUsersTurn = false
          console.log(isUsersTurn);
          houseTurn();
        }

      }
    }

    const houseTurn = () => {
      if (!isUsersTurn) {

        // Finish the players after you at the table.
        if (this.posAtTable + 1 < this.players.length) {
          for (let i = this.posAtTable + 1; i < this.players.length; i++) {
            let currentPlayer = this.players[i];
            // This is where the CPUS could make an action
            this.interface.hydrate(this.players, this.house, currentPlayer);
          }
        }

        this.interface.hydrate(this.players, this.house, this.house);

        // If the dealer has less than 17, keep hitting
        while (this.house.handGetSum < 17 || (this.house.handGetSum <= 17 && this.house.handAces() > 0)) {
          this.house.hand.handAddCard(shoe.popRandomCard());

        }

      }
    }

    // Loops through all of the CPU players before the user.
    for (let i = 0; i < this.players.length; i++) {
      let currentPlayer = this.players[i];

      // This is where the CPUS could make an action

      this.interface.hydrate(this.players, this.house, currentPlayer);

      if (currentPlayer.name == "You") {
        isUsersTurn = true;
        break;
      }

    }

    document.getElementById("toolbarHit").addEventListener('click', function() {
      if (isRoundActive) hit();
    });

    document.getElementById("toolbarSplit").addEventListener('click', function() {
      if (isRoundActive) split();
    });

    document.getElementById("toolbarDoubleDown").addEventListener('click', function() {
      if (isRoundActive) doubleDown();
    });

    document.getElementById("toolbarStand").addEventListener('click', function() {
      if (isRoundActive) stand();
    });

  }
}
