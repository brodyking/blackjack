class Card {

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  compareTo(otherCard) {
    // Making sure it is a card. Thank you js.
    if (typeof otherCard == object
      && otherCard.cards !== undefined
      && otherCard.count !== undefined) {
      if (this.rank > otherCard.rank) {
        return this.rank - otherCard.rank;
      } else if (this.rank < otherCard.rank) {
        return otherCard.rank - this.rank;
      } else {
        return 0;
      }
    }
  }

  toString() {
    let cardClass = "";
    switch (this.rank) {
      case 11:
        cardClass = "j"
        break;
      case 12:
        cardClass = "q"
        break;
      case 13:
        cardClass = "k"
        break;
      case 14:
        cardClass = "a"
        break;
      default:
        cardClass = this.rank;
    }
    cardClass += this.suit.charAt(0);
    return '<span class="pcard-' + cardClass + '"></span>';

  }

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

  constructor(deckCount) {
    this.cards = [];
    this.count = 0;
    for (let i = 0; i < deckCount; i++) {
      let suits = ["diamond", "spade", "club", "heart"];
      suits.forEach((element) => {
        for (let x = 2; x < 15; x++) {
          this.addCard(element, x);
        }
      })
    }
  }

  addCard(suit, rank) {
    let card = new Card(suit, rank);
    this.cards.push(card);
    return card;
  }

  getRandomCard() {
    let randomIndex = Math.floor(Math.random() * this.cards.length);
    let card = this.cards[randomIndex];
    if (card.rank < 7) {
      this.count += 1;
    } else if (card.rank > 9) {
      this.count -= 1;
    }
    this.cards.splice(randomIndex, 1);
    return card;
  }

  getCount() {
    return this.count;
  }
}
