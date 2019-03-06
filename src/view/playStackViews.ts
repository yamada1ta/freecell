import { CardView } from './cardView'
import { Card } from '../card'
import { DrawUtils } from './drawUtils'
import { Column } from './column';
import { FreeCell } from './freeCell';
import { HomeCell } from './homeCell';
import { Suit } from '../suit'
import { Container } from 'pixi.js';
import { CardStackView } from './cardStackView';
import { AnimationManager } from '../animationManager';
import { repeat } from '../utils'

export class PlayStackViews {
  private readonly cards: { [key: string]: CardView } = {};
  private readonly stacks: CardStackView[];
  private readonly columns: Column[];

  constructor(
    parent: Container, deck: Card[],
    columnsNum: number, freeCellsNum: number, homeCellSuits: Suit[],
    animManager: AnimationManager) {

    deck.forEach(card => {
      this.cards[toKey(card)] = new CardView(parent, card, animManager);
    });

    this.columns = createColumns(parent, columnsNum);
    const freeCells = createFreeCells(parent, freeCellsNum);
    const homeCells = createHomeCells(parent, homeCellSuits);

    this.stacks =
      Array<CardStackView>().concat(this.columns).concat(freeCells).concat(homeCells);
  }

  get cardViews() {
    return Object.keys(this.cards).map(v => this.cards[v]);
  }

  init(cards: Card[][]) {
    this.stacks.forEach(v => v.clear());

    cards.forEach((column, i) =>
      this.columns[i].init(column.map(v => this.cards[toKey(v)]))
    );
  }

  get(index: number) {
    return this.stacks[index];
  }

  indexOf(value: CardStackView) {
    return this.stacks.indexOf(value);
  }

  equalTop(card: CardView) {
    return this.stacks.filter(v => v.equalTop(card))[0];
  }

  hitAll(card: CardView) {
    return this.stacks.filter(v => v.hit(card));
  }
}

function toKey(card: Card) {
  return card.suit + card.number.toString();
}

function createColumns(parent: Container, num: number) {
  const baseX = 30;
  const baseY = 220;
  const marginX = 20;

  return repeat(num).map((_, i) =>
    new Column(parent, baseX + (DrawUtils.cardWidth + marginX) * i, baseY));
}

function createFreeCells(parent: Container, num: number) {
  const baseX = 30;
  const baseY = 100;
  const marginX = 10;

  return repeat(num).map((_, i) =>
    new FreeCell(parent, baseX + (DrawUtils.cardWidth + marginX) * i, baseY));
}

function createHomeCells(parent: Container, suits: Suit[]) {
  const baseX = 340;
  const baseY = 100;
  const marginX = 10;

  return suits.map((suit, i) =>
    new HomeCell(parent, baseX + (DrawUtils.cardWidth + marginX) * i, baseY, suit));
}