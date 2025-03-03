import "./assets/css/global.css";

import { signal } from "@preact/signals";
import { render } from "preact";
import { useState } from "preact/hooks";

import { AsciiOutput } from "./components/AsciiOutput";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { SettingsPanel } from "./components/SettingsPanel";
import { processImage } from "./utils/asciiConverter";

export const imageData = signal<string | null>(null);
export const asciiArt = signal<string>("");
export const coloredAscii = signal<boolean>(false);
export const resolution = signal<number>(0.3);
export const contrast = signal<number>(1);
export const brightness = signal<number>(1);
export const inverted = signal<boolean>(false);

export function App() {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleImageUpload = (dataUrl: string) => {
		imageData.value = dataUrl;
		generateAscii();
	};

	const generateAscii = async () => {
		if (!imageData.value) return;

		setIsProcessing(true);
		try {
			const result = await processImage(
				imageData.value,
				resolution.value,
				contrast.value,
				brightness.value,
				inverted.value,
				coloredAscii.value,
			);
			asciiArt.value = result;
		} catch (error) {
			console.error("Error generating ASCII art:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="grow p-4 md:p-6 max-w-7xl mx-auto w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-4 space-y-6">
						<ImageUploader onImageUpload={handleImageUpload} />

						<SettingsPanel
							onSettingsChange={generateAscii}
							isProcessing={isProcessing}
						/>
					</div>

					<div className="lg:col-span-8">
						<AsciiOutput isProcessing={isProcessing} />
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}

render(<App />, document.getElementById("app") as HTMLElement);
