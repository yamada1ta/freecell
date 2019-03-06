import { Container, Graphics, DisplayObject, TextStyle, TextStyleOptions } from 'pixi.js';
import { Tween } from '@tweenjs/tween.js';
import { Consts } from '../consts';

export class ScreenCover {
  onClose = () => { };

  set onTap(value: () => void) {
    this.view.on('pointertap', value);
  }

  private readonly view: Graphics;

  constructor(parent: Container, child: DisplayObject, screen: { width: number, height: number }) {
    this.view = new Graphics()
      .beginFill(Consts.Color.lightGrey, 0.3)
      .drawRect(0, 0, screen.width, screen.height);

    this.view.alpha = 0;

    this.view.addChild(child);

    parent.addChild(this.view);
  }

  get visible() {
    return this.view.alpha > 0;
  }

  show(duration: number = 200) {
    this.view.parent.addChild(this.view);

    new Tween(this.view)
      .to({ alpha: 1 }, duration)
      .onComplete(() => {
        this.view.interactive = true;
      })
      .start();
  }

  close(duration: number = 100) {
    this.view.interactive = false;

    new Tween(this.view)
      .to({ alpha: 0 }, duration)
      .onComplete(() => {
        this.onClose();
      })
      .start();
  }
}

export function defaultStyle(fontSize: number, fill: number, options: TextStyleOptions = {}) {
  options.fontSize = fontSize;
  options.fill = fill;
  options.fontFamily = 'Times New Roman';
  options.letterSpacing = 1.1;
  options.dropShadowColor = fill;
  options.dropShadow = true;
  options.dropShadowBlur = 10;
  options.dropShadowDistance = 0;
  options.dropShadowAlpha = 0.5;

  return new TextStyle(options);
}