import { createNode, insertNode } from './useNode';

class Options {
  constructor(num = 10, theme = false, volume = false) {
    this.num = num;
    this.theme = theme;
    this.volume = volume;
  }

  build() {
    this._createElements();
    this._appendElements();
    this._addAttr();
    return this.head;
  }

  _createElements() {
    document.body.classList.add('body', 'body');
    if (this.theme) document.body.classList.add('body_dark');

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
    if (this.theme) this.themeBtn.classList.add('head__theme_dark');
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

    if (Number(this.num) === 10) this.opt1.selected = true;
    if (Number(this.num) === 10) this.opt2.selected = true;
    if (Number(this.num) === 10) this.opt3.selected = true;

    this.inputMines.type = 'number';
    this.inputMines.placeholder = 'mines';
    if (this.num === 10) this.inputMines.value = 10;
    if (this.num === 15) this.inputMines.value = 35;
    if (this.num === 25) this.inputMines.value = 60;
  }
}

export { Options };
