function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeWithMargin(initial: number, margin: number, signed: boolean = false): number {
  const min: number = initial - margin;
  const max: number = initial + margin;

  return signed ? Math.max(getRandomInt(min, max), 0) : getRandomInt(min, max);
}

function getAverage(...numbers: number[]): number {
  const total = numbers.reduce((sum, num) => sum + num, 0);
  return numbers.length ? total / numbers.length : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
