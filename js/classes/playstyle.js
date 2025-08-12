import { hardTotals } from "./basic-strategy/hardTotals.js";
import { softTotals } from "./basic-strategy/softTotals.js";

export class Playstyle {
  constructor() {
    this.hardTotals = new hardTotals;
    this.softTotals = new softTotals;
  }

  getAction(hand, dealerUpcard) {
    if (hand.aces > 0) {
      return this.softTotals.getAction(hand.getSum(), dealerUpcard.getValue());
    } else {
      return this.hardTotals.getAction(hand.getSum(), dealerUpcard.getValue());
    }
  }

}
