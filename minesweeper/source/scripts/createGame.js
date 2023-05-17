import { Field } from './createField';
import { Options } from './createOpt';
import { setScore } from './setScore';
import { createNode, insertNode } from './useNode';

class Game {
  build() {
    this._createElements();
    this._appendElements();
    this._bindEvents();
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
    select.addEventListener('input', changeLevel);

    const input = document.querySelector('.head__mines');
    const changeMines = this._changeMines.bind(this);
    input.addEventListener('change', changeMines);

    const themeBtn = document.querySelector('.head__theme');
    themeBtn.addEventListener('click', this._switchTheme);

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
      // builderField = new Field(10, 10, isChange);
      fieldSize = 10;
      mines = 10;
      inputMines.value = 10;
    }
    if (e.target.value === '15') {
      // builderField = new Field(15, 40, isChange);
      fieldSize = 15;
      mines = 40;
      inputMines.value = 40;
    }
    if (e.target.value === '25') {
      // builderField = new Field(25, 100, isChange);
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
    // let mines;
    // if (select.value === '10') {
    //   if (value > 99) {
    //     mines = 99;
    //   } else {
    //     mines = value;
    //   }
    // } else if (select.value === '15') {
    //   if (value > 224) {
    //     mines = 224;
    //   } else {
    //     mines = value;
    //   }
    // } else if (select.value === '25') {
    //   if (value > 624) {
    //     mines = 624;
    //   } else {
    //     mines = value;
    //   }
    // }
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

  _switchTheme(e) {
    const bg = document.querySelector('.bg-gif');
    bg.classList.toggle('bg-gif_dark');
    e.target.classList.toggle('head__theme_dark');
    isDark = !isDark;
    playBg();
  }
}

// function playBg() {
//   if (isDark) {
//     playSound('../assets/sound/Костер.mp3', 0.1);
//   } else {
//     playSound('../assets/sound/Вода.mp3', 0.1);
//   }
// }
function playBg() {
  const soundBtn = document.querySelector('.head__sound');
  if (!soundBtn.classList.contains('head__sound_off')) {
    if (isDark) {
      audioBg.src = '../assets/sound/Костер.mp3';
    } else {
      audioBg.src = '../assets/sound/Вода.mp3';
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

export { Game };
