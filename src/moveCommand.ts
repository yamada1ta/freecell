import { Command } from './command'
import { CardStack } from './cardStack';

export class MoveCommand implements Command {
  constructor(
    private readonly src: CardStack,
    private readonly dest: CardStack) { }

  do() {
    this.dest.push(this.src);
    this.src.pop();
  }

  undo() {
    this.src.push(this.dest);
    this.dest.pop();
  }

  redo() {
    this.do();
  }
}
