import { CardView } from './cardView'
import { Graphics, Container } from 'pixi.js';
import { hitRect } from '../utils'
import { DrawUtils } from './drawUtils'
import { CardStackView } from './cardStackView'

export class FreeCell implements CardStackView {
  private card: CardView | null = null;
  private readonly view: Graphics;

  constructor(parent: Container, x: number, y: number) {
    this.view = DrawUtils.cell(x, y);

    parent.addChild(this.view);
  }

  push(value: CardView) {
    this.card = value;
    this.card.moveTo(this.view.x, this.view.y);
  }

  pop() {
    this.card = null
  }

  clear() {
    this.pop();
  }

  hit(target: CardView) {
    return hitRect(this.view.getBounds(), target.bounds);
  }

  equalTop(value: CardView) {
    return this.card !== null && value === this.card;
  }

  get top(): CardView | null {
    return this.card;
  }
}