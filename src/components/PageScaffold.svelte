<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
</script>

<div
  class="h-screen w-full bg-white relative"
  transition:fly={{ y: window.innerHeight, duration: 130 }}>
  <nav class="w-full flex flex-row p-4 shadow fixed top-0" style="height: 56px">
    <i
      class="material-icons fill-current"
      style="color:hsl(var(--primary-hue), 50%, 50%)"
      in:fly={{ x: -24, duration: 80, delay: 100 }}
      on:click={() => window.history.back()}>
      arrow_back
    </i>
  </nav>
  <slot />
</div>
