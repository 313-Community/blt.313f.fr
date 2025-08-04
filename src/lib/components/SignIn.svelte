<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Snippet } from "svelte";
  import { type Provider } from "$lib/auth";

  let { children, providers, redirectTo = '/' }: {
    children?: Snippet,
    providers: Provider[],
    redirectTo?: string
  } = $props();

  let options: Record<string, Record<string, string>> = $state(
    Object.fromEntries(providers.map((p: Provider) =>
      [ p.id, Object.fromEntries(p.selects.map(({ key, values }) => [ key, values[0].actual ])) ]
    ))
  );

  function signIn(provider: Provider): Promise<void> {
    const params = new URLSearchParams({ redirectTo, ...options[provider.id] }).toString();
    return goto('/api/auth/callback/' + provider.id + '?' + params);
  }

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

<div class="signin">
  <h2 class="title">
    {@render children?.()}
  </h2>
  {#each providers as provider, index (index)}
    <button type="button" onclick={() => signIn(provider)}
            style:background-color={provider.color}
            style:color={getTextColor(provider.color)}>
      <img src={provider.icon} alt={provider.id} height="32"/>
      {provider.name}
      {#if options}
        {#each provider.selects as slct, i (i)}
          <select bind:value={options[provider.id][slct.key]} onclick={e => e.stopPropagation()}>
            {#each slct.values as { actual, show }, i (i)}
              <option value={actual}>{show}</option>
            {/each}
          </select>
        {/each}
      {/if}
    </button>
  {/each}
</div>

<style>
  .signin {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px; /* Espace entre les boutons */
  }

  .title {
    text-align: center;
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
</style>
