<script>
  export let text = "";
</script>

<style type="text/postcss">
  .dot {
    animation: scale 1s 1.4s infinite ease-in-out both,
      fade 1s 1.4s infinite ease-in-out both;
    line-height: 0.5;
    color: hsl(var(--accent-hue), 40%, 50%);
    @apply text-4xl opacity-0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
    @apply mr-1;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
    @apply mr-1;
  }

  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes scale {
    0%,
    100% {
      transform-origin: center;
      transform: scale(1);
    }
    ,
    50% {
      transform-origin: center;
      transform: scale(1.5);
    }
  }

  @keyframes fade {
    0%,
    100% {
      opacity: 1;
    }
    ,
    50% {
      opacity: 0;
    }
  }
</style>

<div class="w-full h-auto">
  <div class="flex text-center justify-center items-center">
    <div class="dot">
      <div>·</div>
    </div>
    <div class="dot">
      <div>·</div>
    </div>
    <div class="dot">
      <div>·</div>
    </div>
  </div>
  {#if text !== undefined}
    <body
      class="mt-4 block w-full text-center"
      style="color: var(--text-color)">
      {text}
    </body>
  {/if}
</div>
