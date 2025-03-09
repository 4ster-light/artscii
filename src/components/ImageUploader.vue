<template>
  <div class="card p-5">
    <h2 class="text-xl font-semibold mb-4 text-lavender">Upload Image</h2>

    <div
      class="border-2 border-dashed border-surface2 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-mauve"
      @click="triggerFileInput"
      @keydown="e => e.key === 'Enter' && triggerFileInput()"
      @drop.prevent="handleDrop"
      @dragover.prevent
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/*"
        @change="handleFileSelect"
      />

      <template v-if="store.imageData">
        <div class="space-y-4">
          <img
            :src="store.imageData"
            alt="Uploaded content"
            class="max-h-48 mx-auto object-contain rounded-sm"
          />
          <p class="text-subtext0">Click or drag to replace</p>
        </div>
      </template>
      <template v-else>
        <div class="py-8 space-y-2">
          <div class="text-4xl text-mauve mb-2">@</div>
          <p class="text-subtext0">Click to select or drag an image here</p>
          <p class="text-sm text-overlay0">Supports JPG, PNG, GIF, etc.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAsciiStore } from "../stores/ascii";

const store = useAsciiStore();
const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
	fileInput.value?.click();
}

function handleFileSelect(event: Event) {
	const target = event.target as HTMLInputElement;
	if (target.files?.[0]) {
		processFile(target.files[0]);
	}
}

function handleDrop(event: DragEvent) {
	const file = event.dataTransfer?.files[0];
	if (file) {
		processFile(file);
	}
}

function processFile(file: File) {
	const reader = new FileReader();
	reader.onload = (e) => {
		const result = e.target?.result;
		if (typeof result === "string") {
			store.setImage(result);
		}
	};
	reader.readAsDataURL(file);
}
</script>