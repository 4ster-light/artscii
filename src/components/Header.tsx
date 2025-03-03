import GithubIcon from "../assets/img/GithubIcon.svg";
import TwitterIcon from "../assets/img/TwitterIcon.svg";

export function Header() {
	return (
		<header className="bg-mantle border-b border-surface0 py-4 px-6">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
				<div className="flex items-center mb-4 sm:mb-0">
					<h1 className="text-2xl font-bold bg-gradient-to-r from-mauve to-blue bg-clip-text text-transparent">
						✰ArtSCII✰
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<a
						href="https://x.com/4ster_light"
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors"
						aria-label="Twitter"
					>
						<img
							src={TwitterIcon}
							alt="Twitter"
							className="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90"
						/>
					</a>
					<a
						href="https://github.com/4ster-light/artscii"
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors"
						aria-label="GitHub"
					>
						<img
							src={GithubIcon}
							alt="GitHub"
							className="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90"
						/>
					</a>
				</div>
			</div>
		</header>
	);
}
