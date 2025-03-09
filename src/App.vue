<template>
  <div class="min-h-screen flex flex-col">
    <Header />

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

    <Footer />
  </div>
</template>

<script setup lang="ts">
import AsciiOutput from "./components/AsciiOutput.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import ImageUploader from "./components/ImageUploader.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
</script>