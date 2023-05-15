export function playSound(src, volume) {
  const sound = new Audio();
  sound.src = src;
  sound.volume = volume;
  sound.play();
}
