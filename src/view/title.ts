import { Container, Text, Graphics } from 'pixi.js';
import { Consts } from '../consts';
import { ScreenCover, defaultStyle } from './screenCover';
import { TextPart } from './textPart';
import { DrawUtils } from './drawUtils';

export class Title {
  private readonly cover: ScreenCover;

  constructor(parent: Container, screen: { width: number, height: number }) {
    const back = new Graphics()
      .beginFill(Consts.Color.yellow, 0.8)
      .drawRect(0, 0, screen.width, 180)
      .endFill();
    back.y = DrawUtils.midY(back, screen.height);

    const mainText = TextPart.concat([
      new TextPart('F', defaultStyle(70, Consts.Color.red, { fontWeight: 'bold' }), 0, -12),
      new TextPart('ree', defaultStyle(56, Consts.Color.red), -3),
      new TextPart('C', defaultStyle(70, Consts.Color.black, { fontWeight: 'bold' }), 2, -11),
      new TextPart('ell', defaultStyle(56, Consts.Color.black)),
    ]);
    DrawUtils.centering(mainText, screen, 0, -20);

    const tapText = new Text('TAP TO START', defaultStyle(24, Consts.Color.grey, { padding: 5 }));
    DrawUtils.centering(tapText, screen, 0, 50);

    const view = new Container();
    view.addChild(back);
    view.addChild(mainText, tapText);

    this.cover = new ScreenCover(parent, view, screen);
    this.cover.onTap = () => this.cover.close();
  }

  show() {
    this.cover.show(0);
  }

  set onClose(value: () => void) {
    this.cover.onClose = value;
  }
}

