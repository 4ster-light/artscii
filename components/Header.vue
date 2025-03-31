<template>
  <header class="bg-mantle border-b border-surface0 py-4 px-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-mauve to-blue bg-clip-text text-transparent cursor-pointer"
          @click="navigateTo('/')">
          ✰ArTXT✰
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/video" class="p-2 font-semibold rounded-lg bg-surface0 hover:bg-surface1 transition-colors">Video
        </NuxtLink>
        <span class="text-subtext0 font-black text-2xl">|</span>
        <a href="https://x.com/4ster_light" target="_blank" rel="noopener noreferrer"
          class="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors" aria-label="Twitter">
          <img src="../assets/img/TwitterIcon.svg" alt="Twitter"
            class="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90" />
        </a>
        <a href="https://github.com/4ster-light/artscii" target="_blank" rel="noopener noreferrer"
          class="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors" aria-label="GitHub">
          <img src="../assets/img/GithubIcon.svg" alt="GitHub"
            class="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90" />
        </a>
      </div>
    </div>
  </header>
</template>
