import { Card } from '../card'
import { DrawUtils } from './drawUtils'
import { Dragger } from '../dragger';
import { Graphics, Container } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js'
import { AnimationManager } from '../animationManager';
import { distance } from '../utils'

export class CardView {
  private readonly view: Graphics;
  private readonly dragger: Dragger;

  private activeAnim: Tween[] = [];
  private prevAnimEnd: Tween | null = null;
  private prevAnimTime = 0;
  private prevInteractive = false;

  constructor(parent: Container, data: Card, private readonly animManager: AnimationManager) {
    this.view = DrawUtils.card(data.suit, data.number);
    this.view.x = -this.view.width;
    this.view.y = -this.view.height;

    parent.addChild(this.view);

    this.dragger = new Dragger(this.view);
    this.dragger.onStart = () => { this.toFront(); };
  }

  get bounds() {
    return this.view.getBounds();
  }

  set interactive(value: boolean) {
    if (!this.isMoving) {
      this.view.interactive = value;
    } else {
      this.prevInteractive = value;
    }
  }

  set onDragEnd(value: (start: { x: number, y: number }) => void) {
    this.dragger.onEnd = value;
  }

  set onTap(value: () => void) {
    this.dragger.onEndNoMove = value;
  }

  moveTo(x: number, y: number, durationUnit: number = 1) {
    this.prevInteractive = this.view.interactive;
    this.interactive = false;

    const durationMax = 300;
    const dist = distance({ x, y }, this.view);
    const duration = Math.min(Math.floor(dist * durationUnit), durationMax);
    const interval = duration > 0 ? 100 : 0;

    const anim = new Tween(this.view)
      .to({ x: x, y: y }, duration)
      .easing(Easing.Exponential.Out)
      .onStart(() => { this.toFront(); })
      .onComplete(() => {
        this.activeAnim = this.activeAnim.filter(v => v !== anim);

        if (this.activeAnim.length === 0) {
          this.prevAnimEnd = null;
          this.prevAnimTime = 0;
          this.interactive = this.prevInteractive;
        }
      });

    const ret = this.prevAnimEnd === null ?
      this.animManager.add(anim, interval) :
      this.animManager.chain(anim, this.prevAnimEnd, this.prevAnimTime, interval);

    this.prevAnimEnd = ret.end;
    this.prevAnimTime += ret.delay + duration;
    this.activeAnim.push(anim);
  }

  get isMoving() {
    return this.activeAnim.length > 0;
  }

  private toFront() {
    // 描画順を最前にする
    this.view.parent.addChild(this.view);
  }
}
