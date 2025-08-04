import { Deck } from './deck.js';

export class Shoe {
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
