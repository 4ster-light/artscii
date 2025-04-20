<script>
import AsciiOutput from "$lib/components/AsciiOutput.svelte";
import ImageUploader from "$lib/components/ImageUploader.svelte";
import SettingsPanel from "$lib/components/SettingsPanel.svelte";
</script>

<main class="grow p-4 md:p-6 max-w-7xl mx-auto w-full">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-4 space-y-6">
      <ImageUploader />
      <SettingsPanel />
    </div>
    <div class="lg:col-span-8">
      <AsciiOutput />
    </div>
  </div>
</main>
