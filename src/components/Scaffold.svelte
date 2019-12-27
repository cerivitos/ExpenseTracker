<script>
  import { view } from "../store/store";
  import Entry from "./Entry.svelte";

  function setView(viewToSet) {
    view.set(viewToSet);
    handleRouting(viewToSet);
  }

  function handleRouting(newPage) {
    window.history.pushState(
      {
        page: newPage
      },
      null,
      "?page=" + newPage
    );
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
  <slot />
</div>
<nav class="navbar">
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
  <button
    class="flex flex-col items-center w-1/2 py-2 {$view === 'settings' ? 'active' : 'inactive'}"
    on:click={() => setView('settings')}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h--8"
      viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-7H5c-1.11 0-2
        .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-1.75 9c0
        .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4
        2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26
        1.85c-.03.17-.18.3-.35.3h-2.8c-.17
        0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34
        0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69
        0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51
        1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26
        1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4
        2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69z" />
    </svg>
    <span>Settings</span>
  </button>
</nav>
<div class="fixed bottom-0 w-full flex items-center justify-center mb-6">
  <button
    class="rounded-full w-16 h-16 flex items-center p-4 fill-current text-white
    shadow-lg"
    style="background-color:hsl(var(--accent-hue), 50%, 50%); box-shadow: 0px
    10px 15px 0px hsla(var(--accent-hue), 35%, 75%,0.85);"
    on:click={() => setView('entry')}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8"
      viewBox="0 0 24 24"
      enable-background="new 0 0 24 24"
      xml:space="preserve">
      <g id="Bounding_Box">
        <rect fill="none" width="24" height="24" />
        <rect fill="none" width="24" height="24" />
      </g>
      <g id="Flat">
        <g id="ui_x5F_spec_x5F_header_copy_2" />
        <g>
          <path
            d="M18,12c-0.55,0-1,0.45-1,1v5.22c0,0.55-0.45,1-1,1H6c-0.55,0-1-0.45-1-1V8c0-0.55,0.45-1,1-1h5c0.55,0,1-0.45,1-1
            c0-0.55-0.45-1-1-1H5C3.9,5,3,5.9,3,7v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-6C19,12.45,18.55,12,18,12z" />
          <path
            d="M21.02,5H19V2.98C19,2.44,18.56,2,18.02,2h-0.03C17.44,2,17,2.44,17,2.98V5h-2.01C14.45,5,14.01,5.44,14,5.98
            c0,0.01,0,0.02,0,0.03C14,6.56,14.44,7,14.99,7H17v2.01c0,0.54,0.44,0.99,0.99,0.98c0.01,0,0.02,0,0.03,0
            c0.54,0,0.98-0.44,0.98-0.98V7h2.02C21.56,7,22,6.56,22,6.02V5.98C22,5.44,21.56,5,21.02,5z" />
          <path
            d="M14,9H8c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1C15,9.45,14.55,9,14,9z" />
          <path
            d="M14,12H8c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1C15,12.45,14.55,12,14,12z" />
          <path
            d="M14,15H8c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1C15,15.45,14.55,15,14,15z" />
        </g>
      </g>
    </svg>
  </button>
</div>
{#if $view === 'entry'}
  <div>
    <Entry />
  </div>
{/if}
