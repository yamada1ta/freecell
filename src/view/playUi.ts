import { Graphics, Container, Sprite, Texture } from 'pixi.js';
import { Consts } from '../consts';
import { Loader } from '../loader';
import { DrawUtils } from './drawUtils';

type UiType = 'undo' | 'redo' | 'restart';

export class PlayUi {
  private readonly undo: Container;
  private readonly redo: Container;
  private readonly restart: Container;

  constructor(parent: Container) {
    const root = new Container();
    root.x = 30;
    root.y = 20;

    this.undo = createIconButton(Loader.getTexture('undo'), 18, { x: -2, y: -1 });
    root.addChild(this.undo);

    this.redo = createIconButton(Loader.getTexture('redo'), 18, { x: 1, y: -1 });
    this.redo.x = 60;
    root.addChild(this.redo);

    this.restart = createIconButton(Loader.getTexture('restart'), 24, { x: -1, y: 0 });
    this.restart.x = 500;
    root.addChild(this.restart);

    parent.addChild(root);
  }

  onTap(target: UiType, fn: Function) {
    const ui = this.toUi(target);
    ui.on('pointertap', fn);
  }

  set interactiveAll(value: boolean) {
    this.undo.interactive = value;
    this.redo.interactive = value;
    this.restart.interactive = value;
  }

  private toUi(target: UiType) {
    switch (target) {
      case 'undo':
        return this.undo;
      case 'redo':
        return this.redo;
      case 'restart':
        return this.restart;
    }
  }
}

function createIconButton(
  texture: Texture, iconSize: number, diff: { x: number, y: number } = { x: 0, y: 0 }) {
  const radius = 20;
  const color = Consts.Color.white;

  const result = createCircleButton(radius, color);

  const icon = new Sprite(texture);
  icon.width = iconSize;
  icon.height = iconSize;
  icon.tint = Consts.Color.black;
  DrawUtils.centering(icon, { width: radius * 2, height: radius * 2 }, diff.x, diff.y);

  result.addChild(icon);

  return result;
}

function createCircleButton(radius: number, color: number) {
  const result = new Graphics()
    .lineStyle(1, Consts.Color.lightGrey, 0.8, 1)
    .beginFill(color)
    .drawCircle(radius, radius, radius)
    .endFill();

  result.interactive = true;
  result.buttonMode = true;

  return result;
}