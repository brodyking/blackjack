import { Interface } from './interface.js';
import { Shoe } from './shoe.js';
import { Player } from './player.js';
import { Playstyle } from './playstyle.js';

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

    let betScreenValues = this.interface.betScreenGetValues();
    this.players[this.posAtTable].betPlace(parseInt(betScreenValues.betAmount));

    // Draw the inital screen
    this.interface.gameScreen(this.players);

    // Run the Bots before the user

    this.gameLoop();

  }

  async gameLoop() {

    // If it is the users turn
    let isUsersTurn = false;
    // Is the round still active
    // If player gets blackjack on deal or busts
    let isRoundActive = true;

    let playstyle = new Playstyle;

    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const hit = (playerIndex) => {
      // Gives the player a card
      this.players[playerIndex].handAddCard(this.shoe.popRandomCard());
      // Updates interface
      this.interface.hydrate(this.players, this.house, this.players[playerIndex]);
      // Checking for a blackjack
      if (this.players[playerIndex].handIsBlackjack()) {
        // If hand is split and another hand can be played, move to next hand
        // If not split, it will simply goto the dealer
        if (!this.players[playerIndex].handNext() && isUsersTurn) {
          isUsersTurn = false;
          houseTurn();
          return false;
        }
        return true;
      } else if (this.players[playerIndex].handIsBust()) {
        // Checking for a bust.
        // If not split, it will simply goto the dealer
        if (this.players[playerIndex].handHasNext()) {
          this.players[playerIndex].handNext();
          this.interface.hydrate(this.players, this.house, this.players[playerIndex]);
          return true;
        } else {
          if (isUsersTurn) {
            isUsersTurn = false;
            houseTurn();
          }
          return false;
        }
      }
    }

    const doubleDown = (playerIndex) => {
      if (isUsersTurn) {
        console.log(this.players[this.posAtTable].handGet().cards.length);
        if (this.players[this.posAtTable].handGet().cards.length > 2) {
          this.interface.showError("You cannot double down after hitting");
        } else if (this.players[this.posAtTable].tempBalance < this.players[this.posAtTable].betInitial) {
          this.interface.showError("You dont have enough money to double down");
        } else {
          // Gives the player a new card
          this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
          // Sets it as a double down
          this.players[this.posAtTable].doubleDown();
          // Redraw screen
          this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
          // Next hand if split
          if (this.players[this.posAtTable].handHasNext()) {
            this.players[this.posAtTable].handNext();
            this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
            this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
          } else {
            isUsersTurn = false;
            houseTurn();
          }
        }
      }
    }

    const split = (playerIndex) => {
      if (isUsersTurn) {
        if (this.players[this.posAtTable].handIsSplitable()) {
          this.players[this.posAtTable].handSplit();
          this.interface.gameScreen(this.players);
          this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
          this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
          createToolbarListeners();
        } else {
          this.interface.showError("You must have 2 cards of the same value to split");
        }
      }
    }

    const stand = (playerIndex) => {
      if (isUsersTurn) {

        if (this.players[this.posAtTable].handHasNext()) {
          this.players[this.posAtTable].handNext();
          this.players[this.posAtTable].handAddCard(this.shoe.popRandomCard());
          this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
        } else {
          isUsersTurn = false;
          houseTurn();
        }

      }
    }

    const determineWinnings = () => {
      let playerWinnings = [];
      let playerIndex = 0;
      this.players.forEach((player) => {
        // The total amount either being added or removed from the players balance
        playerWinnings.push(0);
        console.log(player.name);
        for (let hand of player.hands) {

          // If house hand or player hand is a blackjack
          if (hand.isBlackjack || this.house.handIsBlackjack()) {
            // If the house had a blackjack at the start
            if (this.house.handIsBlackjack() && this.house.hands[0].cards.length == 2) {
              playerWinnings[playerIndex] -= hand.bet;
              console.log("house has blackjack at the start");
              console.log(playerWinnings);
              continue;
            }

            // If player had a 2 card blackjack, pay them 3-2
            // Else, give them the standard win
            if (hand.cards.length == 2) {
              playerWinnings[playerIndex] = playerWinnings[playerIndex] + hand.bet * (3 / 2);
              console.log("player 2-3 bj");
              console.log(playerWinnings);
              continue;
            }

          }

          // If hand is a bust
          if (hand.isBust) {
            playerWinnings[playerIndex] = playerWinnings[playerIndex] - hand.bet;
            console.log("hand is bust");
            console.log(playerWinnings);
            continue;
          }

          // If house busts
          if (this.house.handIsBust()) {
            playerWinnings[playerIndex] = playerWinnings[playerIndex] + hand.bet;
            console.log("house bust");
            console.log(playerWinnings);
            continue;
          }

          // If hand is a push
          if (hand.getSum() === this.house.handGetSum()) {
            console.log("push");
            console.log(playerWinnings);
            continue;
          }


          // If hand is higher than the house
          // Else statement is if hand is lower than the house
          if (hand.getSum() > this.house.handGetSum()) {
            console.log("bigger hand");
            playerWinnings[playerIndex] = playerWinnings[playerIndex] + hand.bet;
          } else {
            console.log("bigger hand");
            playerWinnings[playerIndex] = playerWinnings[playerIndex] - hand.bet;
          }
          console.log(playerWinnings);

        }

        this.players[playerIndex].balance = parseInt(this.players[playerIndex].balance) + parseInt(playerWinnings[playerIndex]);
        playerIndex++;

      });

      console.log(playerWinnings[0]);
      console.log(this.posAtTable);
      console.log(playerWinnings[this.posAtTable]);
      let usersTotalWinnings = playerWinnings[this.posAtTable];
      let handsToSend = {
        "users": this.players[this.posAtTable].hands,
        "house": this.house.hands[0]
      };
      console.log(usersTotalWinnings);
      console.log(usersTotalWinnings === 0);
      if (usersTotalWinnings === 0) {
        this.interface.push(usersTotalWinnings, handsToSend)
      } else if (usersTotalWinnings > 0) {
        this.interface.win(usersTotalWinnings, handsToSend);
      } else {
        this.interface.lose(usersTotalWinnings, handsToSend);
      }
    }

    const houseTurn = async () => {
      if (!isUsersTurn) {

        // Finish the players after you at the table.
        if (this.posAtTable + 1 < this.players.length) {
          for (let i = this.posAtTable + 1; i < this.players.length; i++) {
            let currentPlayer = this.players[i];

            // This is where the CPUS could make an action
            try {
              console.log(playstyle.getAction(currentPlayer.handGet(), this.house.hands[0].cards[1]));
            } catch (error) {
              console.log(error);
            }

            this.interface.hydrate(this.players, this.house, currentPlayer);
          }
        }

        this.house.handIsDealerPlaying(true);
        this.interface.hydrate(this.players, this.house, this.house);

        // If the dealer has less than 17, keep hitting
        while ((this.house.handGetSum() < 17) || (this.house.handGetSum() <= 17 && this.house.handAces() > 0)) {
          await sleep(1000);
          this.house.handAddCard(this.shoe.popRandomCard());
          this.interface.hydrate(this.players, this.house, this.house);
        }

        determineWinnings();

      }
    }


    const createToolbarListeners = () => {

      document.getElementById("toolbarHit").addEventListener('click', function() {
        if (isRoundActive) hit(window.game.posAtTable);
      });

      document.getElementById("toolbarSplit").addEventListener('click', function() {
        if (isRoundActive) split(window.game.posAtTable);
      });

      document.getElementById("toolbarDoubleDown").addEventListener('click', function() {
        if (isRoundActive) doubleDown(window.game.posAtTable);
      });

      document.getElementById("toolbarStand").addEventListener('click', function() {
        if (isRoundActive) stand(window.game.posAtTable);
      });

    }

    // Loops through all of the CPU players before the user.
    for (let i = 0; i < this.posAtTable; i++) {
      let currentPlayer = this.players[i];

      // This is where the CPUS could make an action
      try {
        console.log(playstyle.getAction(currentPlayer.handGet(), this.house.hands[0].cards[1]));
      } catch (error) {
        console.log(error);
      }

      this.interface.hydrate(this.players, this.house, currentPlayer);

    }

    isUsersTurn = true;
    this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);

    if (this.players[this.posAtTable].handGetSum() == 21) {
      this.interface.hydrate(this.players, this.house, this.players[this.posAtTable]);
      isUsersTurn = false;
      houseTurn();
    }

    createToolbarListeners();

  }
}
