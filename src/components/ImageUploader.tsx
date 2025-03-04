import { useRef } from "preact/hooks";
import { imageData } from "../main";

interface ImageUploaderProps {
	onImageUpload: (dataUrl: string) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const dataUrl = event.target?.result as string;
				onImageUpload(dataUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer?.files?.length) {
			const file = e.dataTransfer.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				const dataUrl = event.target?.result as string;
				onImageUpload(dataUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="card p-5">
			<h2 className="text-xl font-semibold mb-4 text-lavender">Upload Image</h2>

			<div
				className="border-2 border-dashed border-surface2 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-mauve"
				onClick={triggerFileInput}
				onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
			>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/*"
					onChange={handleFileChange}
				/>

				{imageData.value ? (
					<div className="space-y-4">
						<img
							src={imageData.value}
							alt="Uploaded content"
							className="max-h-48 mx-auto object-contain rounded-sm"
						/>
						<p className="text-subtext0">Click or drag to replace</p>
					</div>
				) : (
					<div className="py-8 space-y-2">
						<div className="text-4xl text-mauve mb-2">@</div>
						<p className="text-subtext0">
							Click to select or drag an image here
						</p>
						<p className="text-sm text-overlay0">
							Supports JPG, PNG, GIF, etc.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
