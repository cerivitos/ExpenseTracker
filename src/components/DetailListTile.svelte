<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  export let data;
  export let backgroundColor = "hsl(var(--primary-hue), 50%, 50%)";
  export let iconColor = "white";
  export let index = 0;

  let month, date, addedBy, desc, amount;

  onMount(() => {
    month = new Date(data.date).toString().substring(4, 7);
    date = new Date(data.date).getDate();
    addedBy = data.addedBy;
    amount = data.amount;
    desc = data.desc;
  });
</script>

<style type="text/postcss">
  .amount::before {
    content: "$";
    @apply text-sm font-light mr-1;
  }
</style>

<div
  class="flex flex-row p-4 items-center cursor-pointer"
  style="background-color: var(--background-color); color: var(--text-color)"
  in:fade={{ duration: 120, delay: index * 50 }}>
  <div
    class="rounded-full px-2 mr-4 font-bold text-sm whitespace-no-wrap"
    style="background-color:{backgroundColor}; color:{iconColor}">
    <span>{new Date(data.date).toString().substring(4, 10)}</span>
  </div>
  <div class="flex flex-row w-full items-center justify-start truncate mr-4">
    <span class="flex-grow-0 truncate mr-2">{addedBy}</span>
    <span class="truncate flex-grow" style="color: var(--text-color2)">
      {desc}
    </span>
  </div>
  <span class="font-bold amount">
    {data.amount.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}
  </span>
</div>
