import { CardView } from './cardView'
import { Container, Graphics } from 'pixi.js'
import { hitRect } from '../utils'
import { DrawUtils } from './drawUtils'
import { CardStackView } from './cardStackView'

export class Column implements CardStackView {
  private static readonly marginY = 27;

  private cards: CardView[] = []
  private readonly view: Graphics;

  constructor(
    parent: Container,
    private readonly x: number,
    private readonly y: number) {
    this.view = DrawUtils.cell(this.x, this.y);
    parent.addChildAt(this.view, 0);
  }

  init(value: CardView[]) {
    this.cards = value;
    this.cards.forEach((v, i) => {
      v.moveTo(this.x, this.y + i * Column.marginY, 0);
    });

    this.updateInteractive();
  }

  push(value: CardView) {
    value.moveTo(this.x, this.y + this.cards.length * Column.marginY);
    this.cards.push(value);

    this.updateInteractive();
  }

  pop() {
    this.cards.pop();

    this.updateInteractive();
  }

  clear() {
    this.cards = [];
  }

  hit(target: CardView) {
    if (this.top && this.top.isMoving) {
      return false;
    }

    return hitRect(this.top ? this.top.bounds : this.view.getBounds(), target.bounds);
  }

  equalTop(value: CardView) {
    return this.top !== null && value === this.top;
  }

  get top(): CardView | null {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
  }

  private updateInteractive() {
    this.cards.forEach(v => v.interactive = v === this.top);
  }
}