<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  export let message = "";

  let yPos;

  onMount(() => {
    const fabTop = document
      .getElementById("entry-button")
      .getBoundingClientRect().height;
    yPos = fabTop + 32;
  });

  let show = true;
</script>

{#if show}
  <div
    class="fixed w-full flex items-center justify-center"
    style="bottom: {yPos}px">
    <div
      class="rounded-full text-center text-white px-4 py-2 max-w-lg truncate
      mx-4"
      style="background-color:hsl(var(--accent-hue), 40%, 60%)"
      out:fly={{ y: 30, duration: 150 }}>
      {message}
    </div>
  </div>
{/if}
