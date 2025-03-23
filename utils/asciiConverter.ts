import type { DitheringStrategy } from "./dithering/ditheringStrategy";

const ASCII_CHARS = " .,:;i1tfLCG08@";
const ASCII_CHARS_INVERTED = "@80GCLft1i;:,. ";

function createCanvas(width: number, height: number): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function getPixelBrightness(r: number, g: number, b: number): number {
	return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function adjustPixel(
	value: number,
	contrast: number,
	brightness: number,
): number {
	let adjusted = (value - 128) * contrast + 128; // Apply contrast (0.5-2)
	adjusted = adjusted * brightness; // Apply brightness (0.5-2)
	return Math.max(0, Math.min(255, adjusted)); // Clamp to valid range
}

export const processImage = (
	imageUrl: string,
	resolution = 0.3,
	contrast = 1,
	brightness = 1,
	inverted = false,
	colored = false,
	ditheringStrategy: DitheringStrategy | null = null,
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";

		img.onload = () => {
			try {
				const width = Math.floor(img.width * resolution);
				const height = Math.floor(img.height * resolution * 0.5);

				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Could not get canvas context"));
					return;
				}

				console.log(ditheringStrategy);

				ctx.drawImage(img, 0, 0, width, height);

				const imageData = ctx.getImageData(0, 0, width, height);
				const pixels = imageData.data;

				const chars = inverted ? ASCII_CHARS_INVERTED : ASCII_CHARS;
				const charCount = chars.length - 1;

				const grayscale: number[] = new Array(width * height);
				const colors: [number, number, number][] = colored
					? new Array(width * height)
					: [];

				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const idx = (y * width + x) * 4;
						const [r, g, b] = [0, 1, 2].map((i) =>
							adjustPixel(pixels[idx + i], contrast, brightness),
						);
						const pixelBrightness = getPixelBrightness(r, g, b);
						grayscale[y * width + x] = pixelBrightness;
						if (colored) colors[y * width + x] = [r, g, b];
					}
				}

				if (ditheringStrategy) {
					ditheringStrategy.dithering(grayscale, width, height, charCount);
				}

				let result = "";
				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const i = y * width + x;
						const value = grayscale[i];
						const charIndex = Math.min(
							chars.length - 1,
							Math.floor((value / 255) * charCount),
						);
						const char = chars[charIndex];
						if (colored) {
							const [r, g, b] = colors[i];
							result += `<span style="color: rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})">${char}</span>`;
						} else {
							result += char;
						}
					}
					result += colored ? "<br>" : "\n";
				}

				resolve(result);
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		img.src = imageUrl;
	});
};
