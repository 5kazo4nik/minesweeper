import { createNode, insertNode } from './useNode';

class Field {
  constructor(num) {
    this.num = num;
  }

  createCells() {
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

  build() {
    this.createElements();
    this.appendELements();
    return this.gameContent;
  }

  createElements() {
    this.gameContent = createNode('div', 'game__content');
    this.counters = createNode('div', 'count');
    this.duration = createNode('div', 'count__duration');
    this.restartBtn = createNode('div', 'btn-restart');
    this.clicks = createNode('div', 'count__clicks');
    this.field = this.createCells();
  }

  appendELements() {
    insertNode(this.duration, '000');
    insertNode(this.clicks, '000');

    insertNode(this.counters, this.duration);
    insertNode(this.counters, this.restartBtn);
    insertNode(this.counters, this.clicks);
    insertNode(this.gameContent, this.counters);
    insertNode(this.gameContent, this.field);
  }
}

export { Field };
