<script lang="ts">
  import { SignIn } from "$lib/components";
  import { languages } from "$lib/translation";
  import { lang } from "$lib/utils";

  let { data } = $props();
  const { providers } = $derived(data);

  const language = $derived(languages[lang()]);
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
      {language.connect.connect_with}
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
