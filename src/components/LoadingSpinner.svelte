<script>
  export let text = "";
</script>

<style type="text/postcss">
  .dot {
    animation: scale 1s 1.4s infinite ease-in-out both,
      fade 1s 1.4s infinite ease-in-out both;
    line-height: 0.5;
    @apply text-white text-5xl opacity-0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
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
    <body class="w-full text-center text-primaryColor absolute bottom-0">
      {text}
    </body>
  {/if}
</div>
