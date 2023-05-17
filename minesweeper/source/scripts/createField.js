import { Modal } from './modal';
import { playSound } from './playSound';
import { setScore } from './setScore';
import { createNode, insertNode } from './useNode';

class Field {
  constructor(num, mines, isChange, save = null) {
    this.numCells = num;
    this.mines = mines;
    this.isChange = isChange;
    this.save = save;
  }

  build() {
    if (this.save !== null) {
      isSaved = false;
      savedField = null;
    }
    this._createElements();
    this._appendELements();
    this._updateFlags();
    this._bindEvents();
    return this.gameContent;
  }

  _createCells() {
    if (!savedField) {
      const field = createNode('div', 'game__field', 'field');

      for (let i = 0; i < this.numCells; i++) {
        const row = createNode('div', 'field__row');
        for (let j = 0; j < this.numCells; j++) {
          const cell = createNode('div', 'field__cell', 'cell');
          cell.dataset.x = j;
          cell.dataset.y = i;
          if (this.numCells === 10 || this.numCells === 15) {
            cell.style.width = '20px';
            cell.style.height = '20px';
            cell.style.fontSize = '18px';
          }
          insertNode(row, cell);
        }
        insertNode(field, row);
      }
      savedField = field;
      return field;
    } else {
      return savedField;
    }
  }

  _createElements() {
    this.gameContent = createNode('div', 'game__content');
    this.counters = createNode('div', 'count');
    this.restartBtn = createNode('div', 'btn-restart');
    this.countContent = createNode('div', 'count__content');
    this.duration = createNode('div', 'count__duration');
    this.flags = createNode('div', 'count__flags');
    this.clicks = createNode('div', 'count__clicks');
    this.field = this._createCells();
  }

  _appendELements() {
    if (!isSaved) {
      insertNode(this.duration, '000');
      insertNode(this.flags, String(this.mines).padStart(3, 0));
      insertNode(this.clicks, '000');
    } else {
      insertNode(this.duration, String(secondsCounter).padStart(3, 0));
      insertNode(this.flags, String(flags).padStart(3, 0));
      insertNode(this.clicks, String(clicksCounter).padStart(3, 0));
    }

    insertNode(this.countContent, this.duration);
    insertNode(this.countContent, this.flags);
    insertNode(this.countContent, this.clicks);
    insertNode(this.counters, this.restartBtn);
    insertNode(this.counters, this.countContent);

    insertNode(this.gameContent, this.counters);
    insertNode(this.gameContent, this.field);
  }

