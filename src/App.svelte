<script>
  import Dashboard from "./components/Dashboard.svelte";
  import Router from "./components/Router.svelte";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
</script>

<style lang="postcss">

</style>

<main class="overflow-hidden">
  <Router />
  <Dashboard />
</main>
