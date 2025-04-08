export const getRandomIndex = (max: number, exclude: number[] = []) => {
  if (exclude.length >= max) return 0;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * max);
  } while (exclude.includes(randomIndex));
  return randomIndex;
};
