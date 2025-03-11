<script setup lang="ts">
import { RouterView } from "vue-router";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
      <RouterView />
    <Footer />
  </div>
</template>

<style>
@import "./assets/css/global.css";
</style>