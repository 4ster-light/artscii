export function Footer() {
	return (
		<footer className="bg-mantle border-t border-surface0 py-3 px-6 text-center text-subtext0 text-sm">
			<p>
				Built with Preact and Catppuccin Mocha by{" "}
				<span className="text-mauve">✰λster✰</span>, aka David Vivar{" "}
				{`• ${new Date().getFullYear()}`}
			</p>
		</footer>
	);
}
