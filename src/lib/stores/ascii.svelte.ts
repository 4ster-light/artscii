import { processImage } from "$lib/utils/asciiConverter"
import { getDitheringStrategy } from "$lib/utils/dithering"
import type { StrategyName } from "$lib/utils/dithering/types"

export const ascii = $state({
  imageData: null as string | null,
  asciiArt: "",
  coloredAscii: false,
  resolution: 0.3,
  contrast: 1,
  brightness: 1,
  inverted: false,
  isProcessing: false,
  ditheringStrategy: "none" as StrategyName,
})

export async function setImage(dataUrl: string) {
  ascii.imageData = dataUrl
  await generateAscii()
}

export async function generateAscii() {
  if (!ascii.imageData) return

  ascii.isProcessing = true
  const ditheringStrategy = getDitheringStrategy(ascii.ditheringStrategy)

  ascii.asciiArt = await processImage(
    ascii.imageData,
    ascii.resolution,
    ascii.contrast,
    ascii.brightness,
    ascii.inverted,
    ascii.coloredAscii,
    ditheringStrategy,
  ).catch((e: Error) => {
    console.error("Error generating ASCII art:", e.message)
    return ""
  }).finally(() => {
    ascii.isProcessing = false
  })
}
