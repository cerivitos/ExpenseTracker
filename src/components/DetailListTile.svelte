<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { typeDesigns } from "../util";
  import { themeIsBright } from "../store/store";

  export let data;
  let iconHue, materialIcon, backgroundColor, iconColor;
  export let index = 0;

  let month, date, addedBy, desc, amount;

  onMount(() => {
    month = new Date(data.date).toString().substring(4, 7);
    date = new Date(data.date).getDate();
    addedBy = data.addedBy;
    amount = data.amount;
    desc = data.desc;

    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";
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
    class="rounded-full mr-2 font-bold text-sm whitespace-no-wrap"
    style="color:{$themeIsBright ? iconColor : backgroundColor}">
    <span>{new Date(data.date).toString().substring(4, 10)}</span>
  </div>
  <div
    id="icon"
    class="rounded-full p-1 mr-4 fill-current"
    style="background-color: {backgroundColor}; color:{iconColor}">
    <i class="material-icons" style="display:block !important; font-size: 14px">
      {materialIcon}
    </i>
  </div>
  <div class="flex flex-row w-full items-center justify-start truncate mr-4">
    <span class="mr-2">{addedBy}</span>
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
