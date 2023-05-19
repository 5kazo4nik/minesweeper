import '../index.html';
import '../styles/styles.scss';
import { Game } from './createGame';

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.build();
});