  _updateFlags() {
    if (!isSaved) {
      firstClick = true;
      checkedArr = [];
      minesCoords = [];
      isLose = false;
      isWin = false;
      clicksCounter = 0;
      secondsCounter = 0;
      clearInterval(secondsInterval);
      secondsInterval = null;
      flags = this.mines;
    }

    if (isSaved) {
      secondsInterval = this._setSecondsInterval();
    }
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

  // ///////////////////////////////////////////////////////////////////////

  _clickDown(e) {
    mouse = true;
    if (e.target.classList.contains('cell')) e.target.classList.add('cell_active');
    if (e.target.classList.contains('btn-restart')) e.target.classList.add('btn-restart_active');
  }

  _clickUp(e) {
    mouse = false;
    if (e.target.classList.contains('btn-restart')) {
      savedField = null;
      isSaved = false;
      e.target.classList.remove('btn-restart_active');
      this._createElements();
      this._appendELements();
      this._updateFlags();
      document.querySelector('.game__content').replaceWith(this.gameContent);
    }

    if (e.target.classList.contains('cell')) {
      e.target.classList.remove('cell_active');

      if (!e.target.classList.contains('cell_open') && !isWin && !isLose) {
        this._setClicksCount(e);
        this._setOnClick(e);
      }
      if (isWin || isLose) {
        clearInterval(secondsInterval);
      }
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
    const field = [...document.querySelector('.field').children];
    const curRow = e.target.closest('.field__row');
    const rowIndex = field.indexOf(curRow);
    const cellIndex = [...curRow.children].indexOf(e.target);
    const soundBtn = document.querySelector('.head__sound');

    if (e.button === 2) {
      if (e.target.classList.contains('cell_flag')) {
        flags += 1;
      } else if (flags > 0) {
        flags -= 1;
      } else {
        return;
      }
      document.querySelector('.count__flags').textContent = String(flags).padStart(3, 0);
      e.target.classList.toggle('cell_flag');
      if (!soundBtn.classList.contains('head__sound_off')) playSound('../assets/sound/Флажок.mp3', 0.3);
      return;
    }

    if (firstClick) {
      if (e.button !== 2) {
        checkedArr.push([Number(e.target.dataset.y), Number(e.target.dataset.x)]);
      }
      secondsInterval = this._setSecondsInterval();
      this._setMines(field);
    }

    if (e.target.classList.contains('cell_flag')) {
      return;
    }

    const counter = this._setCellValue(field, e.target, rowIndex, cellIndex);
    if (counter === 0) {
      this._openNearCells(field, e.target, rowIndex, cellIndex);
    }
    if (counter >= 0 && !soundBtn.classList.contains('head__sound_off')) {
      playSound('../assets/sound/Клик.mp3', 0.4);
    }

    if (checkedArr.length + minesCoords.length === this.numCells * this.numCells && !isWin) {
      if (!soundBtn.classList.contains('head__sound_off')) playSound('../assets/sound/Победа.mp3', 0.3);
      isWin = true;
    }

    if (isWin || isLose) {
      const modal = new Modal(isWin, isLose, secondsCounter, clicksCounter);
      document.body.prepend(modal.build());
      savedField = null;
      isSaved = false;
    }

    if (isWin) {
      this._setScore();
    }
    savedField = this.field;
  }

  _setMines(field) {
    firstClick = false;
    for (let i = 0; i < this.mines; i++) {
      let row = Math.floor(Math.random() * this.numCells);
      let cell = Math.floor(Math.random() * this.numCells);
      let existMine = isExist(minesCoords, field[row].children[cell]);
      let existCell = isExist(checkedArr, field[row].children[cell]);

      let coords = [];

      while (!!existCell || !!existMine) {
        row = Math.floor(Math.random() * this.numCells);
        cell = Math.floor(Math.random() * this.numCells);
        existMine = isExist(minesCoords, field[row].children[cell]);
        existCell = isExist(checkedArr, field[row].children[cell]);
      }

      coords.push(row, cell);
      minesCoords.push(coords);
    }
  }

  _setCellValue(field, cell, rowIndex, cellIndex) {
    let counter = 0;
    const soundBtn = document.querySelector('.head__sound');
    if (cell.classList.contains('cell_flag')) {
      return;
    }
    cell.classList.add('cell_open');

    if (isExist(minesCoords, cell)) {
      cell.style.backgroundColor = 'red';
      minesCoords.forEach((c) => document.querySelector(`[data-x="${c[1]}"][data-y="${c[0]}"]`).classList.add('cell_bomb'));
      document.querySelector('.btn-restart').classList.add('btn-restart_lose');
      isLose = true;
      if (!soundBtn.classList.contains('head__sound_off')) {
        playSound('../assets/sound/Взрыв.mp3', 0.3);
        playSound('../assets/sound/Поражение.mp3', 0.3);
      }
      return -1;
    }

    const left = field[rowIndex].children[cellIndex - 1];
    const right = field[rowIndex].children[cellIndex + 1];

    if (field[rowIndex - 1]) {
      const topLeft = field[rowIndex - 1].children[cellIndex - 1];
      const topRight = field[rowIndex - 1].children[cellIndex + 1];
      const top = field[rowIndex - 1].children[cellIndex];
      if (isExist(minesCoords, top)) counter += 1;
      if (topRight && isExist(minesCoords, topRight)) counter += 1;
      if (topLeft && isExist(minesCoords, topLeft)) counter += 1;
    }

    if (field[rowIndex + 1]) {
      const botLeft = field[rowIndex + 1].children[cellIndex - 1];
      const botRight = field[rowIndex + 1].children[cellIndex + 1];
      const bot = field[rowIndex + 1].children[cellIndex];
      if (isExist(minesCoords, bot)) counter += 1;
      if (botLeft && isExist(minesCoords, botLeft)) counter += 1;
      if (botRight && isExist(minesCoords, botRight)) counter += 1;
    }

    if (left && isExist(minesCoords, left)) counter += 1;
    if (right && isExist(minesCoords, right)) counter += 1;

    cell.dataset.col = counter;
    if (counter > 0) {
      cell.textContent = counter;
    }

    if (!isExist(checkedArr, cell)) {
      checkedArr.push([Number(cell.dataset.y), Number(cell.dataset.x)]);
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

      if (top && !isExist(minesCoords, top) && !top.dataset.col) {
        counter = this._setCellValue(field, top, rowIndex - 1, cellIndex);
        if (counter === 0 && !cell.dataset.prev) {
          cell.dataset.prev = true;
          this._openNearCells(field, top, rowIndex - 1, cellIndex);
        }
      }
      if (topRight && !isExist(minesCoords, topRight) && !topRight.dataset.col) {
        counter = this._setCellValue(field, topRight, rowIndex - 1, cellIndex + 1);
        if (counter === 0) this._openNearCells(field, topRight, rowIndex - 1, cellIndex + 1);
      }
      if (topLeft && !isExist(minesCoords, topLeft) && !topLeft.dataset.col) {
        counter = this._setCellValue(field, topLeft, rowIndex - 1, cellIndex - 1);
        if (counter === 0) this._openNearCells(field, topLeft, rowIndex - 1, cellIndex - 1);
      }
    }

    if (field[rowIndex + 1]) {
      const botLeft = field[rowIndex + 1].children[cellIndex - 1];
      const botRight = field[rowIndex + 1].children[cellIndex + 1];
      const bot = field[rowIndex + 1].children[cellIndex];

      if (bot && !isExist(minesCoords, bot) && !bot.dataset.col) {
        counter = this._setCellValue(field, bot, rowIndex + 1, cellIndex);
        if (counter === 0 && !cell.dataset.prev) {
          cell.dataset.prev = true;
          this._openNearCells(field, bot, rowIndex + 1, cellIndex);
        }
      }
      if (botRight && !isExist(minesCoords, botRight) && !botRight.dataset.col) {
        counter = this._setCellValue(field, botRight, rowIndex + 1, cellIndex + 1);
        if (counter === 0) this._openNearCells(field, botRight, rowIndex + 1, cellIndex + 1);
      }
      if (botLeft && !isExist(minesCoords, botLeft) && !botLeft.dataset.col) {
        counter = this._setCellValue(field, botLeft, rowIndex + 1, cellIndex - 1);
        if (counter === 0) this._openNearCells(field, botLeft, rowIndex + 1, cellIndex - 1);
      }
    }

    if (right && !isExist(minesCoords, right) && !right.dataset.col) {
      counter = this._setCellValue(field, right, rowIndex, cellIndex + 1);
      if (counter === 0) this._openNearCells(field, right, rowIndex, cellIndex + 1);
    }
    if (left && !isExist(minesCoords, left) && !left.dataset.col) {
      counter = this._setCellValue(field, left, rowIndex, cellIndex - 1);
      if (counter === 0) this._openNearCells(field, left, rowIndex, cellIndex - 1);
    }
  }

  _setClicksCount(e) {
    if (!e.target.className.match(/(open|flag)/) && e.button !== 2) {
      clicksCounter += 1;
      const totalClicks = String(clicksCounter).padStart(3, 0);
      this.clicks.textContent = totalClicks;
    }
  }

  _setSecondsInterval() {
    return setInterval(() => {
      secondsCounter += 1;
      const totalSeconds = String(secondsCounter).padStart(3, 0);
      this.duration.textContent = totalSeconds;
    }, 1000);
  }

  _setScore() {
    setScore(score, clicksCounter, secondsCounter, this.mines, flags, this.numCells, isWin);
    // if (isWin) score.unshift(`Steps: ${clicksCounter}. Time: ${secondsCounter} seconds. Flags: ${this.mines - flags}. Field: ${this.numCells}x${this.numCells}. Mines: ${this.mines}`);
    // if (score.length > 10) score.pop();
    // const list = Array.from(document.querySelectorAll('.result__item'));
    // const fieldStyle = getComputedStyle(this.field);
    // const result = document.querySelector('.result');
    // result.style.width = `${fieldStyle.width}`;
    // console.log(fieldStyle.width);
    // score.forEach((el, index) => {
    //   list[index].textContent = el;
    // });
  }
}

let mouse = false;
let checkedArr = JSON.parse(localStorage.getItem('checkedArr')) || [];
let minesCoords = JSON.parse(localStorage.getItem('minesCoords')) || [];
let savedField = getField('field') || null;
let firstClick = localStorage.getItem('firstClick') === 'true' ? true : false;
let isLose = localStorage.getItem('isLose') === 'true' ? true : false;
let isWin = localStorage.getItem('isWin') === 'true' ? true : false;
let prevClickUp;
let clicksCounter = Number(localStorage.getItem('clicksCounter')) || 0;
let secondsCounter = Number(localStorage.getItem('secondsCounter')) || 0;
let secondsInterval;
let flags = Number(localStorage.getItem('flags')) || 0;
let isSaved = localStorage.getItem('isSaved') === 'true' ? true : false;
let score = JSON.parse(localStorage.getItem('score')) || [];

window.addEventListener('beforeunload', () => {
  if (!isLose && !isWin && !firstClick) {
    isSaved = true;
    localStorage.setItem('checkedArr', JSON.stringify(checkedArr));
    localStorage.setItem('minesCoords', JSON.stringify(minesCoords));
    saveField(savedField);
    localStorage.setItem('firstClick', firstClick);
    localStorage.setItem('clicksCounter', clicksCounter);
    localStorage.setItem('secondsCounter', secondsCounter);
    localStorage.setItem('flags', flags);
    localStorage.setItem('isWin', isWin);
    localStorage.setItem('isLose', isLose);
    localStorage.setItem('isSaved', isSaved);
  } else {
    isSaved = false;
    localStorage.removeItem('checkedArr');
    localStorage.removeItem('minesCoords');
    localStorage.removeItem('field');
    localStorage.removeItem('firstClick', false);
    localStorage.removeItem('clicksCounter', 0);
    localStorage.removeItem('secondsCounter', 0);
    localStorage.removeItem('flags', flags);
    localStorage.removeItem('isWin', isWin);
    localStorage.removeItem('isLose', isLose);
    localStorage.setItem('isSaved', isSaved);
    if (isWin) localStorage.setItem('score', JSON.stringify(score));
  }
});

function saveField(field) {
  if (field) localStorage.setItem('field', field.outerHTML);
}

function getField() {
  const strField = localStorage.getItem('field');
  const field = document.createElement('div');
  field.innerHTML = strField;
  return field.firstChild;
}

function isExist(checkArr, cell) {
  return checkArr.find((c) => Number(c[0]) === Number(cell.dataset.y) && Number(c[1]) === Number(cell.dataset.x)) || false;
}

export { Field };
