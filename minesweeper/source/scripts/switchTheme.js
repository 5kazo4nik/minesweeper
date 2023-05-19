export function switchTheme(click) {
  let theme = Number(localStorage.getItem('theme')) || 0;
  const themeArr = ['', '_winter', '_spring', '_summer', '_dark'];

  if (click) {
    theme += 1;
    theme = theme > 4 ? 0 : theme;
  }
  console.log(theme);

  const bg = document.querySelector('.bg-gif');
  const game = document.querySelector('.game');
  const headOpt = document.querySelector('.head__opt');
  const btnTheme = document.querySelector('.head__theme');
  const count = document.querySelector('.count');
  const btnRestart = document.querySelector('.btn-restart');
  const field = document.querySelector('.field');
  const cells = document.querySelectorAll('.cell');
  const result = document.querySelector('.result');
  const resultItems = document.querySelectorAll('.result__item');
  const modalWindow = document.querySelector('.modal__window');

  if (theme > 0) {
    // const nodes = [bg, game, headOpt, btnTheme, count, btnRestart, field, result]
    // nodes.forEach((node) => {
    //   node.classList.add()
    // })
    bg.classList.add(`bg-gif${themeArr[theme]}`);
    game.classList.add(`game${themeArr[theme]}`);
    headOpt.classList.add(`head__opt${themeArr[theme]}`);
    btnTheme.classList.add(`head__theme${themeArr[theme]}`);
    count.classList.add(`count${themeArr[theme]}`);
    btnRestart.classList.add(`btn-restart${themeArr[theme]}`);
    field.classList.add(`field${themeArr[theme]}`);
    cells.forEach((cell) => cell.classList.add(`cell${themeArr[theme]}`));
    if (result) result.classList.add(`result${themeArr[theme]}`);
    if (result) resultItems.forEach((item) => item.classList.add(`result__item${themeArr[theme]}`));
    if (modalWindow) modalWindow.classList.add(`modal__window${themeArr[theme]}`);
  }
  themeArr.forEach((name, index) => {
    if (index !== 0 && index !== theme) {
      bg.classList.remove(`bg-gif${name}`);
      game.classList.remove(`game${name}`);
      headOpt.classList.remove(`head__opt${name}`);
      btnTheme.classList.remove(`head__theme${name}`);
      count.classList.remove(`count${name}`);
      btnRestart.classList.remove(`btn-restart${name}`);
      field.classList.remove(`field${name}`);
      cells.forEach((cell) => cell.classList.remove(`cell${name}`));
      if (result) result.classList.remove(`result${name}`);
      if (result) resultItems.forEach((item) => item.classList.remove(`result__item${name}`));
      if (modalWindow) modalWindow.classList.remove(`modal__window${name}`);
    }
  });
  localStorage.setItem('theme', theme);
  // bg.classList.toggle('bg-gif_dark');
  // e.target.classList.toggle('head__theme_dark');
  // isDark = !isDark;
}
