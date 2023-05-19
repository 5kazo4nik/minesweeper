// Функция для запуска определенного звука с определенной громкостью
export function playSound(src, volume = 0.4) {
  const sound = new Audio();
  sound.src = src;
  sound.volume = volume;
  sound.play();
}
