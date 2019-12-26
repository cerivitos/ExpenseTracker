<script>
  import { view } from "../store/store";
  import Entry from "./Entry.svelte";

  function setView(viewToSet) {
    view.set(viewToSet);
  }
</script>

<style type="text/postcss">
  .navbar {
    box-shadow: 0px -3px 8px 0px rgba(214, 214, 214, 0.9);
    height: 72px;
    @apply w-full flex fixed bottom-0 bg-white fill-current;
  }

  .navbar .active {
    color: hsl(var(--primary-hue), 65%, 45%);
  }

  .navbar .inactive {
    @apply text-gray-500;
  }

  .content {
    @apply absolute w-full top-0 overflow-x-hidden;
    bottom: 72px;
  }
</style>

<div class="content">
  <Entry />
</div>
<nav class="navbar">
  <button
    class="flex flex-col items-center w-1/2 py-2 active {$view === 'entry' ? 'active' : 'inactive'}"
    on:click={() => setView('entry')}>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4
        11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1
        1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
    </svg>
    <span>New</span>
  </button>
  <button
    class="flex flex-col items-center w-1/2 py-2 {$view === 'dashboard' ? 'active' : 'inactive'}"
    on:click={() => setView('dashboard')}>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9
        2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1
        1v5c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0
        .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0
        .55-.45 1-1 1z" />
    </svg>
    <span>Dashboard</span>
  </button>
</nav>
