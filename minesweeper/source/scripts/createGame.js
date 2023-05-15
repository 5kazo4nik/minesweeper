import { Field } from './createField';
import { Options } from './createOpt';
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
    this.main = createNode('main', 'wrapper');
    this.game = createNode('div', 'game');

    const builderField = new Field(10, 10, isChange);
    const builderOptions = new Options(10);

    this.options = builderOptions.build();
    this.field = builderField.build();

    this.gameResult = createNode('div', 'game__result');
    this.result = createNode('div', 'result');
    this.heading = createNode('h2', 'result__heading');
    this.list = createNode('ol', 'result__list');
  }

  _appendElements() {
    for (let i = 0; i < 10; i++) {
      const item = createNode('li', 'result__item');
      insertNode(this.list, item);
    }

    insertNode(this.heading, 'Score');
    insertNode(this.result, this.heading);
    insertNode(this.result, this.list);
    insertNode(this.gameResult, this.result);

    insertNode(this.game, this.options);
    insertNode(this.game, this.field);
    insertNode(this.game, this.gameResult);

    insertNode(this.main, this.game);
    insertNode(document.body, this.bg);
    insertNode(document.body, this.main);
  }

  _bindEvents() {
    this.game.addEventListener('contextmenu', (e) => e.preventDefault());

    const select = document.querySelector('.head__size');
    select.addEventListener('input', this._changeLevel);

    const input = document.querySelector('.head__mines');
    input.addEventListener('change', this._changeMines);

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
  }

  _changeLevel(e) {
    isChange = true;
    let builderField;
    const inputMines = document.querySelector('.head__mines');
    if (e.target.value === '10') {
      builderField = new Field(10, 10, isChange);
      inputMines.value = 10;
    }
    if (e.target.value === '15') {
      builderField = new Field(15, 40, isChange);
      inputMines.value = 40;
    }
    if (e.target.value === '25') {
      builderField = new Field(25, 100, isChange);
      inputMines.value = 100;
    }

    const newField = builderField.build();
    document.querySelector('.game__content').replaceWith(newField);
    isChange = false;
  }

  _changeMines(e) {
    const select = document.querySelector('.head__size');
    let mines;
    const value = Number(e.target.value);
    if (select.value === '10') {
      if (value > 99) {
        mines = 99;
      } else {
        mines = value;
      }
    } else if (select.value === '15') {
      if (value > 224) {
        mines = 224;
      } else {
        mines = value;
      }
    } else if (select.value === '25') {
      if (value > 624) {
        mines = 624;
      } else {
        mines = value;
      }
    }
    isChange = true;
    const builderField = new Field(Number(select.value), mines, isChange);
    const newField = builderField.build();
    document.querySelector('.game__content').replaceWith(newField);
    isChange = false;
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
let isDark = false;

export { Game };
