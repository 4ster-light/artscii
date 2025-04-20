<script lang="ts">
  import { ascii, setImage } from "$lib/stores/ascii.svelte";

  let fileInput: HTMLInputElement | null = null; // Changed to a regular let for bind:this

  function triggerFileInput() {
    fileInput?.click();
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
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  }
</script>

<div class="card p-5">
  <h2 class="text-xl font-semibold mb-4 text-lavender">Upload Image</h2>

  <div
    class="border-2 border-dashed border-surface2 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-mauve"
    onclick={triggerFileInput}
    ondrop={handleDrop}
    onkeydown={(e: KeyboardEvent) => e.key === "Enter" && triggerFileInput()}
    ondragover={(e: DragEvent) => e.preventDefault()}
    role="button"
    aria-label="Upload Image"
    tabindex={0}
  >
    <input
      type="file"
      bind:this={fileInput}
      class="hidden"
      accept="image/*"
      onchange={handleFileSelect}
    />

    {#if ascii.imageData}
      <div class="space-y-4">
        <img
          src={ascii.imageData}
          alt="Uploaded content"
          class="max-h-48 mx-auto object-contain rounded-sm"
        />
        <p class="text-subtext0">Click or drag to replace</p>
      </div>
    {:else}
      <div class="py-8 space-y-2">
        <div class="text-4xl text-mauve mb-2">@</div>
        <p class="text-subtext0">Click to select or drag an image here</p>
        <p class="text-sm text-overlay0">Supports JPG, PNG, GIF, etc.</p>
      </div>
    {/if}
  </div>
</div>
