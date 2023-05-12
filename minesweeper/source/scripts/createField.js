import { createNode, insertNode } from './useNode';

class Field {
  constructor(num) {
    this.num = num;
  }

  build() {
    this._createElements();
    this._appendELements();
    this._bindEvents();
    return this.gameContent;
  }

  _createCells() {
    const field = createNode('div', 'game__field', 'field');

    for (let i = 0; i < this.num; i++) {
      const row = createNode('div', 'field__row');
      for (let i = 0; i < this.num; i++) {
        const cell = createNode('div', 'field__cell', 'cell');
        if (this.num === 10) {
          cell.style.width = '20px';
          cell.style.height = '20px';
        }
        insertNode(row, cell);
      }
      insertNode(field, row);
    }
    return field;
  }

  _createElements() {
    this.gameContent = createNode('div', 'game__content');
    this.counters = createNode('div', 'count');
    this.duration = createNode('div', 'count__duration');
    this.restartBtn = createNode('div', 'btn-restart');
    this.clicks = createNode('div', 'count__clicks');
    this.field = this._createCells();
  }

  _appendELements() {
    insertNode(this.duration, '000');
    insertNode(this.clicks, '000');

    insertNode(this.counters, this.duration);
    insertNode(this.counters, this.restartBtn);
    insertNode(this.counters, this.clicks);
    insertNode(this.gameContent, this.counters);
    insertNode(this.gameContent, this.field);
  }

  _bindEvents() {
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('mouseover', this._hoverOn);
    document.addEventListener('mousedown', this._clickDown);

    const clickUp = this._clickUp.bind(this);
    document.addEventListener('mouseup', clickUp);
  }

  _clickDown(e) {
    mouse = true;
    if (e.target.classList.contains('cell')) e.target.classList.add('cell_active');
    if (e.target.classList.contains('btn-restart')) e.target.classList.add('btn-restart_active');
  }

  _clickUp(e) {
    mouse = false;
    if (e.target.classList.contains('cell')) e.target.classList.remove('cell_active');
    if (e.target.classList.contains('btn-restart')) {
      e.target.classList.remove('btn-restart_active');
      this._createElements();
      this._appendELements();
      document.querySelector('.game__content').replaceWith(this.gameContent);
    }
  }

  _hoverOn(e) {
    if (mouse && e.target.classList.contains('cell')) {
      e.target.classList.add('cell_active');
    }

    if (mouse && e.target.classList.contains('btn-restart')) {
      e.target.classList.add('btn-restart_active');
    }

    if (e.relatedTarget) {
      e.relatedTarget.classList.remove('cell_active');
      e.relatedTarget.classList.remove('btn-restart_active');
    }
  }
}

let mouse = false;

export { Field };
