import { Suit, isAltColor } from './suit'

export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export class Card {
  constructor(readonly suit: Suit, readonly number: CardNumber) { }

  isDownAndAltColor(target: Card) {
    return this.number === target.number + 1 && isAltColor(this.suit, target.suit);
  }

  isFirst(suit: Suit) {
    return this.suit === suit && this.number === 1;
  }

  isUpAndBothSuit(target: Card) {
    return this.number === target.number - 1 && this.suit === target.suit;
  }
}
