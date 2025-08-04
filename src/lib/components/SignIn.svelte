<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Snippet } from "svelte";
  import { type Provider } from "$lib/auth";

  let { children, render, providers, redirectTo = '/' }: {
    children?: Snippet,
    render: Snippet<[ Provider, (provider: Provider, options: Record<string, string>) => void ]>,
    providers: Provider[],
    redirectTo?: string
  } = $props();

  function signIn(provider: Provider, options: Record<string, string> = {}): Promise<void> {
    const params = new URLSearchParams({ redirectTo, ...options }).toString();
    return goto('/api/auth/callback/' + provider.id + '?' + params);
  }
</script>

<div class="signin">
  <h2 class="title">
    {@render children?.()}
  </h2>
  {#each providers as provider, index (index)}
    {@render render(provider, signIn)}
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
</style>
