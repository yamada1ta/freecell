import { CardNumber, Card } from './card'
import { Suit } from './suit';
import { repeat } from './utils';

export class Deck {
  readonly cards: Card[];

  constructor() {
    const suits = [Suit.Heart, Suit.Diamond, Suit.Club, Suit.Spade];
    const cardNumbers: CardNumber[] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
    ];

    this.cards = [];

    suits.forEach(suit => {
      for (let i = 0; i < cardNumbers.length; i++) {
        this.cards.push(new Card(suit, cardNumbers[i]));
      }
    });
  }

  deal(nums: number[]): Card[][] {
    const cards = shuffle(this.cards);

    return nums.map(num => repeat(num)
      .map(_ => cards.pop())
      .filter<Card>((v): v is Card => v !== undefined));
  }
}

function shuffle<T>(value: T[]) {
  const result = value.concat();

  // フィッシャー–イェーツアルゴリズム
  for (let i = result.length - 1; i >= 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [result[i], result[rand]] = [result[rand], result[i]]
  }

  return result;
}
