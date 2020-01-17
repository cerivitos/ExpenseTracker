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
    box-shadow: 0 0 1px 0 grey;
    height: 56px;
    background-color: var(--background-color);
    @apply w-full flex fixed bottom-0 fill-current items-center;
  }

  .nav-button {
    @apply flex flex-col items-center justify-center w-1/2 py-1;
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

  .entry-wrapper {
    @apply fixed bottom-0 w-full flex items-center justify-center mb-6 pointer-events-none;
  }

  #entry-button {
    @apply rounded-full w-16 h-16 flex items-center justify-center p-4 fill-current text-white shadow-lg pointer-events-auto;
    background-color: hsl(var(--accent-hue), 50%, 50%);
    box-shadow: 0px 3px 6px 0px hsla(var(--accent-hue), 35%, 75%, 0.5);
  }

  .material-icons {
    @apply mr-0;
  }

  #entry-button .material-icons {
    font-size: 32px;
  }

  @media only screen and (min-width: 768px) {
    .content {
      bottom: 0;
    }

    .navbar {
      @apply w-3/12 h-screen flex flex-col fixed left-0 fill-current items-start justify-center p-4;
    }

    .nav-button {
      @apply flex flex-row items-center justify-start w-full py-1;
    }

    .navbar .active {
      color: hsl(var(--primary-hue), 65%, 45%);
      transition: color 180ms;
      @apply text-xl;
    }

    .navbar .inactive {
      transition: color 180ms;
      @apply text-gray-500 text-xl;
    }

    .material-icons {
      @apply mr-2 text-3xl;
    }

    .content {
      @apply absolute w-9/12 top-0 right-0 overflow-x-hidden;
      background-color: var(--background-color);
    }

    #entry-button {
      @apply rounded-full w-full flex flex-row justify-center items-center fill-current text-white font-bold text-xl shadow-lg pointer-events-auto mb-8;
      background-color: hsl(var(--accent-hue), 50%, 50%);
      box-shadow: 0px 3px 6px 0px hsla(var(--accent-hue), 35%, 75%, 0.5);
    }
  }
</style>

<div class="content">
  <slot />
  {#if $toastMessage !== ''}
    <Toast message={$toastMessage} />
  {/if}
</div>
<nav class="navbar">
  {#if window.innerWidth > 768}
    <button id="entry-button" on:click={() => setView('entry')}>
      <i class="material-icons">post_add</i>
      Add spending
    </button>
  {/if}
  <button
    class="nav-button {$view === 'dashboard' ? 'active' : 'inactive'}"
    on:click={() => setView('dashboard')}>
    <i class="material-icons">assessment</i>
    <span>Dashboard</span>
  </button>
  <button
    class="nav-button {$view === 'settings' ? 'active' : 'inactive'}"
    on:click={() => setView('settings')}>
    <i class="material-icons md-48">settings_applications</i>
    <span>Settings</span>
  </button>
</nav>
{#if window.innerWidth <= 768}
  <div class="entry-wrapper">
    <button id="entry-button" on:click={() => setView('entry')}>
      <i class="material-icons md-36">post_add</i>
    </button>
  </div>
{/if}
