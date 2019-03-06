import { CardView } from './cardView'
import { Suit } from '../suit'
import { Graphics, Container } from 'pixi.js';
import { hitRect } from '../utils'
import { DrawUtils } from './drawUtils';
import { CardStackView } from './cardStackView'
import { Consts } from '../consts';

export class HomeCell implements CardStackView {
  private cards: CardView[] = [];
  private readonly view: Graphics;

  constructor(parent: Container, x: number, y: number, suit: Suit) {
    this.view = DrawUtils.cell(x, y);
    const suitView = DrawUtils.suit(suit, this.view.width * 0.7, Consts.Color.white);
    DrawUtils.centering(suitView, this.view, -2);

    this.view.addChild(suitView);

    parent.addChild(this.view);
  }

  hit(target: CardView) {
    return hitRect(this.view.getBounds(), target.bounds);
  }

  equalTop(value: CardView) {
    return this.top !== null && value === this.top;
  }

  push(value: CardView) {
    value.moveTo(this.view.x, this.view.y);
    value.interactive = false;
    this.cards.push(value);
  }

  pop() {
    if (this.top) {
      this.top.interactive = true;
      this.cards.pop();
    }
  }

  clear() {
    this.cards = [];
  }

  get top(): CardView | null {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
  }
}
