import { Field } from './createField';
import { Options } from './createOpt';
import { setScore } from './setScore';
import { switchTheme } from './switchTheme';
import { createNode, insertNode } from './useNode';

class Game {
  build() {
    this._createElements();
    this._appendElements();
    this._bindEvents();
    // this._switchTheme()
    switchTheme(false);
    playBg();
  }

  _createElements() {
    this.bg = createNode('div', 'bg-gif');
    if (isDark) this.bg.classList.add('bg-gif_dark');
    this.main = createNode('main', 'wrapper');
    this.game = createNode('div', 'game');

    const builderField = new Field(fieldSize, mines, isChange);
    const builderOptions = new Options(fieldSize, mines, isDark);

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
    this.game.addEventListener('contextmenu', (e) => e.preventDefault());

    const select = document.querySelector('.head__size');
    const changeLevel = this._changeLevel.bind(this);
    select.addEventListener('input', (e) => {
      changeLevel(e);
      switchTheme(false);
    });

    const input = document.querySelector('.head__mines');
    const changeMines = this._changeMines.bind(this);
    input.addEventListener('change', (e) => {
      changeMines(e);
      switchTheme(false);
    });

    const themeBtn = document.querySelector('.head__theme');
    themeBtn.addEventListener('click', () => {
      switchTheme(true);
      theme = Number(localStorage.getItem('theme')) || 0;
      playBg();
    });

    const soundBtn = document.querySelector('.head__sound');
    soundBtn.addEventListener('click', (e) => {
      e.target.classList.toggle('head__sound_off');
      playBg();
    });

    audioBg.addEventListener('ended', playBg);

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.remove();
      }
    });

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('isDark', isDark);
      localStorage.setItem('mines', mines);
      localStorage.setItem('fieldSize', fieldSize);
    });
  }

  // /////////////////////////////////////////

  _setScore() {
    if (score.length) {
      setScore(score, clicksCounter, secondsCounter, mines, flags, fieldSize);
    }
  }

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

function playBg() {
  const soundBtn = document.querySelector('.head__sound');
  if (!soundBtn.classList.contains('head__sound_off')) {
    if (theme === 0) {
      audioBg.src = '../assets/sound/Вода.mp3';
    }
    if (theme === 1) {
      audioBg.src = '../assets/sound/колокольчики.mp3';
    }
    if (theme === 2) {
      audioBg.src = '../assets/sound/птицы.mp3';
    }
    if (theme === 3) {
      audioBg.src = '../assets/sound/ветер.mp3';
    }
    if (theme === 4) {
      audioBg.src = '../assets/sound/Костер.mp3';
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
let isChange = false;
let isDark = localStorage.getItem('isDark') === 'true' ? true : false;
let mines = Number(localStorage.getItem('mines')) || 10;
let fieldSize = Number(localStorage.getItem('fieldSize')) || 10;

const score = JSON.parse(localStorage.getItem('score')) || [];
const clicksCounter = Number(localStorage.getItem('clicksCounter')) || 0;
const secondsCounter = Number(localStorage.getItem('secondsCounter')) || 0;
const flags = Number(localStorage.getItem('flags')) || 0;

let theme = Number(localStorage.getItem('theme')) || 0;
// const themeArr = ['', '_winter', '_spring', '_summer', '_dark'];

export { Game };
