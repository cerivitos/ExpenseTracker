<script>
  import { debounce } from "../util";
  import { createEventDispatcher } from "svelte";

  export let inputValue = "0";
  export let id = "";
  export let min = "0.0";
  export let step = "0.1";
  export let max;

  let isError = false;

  const dispatch = createEventDispatcher();

  function dispatchStatus(id, isError) {
    dispatch("error", {
      id: id,
      isError: isError
    });
  }

  const handleInput = debounce(e => {
    inputValue = +e.target.value;

    if (typeof inputValue != "number" || inputValue < min || inputValue > max) {
      isError = true;
    } else {
      isError = false;
    }
    dispatchStatus(id, isError);
  }, 800);
</script>

<style type="text/postcss">
  .input-field {
    color: hsl(var(--text-color-dark));
    transition: all 0.3s;
    background-color: hsla(var(--background-hue), 0%, 94%, 0.7);
    outline: none !important;
    font-weight: bold;
    font-family: "Rubik", sans-serif;
    @apply rounded px-2 py-1 appearance-none text-right;
  }

  .input-error {
    background-color: rgba(220, 20, 60, 0.2);
    box-shadow: 0 0 0 2px rgba(220, 20, 60) inset;
    color: rgba(220, 20, 60);
  }

  .input-field:focus {
    box-shadow: 0 0 0 2px hsl(var(--secondary-hue), 50%, 50%) inset;
    background-color: hsla(var(--secondary-hue), 50%, 50%, 0.1);
    padding: 0.5rem;
  }

  .input-field:hover:not(:focus) {
    box-shadow: 0 0 0 2px hsla(var(--secondary-hue), 50%, 50%, 0.4) inset;
  }
</style>

<input
  class="input-field w-full {isError ? 'input-error' : ''}"
  type="number"
  {min}
  {step}
  {id}
  {max}
  value={inputValue}
  data-cy={id}
  on:input={handleInput} />
