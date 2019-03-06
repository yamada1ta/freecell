export const enum Suit {
  Heart = 'heart',
  Diamond = 'diamond',
  Club = 'club',
  Spade = 'spade'
}

export function isAltColor(value: Suit, target: Suit) {
  switch (value) {
    case Suit.Heart:
    case Suit.Diamond:
      return target === Suit.Club || target === Suit.Spade;
    case Suit.Club:
    case Suit.Spade:
      return target === Suit.Heart || target === Suit.Diamond;
  }
}
