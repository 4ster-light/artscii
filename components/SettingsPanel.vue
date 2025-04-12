<script setup lang="ts">
import { availableStrategies } from "../utils/dithering/utils"
const store = useAsciiStore()
</script>

<template>
  <div class="card p-5">
    <h2 class="text-xl font-semibold mb-4 text-lavender">Settings</h2>

    <div class="space-y-6 md:space-y-5">
      <div>
        <label
          class="flex items-center justify-between mb-2"
          for="resolution"
        >
          <span class="text-subtext0">Resolution</span>
          <span class="text-sm text-overlay1">
            {{ Math.round(store.resolution * 100) }}%
          </span>
        </label>
        <input
          id="resolution"
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          v-model="store.resolution"
          @change="store.generateAscii"
          class="w-full"
          :disabled="store.isProcessing"
        />
        <p class="text-xs text-overlay0 mt-1">
          Higher values create more detailed ASCII art
        </p>
      </div>

      <div>
        <label
          class="flex items-center justify-between mb-2"
          for="contrast"
        >
          <span class="text-subtext0">Contrast</span>
          <span class="text-sm text-overlay1">
            {{ store.contrast.toFixed(1) }}x
          </span>
        </label>
        <input
          id="contrast"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          :value="store.contrast"
          @input="e => store.contrast = Number((e.target as HTMLInputElement).value)"
          @change="store.generateAscii"
          class="w-full"
          :disabled="store.isProcessing"
        />
      </div>

      <div>
        <label
          class="flex items-center justify-between mb-2"
          for="brightness"
        >
          <span class="text-subtext0">Brightness</span>
          <span class="text-sm text-overlay1">
            {{ store.brightness.toFixed(1) }}x
          </span>
        </label>
        <input
          id="brightness"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          :value="store.brightness"
          @input="e => store.brightness = Number((e.target as HTMLInputElement).value)"
          @change="store.generateAscii"
          class="w-full"
          :disabled="store.isProcessing"
        />
      </div>

      <div class="flex items-center space-x-3">
        <input
          type="checkbox"
          id="inverted"
          v-model="store.inverted"
          @change="store.generateAscii"
          class="checkbox-input"
          :disabled="store.isProcessing"
        />
        <label for="inverted" class="text-subtext0">
          Invert colors
        </label>
      </div>

      <div class="flex items-center space-x-3">
        <input
          type="checkbox"
          id="colored"
          v-model="store.coloredAscii"
          @change="store.generateAscii"
          class="checkbox-input"
          :disabled="store.isProcessing"
        />
        <label for="colored" class="text-subtext0">
          Colored output
        </label>
      </div>

      <div>
        <label for="dithering" class="text-subtext0">Dithering </label>
        <select id="dithering" v-model="store.ditheringStrategy" @change="store.generateAscii" class="select-input"
          :disabled="store.isProcessing">
          <option v-for="option in availableStrategies" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p class="text-xs text-overlay0 mt-1">
          Dithering can improve the appearance of the ASCII art by reducing banding.
        </p>
      </div>
    </div>
  </div>
</template>
