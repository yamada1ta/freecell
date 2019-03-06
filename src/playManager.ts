import { CardView } from './view/cardView'
import { Card } from './card'
import { Suit } from './suit'
import { CommandManager } from './commandManager'
import { AutoMoveCommand } from './autoMoveCommand'
import { Container } from 'pixi.js';
import { CardStack } from './cardStack';
import { CardStackView } from './view/cardStackView';
import { PlayStackViews } from './view/playStackViews'
import { PlayUi } from './view/playUi'
import { Deck } from './deck';
import { AnimationManager } from './animationManager';
import { PlayStacks } from './playStacks';

export class PlayManager {
  private static readonly columnsLayout = [7, 7, 7, 7, 6, 6, 6, 6];

  private readonly stacks: PlayStacks;
  private readonly stackViews: PlayStackViews;
  private readonly ui: PlayUi;

  private readonly deck = new Deck();
  private readonly commandManager = new CommandManager();
  private readonly animManager = new AnimationManager();

  constructor(parent: Container) {
    const freeCellsNum = 4;
    const homeCellSuits = [Suit.Heart, Suit.Club, Suit.Diamond, Suit.Spade];

    this.stacks = new PlayStacks(
      PlayManager.columnsLayout.length, freeCellsNum, homeCellSuits);

    this.stacks.onPush = (src, stack) => {
      const srcView = this.toView(src);
      const destView = this.toView(stack);
      if (srcView.top) {
        destView.push(srcView.top);
      }
    };

    this.stacks.onPop =
      stack => this.toView(stack).pop();

    this.stackViews = new PlayStackViews(
      parent, this.deck.cards,
      PlayManager.columnsLayout.length, freeCellsNum,
      homeCellSuits, this.animManager);

    this.stackViews.cardViews.forEach(card => {
      card.onDragEnd = start => this.cardDragEnd(card, start);
      card.onTap = () => this.cardTap(card);
    });

    this.ui = new PlayUi(parent);
    this.ui.onTap('undo', () => this.commandManager.undo());
    this.ui.onTap('redo', () => this.commandManager.redo());
    this.ui.onTap('restart', () => this.start());

    this.animManager.onChange = () => {
      this.ui.interactiveAll =
        !this.stacks.isCompleted && this.animManager.count === 0;
    };
  }

  start() {
    this.commandManager.clear();

    const cards = this.deck.deal(PlayManager.columnsLayout);
    this.stacks.init(cards);
    this.stackViews.init(cards);

    this.ui.interactiveAll = true;
  }

  get isCleared() {
    return this.stacks.isCompleted && this.animManager.count === 0;
  }

  private cardDragEnd(card: CardView, start: { x: number, y: number }) {
    const src = this.toStack(this.stackViews.equalTop(card));

    const dests = this.stackViews.hitAll(card).map(v => this.toStack(v));
    const dest = findFirst(dests, v => v.canPush(src.top as Card));

    if (dest) {
      this.moveCard(src, dest);
    } else {
      card.moveTo(start.x, start.y);
    }
  }

  private cardTap(card: CardView) {
    const src = this.toStack(this.stackViews.equalTop(card));

    if (!this.stacks.isfreeMoveSrc(src)) {
      return;
    }

    const top = src.top as Card;
    const dests = this.stacks.freeMoveDest(top.number);
    const dest = findFirst(dests, v => v.canPush(top));

    if (dest) {
      this.moveCard(src, dest);
    }
  }

  private moveCard(src: CardStack, dest: CardStack) {
    this.commandManager.do(
      new AutoMoveCommand(src, dest, this.stacks.autoMoveSrc, this.stacks.autoMoveDest));
  }

  private toStack(value: CardStackView) {
    return this.stacks.get(this.stackViews.indexOf(value));
  }

  private toView(value: CardStack) {
    return this.stackViews.get(this.stacks.indexOf(value));
  }
}

function findFirst<T>(targets: T[], pred: (v: T) => boolean): T | null {
  const result = targets.filter(pred);
  if (result.length > 0) {
    return result[0];
  }

  return null;
}