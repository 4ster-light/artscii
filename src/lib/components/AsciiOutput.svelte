<script lang="ts">
import { ascii } from "$lib/stores/ascii.svelte";
import { toPng } from "html-to-image";

let scale = $state(1);
let isFullscreen = $state(false);
let outputRef: HTMLDivElement | null = $state(null);

function downloadAsPng() {
	if (!outputRef || !ascii.asciiArt) return;
	toPng(outputRef, {
		backgroundColor: "#000000",
		style: {
			transform: `scale(${scale})`,
			transformOrigin: "top left",
		},
	}).then((dataUrl) => {
		const link = document.createElement("a");
		link.download = "ascii-art.png";
		link.href = dataUrl;
		link.click();
	});
}

function downloadAsText() {
	if (!ascii.asciiArt) return;
	const blob = new Blob([ascii.asciiArt], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.download = "ascii-art.txt";
	link.href = url;
	link.click();
	URL.revokeObjectURL(url);
}

function toggleFullscreen() {
	if (!outputRef) return;
	if (!document.fullscreenElement) {
		outputRef.requestFullscreen().then(() => isFullscreen = true);
	} else {
		document.exitFullscreen().then(() => isFullscreen = false);
	}
}

$effect(() => {
	isFullscreen = document.fullscreenElement !== null;
});
</script>

<div class="card h-full flex flex-col">
  <div
    class="p-5 border-b border-surface0 flex flex-wrap items-center justify-between gap-2"
  >
    <h2 class="text-xl font-semibold text-lavender">ASCII Output</h2>
    <div class="flex items-center space-x-2">
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        bind:value={scale}
        class="w-24"
        title="Adjust size"
        disabled={!ascii.asciiArt || ascii.isProcessing}
      />
      <button
        onclick={toggleFullscreen}
        class="btn"
        disabled={!ascii.asciiArt || ascii.isProcessing}
      >
        {isFullscreen ? "Exit" : "Fullscreen"}
      </button>
      <button
        onclick={downloadAsPng}
        class="btn"
        disabled={!ascii.asciiArt || ascii.isProcessing}
      >
        PNG
      </button>
      <button
        onclick={downloadAsText}
        class="btn"
        disabled={!ascii.asciiArt || ascii.isProcessing}
      >
        TXT
      </button>
    </div>
  </div>

  <div class="grow p-4 overflow-auto relative">
    {#if ascii.isProcessing}
      <div
        class="absolute inset-0 bg-base/80 flex items-center justify-center z-10 transition-all duration-300 ease-in-out"
      >
        <div class="text-mauve text-lg">Processing...</div>
      </div>
    {:else if ascii.asciiArt}
      <div class="ascii-container">
        <div
          bind:this={outputRef}
          class="ascii-output transition-all duration-300 ease-in-out"
          style="
            transform: scale({scale});
            transform-origin: top left;
            color: {ascii.coloredAscii ? undefined : 'var(--text)'};
            opacity: {ascii.isProcessing ? '0.5' : '1'};
          "
        >
          {@html ascii.asciiArt}
        </div>
      </div>
    {:else}
      <div
        class="h-full flex flex-col items-center justify-center text-center p-6"
      >
        <div class="text-4xl text-mauve mb-4">@</div>
        <p class="text-subtext0 mb-2">Upload an image to generate the ASCII</p>
        <p class="text-sm text-overlay0">
          Adjust the settings to customize the output
        </p>
      </div>
    {/if}
  </div>
</div>
