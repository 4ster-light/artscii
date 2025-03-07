import "./assets/css/global.css";

import { signal } from "@preact/signals";
import { render } from "preact";
import { useState } from "preact/hooks";

import { AsciiOutput } from "./components/AsciiOutput.tsx";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { ImageUploader } from "./components/ImageUploader.tsx";
import { SettingsPanel } from "./components/SettingsPanel.tsx";
import { processImage } from "./utils/asciiConverter.ts";

export const imageData = signal<string | null>(null);
export const asciiArt = signal<string>("");
export const coloredAscii = signal<boolean>(false);
export const resolution = signal<number>(0.3);
export const contrast = signal<number>(1);
export const brightness = signal<number>(1);
export const inverted = signal<boolean>(false);

export function App() {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleImageUpload = async (dataUrl: string) => {
		imageData.value = dataUrl;
		await generateAscii();
	};

	const generateAscii = async () => {
		if (!imageData.value) return;

		setIsProcessing(true);
		try {
			asciiArt.value = await processImage(
				imageData.value,
				resolution.value,
				contrast.value,
				brightness.value,
				inverted.value,
				coloredAscii.value,
			);
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
