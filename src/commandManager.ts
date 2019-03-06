import { Command } from './command'

export class CommandManager {
  private commands: Command[] = [];
  private undoIndex = -1;

  private get redoIndex() {
    return this.undoIndex + 1;
  }

  do(command: Command) {
    command.do();

    if (this.undoIndex < this.commands.length - 1) {
      this.commands.splice(this.undoIndex + 1);
    }

    this.commands.push(command);

    this.undoIndex = this.commands.length - 1;
  }

  undo() {
    if (this.undoIndex >= 0) {
      this.commands[this.undoIndex].undo();
      this.undoIndex--;
    }
  }

  redo() {
    if (this.redoIndex >= 0 && this.redoIndex < this.commands.length) {
      this.commands[this.redoIndex].redo();
      this.undoIndex++;
    }
  }

  clear() {
    this.commands = [];
    this.undoIndex = -1;
  }
}