import { Suit } from '../suit'
import { CardNumber } from '../card'
import { Consts } from '../consts';
import { Graphics, Container, Sprite, Text } from 'pixi.js';
import { Loader } from '../loader';

export class DrawUtils {
  static readonly cardWidth = 50;
  private static readonly cardHeight = 80;
  private static readonly cardCornerRadius = 5;
  private static readonly cardColor = Consts.Color.white;

  private constructor() { }

  static card(suit: Suit, number: CardNumber) {
    const result = new Graphics()
      .lineStyle(1, Consts.Color.lightGrey, 0.8, 1)
      .beginFill(DrawUtils.cardColor)
      .drawRoundedRect(0, 0, DrawUtils.cardWidth, DrawUtils.cardHeight, DrawUtils.cardCornerRadius)
      .endFill();

    result.addChild(DrawUtils.pattern(suit, number, DrawUtils.cardWidth, DrawUtils.cardHeight));

    return result;
  }

  private static pattern(
    suit: Suit, number: CardNumber, cardWidth: number, cardHeight: number) {
    const result = new Container();

    const mainSuitSize = 35;
    const mainSuit = DrawUtils.suit(suit, mainSuitSize);
    mainSuit.x = DrawUtils.midX(mainSuit, cardWidth);
    mainSuit.y = (cardHeight - mainSuit.height) - 10;
    result.addChild(mainSuit);

    const miniSuitSize = 14;
    const miniSuit = DrawUtils.suit(suit, miniSuitSize);
    miniSuit.x = (cardWidth - miniSuit.width) - 5;
    miniSuit.y = 6;
    result.addChild(miniSuit);

    const color = suitToColor(suit);

    const numberSize = 16;
    const numberText = new Text(numberToString(number), {
      fill: color,
      fontSize: numberSize,
      fontWeight: 'bold',
      letterSpacing: -1,
      // 文字をぼかしてなじませるために文字と同色のドロップシャドウを使用
      dropShadow: true,
      dropShadowBlur: 1.5,
      dropShadowDistance: 0,
      dropShadowColor: color
    });
    numberText.x = 5;
    numberText.y = 4;
    result.addChild(numberText);

    return result;
  }

  static suit(suit: Suit, size: number, color?: number) {
    if (!color) {
      color = suitToColor(suit);
    }

    const result = new Sprite(Loader.getTexture(suit));
    result.width = size;
    result.height = size;
    result.tint = color;

    return result;
  }

  static cell(x: number, y: number) {
    const result = new Graphics()
      .lineStyle(2, Consts.Color.white)
      .drawRoundedRect(0, 0, DrawUtils.cardWidth, DrawUtils.cardHeight, DrawUtils.cardCornerRadius)
      .endFill();

    result.position.set(x, y);

    return result;
  }

  static centering(
    target: Container, parent: { width: number, height: number },
    diffX: number = 0, diffY: number = 0) {
    target.x = DrawUtils.midX(target, parent.width, diffX);
    target.y = DrawUtils.midY(target, parent.height, diffY);
  }

  static midX(target: { width: number }, parentWidth: number, diff: number = 0) {
    return (parentWidth - target.width) / 2 + diff;
  }

  static midY(target: { height: number }, parentHeight: number, diff: number = 0) {
    return (parentHeight - target.height) / 2 + diff;
  }
}

function suitToColor(value: Suit) {
  switch (value) {
    case Suit.Heart:
    case Suit.Diamond:
      return Consts.Color.red;
    case Suit.Club:
    case Suit.Spade:
      return Consts.Color.black;
  }
}

function numberToString(value: CardNumber) {
  if (value === 1) {
    return 'A';
  } else if (value === 11) {
    return 'J';
  } else if (value === 12) {
    return 'Q';
  } else if (value === 13) {
    return 'K';
  }

  return value.toString();
}
