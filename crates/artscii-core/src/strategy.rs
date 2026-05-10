#[cfg(feature = "cli")]
use clap::ValueEnum;

#[derive(Debug, Clone, Copy, Default)]
#[cfg_attr(feature = "cli", derive(ValueEnum))]
pub enum DitheringStrategy {
    #[default]
    None,
    FloydSteinberg,
    Atkinson,
    Riemersma,
}

impl DitheringStrategy {
    pub fn apply(&self, grayscale: &mut [f32], width: usize, height: usize, levels: usize) {
        match self {
            DitheringStrategy::None => {}
            DitheringStrategy::FloydSteinberg => floyd_steinberg(grayscale, width, height, levels),
            DitheringStrategy::Atkinson => atkinson(grayscale, width, height, levels),
            DitheringStrategy::Riemersma => riemersma(grayscale, width, height, levels),
        }
    }
}

fn floyd_steinberg(image: &mut [f32], width: usize, height: usize, levels: usize) {
    let scale = 255.0 / (levels - 1) as f32;

    for y in 0..height {
        for x in 0..width {
            let i = y * width + x;

            let old_pixel = image[i];
            let new_pixel = (old_pixel / scale).round() * scale;
            let error = old_pixel - new_pixel;

            image[i] = new_pixel;

            if x + 1 < width {
                image[y * width + (x + 1)] += error * 7.0 / 16.0;
            }
            if y + 1 < height {
                if x > 0 {
                    image[(y + 1) * width + (x - 1)] += error * 3.0 / 16.0;
                }
                image[(y + 1) * width + x] += error * 5.0 / 16.0;
                if x + 1 < width {
                    image[(y + 1) * width + (x + 1)] += error * 1.0 / 16.0;
                }
            }
        }
    }

    for pixel in image.iter_mut() {
        *pixel = pixel.clamp(0.0, 255.0);
    }
}

fn atkinson(image: &mut [f32], width: usize, height: usize, levels: usize) {
    let scale = 255.0 / (levels - 1) as f32;

    for y in 0..height {
        for x in 0..width {
            let i = y * width + x;

            let old_pixel = image[i];
            let new_pixel = (old_pixel / scale).round() * scale;
            let error = old_pixel - new_pixel;
            let error_fraction = error / 8.0;

            image[i] = new_pixel;

            if x + 1 < width {
                image[y * width + (x + 1)] += error_fraction;
            }
            if x + 2 < width {
                image[y * width + (x + 2)] += error_fraction;
            }
            if y + 1 < height {
                if x > 0 {
                    image[(y + 1) * width + (x - 1)] += error_fraction;
                }
                image[(y + 1) * width + x] += error_fraction;
                if x + 1 < width {
                    image[(y + 1) * width + (x + 1)] += error_fraction;
                }
            }
            if y + 2 < height {
                image[(y + 2) * width + x] += error_fraction;
            }
        }
    }

    for pixel in image.iter_mut() {
        *pixel = pixel.clamp(0.0, 255.0);
    }
}

fn riemersma(image: &mut [f32], width: usize, height: usize, levels: usize) {
    let scale = 255.0 / (levels - 1) as f32;
    let total_pixels = width * height;
    let mut visited = vec![false; total_pixels];
    let mut error = 0.0f32;

    let directions: [(i32, i32); 8] = [
        (0, 1),
        (1, 0),
        (0, -1),
        (-1, 0),
        (1, 1),
        (1, -1),
        (-1, -1),
        (-1, 1),
    ];

    let mut row: i32 = 0;
    let mut col: i32 = 0;
    visited[0] = true;

    for _ in 0..total_pixels {
        let idx = (row as usize) * width + (col as usize);
        let old_pixel = image[idx] + error;
        let new_pixel = (old_pixel / scale).round() * scale;

        error = old_pixel - new_pixel;
        image[idx] = new_pixel;

        for &(dr, dc) in &directions {
            let new_row = row + dr;
            let new_col = col + dc;

            if new_row >= 0 && new_row < height as i32 && new_col >= 0 && new_col < width as i32 {
                let new_idx = (new_row as usize) * width + (new_col as usize);
                if !visited[new_idx] {
                    row = new_row;
                    col = new_col;
                    visited[new_idx] = true;
                    break;
                }
            }
        }
    }

    for pixel in image.iter_mut() {
        *pixel = pixel.clamp(0.0, 255.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_floyd_steinberg_clamps_values() {
        let mut data = vec![0.0, 128.0, 255.0, 64.0];
        floyd_steinberg(&mut data, 2, 2, 2);
        assert!(data.iter().all(|&x| (0.0..=255.0).contains(&x)));
    }

    #[test]
    fn test_atkinson_clamps_values() {
        let mut data = vec![0.0, 128.0, 255.0, 64.0];
        atkinson(&mut data, 2, 2, 2);
        assert!(data.iter().all(|&x| (0.0..=255.0).contains(&x)));
    }

    #[test]
    fn test_riemersma_clamps_values() {
        let mut data = vec![0.0, 128.0, 255.0, 64.0];
        riemersma(&mut data, 2, 2, 2);
        assert!(data.iter().all(|&x| (0.0..=255.0).contains(&x)));
    }
}
