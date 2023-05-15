import { playSound } from './playSound';
import { createNode, insertNode } from './useNode';

class Field {
  constructor(num, mines, isChange) {
    this.numCells = num;
    this.mines = mines;
    this.isChange = isChange;
  }

  build() {
    this._createElements();
    this._appendELements();
    this._updateFlags();
    this._bindEvents();
    return this.gameContent;
  }

  _createCells() {
    const field = createNode('div', 'game__field', 'field');

    for (let i = 0; i < this.numCells; i++) {
      const row = createNode('div', 'field__row');
      for (let i = 0; i < this.numCells; i++) {
        const cell = createNode('div', 'field__cell', 'cell');
        if (this.numCells === 10 || this.numCells === 15) {
          cell.style.width = '20px';
          cell.style.height = '20px';
          cell.style.fontSize = '18px';
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

  _updateFlags() {
    firstClick = true;
    firstClick = true;
    checkedArr = [];
    minesArr = [];
    isLose = false;
    isWin = false;
  }

  _bindEvents() {
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('mouseover', this._hoverOn);
    document.addEventListener('mousedown', this._clickDown);

    if (this.isChange) {
      document.removeEventListener('mouseup', prevClickUp);
    }
    const clickUp = this._clickUp.bind(this);
    prevClickUp = clickUp;
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
      this._updateFlags();
      document.querySelector('.game__content').replaceWith(this.gameContent);
      // firstClick = true;
      // checkedArr = [];
      // minesArr = [];
      // isLose = false;
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
      playSound('../assets/sound/Флажок.mp3', 0.3);
      return;
    }
    if (e.target.classList.contains('cell_flag')) return;

    const counter = this._setCellValue(field, e.target, rowIndex, cellIndex);

    if (counter === 0) {
      this._openNearCells(field, e.target, rowIndex, cellIndex);
    }
    if (counter >= 0) {
      playSound('../assets/sound/Клик.mp3', 0.4);
    }

    if (checkedArr.length + minesArr.length === this.numCells * this.numCells && !isWin) {
      playSound('../assets/sound/Победа.mp3', 0.3);
      isWin = true;
    }
    // console.log(checkedArr.length + minesArr.length);
    // console.log(this.numCells);
  }

  _setMines(field) {
    firstClick = false;
    for (let i = 0; i < this.mines; i++) {
      let row = Math.floor(Math.random() * this.numCells);
      let cell = Math.floor(Math.random() * this.numCells);
      let existMine = minesArr.includes(field[row].children[cell]);
      let existCell = checkedArr.includes(field[row].children[cell]);

      while (existCell || existMine) {
        row = Math.floor(Math.random() * this.numCells);
        cell = Math.floor(Math.random() * this.numCells);
        existMine = minesArr.includes(field[row].children[cell]);
        existCell = checkedArr.includes(field[row].children[cell]);
      }
      minesArr.push(field[row].children[cell]);
    }
    // console.log(minesArr.length);
  }

  _setCellValue(field, cell, rowIndex, cellIndex) {
    let counter = 0;
    cell.classList.add('cell_open');
    cell.classList.remove('cell_flag');

    if (minesArr.includes(cell)) {
      cell.style.backgroundColor = 'red';
      minesArr.forEach((el) => el.classList.add('cell_bomb'));
      document.querySelector('.btn-restart').classList.add('btn-restart_lose');
      isLose = true;
      playSound('../assets/sound/Взрыв.mp3', 0.3);
      playSound('../assets/sound/Поражение.mp3', 0.3);
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

    if (!checkedArr.includes(cell)) {
      checkedArr.push(cell);
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
let prevClickUp;
let isWin = false;

export { Field };
