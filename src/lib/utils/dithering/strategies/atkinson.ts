import type { DitheringStrategy } from "../types"

export class AtkinsonDithering implements DitheringStrategy {
  dithering(
    imageArray: number[],
    width: number,
    height: number,
    quantizationLevels: number,
  ): void {
    const scale = 255 / (quantizationLevels - 1)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x

        const oldPixel = imageArray[i]
        const newPixel = Math.round(oldPixel / scale) * scale
        const error = oldPixel - newPixel

        imageArray[i] = newPixel

        if (x + 1 < width) imageArray[y * width + (x + 1)] += (error * 1) / 8
        if (x + 2 < width) imageArray[y * width + (x + 2)] += (error * 1) / 8
        if (y + 1 < height && x > 0) imageArray[(y + 1) * width + (x - 1)] += (error * 1) / 8
        if (y + 1 < height) imageArray[(y + 1) * width + x] += (error * 1) / 8
        if (y + 1 < height && x + 1 < width) imageArray[(y + 1) * width + (x + 1)] += (error * 1) / 8
        if (y + 2 < height) imageArray[(y + 2) * width + x] += (error * 1) / 8
      }
    }

    for (let i = 0; i < imageArray.length; i++)
      imageArray[i] = Math.max(0, Math.min(255, imageArray[i]))
  }
}
