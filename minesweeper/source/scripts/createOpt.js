import { createNode, insertNode } from './useNode';

// Класс генерации опций.
class Options {
  constructor(fieldSize, mines) {
    this.fieldSize = fieldSize;
    this.mines = mines;
  }

  // Генерирует нужные элементы и возвращает узел-обертку.
  build() {
    this._createElements();
    this._appendElements();
    this._addAttr();
    return this.head;
  }

  _createElements() {
    document.body.classList.add('body', 'body');

    this.head = createNode('div', 'game__head', 'head');
    this.options = createNode('div', 'head__opt');

    this.soundBtn = createNode('div', 'head__sound', 'head__sound_off');

    this.inputs = createNode('div', 'head__inputs');
    this.inputMines = createNode('input', 'head__mines');

    this.select = createNode('select', 'head__size');
    this.opt1 = createNode('option');
    this.opt2 = createNode('option');
    this.opt3 = createNode('option');

    this.themeBtn = createNode('div', 'head__theme');
  }

  _appendElements() {
    insertNode(this.opt1, 'Easy');
    insertNode(this.opt2, 'Medium');
    insertNode(this.opt3, 'Hard');

    insertNode(this.select, this.opt1);
    insertNode(this.select, this.opt2);
    insertNode(this.select, this.opt3);

    insertNode(this.inputs, this.inputMines);
    insertNode(this.inputs, this.select);

    insertNode(this.options, this.soundBtn);
    insertNode(this.options, this.inputs);
    insertNode(this.options, this.themeBtn);

    insertNode(this.head, this.options);
  }

  _addAttr() {
    this.opt1.value = 10;
    this.opt2.value = 15;
    this.opt3.value = 25;

    if (Number(this.fieldSize) === 10) this.opt1.selected = true;
    if (Number(this.fieldSize) === 15) this.opt2.selected = true;
    if (Number(this.fieldSize) === 25) this.opt3.selected = true;

    this.inputMines.type = 'number';
    this.inputMines.placeholder = 'mines';
    this.inputMines.value = this.mines;
  }
}

export { Options };
