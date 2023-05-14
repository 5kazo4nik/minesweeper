import { Field } from './createField';
import { Options } from './createOpt';
import { createNode, insertNode } from './useNode';

class Game {
  build() {
    this._createElements();
    this._appendElements();
    this._bindEvents();
  }

  _createElements() {
    this.main = createNode('main', 'wrapper');
    this.game = createNode('div', 'game');

    const builderField = new Field(10, 10, isChange);
    const builderOptions = new Options(10);

    this.options = builderOptions.build();
    this.field = builderField.build();

    this.gameResult = createNode('div', 'game__result');
    this.result = createNode('div', 'result');
    this.heading = createNode('h2', 'result__heading');
    this.list = createNode('ol', 'result__list');
  }

  _appendElements() {
    for (let i = 0; i < 10; i++) {
      const item = createNode('li', 'result__item');
      insertNode(this.list, item);
    }

    insertNode(this.heading, 'Score');
    insertNode(this.result, this.heading);
    insertNode(this.result, this.list);
    insertNode(this.gameResult, this.result);

    insertNode(this.game, this.options);
    insertNode(this.game, this.field);
    insertNode(this.game, this.gameResult);

    insertNode(this.main, this.game);
    insertNode(document.body, this.main);
  }

  _bindEvents() {
    this.game.addEventListener('contextmenu', (e) => e.preventDefault());

    const select = document.querySelector('.head__size');
    select.addEventListener('input', this._changeLevel);
  }

  _changeLevel(e) {
    // console.log(e.target.value);
    // document.removeEventListener('mouseup', clickUp);
    isChange = true;
    let builderField;
    if (e.target.value === '10') {
      builderField = new Field(10, 10, isChange);
    }
    if (e.target.value === '15') {
      builderField = new Field(15, 40, isChange);
    }
    if (e.target.value === '25') {
      builderField = new Field(25, 100, isChange);
    }

    const newField = builderField.build();
    document.querySelector('.game__content').replaceWith(newField);
    isChange = false;
  }
}

let isChange = false;

export { Game, isChange };
