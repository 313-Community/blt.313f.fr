<script lang="ts">
  import { page } from '$app/state';
  import { defaultLanguage, languages, supportedLanguages } from "$lib/translation";

  let { children } = $props();

  const lang = $derived(page.params.lang || defaultLanguage);
  const language = $derived(supportedLanguages.includes(lang) ? languages[lang] : languages[defaultLanguage]);
</script>

<svelte:head>
  <!-- Favicon links -->
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <!-- Manage how the discord embeds will render, adapted from https://stackoverflow.com/a/59844733 -->
  <meta content="Battle Life Time" property="og:title"/>
  <meta content="Quickly check your total time spent playing World of Warships" property="og:description"/>
  <meta content="https://blt.313f.fr" property="og:url"/>
  <!--meta content="https://embed.com/embedimage.png" property="og:image"/-->
  <!--meta content="#43B581" data-react-helmet="true" name="theme-color"/-->
  <!--meta name="twitter:card" content="summary_large_image"-->
</svelte:head>

<div class="global-page">
  {@render children?.()}
  <div class="github">
    <a href="https://github.com/313-Community/blt.313f.fr">
      <div class="content">
        {language.layout.github}
      </div>
    </a>
  </div>
</div>

<style>
  .global-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    background: url("/img/background.jpeg") no-repeat center center fixed;
  }

  .github {
    text-align: center;
    justify-content: center;
    margin: 20px
  }

  a {
    color: black;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
