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
    // The players "hands"
    // Used to store multiple hands incase of a split
    this.hands = [];
    this.hands[0] = new Hand(this.isDealer);
    // The current hand to use when betting,getHand(),etc.
    this.currentHand = 0;
    // If the hand has been double downed on
    this.isDoubleDown = false;
  }

  // Returns the current hand
  handGet() {
    return this.hands[this.currentHand];
  }

  // Moves to the next hand if available.
  // Returns true if a next hand was switched to,
  // Returns false if there was not another hand after.
  handNext() {
    if (this.currentHand + 1 <= this.hands.length) {
      this.currentHand++;
      return true;
    }
    return false;
  }
  // Splits the two hands, doubles the bet
  handSplit() {
    if (this.hands[this.currentHand].isSplitable()) {
      // Creates new hand, gives it the second card on the first hand
      let nextHand = new Hand(this.isDealer);
      nextHand.addCard(this.hands[this.currentHand].cards[1]);
      this.hands.push(nextHand);
      // Remove second card on the first hand, give new card
      this.hands[this.currentHand].removeCard(this.hands[this.currentHand].cards[1]);
      // Doubles the bet
      this.bet = this.bet * 2;
      return true
    }
    return false;
  }

  handIsSplit() {
    return (this.hands.length > 1);
  }
  handIsSplitable() {
    return this.hands[this.currentHand].isSplitable();
  }
  handClear() {
    this.hands = [];
    this.hands[0] = new Hand(this.isDealer);
    this.currentHand = 0;
  }

  handAddCard(card) {
    this.hands[this.currentHand].addCard(card);
  }

  handGetSum() {
    return this.hands[this.currentHand].getSum();
  }

  handToString() {
    return this.hands[this.currentHand].toString();
  }

  handIsDealerPlaying() {
    return this.hands[this.currentHand].isDealerPlaying;
  }

  handIsDealer() {
    return this.hands[this.currentHand].isDealer;
  }

  handAces() {
    return this.hands[this.currentHand].aces;
  }

  handCards() {
    return this.hands[this.currentHand].cards;
  }
  handLength() {
    return this.hands[this.currentHand].cards.length;
  }
  clearBet() {
    this.bet = 0;
    this.isDoubleDown = false;
    this.hands[0].clear();
  }

  betPlace(amount) {
    this.bet = amount;
    this.balance -= amount;
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
