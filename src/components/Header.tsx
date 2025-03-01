export function Header() {
	return (
		<header className="bg-mantle border-b border-surface0 py-4 px-6">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
				<div className="flex items-center mb-4 sm:mb-0">
					<h1 className="text-2xl font-bold bg-linear-to-r from-mauve to-blue bg-clip-text text-transparent">
						✰ArtSCII✰
					</h1>
				</div>
				<div className="text-subtext0 text-sm">
					Transform images into beautiful ASCII art
				</div>
			</div>
		</header>
	);
}
