import { Card } from './card'

export class CardStack {
  onPush = (_: CardStack) => { };
  onPop = () => { };

  private cards: Card[] = [];

  constructor(private readonly pushCondition: (v: Card | null, t: Card) => boolean) { }

  init(cards: Card[]) {
    this.cards = cards;
  }

  canPush(target: Card) {
    return this.pushCondition(this.top, target);
  }

  push(src: CardStack) {
    if (src.top) {
      this.cards.push(src.top);
    }
    this.onPush(src);
  }

  pop() {
    const card = this.cards.pop();
    if (card) {
      this.onPop();
    }
  }

  clear() {
    this.cards = [];
  }

  get top() {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
  }
}
