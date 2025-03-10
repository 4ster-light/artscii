import { defineStore } from "pinia";
import { processImage } from "../utils/asciiConverter.ts";
import { getDitheringStrategy } from "../utils/dithering/utils";

export const useAsciiStore = defineStore("ascii", {
	state: () => ({
		imageData: null as string | null,
		asciiArt: "",
		coloredAscii: false,
		resolution: 0.3,
		contrast: 1,
		brightness: 1,
		inverted: false,
		isProcessing: false,
		ditheringStrategy: "none",
	}),

	actions: {
		async setImage(dataUrl: string) {
			this.imageData = dataUrl;
			await this.generateAscii();
		},

		async generateAscii() {
			if (!this.imageData) return;

			this.isProcessing = true;
			try {
				const ditheringStrategy = getDitheringStrategy(this.ditheringStrategy);
				const newAscii = await processImage(
					this.imageData,
					this.resolution,
					this.contrast,
					this.brightness,
					this.inverted,
					this.coloredAscii,
					ditheringStrategy,
				);
				this.asciiArt = newAscii;
			} catch (error) {
				console.error("Error generating ASCII art:", error);
			} finally {
				this.isProcessing = false;
			}
		},
	},
});
