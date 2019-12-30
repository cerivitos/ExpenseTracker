<script>
  import { fade, fly } from "svelte/transition";

  export let data;
  export let index;
</script>

<div
  class="relative py-4 flex flex-row items-center"
  in:fade={{ duration: 80, delay: index * 50 }}
  out:fade={{ duration: 80 }}>
  <div class="rounded-full w-8 h-8 bg-gray-500 ml-4 mr-2" />
  <div class="flex flex-col justify-between truncate flex-grow">
    <span class="font-bold">{data.type}</span>
    <span class="font-light text-gray-600">
      {data.items} {data.items > 1 ? 'entries' : 'entry'}
    </span>
  </div>
  <div class="flex flex-col justify-between items-end ml-2 mr-4">
    <span>${Math.round(data.sum)}</span>
    <span class="font-light text-gray-600">{Math.round(data.percentage)}%</span>
  </div>
  <div
    class="absolute left-0 top-0 h-full bg-blue-200 rounded-r"
    in:fly={{ x: -(window.innerWidth * data.percentage) / 100, duration: 180, delay: index * 80 }}
    style="width: {(window.innerWidth * data.percentage) / 100}px; z-index:-1" />
</div>
