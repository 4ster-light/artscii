import { AtkinsonDithering } from "./atkinson";
import type { DitheringStrategy } from "./ditheringStrategy";
import { FloydSteinbergDithering } from "./floydSteinberg";
import { RiemersmaDithering } from "./riemersma";

export const availableStrategies = [
	{ value: "none", label: "No Dithering" },
	{ value: "atkinson", label: "Atkinson" },
	{ value: "floyd-steinberg", label: "Floyd-Steinberg" },
	{ value: "riemersma", label: "Riemersma" },
];

export function getDitheringStrategy(name: string): DitheringStrategy | null {
	switch (name) {
		case "atkinson":
			return new AtkinsonDithering();
		case "floyd-steinberg":
			return new FloydSteinbergDithering();
		case "riemersma":
			return new RiemersmaDithering();
		case "none":
			return null;
		default:
			return null;
	}
}
