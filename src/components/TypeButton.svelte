<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { themeIsBright } from "../store/store";

  export let label = "";
  export let colorHue = 180;
  export let isActive = false;
  export let materialIcon = "";

  onMount(() => {
    setButtonColors(isActive);
  });

  const dispatch = createEventDispatcher();

  function dispatchType() {
    dispatch("dispatchType", {
      selectedType: label
    });
  }

  function setButtonColors(buttonActive) {
    if (buttonActive) {
      document
        .getElementById(label + "-button")
        .style.setProperty(
          "background-color",
          "hsl(" + colorHue + ", 50%, 80%)"
        );
      document
        .getElementById(label + "-button")
        .style.setProperty("color", "hsl(" + colorHue + ", 65%, 40%)");
      $themeIsBright
        ? document
            .getElementById(label + "-label")
            .style.setProperty("color", "hsl(" + colorHue + ", 65%, 55%)")
        : document
            .getElementById(label + "-label")
            .style.setProperty("color", "hsl(" + colorHue + ", 50%, 80%)");
    } else {
      document
        .getElementById(label + "-button")
        .style.setProperty("background-color", "var(--inactive-button-color)");
      document
        .getElementById(label + "-button")
        .style.setProperty("color", "var(--text-color2)");
      document
        .getElementById(label + "-label")
        .style.setProperty("color", "var(--text-color2)");
    }
  }

  $: if (document.getElementById(label + "-button")) {
    setButtonColors(isActive);
  }
</script>

<style type="text/postcss">
  .wrapper {
    @apply flex flex-col items-center justify-center w-1/3 mt-4;
    color: var(--text-color);
    transition-timing-function: ease-in;
    transition: all 180ms;
  }

  .type-button {
    @apply rounded-full p-2 fill-current text-center align-middle;
    background-color: var(--inactive-button-color);
    color: var(--text-color2);
    transition: background-color 120ms ease-out;
  }

  .type-button i {
    display: block !important;
  }
</style>

<div class="wrapper">
  <button
    class="type-button"
    title={label}
    id="{label}-button"
    on:click={() => dispatchType()}>
    <i class="material-icons-round">{materialIcon}</i>
  </button>
  <span id="{label}-label">{label}</span>
</div>
