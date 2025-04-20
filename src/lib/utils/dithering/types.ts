export interface DitheringStrategy {
  dithering(
    imageArray: number[],
    width: number,
    height: number,
    quantizationLevels: number,
  ): void
}

export type StrategyName =
  | "none"
  | "atkinson"
  | "floyd-steinberg"
  | "riemersma"
