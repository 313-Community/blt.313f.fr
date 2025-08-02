<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="page">
  <img src={`https://http.cat/${page.status}`} alt="http.cat"/>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 100vh;
    background-color: black;
  }

  img {
    width: 60vw;
    height: auto;
    margin: 0 auto;
  }
</style>
