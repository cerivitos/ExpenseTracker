<script>
  import { fade } from "svelte/transition";
  import scale from "../scale.js";
  import { onMount } from "svelte";
  import { typeDesigns, handleRouting } from "../util";
  import { view, detailData, overlay, themeIsBright } from "../store/store";

  export let data;
  export let index;

  let materialIcon, backgroundColor, iconColor, barColor;
  let expanded = false;
  let barStyle = false;

  onMount(() => {
    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";
    barColor = "hsl(" + hue + ", 45%, 50%)";
  });

  function viewDetails() {
    detailData.set(data);
    handleRouting("detail#" + data.type);
    overlay.set("detail");
  }
</script>

<style type="text/postcss">
  .amount::before {
    content: "$";
    @apply text-sm font-light mr-1;
  }
</style>

<div
  class="relative py-2 mb-2 {window.innerWidth <= 768 ? 'w-full' : 'w-8/12'}
  flex flex-row items-center cursor-pointer"
  in:fade={{ duration: 80, delay: index * 50 }}
  out:fade={{ duration: 80 }}
  on:click={() => viewDetails()}>
  <div id="items-wrapper" class="z-10 flex flex-row items-center w-full">
    <div
      id="icon"
      class="rounded-full p-2 ml-4 mr-2 fill-current"
      style="background-color: {backgroundColor}; color:{iconColor}">
      <i class="material-icons-round md-18" style="display:block !important">
        {materialIcon}
      </i>
    </div>
    <div
      class="flex flex-row items-center truncate flex-grow"
      style="color: {$themeIsBright ? iconColor : backgroundColor}">
      <span class="mr-2 font-bold" id="label">{data.type}</span>
      <span>{Math.round(data.percentage)}%</span>
    </div>
    <span class="ml-2 mr-4 font-bold amount">
      {Math.round(data.sum).toLocaleString()}
    </span>
  </div>
  <div
    class="absolute left-0 top-0 h-full rounded-r opacity-25"
    in:scale={{ duration: 180, delay: index * 80 }}
    style="width: {((window.innerWidth <= 768 ? window.innerWidth : (window.innerWidth * 1) / 2) * data.percentage) / 100}px;
    background-color: {barColor}" />
</div>
