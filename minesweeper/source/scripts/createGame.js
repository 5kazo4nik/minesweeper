import { Field } from './createField';
import { Options } from './createOpt';
import { setScore } from './setScore';
import { switchTheme } from './switchTheme';
import { createNode, insertNode } from './useNode';

import water from '../assets/sound/Вода.mp3';
import fire from '../assets/sound/Костер.mp3';
import wind from '../assets/sound/ветер.mp3';
import bells from '../assets/sound/колокольчики.mp3';
import birds from '../assets/sound/птицы.mp3';

// Класс для создания игры
class Game {
  // Создает и добавляет нужные элементы друг в друга и в документ. Меняет тему на сохраненную, запускает фоновую музыку
  build() {
    this._createElements();
    this._appendElements();
    this._bindEvents();
    switchTheme(false);
    playBg();
  }

  _createElements() {
    this.bg = createNode('div', 'bg-gif');
    this.main = createNode('main', 'wrapper');
    this.game = createNode('div', 'game');

    const builderField = new Field(fieldSize, mines, isChange);
    const builderOptions = new Options(fieldSize, mines);

    this.options = builderOptions.build();
    this.field = builderField.build();

    if (score.length > 0) {
      this.gameResult = createNode('div', 'game__result');
      this.result = createNode('div', 'result');
      this.heading = createNode('h2', 'result__heading');
      this.list = createNode('ol', 'result__list');
    }
  }

  _appendElements() {
    if (score.length > 0) {
      for (let i = 0; i < score.length; i++) {
        const item = createNode('li', 'result__item');
        insertNode(this.list, item);
      }

      insertNode(this.heading, 'Score');
      insertNode(this.result, this.heading);
      insertNode(this.result, this.list);
      insertNode(this.gameResult, this.result);
    }

    insertNode(this.game, this.options);
    insertNode(this.game, this.field);
    if (score.length > 0) insertNode(this.game, this.gameResult);

    insertNode(this.main, this.game);
    insertNode(document.body, this.bg);
    insertNode(document.body, this.main);

    this._setScore();
  }

  _bindEvents() {
    this.game.addEventListener('contextmenu', (e) => e.preventDefault()); // Запрещает контекстное меню на поле

    const select = document.querySelector('.head__size'); // Пересоздает поле с определенным количеством ячеек и оставляет текущую тему
    const changeLevel = this._changeLevel.bind(this);
    select.addEventListener('input', (e) => {
      changeLevel(e);
      switchTheme(false);
    });

    const input = document.querySelector('.head__mines'); // Пересоздает поле с определенным количеством мин и оставляет текущую тему
    const changeMines = this._changeMines.bind(this);
    input.addEventListener('change', (e) => {
      changeMines(e);
      switchTheme(false);
    });

    const themeBtn = document.querySelector('.head__theme'); // Меняет тему, сохраняет номер темы и запускает фоновый звук
    themeBtn.addEventListener('click', () => {
      switchTheme(true);
      theme = Number(localStorage.getItem('theme')) || 0;
      playBg();
    });

    const soundBtn = document.querySelector('.head__sound'); // Включает или выключает звуки
    soundBtn.addEventListener('click', (e) => {
      e.target.classList.toggle('head__sound_off');
      playBg();
    });

    audioBg.addEventListener('ended', playBg); // Перезапускает фон если закончился

    // Удаляет модальное окно из документа
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.remove();
      }
    });

    window.addEventListener('resize', () => {
      const cell = document.querySelector('.cell');
      const cellStyle = getComputedStyle(cell);
      const result = document.querySelector('.result');
      const cellWidth = cellStyle.width;
      result.style.width = `${cellWidth.slice(0, cellWidth.length - 2) * fieldSize + 6 * fieldSize + 8}px`;
    });

    // сохраняет количество мин и размер поля
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('mines', mines);
      localStorage.setItem('fieldSize', fieldSize);
    });
  }

  // /////////////////////////////////////////

  // Устанавливает таблицу результатов если результаты имеются.
  _setScore() {
    const score = JSON.parse(localStorage.getItem('score')) || [];
    if (score.length) {
      setScore(score, clicksCounter, secondsCounter, mines, flags, fieldSize);
    }
  }

  // Смена уровня сложности с изменением поля, количества мин и изменением размера таблицы результатов и перезапуском игры
  _changeLevel(e) {
    isChange = true;
    let builderField;
    const inputMines = document.querySelector('.head__mines');
    if (e.target.value === '10') {
      fieldSize = 10;
      mines = 10;
      inputMines.value = 10;
    }
    if (e.target.value === '15') {
      fieldSize = 15;
      mines = 40;
      inputMines.value = 40;
    }
    if (e.target.value === '25') {
      fieldSize = 25;
      mines = 99;
      inputMines.value = 99;
    }

    builderField = new Field(fieldSize, mines, isChange, false);
    const newField = builderField.build();
    document.querySelector('.game__content').replaceWith(newField);
    isChange = false;
    this._setScore();
  }

  // Изменяет количество мин и перезапускает игру
  _changeMines(e) {
    const value = Number(e.target.value);
    const select = document.querySelector('.head__size');
    if (value > 99) {
      mines = 99;
    } else if (value < 10) {
      mines = 10;
    } else {
      mines = value;
    }
    e.target.value = mines;
    isChange = true;
    const builderField = new Field(Number(select.value), mines, isChange, false);
    const newField = builderField.build();
    document.querySelector('.game__content').replaceWith(newField);
    isChange = false;
    this._setScore();
  }
}

// Запускает фоновый звук если разрешено.
function playBg() {
  const soundBtn = document.querySelector('.head__sound');
  if (!soundBtn.classList.contains('head__sound_off')) {
    if (theme === 0) {
      audioBg.src = water;
    }
    if (theme === 1) {
      audioBg.src = bells;
    }
    if (theme === 2) {
      audioBg.src = birds;
    }
    if (theme === 3) {
      audioBg.src = wind;
    }
    if (theme === 4) {
      audioBg.src = fire;
    }
    audioBg.autoplay = true;
    audioBg.currentTime = 0;
    audioBg.volume = 0.1;
    audioBg.play();
  } else {
    audioBg.pause();
  }
}

const audioBg = new Audio();
let isChange = false; // Флаг было ли изменение количества мин или ячеек.
let mines = Number(localStorage.getItem('mines')) || 10; // Количество мин
let fieldSize = Number(localStorage.getItem('fieldSize')) || 10; // Размер поля

const score = JSON.parse(localStorage.getItem('score')) || []; // Массив со строками сохраненных результатов
const clicksCounter = Number(localStorage.getItem('clicksCounter')) || 0; // Количество кликов
const secondsCounter = Number(localStorage.getItem('secondsCounter')) || 0; // Количество секунд
const flags = Number(localStorage.getItem('flags')) || 0; // Количество флажков

let theme = Number(localStorage.getItem('theme')) || 0; // Номер текущей темы

export { Game };
