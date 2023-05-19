import { createNode, insertNode } from './useNode';

// Функция изменения результатов на странице и ограничения страницы по ширине ячеек.
export function setScore(score, cliks, seconds, mines, flags, fieldSize, isWin = false) {
  if (isWin) score.unshift(`Steps: ${cliks}. Time: ${seconds} seconds. Flags: ${mines - flags}. Field: ${fieldSize}x${fieldSize}. Mines: ${mines}`);
  if (score.length > 10) score.pop();
  createScore(score);

  const cell = document.querySelector('.cell');
  const list = Array.from(document.querySelectorAll('.result__item'));
  const cellStyle = getComputedStyle(cell);
  const result = document.querySelector('.result');
  const cellWidth = cellStyle.width;
  result.style.width = `${cellWidth.slice(0, cellWidth.length - 2) * fieldSize + 6 * fieldSize + 8}px`;
  score.forEach((el, index) => {
    list[index].textContent = el;
  });
}

// Функция создания таблицы с результатами и добавления их на страницу.
function createScore(score) {
  const gameResult = createNode('div', 'game__result');
  const result = createNode('div', 'result');
  const heading = createNode('h2', 'result__heading');
  const list = createNode('ol', 'result__list');
  const game = document.querySelector('.game');
  const prevGameResult = document.querySelector('.game__result');

  for (let i = 0; i < score.length; i++) {
    const item = createNode('li', 'result__item');
    insertNode(list, item);
  }
  insertNode(heading, 'Score');
  insertNode(result, heading);
  insertNode(result, list);
  insertNode(gameResult, result);
  if (prevGameResult) {
    prevGameResult.replaceWith(gameResult);
  } else {
    insertNode(game, gameResult);
  }
}
