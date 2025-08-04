export class Card {
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
    } else {
      switch (this.rank) {
        case "j":
          return 10;
        case "q":
          return 10;
        case "k":
          return 10;
        case "a":
          return 11;
      }
    }
  }
}
