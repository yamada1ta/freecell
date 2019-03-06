import { Container, Text } from 'pixi.js';
import { Consts } from '../consts';
import { ScreenCover, defaultStyle } from './screenCover';
import { DrawUtils } from './drawUtils';

export class Loading {
  private readonly cover: ScreenCover;

  constructor(parent: Container, screen: { width: number, height: number }) {
    const view = new Text('Loading...', defaultStyle(48, Consts.Color.grey, { padding: 5 }));
    DrawUtils.centering(view, screen);

    this.cover = new ScreenCover(parent, view, screen);
  }

  show() {
    this.cover.show(0);
  }

  close() {
    this.cover.close(0);
  }
}
