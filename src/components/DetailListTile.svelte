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

<div
  class="flex flex-row p-4 items-center"
  in:fade={{ duration: 120, delay: index * 50 }}>
  <div
    class="w-10 rounded-lg flex flex-col items-center justify-between py-1 mr-4"
    style="background-color:{backgroundColor}; color:{iconColor}">
    <span class="font-bold text-xs">
      {new Date(data.date).toString().substring(4, 7)}
    </span>
    <span class="font-bold">{new Date(data.date).getDate()}</span>
  </div>
  <div class="flex flex-col flex-grow items-start justify-around truncate mr-4">
    <span class="font-bold w-full truncate">{addedBy}</span>
    <span class="text-gray-600 w-full truncate">{desc}</span>
  </div>
  <span>$ {data.amount.toFixed(2)}</span>
</div>
