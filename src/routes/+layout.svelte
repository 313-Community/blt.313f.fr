<script lang="ts">
  import { page } from '$app/state';
  import { languages } from "$lib/translation";

  let { children } = $props();

  const lang = $derived(page.params.lang || 'en');
  const language = $derived(languages[lang]);
</script>

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
