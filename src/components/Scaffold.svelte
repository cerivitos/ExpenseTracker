<script>
  import { view, toastMessage, overlay } from "../store/store";
  import Toast from "./Toast.svelte";
  import { handleRouting } from "../util";

  function setView(viewToSet) {
    handleRouting(viewToSet);
    if (viewToSet === "entry") {
      overlay.set(viewToSet);
    } else {
      overlay.set("");
      view.set(viewToSet);
    }
  }
</script>

<style type="text/postcss">
  .navbar {
    box-shadow: 0 0 0.5px 0 black;
    height: 56px;
    background-color: var(--background-color);
    @apply w-full flex fixed bottom-0 fill-current items-center;
  }

  .navbar .active {
    color: hsl(var(--primary-hue), 65%, 45%);
    transition: all 180ms;
    @apply text-base;
  }

  .navbar .inactive {
    transition: all 180ms;
    @apply text-gray-500 text-sm;
  }

  .content {
    @apply absolute w-full top-0 overflow-x-hidden;
    bottom: 56px;
    background-color: var(--background-color);
  }
</style>

<div class="content">
  <slot />
  {#if $toastMessage !== ''}
    <Toast message={$toastMessage} />
  {/if}
</div>
<nav class="navbar">
  <button
    class="flex flex-col items-center justify-center w-1/2 py-1 {$view === 'dashboard' ? 'active' : 'inactive'}"
    on:click={() => setView('dashboard')}>
    <i class="material-icons">assessment</i>
    <span>Dashboard</span>
  </button>
  <button
    class="flex flex-col items-center justify-center w-1/2 py-1 {$view === 'settings' ? 'active' : 'inactive'}"
    on:click={() => setView('settings')}>
    <i class="material-icons">settings_applications</i>
    <span>Settings</span>
  </button>
</nav>
<div
  class="fixed bottom-0 w-full flex items-center justify-center mb-6
  pointer-events-none">
  <button
    id="entry-button"
    class="rounded-full w-16 h-16 flex items-center p-4 fill-current text-white
    shadow-lg pointer-events-auto"
    style="background-color:hsl(var(--accent-hue), 50%, 50%); box-shadow: 0px
    3px 6px 0px hsla(var(--accent-hue), 35%, 75%, 0.5);"
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
