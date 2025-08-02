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
    } else if (this.rank < 14) {
      return 10;
    } else {
      return 11;
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
    this.cardsRemaining = [];
    this.cardsDealt = [];
    this.decks = numOfDecks;
    this.count = 0;
    for (let i = 0; i < numOfDecks; i++) {
      let nextDeck = new Deck;
      this.cardsRemaining.push(nextDeck.cards);
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
    this.cardsDealt.push(card);
    this.cards.splice(randomIndex, 1);
    return card;
  }

  getRunningCount() {
    return this.count;
  }

  // getTrueCount returns the running count devided by the amount of decks used
  getTrueCount() {
    let cardsUsed = this.cardsDealt.length;
    let cardsTotal = this.decks * 52;
    let decksRemaining = Math.round((cardsTotal - cardsUsed) / 52);
    return this.count / decksRemaining;
  }

}
