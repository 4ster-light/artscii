<script setup lang="ts">
useSeoMeta({
	title: "Artscii",
	description: "The best image to ascii art converter",
	ogTitle: "✰ArtSCII✰",
	ogDescription: "The best image to ascii art converter",
	ogImage: "/Icon.svg",
	ogUrl: "https://artscii.deno.dev",
	twitterTitle: "✰ArtSCII✰",
	twitterDescription: "The best image to ascii art converter",
	twitterImage: "/Icon.svg",
	twitterCard: "summary",
});

useHead({
	htmlAttrs: {
		lang: "en",
	},
	link: [
		{
			rel: "icon",
			type: "image/svg",
			href: "/Icon.svg",
		},
	],
});
</script>

<template>
  <main class="flex flex-col items-center justify-center h-[87vh]">
    <h1 class="text-5xl md:text-7xl mb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-mauve to-blue leading-tight">
      ✰ Coming soon ✰
    </h1>
    <NuxtLink to="/" class="p-4 font-semibold rounded-lg bg-surface0 hover:bg-surface1 transition-colors duration-150 ease-in-out text-2xl">
      Back Home &rarr;
    </NuxtLink>
  </main>
</template>
