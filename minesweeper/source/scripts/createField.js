import { Modal } from './modal';
import { playSound } from './playSound';
import { setScore } from './setScore';
import { switchTheme } from './switchTheme';
import { createNode, insertNode } from './useNode';

// Класс создания поля
class Field {
  constructor(num, mines, isChange, save = true) {
    this.numCells = num;
    this.mines = mines;
    this.isChange = isChange;
    this.save = save;
  }

  // Генерирует поле и возвращает обертку.
  build() {
    if (!this.save) {
      isSaved = false;
      savedField = null;
    }
    this._createElements();
    this._appendELements();
    this._updateFlags();
    this._bindEvents();
    return this.gameContent;
  }

  // Создает ячейки и добавляет им нужные классы и атрибуты, возвращает обертку если нет сохраненного поля.
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

  // Обновляет флаги если игра не сохранена.
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
    document.addEventListener('dragstart', (e) => e.preventDefault()); // Запрещает перетаскивать элементы
    document.addEventListener('mouseover', this._hoverOn);
    document.addEventListener('mousedown', this._clickDown);

    if (this.isChange) {
      document.removeEventListener('mouseup', prevClickUp); // Нужно для удаления слушателя с предыдущего поля
    }
    const clickUp = this._clickUp.bind(this);
    prevClickUp = clickUp;
    document.addEventListener('mouseup', clickUp);
  }

  // ///////////////////////////////////////////////////////////////////////

  // Слушатель при событии mouseDown
  _clickDown(e) {
    mouse = true;
    if (e.target.classList.contains('cell')) e.target.classList.add('cell_active');
    if (e.target.classList.contains('btn-restart')) e.target.classList.add('btn-restart_active');
  }

  // Слушатель при событии mouseUp
  _clickUp(e) {
    mouse = false;
    // Пересоздает элементы, удаляет сохраненное поле, убирает флаг сохранения, заменяет текущее поле на новое и оставляет текущую тему.
    if (e.target.classList.contains('btn-restart')) {
      savedField = null;
      isSaved = false;
      e.target.classList.remove('btn-restart_active');
      this._createElements();
      this._appendELements();
      this._updateFlags();
      document.querySelector('.game__content').replaceWith(this.gameContent);
      switchTheme(false);
    }

    // При клике по ячейке если конец игры то останавливает счет секунд.
    if (e.target.classList.contains('cell')) {
      e.target.classList.remove('cell_active');

      if (!e.target.classList.contains('cell_open') && !isWin && !isLose) {
        this._setClicksCount(e);
        this._setOnClick(e);
      }
      if (isWin || isLose) {
        clearInterval(secondsInterval);
      }
      if (isWin) localStorage.setItem('score', JSON.stringify(score));
    }
  }

  // Нужно для анимации перемещения над клетками с зажатой мышкой. На событии mouseMove
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

    // Если правая кнопка мыши то добавляет флажок(если остались) на текущую ячейку и уменьшает количество флажков, если на ячейке был флажок то прибавляет флажок. Выводит на страницу количество флажков и проигрывает звук.
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

    // Если первый клик то устанавливает мины и запускает интервал с секундами.
    if (firstClick) {
      if (e.button !== 2) {
        checkedArr.push([Number(e.target.dataset.y), Number(e.target.dataset.x)]);
      }
      secondsInterval = this._setSecondsInterval();
      this._setMines(field);
    }

    // Запрещает клик по флагу
    if (e.target.classList.contains('cell_flag')) {
      return;
    }

    // Устанавливает цифры и если поблизости нет мин открывает ближайшие ячейки. Запускает звук при клике не на мину.
    const counter = this._setCellValue(field, e.target, rowIndex, cellIndex);
    if (counter === 0) {
      this._openNearCells(field, e.target, rowIndex, cellIndex);
    }
    if (counter >= 0 && !soundBtn.classList.contains('head__sound_off')) {
      playSound('../assets/sound/Клик.mp3', 0.4);
    }

    // Устанавливает флаг победы и проигрывает звук если все продуктивные ячейки открыты
    if (checkedArr.length + minesCoords.length === this.numCells * this.numCells && !isWin) {
      if (!soundBtn.classList.contains('head__sound_off')) playSound('../assets/sound/Победа.mp3', 0.3);
      isWin = true;
    }

    // В случае победы или поражения создает и добавляет модальное окно, убирает флаг сохранения и сохраненное поле
    if (isWin || isLose) {
      const modal = new Modal(isWin, isLose, secondsCounter, clicksCounter);
      document.body.prepend(modal.build());
      switchTheme(false);
      savedField = null;
      isSaved = false;
    }

    // Перерисовывает таблицу результатов при победе
    if (isWin) {
      this._setScore();
    }
    savedField = this.field;
  }

  // Убирает флаг первого клика и добавляет в массив координаты мин так, чтобы не было повторов и расположения на месте первого клика.
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

  // Возвращает значение ячейки при клике в зависимости от количества мин поблизости. Если клик по флажку то ничего не произойдет, при клике по мине будет ячейка изменится и проиграется звук.
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

  // Рекурсивно открывает ячейки покругу если не цифра и не бомба
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

  // Считает клики если ячейка не открыта и на ней нет флага
  _setClicksCount(e) {
    if (!e.target.className.match(/(open|flag)/) && e.button !== 2) {
      clicksCounter += 1;
      const totalClicks = String(clicksCounter).padStart(3, 0);
      this.clicks.textContent = totalClicks;
    }
  }

  // Запускает интервал который считает секунды и выводит на экран
  _setSecondsInterval() {
    return setInterval(() => {
      secondsCounter += 1;
      const totalSeconds = String(secondsCounter).padStart(3, 0);
      this.duration.textContent = totalSeconds;
    }, 1000);
  }

  // Выводит результат с текущей темой
  _setScore() {
    setScore(score, clicksCounter, secondsCounter, this.mines, flags, this.numCells, isWin);
    switchTheme(false);
  }
}

