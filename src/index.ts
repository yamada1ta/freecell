import { Game } from './game';

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game(document.body);

  game.resize(parentSize());
  window.addEventListener('resize', () => game.resize(parentSize()));

  game.start();
});

function parentSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  };
}