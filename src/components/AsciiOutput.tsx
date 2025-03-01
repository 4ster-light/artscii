import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "preact/hooks";
import { asciiArt, coloredAscii } from "../main";

interface AsciiOutputProps {
	isProcessing: boolean;
}

export function AsciiOutput({ isProcessing }: AsciiOutputProps) {
	const outputRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [isFullscreen, setIsFullscreen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsFullscreen(document.fullscreenElement !== null);
		};

		document.addEventListener("fullscreenchange", handleResize);
		return () => {
			document.removeEventListener("fullscreenchange", handleResize);
		};
	}, []);

	const downloadAsPng = async () => {
		if (!outputRef.current || !asciiArt.value) return;

		try {
			const dataUrl = await toPng(outputRef.current, {
				backgroundColor: coloredAscii.value ? "#1e1e2e" : "#1e1e2e",
				style: {
					transform: "scale(1)",
					transformOrigin: "top left",
				},
			});

			const link = document.createElement("a");
			link.download = "ascii-art.png";
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error("Error downloading image:", error);
		}
	};

	const downloadAsText = () => {
		if (!asciiArt.value) return;

		const blob = new Blob([asciiArt.value], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.download = "ascii-art.txt";
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	};

	const toggleFullscreen = () => {
		if (!outputRef.current) return;

		if (!document.fullscreenElement) {
			outputRef.current.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<div className="card h-full flex flex-col">
			<div className="p-5 border-b border-surface0 flex flex-wrap items-center justify-between gap-2">
				<h2 className="text-xl font-semibold text-lavender">ASCII Output</h2>

				<div className="flex items-center space-x-2">
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={scale}
						onChange={(e) =>
							setScale(Number.parseFloat((e.target as HTMLInputElement).value))
						}
						className="w-24"
						title="Adjust size"
						disabled={!asciiArt.value || isProcessing}
					/>

					<button
						onClick={toggleFullscreen}
						className="btn"
						disabled={!asciiArt.value || isProcessing}
						title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
					>
						{isFullscreen ? "Exit" : "Fullscreen"}
					</button>

					<button
						onClick={downloadAsPng}
						className="btn"
						disabled={!asciiArt.value || isProcessing}
						title="Download as PNG"
					>
						PNG
					</button>

					<button
						onClick={downloadAsText}
						className="btn"
						disabled={!asciiArt.value || isProcessing}
						title="Download as Text"
					>
						TXT
					</button>
				</div>
			</div>

			<div className="grow p-4 overflow-auto relative">
				{isProcessing && (
					<div className="absolute inset-0 bg-base/80 flex items-center justify-center z-10">
						<div className="text-mauve text-lg">Processing...</div>
					</div>
				)}

				{asciiArt.value ? (
					<div
						ref={outputRef}
						className="ascii-output mx-auto"
						style={{
							transform: `scale(${scale})`,
							transformOrigin: "top left",
							color: coloredAscii.value ? undefined : "var(--text)",
						}}
						dangerouslySetInnerHTML={{ __html: asciiArt.value }}
					/>
				) : (
					<div className="h-full flex flex-col items-center justify-center text-center p-6">
						<div className="text-4xl text-mauve mb-4">@</div>
						<p className="text-subtext0 mb-2">
							Upload an image to generate ASCII art
						</p>
						<p className="text-sm text-overlay0">
							Adjust the settings to customize the output
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
