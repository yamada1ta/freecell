import { CardStack } from './cardStack'
import { Command } from './command'
import { MoveCommand } from './moveCommand'
import { Suit } from './suit';

export type HomeStack = { stack: CardStack, suit: Suit };

export class AutoMoveCommand implements Command {
  private readonly commands: MoveCommand[] = [];

  constructor(
    private readonly baseMoveSrc: CardStack,
    private readonly baseMoveDest: CardStack,
    private readonly autoMoveSrc: CardStack[],
    private readonly autoMoveDest: HomeStack[]) { }

  do() {
    const baseMove = new MoveCommand(this.baseMoveSrc, this.baseMoveDest);
    baseMove.do();
    this.commands.push(baseMove);

    let autoMoves = autoMove(this.autoMoveSrc, this.autoMoveDest);

    while (autoMoves.length > 0) {
      autoMoves.forEach(v => {
        v.do();
        this.commands.push(v);
      });

      autoMoves = autoMove(this.autoMoveSrc, this.autoMoveDest);
    }
  }

  undo() {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  redo() {
    this.commands.forEach(v => v.redo());
  }
}

function autoMove(srcs: CardStack[], dests: HomeStack[]) {
  const result: MoveCommand[] = [];

  const minNum = getMinNum(dests);

  srcs.forEach(src => {
    const top = src.top;
    if (top !== null && top.number <= minNum(top.suit) + 1) {
      dests
        .filter(v => v.stack.canPush(top))
        .forEach(v => result.push(new MoveCommand(src, v.stack)));
    }
  });

  return result;
}

function getMinNum(dest: HomeStack[]) {
  const redNums = dest.filter(v => isRed(v.suit)).map(v => v.stack.top !== null ? v.stack.top.number : 1);
  const blackNums = dest.filter(v => !isRed(v.suit)).map(v => v.stack.top !== null ? v.stack.top.number : 1);

  const redMin = Math.min(...redNums);
  const blackMin = Math.min(...blackNums);

  return (suit: Suit) => isRed(suit) ? blackMin : redMin;
}

function isRed(value: Suit) {
  return value === Suit.Heart || value === Suit.Diamond;
}