export var palette = [
  "#C23B23",
  "#c79c52",
  "#EADA52",
  "#03C03C",
  "#579ABE",
  "#976ED7",
];

export const paletteFor = (id: number) => {
  return palette[id % palette.length];
};
