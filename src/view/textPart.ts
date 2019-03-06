import { Container, Text, TextStyle } from 'pixi.js';

export class TextPart {
  constructor(
    readonly text: string,
    readonly style: TextStyle,
    readonly x: number = 0,
    readonly y: number = 0) { }

  static concat(parts: TextPart[]) {
    const texts: Text[] = [];

    parts.forEach((v, i) => {
      const text = new Text(v.text, v.style);
      text.x = v.x;
      text.y = v.y;

      if (i > 0) {
        const prev = texts[i - 1];
        text.x += prev.x + prev.width;
      }

      texts.push(text);
    });

    const result = new Container();
    result.addChild(...texts);

    return result;
  }
}