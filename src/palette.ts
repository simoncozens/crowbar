export const palette = [
  "#C23B23",
  "#c79c52",
  "#857b2a",
  "#03C03C",
  "#579ABE",
  "#976ED7",
];

export const paletteFor = (id: number) => palette[id % palette.length];