let mouse = false; // Флаг нажата ли мышь
let checkedArr = JSON.parse(localStorage.getItem('checkedArr')) || []; // Массив с массивами координат открытых ячеек
let minesCoords = JSON.parse(localStorage.getItem('minesCoords')) || []; // Массив с массивами координат мин
let savedField = getField('field') || null; // Сохраненное поле
let firstClick = localStorage.getItem('firstClick') === 'true' ? true : false; // Флаг первого клика
let isLose = localStorage.getItem('isLose') === 'true' ? true : false; // Флаг при поражении
let isWin = localStorage.getItem('isWin') === 'true' ? true : false; // Флаг при победе
let prevClickUp; // Флаг для сохранения интервала предыдущего поля, на него ставится bind при генерации нового поля
let clicksCounter = Number(localStorage.getItem('clicksCounter')) || 0; // Количество кликов
let secondsCounter = Number(localStorage.getItem('secondsCounter')) || 0; // Количество секунд
let secondsInterval; // Сохраняет интервал и удаляет при победе или поражении
let flags = Number(localStorage.getItem('flags')) || 0; // Количество флажков
let isSaved = localStorage.getItem('isSaved') === 'true' ? true : false; // Флаг сохранена ли игра
let score = JSON.parse(localStorage.getItem('score')) || []; // Массив со строками текущего счета

// Сохранение данных если нет победы, поражения и был первый клик.
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
  }
});

// Сохраняет все поле как строку.
function saveField(field) {
  if (field) localStorage.setItem('field', field.outerHTML);
}

// Получает поле как dom
function getField() {
  const strField = localStorage.getItem('field');
  const field = document.createElement('div');
  field.innerHTML = strField;
  return field.firstChild;
}

// Функция проверки ячейки, открыта ли она или есть ли там мина.
function isExist(checkArr, cell) {
  return checkArr.find((c) => Number(c[0]) === Number(cell.dataset.y) && Number(c[1]) === Number(cell.dataset.x)) || false;
}

export { Field };
