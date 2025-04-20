<script lang="ts">
  import { ascii, generateAscii } from "$lib/stores/ascii.svelte";
  import { availableStrategies } from "../utils/dithering/index";
</script>

<div class="card p-5">
  <h2 class="text-xl font-semibold mb-4 text-lavender">Settings</h2>

  <div class="space-y-6 md:space-y-5">
    <div>
      <label class="flex items-center justify-between mb-2" for="resolution">
        <span class="text-subtext0">Resolution</span>
        <span class="text-sm text-overlay1">
          {Math.round(ascii.resolution * 100)}%
        </span>
      </label>
      <input
        id="resolution"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        bind:value={ascii.resolution}
        oninput={generateAscii}
        class="w-full"
        disabled={ascii.isProcessing}
      />
      <p class="text-xs text-overlay0 mt-1">
        Higher values create more detailed ASCII art
      </p>
    </div>

    <div>
      <label class="flex items-center justify-between mb-2" for="contrast">
        <span class="text-subtext0">Contrast</span>
        <span class="text-sm text-overlay1">
          {ascii.contrast.toFixed(1)}x
        </span>
      </label>
      <input
        id="contrast"
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        bind:value={ascii.contrast}
        oninput={generateAscii}
        class="w-full"
        disabled={ascii.isProcessing}
      />
    </div>

    <div>
      <label class="flex items-center justify-between mb-2" for="brightness">
        <span class="text-subtext0">Brightness</span>
        <span class="text-sm text-overlay1">
          {ascii.brightness.toFixed(1)}x
        </span>
      </label>
      <input
        id="brightness"
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        bind:value={ascii.brightness}
        oninput={generateAscii}
        class="w-full"
        disabled={ascii.isProcessing}
      />
    </div>

    <div class="flex items-center space-x-3">
      <input
        type="checkbox"
        id="inverted"
        bind:checked={ascii.inverted}
        onchange={generateAscii}
        class="checkbox-input"
        disabled={ascii.isProcessing}
      />
      <label for="inverted" class="text-subtext0"> Invert colors </label>
    </div>

    <div class="flex items-center space-x-3">
      <input
        type="checkbox"
        id="colored"
        bind:checked={ascii.coloredAscii}
        onchange={generateAscii}
        class="checkbox-input"
        disabled={ascii.isProcessing}
      />
      <label for="colored" class="text-subtext0"> Colored output </label>
    </div>

    <div>
      <label for="dithering" class="text-subtext0">Dithering </label>
      <select
        id="dithering"
        bind:value={ascii.ditheringStrategy}
        oninput={generateAscii}
        class="select-input"
        disabled={ascii.isProcessing}
      >
        {#each availableStrategies as option}
          <option value={option.value}>
            {option.label}
          </option>
        {/each}
      </select>
      <p class="text-xs text-overlay0 mt-1">
        Dithering can improve the appearance of the ASCII art by reducing
        banding.
      </p>
    </div>
  </div>
</div>
