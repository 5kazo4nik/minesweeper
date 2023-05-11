import '../index.html';
import '../styles/styles.scss';
// import { Field } from './createField';
// import { Options } from './createOpt';
import { Game } from './createGame';

// const gameField = new Field(10);
// const options = new Options(10);

// console.log(gameField.build());
// console.log(options.build());

const game = new Game();
console.log(game.build());
