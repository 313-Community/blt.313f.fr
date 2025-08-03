<script lang="ts">
  import { languages } from "$lib/translation";
  import { lang } from "$lib/utils";

  let { children } = $props();

  let language = $derived(languages[lang()]);
</script>

<svelte:head>
  <!-- Favicon links -->
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <link rel="shortcut icon" href="/favicon.ico"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
  <link rel="manifest" href="/site.webmanifest"/>

  <!-- Manage how the discord embeds will render, adapted from https://stackoverflow.com/a/59844733 -->
  <meta content="Battle Life Time" property="og:title"/>
  <meta content="Quickly check your total time spent playing World of Warships" property="og:description"/>
  <meta content="https://blt.313f.fr" property="og:url"/>
  <!--meta content="https://embed.com/embedimage.png" property="og:image"/-->
  <!--meta content="#43B581" data-react-helmet="true" name="theme-color"/-->
  <!--meta name="twitter:card" content="summary_large_image"-->
</svelte:head>

<div class="global-page">
  <div class="main-content">
    {@render children?.()}
  </div>
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("/img/background.jpeg") no-repeat center center fixed;
  }

  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .github {
    margin: auto 1rem 1rem;
    text-align: center;
    width: 95%;
  }

  a {
    color: black;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
