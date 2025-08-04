import { Interface } from './interface.js';
import { Shoe } from './shoe.js';
import { Player } from './player.js';

export class Game {
  constructor() {
    this.interface = new Interface;
  }

  startGame() {
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
    this.posAtTable = Math.round(Math.random() * this.players.length);
    this.players.splice(this.posAtTable, 0, new Player("You", this.startingBalance, false));
    this.startRound();
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
