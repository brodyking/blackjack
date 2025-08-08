export class Hand {
  constructor(isDealer) {
    // isDealer determines which cards are shown in the toString
    this.isDealer = isDealer;
    // if it is the dealers turn, all the cards will be shown.
    this.isDealerPlaying = false;
    this.cards = [];
    this.aces = 0;
    this.sum = 0;
    this.isBust = false;
    this.isBlackjack = false;
    this.bet = 0;
  }

  clear() {
    this.cards = [];
    this.aces = 0;
    this.sum = 0;
    this.isDealerPlaying = false;
    this.isBust = false;
    this.isBlackjack = false;
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
    if (this.sum > 21) {
      this.isBust = true;
    }
    if (this.sum == 21) {
      this.isBlackjack = true;
    }
  }

  // removeCard finds the card in the array and removes it.
  // Returns true if the card was found and removed
  // Retruns false if the card isnt in the hand.
  removeCard(card) {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] == card) {
        this.sum -= card.getValue();
        this.cards.splice(i, 1);
        return true;
      }
    }
    return false;
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

  // Returns true if both cards in the hand are of the same value
  isSplitable() {
    if (this.cards.length !== 2) {
      return false;
    } else {
      return (this.cards[0].getValue() == this.cards[1].getValue());
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
