import { AtkinsonDithering } from "./strategies/atkinson"
import { FloydSteinbergDithering } from "./strategies/floydSteinberg"
import { RiemersmaDithering } from "./strategies/riemersma"
import type { DitheringStrategy, StrategyName } from "./types"

export const availableStrategies: StrategyName[] = [
  "none",
  "atkinson",
  "floyd-steinberg",
  "riemersma",
]

export function getDitheringStrategy(
  name: StrategyName,
): DitheringStrategy | null {
  switch (name) {
    case "atkinson":
      return new AtkinsonDithering()
    case "floyd-steinberg":
      return new FloydSteinbergDithering()
    case "riemersma":
      return new RiemersmaDithering()
    case "none":
      return null
    default:
      return null
  }
}
