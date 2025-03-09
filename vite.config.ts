import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [
    deno(),
    vue(),
    tailwindcss()
  ]
})
