import { createNode, insertNode } from './useNode';

class Field {
  constructor(num, mines) {
    this.numCells = num;
    this.mines = mines;
  }

  build() {
    this._createElements();
    this._appendELements();
    this._bindEvents();
    return this.gameContent;
  }

  _createCells() {
    const field = createNode('div', 'game__field', 'field');

    for (let i = 0; i < this.numCells; i++) {
      const row = createNode('div', 'field__row');
      for (let i = 0; i < this.numCells; i++) {
        const cell = createNode('div', 'field__cell', 'cell');
        if (this.numCells === 10) {
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
    if (e.target.classList.contains('btn-restart')) {
      e.target.classList.remove('btn-restart_active');
      this._createElements();
      this._appendELements();
      document.querySelector('.game__content').replaceWith(this.gameContent);
      firstClick = true;
      checkedArr = [];
      minesArr = [];
      isLose = false;
    }

    if (e.target.classList.contains('cell')) {
      e.target.classList.remove('cell_active');

      this._setOnClick(e);
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

  // //////////////////////////////////////////////////////////////////

  _setOnClick(e) {
    if (isLose) return;

    const field = [...document.querySelector('.field').children];
    const curRow = e.target.closest('.field__row');
    const rowIndex = field.indexOf(curRow);
    const cellIndex = [...curRow.children].indexOf(e.target);

    if (firstClick) {
      if (e.button !== 2) checkedArr.push(e.target);
      this._setMines(field);
    }

    if (e.button === 2) {
      e.target.classList.toggle('cell_flag');
      return;
    }
    if (e.target.classList.contains('cell_flag')) return;

    // e.target.classList.add('cell_open');
    // if (minesArr.includes(e.target)) {
    //   e.target.classList.add('cell_bomb');
    //   document.querySelector('.btn-restart').classList.add('btn-restart_lose');
    //   isLose = true;
    //   return;
    // }

    const counter = this._setCellValue(field, e.target, rowIndex, cellIndex);
    if (counter === 0) {
      this._openNearCells(field, e.target, rowIndex, cellIndex);
    }
  }

  _setMines(field) {
    firstClick = false;
    for (let i = 0; i < this.mines; i++) {
      let row = Math.floor(Math.random() * (this.numCells - 1));
      let cell = Math.floor(Math.random() * (this.numCells - 1));
      let existMine = minesArr.includes(field[row].children[cell]);
      let existCell = checkedArr.includes(field[row].children[cell]);

      while (existCell || existMine) {
        row = Math.floor(Math.random() * (this.numCells - 1));
        cell = Math.floor(Math.random() * (this.numCells - 1));
        existMine = minesArr.includes(field[row].children[cell]);
        existCell = checkedArr.includes(field[row].children[cell]);
      }
      minesArr.push(field[row].children[cell]);
    }
  }

  _setCellValue(field, cell, rowIndex, cellIndex) {
    let counter = 0;
    cell.classList.add('cell_open');

    if (minesArr.includes(cell)) {
      // cell.classList.add('cell_bomb');
      cell.style.backgroundColor = 'red';
      minesArr.forEach((el) => el.classList.add('cell_bomb'));
      document.querySelector('.btn-restart').classList.add('btn-restart_lose');
      isLose = true;
      return -1;
    }

    if (field[rowIndex - 1]) {
      if (minesArr.includes(field[rowIndex - 1].children[cellIndex])) counter += 1;
      if (minesArr.includes(field[rowIndex - 1].children[cellIndex + 1])) counter += 1;
      if (minesArr.includes(field[rowIndex - 1].children[cellIndex - 1])) counter += 1;
    }

    if (field[rowIndex + 1]) {
      if (minesArr.includes(field[rowIndex + 1].children[cellIndex])) counter += 1;
      if (minesArr.includes(field[rowIndex + 1].children[cellIndex + 1])) counter += 1;
      if (minesArr.includes(field[rowIndex + 1].children[cellIndex - 1])) counter += 1;
    }

    if (minesArr.includes(field[rowIndex].children[cellIndex + 1])) counter += 1;
    if (minesArr.includes(field[rowIndex].children[cellIndex - 1])) counter += 1;

    cell.dataset.col = counter;
    if (counter > 0) {
      cell.textContent = counter;
    }

    return counter;
  }

  _openNearCells(field, cell, rowIndex, cellIndex) {
    let counter;
    const left = field[rowIndex].children[cellIndex - 1];
    const right = field[rowIndex].children[cellIndex + 1];

    if (field[rowIndex - 1]) {
      const topLeft = field[rowIndex - 1].children[cellIndex - 1];
      const topRight = field[rowIndex - 1].children[cellIndex + 1];
      const top = field[rowIndex - 1].children[cellIndex];

      if (!minesArr.includes(top) && top && !top.dataset.col) {
        counter = this._setCellValue(field, top, rowIndex - 1, cellIndex);
        if (counter === 0 && !cell.dataset.prev) {
          cell.dataset.prev = true;
          this._openNearCells(field, top, rowIndex - 1, cellIndex);
        }
      }
      if (!minesArr.includes(topRight) && topRight && !topRight.dataset.col) {
        counter = this._setCellValue(field, topRight, rowIndex - 1, cellIndex + 1);
        if (counter === 0) this._openNearCells(field, topRight, rowIndex - 1, cellIndex + 1);
      }
      if (!minesArr.includes(topLeft) && topLeft && !topLeft.dataset.col) {
        counter = this._setCellValue(field, topLeft, rowIndex - 1, cellIndex - 1);
        if (counter === 0) this._openNearCells(field, topLeft, rowIndex - 1, cellIndex - 1);
      }
    }

    if (field[rowIndex + 1]) {
      const botLeft = field[rowIndex + 1].children[cellIndex - 1];
      const botRight = field[rowIndex + 1].children[cellIndex + 1];
      const bot = field[rowIndex + 1].children[cellIndex];

      if (!minesArr.includes(bot) && bot && !bot.dataset.col) {
        counter = this._setCellValue(field, bot, rowIndex + 1, cellIndex);
        if (counter === 0 && !cell.dataset.prev) {
          cell.dataset.prev = true;
          this._openNearCells(field, bot, rowIndex + 1, cellIndex);
        }
      }
      if (!minesArr.includes(botRight) && botRight && !botRight.dataset.col) {
        counter = this._setCellValue(field, botRight, rowIndex + 1, cellIndex + 1);
        if (counter === 0) this._openNearCells(field, botRight, rowIndex + 1, cellIndex + 1);
      }
      if (!minesArr.includes(botLeft) && botLeft && !botLeft.dataset.col) {
        counter = this._setCellValue(field, botLeft, rowIndex + 1, cellIndex - 1);
        if (counter === 0) this._openNearCells(field, botLeft, rowIndex + 1, cellIndex - 1);
      }
    }

    if (!minesArr.includes(right) && right && !right.dataset.col) {
      counter = this._setCellValue(field, right, rowIndex, cellIndex + 1);
      if (counter === 0) this._openNearCells(field, right, rowIndex, cellIndex + 1);
    }
    if (!minesArr.includes(left) && left && !left.dataset.col) {
      counter = this._setCellValue(field, left, rowIndex, cellIndex - 1);
      if (counter === 0) this._openNearCells(field, left, rowIndex, cellIndex - 1);
    }
  }
}

let mouse = false;
let checkedArr = [];
let minesArr = [];
let firstClick = true;
let isLose = false;

export { Field };
