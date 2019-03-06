import { interaction, DisplayObject } from 'pixi.js';
import { distance } from './utils'

enum DragState { None, Pre, Progress }

export class Dragger {
  onStart = () => { };
  onEnd = (_: { x: number, y: number }) => { };
  onEndNoMove = () => { };

  private state = DragState.None;
  private data: interaction.InteractionData | null = null;
  private diffX = 0;
  private diffY = 0;

  private startPos = { x: 0, y: 0 };

  constructor(private readonly target: DisplayObject) {
    this.target
      .on('pointerdown', this.start.bind(this))
      .on('pointermove', this.progress.bind(this))
      .on('pointerup', this.end.bind(this))
      .on('pointerupoutside', this.end.bind(this));
  }

  private start(event: interaction.InteractionEvent) {
    this.data = event.data;
    this.state = DragState.Pre;

    const basePos = this.data.getLocalPosition(this.target.parent);
    this.diffX = this.target.x - basePos.x;
    this.diffY = this.target.y - basePos.y;

    this.startPos.x = this.target.x;
    this.startPos.y = this.target.y;

    this.onStart();
  }

  private progress() {
    if (this.state === DragState.None || !this.data) {
      return;
    }

    const newPosition = this.data.getLocalPosition(this.target.parent);
    newPosition.x += this.diffX;
    newPosition.y += this.diffY;

    if (this.state === DragState.Pre) {
      const threshold = 2;
      const dist = distance(this.startPos, newPosition);

      if (dist >= threshold) {
        this.state = DragState.Progress;
      }
    }

    if (this.state === DragState.Progress) {
      this.target.position.set(newPosition.x, newPosition.y);
    }
  }

  private end() {
    if (this.state === DragState.Progress) {
      this.onEnd(this.startPos);
    } else if (this.state === DragState.Pre) {
      this.onEndNoMove();
    }

    this.data = null;
    this.state = DragState.None;
  }
}