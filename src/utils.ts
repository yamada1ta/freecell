import { Rectangle, Point } from 'pixi.js';

export function hitRect(value: Rectangle, target: Rectangle) {
  const points = [
    new Point(target.left, target.top),
    new Point(target.left, target.bottom),
    new Point(target.right, target.top),
    new Point(target.right, target.bottom),
  ];

  return points.filter(v => value.contains(v.x, v.y)).length > 0;
}

export function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function repeat(times: number) {
  return Array.apply(null, Array(times));
}