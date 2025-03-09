import { defineStore } from "pinia";
import { processImage } from "../utils/asciiConverter.ts";

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
				const newAscii = await processImage(
					this.imageData,
					this.resolution,
					this.contrast,
					this.brightness,
					this.inverted,
					this.coloredAscii,
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
