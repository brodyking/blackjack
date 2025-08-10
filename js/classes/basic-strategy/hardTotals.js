export class hardTotals {
  constructor() {

    this.chart = [
      // Dealer's Upcard: 2   3   4   5   6   7   8   9   10  A
      // ---------------------------------------------------------
      /* Player's 8:   */['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 9:   */['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 10:  */['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
      /* Player's 11:  */['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      /* Player's 12:  */['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 13:  */['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 14:  */['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 15:  */['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 16:  */['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
      /* Player's 17+: */['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']
    ];
  }

  getAction(hardTotal, dealerUpcard) {
    let index = hardTotal - 8;
    if (hardTotal >= 18) {
      return 'S';
    }
    return this.chart[index][dealerUpcard - 2];
  }
}
