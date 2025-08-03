<script lang="ts">
  import duration from "humanize-duration";
  import { languages } from "$lib/translation";
  import { lang } from "$lib/utils";

  const { data } = $props();

  const _lang = $derived(lang());
  const _blt = $derived(data.private.battle_life_time * 1000);
  const _created = $derived(data.created_at * 1000);

  const battle_life_time = $derived(duration(_blt, { language: _lang }));
  const as_hour = $derived(duration(Math.round(_blt / 3600) * 3600, { units: [ 'h' ], language: _lang }));
  const created_at = $derived(new Date(_created).toLocaleString());
  const percentage = $derived(Math.round(1000 * _blt / (Date.now() - _created)) / 10);

  const language = $derived(languages[_lang]);
</script>

<div class="page">
  <div class="content">
    <h3>
      {language.blt.time_played.replace('%battle_life_time%', battle_life_time)}
      <br/>
      {language.blt.as_hour.replace('%as_hour%', as_hour)}
    </h3>
  </div>
  <div class="content">
    <h3>
      {language.blt.created_at.replace('%created_at%', created_at)}
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
    display: flex;
    flex-direction: column;
    align-items: stretch; /* Étire les enfants à la même largeur */
    justify-content: center;
    overflow: hidden;
    background-size: cover;
    gap: 2rem;
  }

  .content {
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
