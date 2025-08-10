export class softTotals {
  constructor() {

    this.chart = [
      // Dealer's Upcard: 2   3   4   5   6   7   8   9   10  A
      // ----------------------------------------------------------
      /* Soft 13 (A,2): */['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Soft 14 (A,3): */['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Soft 15 (A,4): */['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Soft 16 (A,5): */['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Soft 17 (A,6): */['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
      /* Soft 18 (A,7): */['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'],
      /* Soft 19 (A,8): */['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      /* Soft 20 (A,9): */['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']
    ];
  }

  getAction(softTotal, dealerUpcard) {
    let index = softTotal - 13;
    if (softTotal >= 18) {
      return 'S';
    }
    return this.chart[index][dealerUpcard - 2];
  }
}
