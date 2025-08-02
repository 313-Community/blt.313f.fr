<script lang="ts">
  import { page } from "$app/state";
  import duration from "humanize-duration";
  import { defaultLanguage, languages, supportedLanguages } from "$lib/translation";

  const { data } = $props();
  const battle_life_time = $derived(data.private.battle_life_time * 1000);
  const created_at = $derived(data.created_at * 1000);
  const percentage = $derived(Math.round(1000 * battle_life_time / (Date.now() - created_at)) / 10);

  const lang = $derived(page.params.lang || defaultLanguage);
  const language = $derived(supportedLanguages.includes(lang) ? languages[lang] : languages[defaultLanguage]);
</script>

<div class="page">
  <div class="content">
    <h3>
      {language.blt.time_played.replace('%battle_life_time%', duration(battle_life_time, { language: lang }))}
    </h3>
  </div>
  <div class="content">
    <h3>
      {language.blt.created_at.replace('%created_at%', new Date(created_at).toLocaleString())}
    </h3>
  </div>
  <div class="content">
    <h3>
      {language.blt.percentage.replace('%percentage%', String(percentage))}
      <input type="range" value={percentage} min="0" max="100"/>
    </h3>
  </div>
</div>

<style>
  .page {
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-size: cover;
    flex-direction: column;
    gap: 2rem;
  }

  .content {
    width: 90%;
    text-align: center;
  }

  input[type="range"] {
    --fill-color: black;
    --track-color: #e0e0e0;
    width: 100%;
    height: 6px;
    background: transparent;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }

  /* Webkit (Chrome, Safari) */
  input[type="range"]::-webkit-slider-runnable-track {
    height: 6px;
    background: var(--track-color);
    border-radius: 3px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    pointer-events: none;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      var(--fill-color) 0%,
      var(--fill-color) calc(var(--value, 0) * 1%),
      var(--track-color) calc(var(--value, 0) * 1%),
      var(--track-color) 100%
    );
  }

  /* Firefox */
  input[type="range"]::-moz-range-track {
    height: 6px;
    background: var(--track-color);
    border-radius: 3px;
  }

  input[type="range"]::-moz-range-progress {
    height: 6px;
    background: var(--fill-color);
    border-radius: 3px;
  }

  input[type="range"]::-moz-range-thumb {
    width: 0;
    height: 0;
    border: none;
    background: transparent;
  }

  /* IE/Edge */
  input[type="range"]::-ms-fill-lower {
    background: var(--fill-color);
    border-radius: 3px;
  }

  input[type="range"]::-ms-fill-upper {
    background: var(--track-color);
    border-radius: 3px;
  }

  input[type="range"]::-ms-thumb {
    width: 0;
    height: 0;
    border: none;
    background: transparent;
  }
</style>
