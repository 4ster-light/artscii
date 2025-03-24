<script setup lang="ts">
import { toPng } from "html-to-image";

const store = useAsciiStore();
const outputRef = ref<HTMLDivElement | null>(null);
const scale = ref(1);
const isFullscreen = ref(false);

function handleFullScreen() {
	isFullscreen.value = document.fullscreenElement !== null;
}

onMounted(() =>
	document.addEventListener("fullscreenchange", handleFullScreen),
);
onUnmounted(() =>
	document.removeEventListener("fullscreenchange", handleFullScreen),
);

async function downloadAsPng() {
	if (!outputRef.value || !store.asciiArt) return;

	try {
		const dataUrl = await toPng(outputRef.value, {
			backgroundColor: "#000000",
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
}

async function downloadAsText() {
	if (!store.asciiArt) return;

	const blob = new Blob([store.asciiArt], { type: "text/plain" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.download = "ascii-art.txt";
	link.href = url;
	link.click();

	URL.revokeObjectURL(url);
}

async function toggleFullscreen() {
	if (!outputRef.value) return;

	if (!document.fullscreenElement) {
		outputRef.value.requestFullscreen().catch((error) => {
			console.error(`Error attempting to enable fullscreen: ${error.message}`);
		});
	} else {
		await document.exitFullscreen();
	}
}
</script>

<template>
  <div class="card h-full flex flex-col">
    <div class="p-5 border-b border-surface0 flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-xl font-semibold text-lavender">ASCII Output</h2>

      <div class="flex items-center space-x-2">
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          v-model="scale"
          class="w-24"
          title="Adjust size"
          :disabled="!store.asciiArt || store.isProcessing"
        />

        <button
          type="button"
          @click="toggleFullscreen"
          class="btn"
          :disabled="!store.asciiArt || store.isProcessing"
          :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        >
          {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
        </button>

        <button
          type="button"
          @click="downloadAsPng"
          class="btn"
          :disabled="!store.asciiArt || store.isProcessing"
          title="Download as PNG"
        >
          PNG
        </button>

        <button
          type="button"
          @click="downloadAsText"
          class="btn"
          :disabled="!store.asciiArt || store.isProcessing"
          title="Download as Text"
        >
          TXT
        </button>
      </div>
    </div>

    <div class="grow p-4 overflow-auto relative">
      <div v-if="store.isProcessing" 
        class="absolute inset-0 bg-base/80 flex items-center justify-center z-10 transition-all duration-300 ease-in-out"
      >
        <div class="text-mauve text-lg">Processing...</div>
      </div>

      <template v-else>
        <div v-if="store.asciiArt" class="ascii-container">
          <div
            ref="outputRef" 
            class="ascii-output transition-all duration-300 ease-in-out" 
            :style="{
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              color: store.coloredAscii ? undefined : 'var(--text)',
              opacity: store.isProcessing ? '0.5' : '1'
            }" 
            v-html="store.asciiArt" 
          />
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center text-center p-6">
          <div class="text-4xl text-mauve mb-4">@</div>
          <p class="text-subtext0 mb-2">Upload an image to generate the ASCII</p>
          <p class="text-sm text-overlay0">Adjust the settings to customize the output</p>
        </div>
      </template>
    </div>
  </div>
</template>
