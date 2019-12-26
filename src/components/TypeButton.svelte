<script>
  import { createEventDispatcher } from "svelte";

  export let label = "";
  export let colorHue = 180;
  export let isActive = false;

  const dispatch = createEventDispatcher();

  function dispatchType() {
    dispatch("dispatchType", {
      selectedType: label
    });
  }

  $: if (document.getElementById(label + "-button")) {
    if (isActive) {
      document
        .getElementById(label + "-button")
        .style.setProperty(
          "background-color",
          "hsl(" + colorHue + ", 50%, 80%)"
        );
      document
        .getElementById(label + "-button")
        .style.setProperty("color", "hsl(" + colorHue + ", 65%, 40%)");

      document
        .getElementById(label + "-label")
        .style.setProperty("color", "hsl(" + colorHue + ", 65%, 40%)");
    } else {
      document
        .getElementById(label + "-button")
        .style.setProperty("background-color", "#edf2f7");
      document
        .getElementById(label + "-button")
        .style.setProperty("color", "#cbd5e0");

      document
        .getElementById(label + "-label")
        .style.setProperty("color", "#cbd5e0");
    }
  }
</script>

<style type="text/postcss">
  .wrapper {
    @apply flex flex-col items-center justify-center w-1/3 mt-4;
    transition-timing-function: ease-in;
    transition: all 350ms;
  }

  .type-button {
    @apply rounded-full p-2 fill-current bg-gray-200 text-gray-400;
  }

  .type-button svg {
    @apply w-8 h-8;
  }
</style>

<div class="wrapper">
  <button
    class="type-button"
    title={label}
    id="{label}-button"
    on:click={() => dispatchType()}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <slot />
    </svg>
  </button>
  <span class="text-gray-400" id="{label}-label">{label}</span>
</div>
