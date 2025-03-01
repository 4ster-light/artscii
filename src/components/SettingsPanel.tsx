import {
	brightness,
	coloredAscii,
	contrast,
	inverted,
	resolution,
} from "../main";

interface SettingsPanelProps {
	onSettingsChange: () => void;
	isProcessing: boolean;
}

export function SettingsPanel({
	onSettingsChange,
	isProcessing,
}: SettingsPanelProps) {
	const handleResolutionChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		resolution.value = Number.parseFloat(target.value);
		onSettingsChange();
	};

	const handleContrastChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		contrast.value = Number.parseFloat(target.value);
		onSettingsChange();
	};

	const handleBrightnessChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		brightness.value = Number.parseFloat(target.value);
		onSettingsChange();
	};

	const handleColoredChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		coloredAscii.value = target.checked;
		onSettingsChange();
	};

	const handleInvertedChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		inverted.value = target.checked;
		onSettingsChange();
	};

	return (
		<div className="card p-5">
			<h2 className="text-xl font-semibold mb-4 text-lavender">Settings</h2>

			<div className="space-y-5">
				<div>
					<label className="flex items-center justify-between mb-2">
						<span className="text-subtext0">Resolution</span>
						<span className="text-sm text-overlay1">
							{Math.round(resolution.value * 100)}%
						</span>
					</label>
					<input
						type="range"
						min="0.1"
						max="1"
						step="0.05"
						value={resolution.value}
						onChange={handleResolutionChange}
						className="w-full"
						disabled={isProcessing}
					/>
					<p className="text-xs text-overlay0 mt-1">
						Higher values create more detailed ASCII art
					</p>
				</div>

				<div>
					<label className="flex items-center justify-between mb-2">
						<span className="text-subtext0">Contrast</span>
						<span className="text-sm text-overlay1">
							{contrast.value.toFixed(1)}x
						</span>
					</label>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={contrast.value}
						onChange={handleContrastChange}
						className="w-full"
						disabled={isProcessing}
					/>
				</div>

				<div>
					<label className="flex items-center justify-between mb-2">
						<span className="text-subtext0">Brightness</span>
						<span className="text-sm text-overlay1">
							{brightness.value.toFixed(1)}x
						</span>
					</label>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={brightness.value}
						onChange={handleBrightnessChange}
						className="w-full"
						disabled={isProcessing}
					/>
				</div>

				<div className="flex items-center justify-between">
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={coloredAscii.value}
							onChange={handleColoredChange}
							className="sr-only"
							disabled={isProcessing}
						/>
						<div
							className={`w-10 h-5 rounded-full ${coloredAscii.value ? "bg-mauve" : "bg-surface1"} relative transition-colors`}
						>
							<div
								className={`absolute w-4 h-4 rounded-full bg-text top-0.5 transition-transform ${coloredAscii.value ? "translate-x-5" : "translate-x-0.5"}`}
							></div>
						</div>
						<span className="ml-2 text-subtext0">Colored output</span>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={inverted.value}
							onChange={handleInvertedChange}
							className="sr-only"
							disabled={isProcessing}
						/>
						<div
							className={`w-10 h-5 rounded-full ${inverted.value ? "bg-mauve" : "bg-surface1"} relative transition-colors`}
						>
							<div
								className={`absolute w-4 h-4 rounded-full bg-text top-0.5 transition-transform ${inverted.value ? "translate-x-5" : "translate-x-0.5"}`}
							></div>
						</div>
						<span className="ml-2 text-subtext0">Invert colors</span>
					</label>
				</div>
			</div>
		</div>
	);
}
