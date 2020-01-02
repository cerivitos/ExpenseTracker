<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { typeDesigns, handleRouting } from "../util";
  import { view, detailData } from "../store/store";

  export let data;
  export let index;

  let materialIcon, backgroundColor, iconColor, barColor;
  let expanded = false;

  onMount(() => {
    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";
    barColor = "hsl(" + hue + ", 45%, 95%)";
  });

  function viewDetails() {
    detailData.set(data);
    handleRouting("detail#" + data.type);
    view.set("detail");
  }
</script>

<div
  class="relative py-4 flex flex-row items-center"
  in:fade={{ duration: 80, delay: index * 50 }}
  out:fade={{ duration: 80 }}
  on:click={() => viewDetails()}>
  <div
    id="icon"
    class="rounded-full p-2 ml-4 mr-2 fill-current"
    style="background-color: {backgroundColor}; color:{iconColor}">
    <i class="material-icons md-18" style="display:block !important">
      {materialIcon}
    </i>
  </div>
  <div class="flex flex-col justify-between truncate flex-grow">
    <span class="font-bold" id="label">{data.type}</span>
    <span class="font-light text-gray-600">
      {data.items} {data.items > 1 ? 'entries' : 'entry'}
    </span>
  </div>
  <div class="flex flex-col justify-between items-end ml-2 mr-4">
    <span>${Math.round(data.sum)}</span>
    <span class="font-light text-gray-600">{Math.round(data.percentage)}%</span>
  </div>
  <div
    class="absolute left-0 top-0 h-full rounded-r"
    in:fly={{ x: -(window.innerWidth * data.percentage) / 100, duration: 180, delay: index * 80 }}
    style="width: {(window.innerWidth * data.percentage) / 100}px;
    z-index:-1;background-color:{barColor}" />
</div>
