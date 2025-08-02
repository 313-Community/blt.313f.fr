<script lang="ts">
  import { SignIn } from "$lib/components";
  import { page } from "$app/state";
  import { defaultLanguage, languages, supportedLanguages } from "$lib/translation";

  let { data } = $props();
  const { providers } = $derived(data);

  const lang = $derived(page.params.lang || defaultLanguage);
  const language = $derived(supportedLanguages.includes(lang) ? languages[lang] : languages[defaultLanguage]);

  function getTextColor(backgroundColor: string): string {
    // Convertit la couleur hexadécimale en valeurs RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calcule la luminance relative
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Retourne noir ou blanc en fonction de la luminance
    return luminance > 186 ? '#000000' : '#FFFFFF';
  }
</script>

<div class="page">
  <div class="title content">
    <h1>
      {language.login.title}
    </h1>
    <h4>
      {language.login.description}
    </h4>
  </div>
  <div class="signin content">
    <SignIn {providers}>
      {#snippet render(provider, signIn)}
        <button type="button" onclick={() => signIn(provider)}
                style:background-color={provider.color}
                style:color={getTextColor(provider.color)}>
          <img src={provider.icon} alt={provider.id} height="32"/>
          {provider.name}
        </button>
      {/snippet}

      {language.login.connect}
    </SignIn>
  </div>
</div>

<style>
  .page {
    height: 100%;
    background-size: cover;
    display: flex;
    flex-direction: row;
    gap: 10%;
    flex-grow: 1;
    padding: 20px;
  }

  .title {
    text-align: center;
    font-size: 2rem;
    max-width: 45%;
  }

  .signin {
    width: 30%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px; /* Espace entre l'icône et le texte */
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 10px;
  }

  button:hover {
    opacity: 0.8;
  }

  img {
    display: block;
  }

  @media (max-width: 768px) {
    .page {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .title, .signin {
      max-width: 100%;
      width: auto;
    }

    .title {
      font-size: 1rem;
    }
  }
</style>
