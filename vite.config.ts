import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [
    deno(),
    preact(),
    tailwindcss()
  ]
});
