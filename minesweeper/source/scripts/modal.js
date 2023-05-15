import { createNode, insertNode } from './useNode';

export class Modal {
  constructor(isWin, isLose, seconds, clicks) {
    this.isWin = isWin;
    this.isLose = isLose;
    this.seconds = seconds;
    this.clicks = clicks;
  }

  build() {
    this._createElements();
    this._insertNodes();
    return this.modal;
  }

  _createElements() {
    this.modal = createNode('div', 'modal');
    this.window = createNode('div', 'modal__window');
    this.heading = createNode('h3', 'modal__heading');
    this.text = createNode('p', 'modal__text');
    this.img = createNode('div', 'modal__img');
    if (this.isLose) this.img.classList.add('modal__img_lose');
    if (this.isWin) this.img.classList.add('modal__img_win');
  }

  _insertNodes() {
    if (this.isWin) {
      this.heading.textContent = 'Hooray!';
      this.text.textContent = `You found all mines in ${this.seconds} seconds and ${this.clicks} moves!`;
    }
    if (this.isLose) {
      this.heading.textContent = 'Game over...';
      this.text.textContent = `You make mistake in ${this.seconds} seconds and ${this.clicks} moves...`;
    }
    insertNode(this.window, this.heading);
    insertNode(this.window, this.text);
    insertNode(this.window, this.img);
    insertNode(this.modal, this.window);
  }
}
