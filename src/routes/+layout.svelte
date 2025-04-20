<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import { page } from "$app/state";
  import "../app.css";

  const { children } = $props();
  const DEFAULT_TITLE = "✰ArtSCII✰";
  let SEO = $state({
    title: DEFAULT_TITLE,
    description: "The best image to ascii art converter",
    image: "/Icon.svg",
    url: "",
  })
  $effect(() => {
    SEO.title =
      page.url.pathname === "/"
        ? DEFAULT_TITLE
        : page.url.pathname.replace("/", "").charAt(0).toUpperCase() +
          page.url.pathname.replace("/", "").slice(1)
    SEO.url = page.url.toString()
  })
</script>

<svelte:head>
  <title>{DEFAULT_TITLE}</title>
  <meta name="description" content={SEO.description} />
  <meta property="og:title" content={SEO.title} />
  <meta property="og:description" content={SEO.description} />
  <meta property="og:image" content={SEO.image} />
  <meta property="og:url" content={SEO.url} />
  <meta name="twitter:title" content={SEO.title} />
  <meta name="twitter:description" content={SEO.description} />
  <meta name="twitter:image" content={SEO.image} />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href={SEO.image} type="image/svg+xml" />
</svelte:head>

<main class="min-h-screen flex flex-col">
  <Header />
  {@render children()}
  <Footer />
</main>
