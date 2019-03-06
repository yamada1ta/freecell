import { CardStack } from './cardStack';
import { HomeStack } from './autoMoveCommand'
import { Suit } from './suit'
import { repeat } from './utils'
import { Card, CardNumber } from './card';

export class PlayStacks {
  private readonly columns: CardStack[];
  private readonly freeCells: CardStack[];
  private readonly homeCells: HomeStack[];
  private readonly all: CardStack[];

  constructor(columnsNum: number, freeCellsNum: number, homeCellSuits: Suit[]) {
    const stacks = createStacks(columnsNum, freeCellsNum, homeCellSuits);
    this.columns = stacks.columns;
    this.freeCells = stacks.freeCells;
    this.homeCells = stacks.homeCells;
    this.all = this.columns.concat(this.freeCells).concat(this.homeCells.map(v => v.stack));
  }

  set onPush(value: (src: CardStack, dest: CardStack) => void) {
    this.all.forEach(v => {
      v.onPush = src => value(src, v);
    });
  }

  set onPop(value: (stack: CardStack) => void) {
    this.all.forEach(v => {
      v.onPop = () => value(v);
    });
  }

  private clear() {
    this.all.forEach(v => v.clear());
  }

  init(cards: Card[][]) {
    this.clear();

    cards.forEach((column, i) => {
      this.columns[i].init(column);
    });
  }

  get isCompleted() {
    return !this.homeCells
      .map(v => v.stack.top)
      .some(v => v === null || v.number < 13);
  }

  get autoMoveSrc() {
    return this.columns.concat(this.freeCells);
  }

  get autoMoveDest() {
    return this.homeCells;
  }

  isfreeMoveSrc(value: CardStack) {
    return this.columns.some(v => v === value);
  }

  freeMoveDest(srcNumber: CardNumber) {
    return srcNumber === 1 ? this.homeCells.map(v => v.stack) : this.freeCells;
  }

  get(index: number) {
    return this.all[index];
  }

  indexOf(value: CardStack) {
    return this.all.indexOf(value);
  }
}

function createStacks(columnsNum: number, freeCellsNum: number, homeCellSuits: Suit[]) {
  const columns = repeat(columnsNum)
    .map(_ => new CardStack((top, target) => top === null || top.isDownAndAltColor(target)));

  const freeCells = repeat(freeCellsNum)
    .map(_ => new CardStack(top => top === null));

  const homeCells = homeCellSuits.map(suit => {
    const stack = new CardStack(
      (top, target) => top === null ? target.isFirst(suit) : top.isUpAndBothSuit(target));

    return { stack, suit };
  });

  return { columns, freeCells, homeCells };
}