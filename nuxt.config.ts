import tailwindcss from "@tailwindcss/vite"
import { defineNuxtConfig } from "nuxt/config"
import type { PluginOption } from "vite"

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	imports: {
		autoImport: true,
	},
	modules: ["@pinia/nuxt"],
	css: ["./assets/css/global.css"],
	vite: {
		plugins: [tailwindcss() as PluginOption],
	},
	nitro: {
		output: {
			dir: "dist",
		},
	},
})
