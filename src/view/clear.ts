import { Container, Text } from 'pixi.js';
import { Tween } from '@tweenjs/tween.js';
import { Consts } from '../consts';
import { ScreenCover, defaultStyle } from './screenCover';
import { TextPart } from './textPart';
import { DrawUtils } from './drawUtils';

export class Clear {
  private readonly cover: ScreenCover;

  private readonly mainText: Container;
  private readonly tapText: Text;

  constructor(parent: Container, screen: { width: number, height: number }) {
    this.mainText = TextPart.concat([
      new TextPart('Cl', defaultStyle(70, Consts.Color.red, { fontWeight: 'bold' })),
      new TextPart('ea', defaultStyle(70, Consts.Color.yellow)),
      new TextPart('r!', defaultStyle(70, Consts.Color.black, { fontWeight: 'bold' })),
    ]);
    DrawUtils.centering(this.mainText, screen, 0, -30);

    this.tapText = new Text('TAP TO RESTART', defaultStyle(24, Consts.Color.grey, { padding: 5 }));
    DrawUtils.centering(this.tapText, screen, 0, 50);

    const view = new Container();
    view.addChild(this.mainText, this.tapText);

    this.cover = new ScreenCover(parent, view, screen);
    this.cover.onTap = () => {
      if (this.tapText.alpha === 1) {
        this.cover.close();
      }
    }
  }

  show() {
    this.mainText.alpha = 0;
    this.tapText.alpha = 0;

    this.cover.show();

    const diff = 5;

    this.mainText.y -= diff;
    this.tapText.y -= diff;

    const showMain = new Tween(this.mainText)
      .delay(200)
      .to({ alpha: 1, y: this.mainText.y + diff }, 500);

    const showTap = new Tween(this.tapText)
      .delay(300)
      .to({ alpha: 1, y: this.tapText.y + diff }, 200);

    showMain.chain(showTap).start();
  }

  set onClose(value: () => void) {
    this.cover.onClose = value;
  }

  get visible() {
    return this.cover.visible;
  }
}
