<script>
  import { fade } from "svelte/transition";

  export let data;
</script>

<div
  class="relative py-4 flex flex-row items-center"
  transition:fade={{ duration: 180 }}>
  <div class="rounded-full w-8 h-8 bg-gray-500 mr-2" />
  <div class="flex flex-col justify-between truncate flex-grow">
    <span class="font-bold">{data.type}</span>
    <span class="font-light text-gray-600">
      {data.items} {data.items > 1 ? 'entries' : 'entry'}
    </span>
  </div>
  <div class="flex flex-col justify-between items-end mx-2">
    <span>
      ${data.sum.toString().split('.')[1] ? (data.sum.toString().split('.')[1].length === 1 ? data.sum + '0' : data.sum) : data.sum}
    </span>
    <span class="font-light text-gray-600">{Math.round(data.percentage)}%</span>
  </div>
  <div
    class="absolute left-0 top-0 h-full bg-blue-200"
    style="width: {(window.innerWidth * data.percentage) / 100}px; z-index:-1" />
</div>
