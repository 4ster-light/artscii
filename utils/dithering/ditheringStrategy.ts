export interface DitheringStrategy {
	dithering(
		imageArray: number[],
		width: number,
		height: number,
		quantizationLevels: number,
	): void
}
