import { CardView } from './cardView'

export interface CardStackView {
  push(value: CardView): void;
  pop(): void;
  clear(): void;
  hit(target: CardView): boolean;
  equalTop(value: CardView): boolean;
  top: CardView | null;
}