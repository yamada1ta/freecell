import { Application } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { PlayManager } from './playManager';
import { Title } from './view/title';
import { Clear } from './view/clear';
import { Loader } from './loader';
import { Loading } from './view/loading';

type Size = { width: number, height: number };

export class Game {
  private readonly app: Application;

  private readonly screenSize = {
    width: 600,
    height: 800
  };

  constructor(parent: HTMLElement) {
    this.app = new Application({
      width: this.screenSize.width,
      height: this.screenSize.height,
      antialias: true,
      backgroundColor: 0xB3CED7,
      resolution: devicePixelRatio
    });

    parent.appendChild(this.app.view);
  }

  start() {
    this.app.ticker.add(() => TWEEN.update());

    const loading = new Loading(this.app.stage, this.app.screen);
    loading.show();

    Loader.onComplete.add(() => {
      loading.close();
      this.play();
    });

    Loader.load();
  }

  resize(parentSize: Size) {
    const size = calcSize(parentSize, this.app.renderer, this.screenSize);

    this.app.renderer.view.style.width = size.width + 'px';
    this.app.renderer.view.style.height = size.height + 'px';
  }

  private play() {
    const play = new PlayManager(this.app.stage);

    const clear = new Clear(this.app.stage, this.app.screen);
    clear.onClose = () => play.start();

    const title = new Title(this.app.stage, this.app.screen);
    title.onClose = () => {
      play.start();

      this.app.ticker.add(() => {
        if (play.isCleared && !clear.visible) {
          clear.show();
        }
      });
    };

    title.show();
  }
}

function calcSize(parent: Size, renderer: Size, screen: Size): Size {
  if (parent.width > renderer.width && parent.height > renderer.height) {
    return { width: screen.width, height: screen.height };
  }

  let width = parent.width;
  let height = parent.width * screen.height / screen.width;

  if (height > parent.height) {
    width = parent.height * screen.width / screen.height;
    height = parent.height;
  }

  return { width, height };
}
