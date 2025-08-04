import { Card } from './card.js';

export class Deck {
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
