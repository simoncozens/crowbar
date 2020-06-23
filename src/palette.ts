export var palette = [
"#ffb3ba",
"#ffdfba",
"#ffffba",
"#baffc9",
"#bae1ff",
]

export const paletteFor = (id: number) => {
	return palette[id % palette.length];
}
