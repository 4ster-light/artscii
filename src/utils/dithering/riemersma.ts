import type { DitheringStrategy } from "./ditheringStrategy";

export class RiemersmaDithering implements DitheringStrategy {
	dithering(
		imageArray: number[],
		width: number,
		height: number,
		quantizationLevels: number,
	): void {
		const scale = 255 / (quantizationLevels - 1);
		const visited = new Array(height * width).fill(false);
		let error = 0;

		// Spiral directions (8-connected neighborhood)
		const spiralDirections = [
			[0, 1], // right
			[1, 0], // down
			[0, -1], // left
			[-1, 0], // up
			[1, 1], // down-right
			[1, -1], // down-left
			[-1, -1], // up-left
			[-1, 1], // up-right
		];

		let row = 0;
		let col = 0;
		visited[row * width + col] = true;

		for (let i = 0; i < height * width; i++) {
			const idx = row * width + col;
			const oldPixel = imageArray[idx] + error;
			const newPixel = Math.round(oldPixel / scale) * scale;
			error = oldPixel - newPixel;
			imageArray[idx] = newPixel;

			// Find next unvisited pixel in spiral pattern
			for (const [dr, dc] of spiralDirections) {
				const newRow = row + dr;
				const newCol = col + dc;
				const newIdx = newRow * width + newCol;

				if (
					newRow >= 0 &&
					newRow < height &&
					newCol >= 0 &&
					newCol < width &&
					!visited[newIdx]
				) {
					row = newRow;
					col = newCol;
					visited[newIdx] = true;
					break;
				}
			}
		}

		// Clamp values to 0-255 range
		for (let i = 0; i < imageArray.length; i++) {
			imageArray[i] = Math.max(0, Math.min(255, imageArray[i]));
		}
	}
}
