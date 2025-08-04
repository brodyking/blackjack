import { Hand } from "./hand.js"

export class Player {
  constructor(name, balance, isDealer) {
    // The players name
    this.name = name;
    // The players balance
    this.balance = balance;
    // The plsyers current bet
    this.bet = 0;
    // Determines if the hand is made with the dealer param
    this.isDealer = isDealer;
    // The players current hand
    this.hand = new Hand(this.isDealer);
    // If the hand has been double downed on
    this.isDoubleDown = false;
    // If a card has been hit (prevents a double down)
    this.hasHit = false;
  }
  clearBet() {
    this.bet = 0;
    this.isDoubleDown = false;
    this.hasHit = false;
  }
  betPlace(amount) {
    this.bet = amount;
    this.balance -= amount;
    this.hasHit = true;
  }
  betWin() {
    this.balance += this.bet * 2;
    this.clearBet();
  }
  betPush() {
    this.balance += this.bet;
    this.clearBet();
  }
  betLose() {
    this.clearBet();
  }
  doubleDown() {
    this.bet = this.bet * 2;
    this.isDoubleDown = true;
    this.balance -= this.bet;
  }
}

