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
